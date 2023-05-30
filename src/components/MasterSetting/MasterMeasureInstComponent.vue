<script lang="ts">
import type { MasterMeasInstrument, MasterMeasuretype, MasterPartName, MasterProcessName } from '@/types/master.type';
import {defaultMasterMeasInstrument} from '@/types/master.type';
import {defineComponent, inject, ref, type PropType, onMounted} from 'vue'
import * as labs from "vuetify/labs/VDataTable";
import {confirmation, alert, success} from "@/components/sweetalert/sweetalert";
import type { AxiosStatic } from 'axios';
import { watch } from 'vue';
import { useMasterStore } from '@/stores/masterStore';
import {rulerequired, rulerequiredselectNumber, rulerequiredselectObject, rulerequiredselectNumberWith0, rulerequiredNumber, rulestringconsistCSV} from './validationrule'

const defprops = {
    masteritems: {type: Array as PropType<MasterMeasInstrument[]>, default: undefined, required: true},
    masterpartname: {type: Array as PropType<MasterPartName[]>, default: undefined, required: true},
    masterprocessname: {type: Array as PropType<MasterProcessName[]>, default: undefined, required: true},
    mastermeastype: {type: Array as PropType<MasterMeasuretype[]>, default: undefined, required: true},
}

export default defineComponent({

    props: defprops,
    emits: [],
    components:{...labs},
    setup(props, {emit}){
        const axios = inject<AxiosStatic>('$axios');
        var masterstore = useMasterStore();
        var valid = ref<boolean>(false)
        const itemsPerPage:number = 200
        const currentPage = ref<number>(1);
        const isOpendialog = ref<boolean>(false);
        const isOpendialogFetchingdata = ref<boolean>(false);
        const isSending = ref<boolean>(false);
        const isEdit = ref<boolean>(false);

        const myform = ref(null)
        const mstitems = ref<MasterMeasInstrument[]|undefined>();

        //Select component reference.
        const refSelectpartname = ref<MasterPartName>();
        const refSelectprocessname = ref<MasterProcessName>();
        const refSelectmeasuretype = ref<MasterMeasuretype>()
        const refFillterProcessitems = ref<MasterProcessName[]>();

        const mstpartnameitems = props.masterpartname;
        const mstprocessnameitems = props.masterprocessname;
        const mstmeastypeitems = props.mastermeastype;



        const headers:any =
        [
            {title: 'Id', sortable: false, align: 'start', key:'id'},
            {title: 'Name', sortable: false, key: 'name'},
            {title: 'Partname', sortable: false, key: 'partId'},
            {title: 'Processname', sortable: false, key: 'procId'},
            {title: 'Measuretype', sortable: false, key: 'measuringId'},
            {title: 'Dataid', sortable: false, key: 'datano'},
            {title: 'Lower', sortable: false, key: 'lowerStd'},
            {title: 'Upper', sortable: false, key: 'upperStd'},
            {title: 'Filename', sortable: false, key: 'filename'},
            {title: 'Seqname', sortable: false, key: 'seqname'},
            {title: 'Datarow', sortable: false, key: 'dataline'},
            {title: 'Datacolumn', sortable: false, key: 'dataposition'},
            {title: 'Actions', key: 'actions', sortable: false, width: '100px'},
        ]

        onMounted(()=>{
            mstitems.value = props.masteritems ? props.masteritems : undefined;
        })

        const fnFetchmaster = async():Promise<MasterMeasInstrument[]> =>{
            return new Promise(async(res, rej)=>{
                isOpendialogFetchingdata.value = true;
                const result = await axios?.get<string,any>(`/Master/GetMasterMeasureIns`).catch((error)=>{
                    alert('Fail', `Code : ${result.status} Message : ${result.data}`)
                })
                isOpendialogFetchingdata.value = false;
                if(result.status == 200)
                {
                    res(result.data as MasterMeasInstrument[]);
                }
                rej([]);
            })
        }

        const iditem = ref<number[]>([]);
        const selectedMasterObj = ref<MasterMeasInstrument>({...defaultMasterMeasInstrument});
        const constructIditems = (items:MasterMeasInstrument[])=>{
            iditem.value = [];
            for(let count = 1; count <= 15; count++) iditem.value.push(count);
            //remove  selected item
            items?.forEach(e => {
                const index = iditem.value.findIndex(f=>f == e.datano);
                iditem.value.splice(index,1);
            });
        }

        const fnClickAdd = ()=>{
            isEdit.value = false;
            //refSelectmode.value = measurttypeModeItems[0];
            //constructIditems();
            //Find nearest not used value.
            selectedMasterObj.value = {...defaultMasterMeasInstrument, datano:iditem.value[0]}
            isOpendialog.value = true;
        }

        const fnClickRefresh = async()=>{
            const master = await fnFetchmaster()
            //Copy master items to store.
            masterstore.mastervalue!.measinstrument = [...master];
            //Reassign reference to variable.
            mstitems.value = masterstore.mastervalue?.measinstrument;
        }

        const fnClickEdit = (item:MasterMeasInstrument)=>{
            isEdit.value = true;
            selectedMasterObj.value = {...item};


            //refSelectmode.value = measurttypeModeItems.find(e=>e.id == item.mode);
            isOpendialog.value = true;
        }

        watch(selectedMasterObj, ()=>{
            refSelectpartname.value = mstpartnameitems?.find(e=> e.id == selectedMasterObj.value.partId)
            refSelectprocessname.value = mstprocessnameitems?.find(e=> e.processId == selectedMasterObj.value.procId)
            refSelectmeasuretype.value = mstmeastypeitems?.find(e=> e.id == selectedMasterObj.value.measuringtypeid)
        })

        const fnClickDelete = async(item:MasterMeasInstrument)=>{
            const result = await confirmation('Confirmation' ,'Do you want to delete this item?')

            if(result.isconfirm)
            {
                const query = `/Master/DeleteMasterMeasureInstrument?id=${item.id}`
                let res = await axios?.delete<MasterMeasInstrument, any>(query,{headers:{Accept:'application/json', "Content-Type":'application/json'}})
                .catch(async(error)=>{
                    await alert(`Error`, `Code : ${res.status} Message : ${res.data}`)
                    return;
                })

                if(res.status == 200)
                {
                    const index = mstitems.value?.findIndex(e=>e.id == item.id);
                    mstitems.value?.splice(index?index:0,1);
                    await success('Complete', 'Remove item success.');
                }
            }
        }

        //Callback when reference variable of mode is changed.
        watch(refSelectpartname,()=>{
            if(refSelectpartname.value?.id !== undefined) selectedMasterObj.value.partId = refSelectpartname.value?.id;
            if(!isEdit)refSelectprocessname.value = undefined;
            refFillterProcessitems.value = mstprocessnameitems?.filter(e=>e.partnameId == refSelectpartname.value?.id);
        })

        watch(refSelectprocessname,()=>{
            if(refSelectprocessname.value?.id !== undefined) selectedMasterObj.value.procId = refSelectprocessname.value?.processId;
            if(!isEdit) refSelectmeasuretype.value = undefined;
        })

        const reffillterMeasureInstrumentitems = ref<MasterMeasInstrument[]>();
        watch([refSelectpartname, refSelectprocessname, refSelectmeasuretype], ()=>{
            if(refSelectpartname.value == undefined || refSelectprocessname.value == undefined) refSelectmeasuretype.value = undefined;
            else if(refSelectmeasuretype.value != undefined)
            {
                reffillterMeasureInstrumentitems.value = mstitems.value?.filter(e=> e.partId == refSelectpartname.value?.id && e.procId == refSelectprocessname.value?.processId && e.measuringtypeid == refSelectmeasuretype.value?.id)
                if(reffillterMeasureInstrumentitems.value !== undefined) constructIditems(reffillterMeasureInstrumentitems.value);
                selectedMasterObj.value.measuringtypeid = refSelectmeasuretype.value.id
            }
        })



        const fnSubmit = async()=>
        {
            //Recall validate.
            // @ts-ignore
            if(valid.value == null || !valid.value) await myform.value?.validate();
            if(!valid.value) return;

            isSending.value = true;

            if(isEdit.value)
            {
                let item = mstitems.value?.find(e=>e.id == selectedMasterObj.value.id);
                if(item == undefined) return;
                const query = `/Master/UpdateMasterMeasureInstrument?id=${item.id}`
                let res = await axios?.put<MasterMeasInstrument, any>(query, selectedMasterObj.value,{headers:{Accept:'application/json', "Content-Type":'application/json'}})
                .catch(async(error)=>{
                    await alert(`Error`, `Code : ${res.status} Message : ${res.data}`)
                    return;
                })

                if(res && res.status == 200)
                {
                    //Assign value memory values to original values.
                    Object.assign(item, selectedMasterObj.value);
                    await success('Complete', 'Update value success.');
                    isOpendialog.value = false;
                }
            }
            else
            {
                let res = await axios?.post<MasterMeasInstrument, any>("/Master/AddMasterMeasureInstrument", selectedMasterObj.value,{headers:{Accept:'application/json', "Content-Type":'application/json'}})
                .catch(async(error)=>{
                    await alert(`Error`, `Code : ${res.status} Message : ${res.data}`)
                    return;
                })

                if(res && res.status == 200)
                {
                    //update id
                    selectedMasterObj.value.id = res.data.id;
                    mstitems.value?.push(selectedMasterObj.value);
                    await success('Complete', 'Add new item success.');
                    isOpendialog.value = false;
                }
            }
            isSending.value = false;
        }

        const fngetnamePartname = (item:MasterMeasInstrument):string =>{
            const obj = mstpartnameitems?.find(e=>e.id == item.partId);
            return obj? obj?.name : '-';
        }

        const fngetnameProcessname = (item:MasterMeasInstrument):string =>{
            const obj = mstprocessnameitems?.find(e => e.partnameId == item.partId && e.processId == item.procId);
            return obj? obj?.name : '-';
        }

        const fngetnameMeasuretype = (item:MasterMeasInstrument):string =>{
            const obj = mstmeastypeitems?.find(e => e.id == item.measuringtypeid);
            return obj? obj?.name : '-';
        }

        return{
            myform,
            rulerequiredselectNumber,
            rulerequiredselectObject,
            rulerequired,
            rulerequiredselectNumberWith0,
            rulerequiredNumber,
            rulestringconsistCSV,
            valid,
            itemsPerPage,
            currentPage,
            headers,
            mstitems,
            fnClickAdd,
            fnClickRefresh,
            fnClickEdit,
            fnClickDelete,
            fnSubmit,
            isOpendialog,
            isOpendialogFetchingdata,
            iditem,
            selectedMasterObj,
            isSending,
            isEdit,
            fngetnamePartname,
            fngetnameProcessname,
            fngetnameMeasuretype,
            refSelectpartname,
            refSelectprocessname,
            refSelectmeasuretype,
            refFillterProcessitems,
            mstpartnameitems,
            mstprocessnameitems,
            mstmeastypeitems
        }
    }
})
</script>

<template>
    <v-card width="100%">
        <!-- DIALOG FETCHING -->
        <v-dialog max-width="400px" persistent v-model="isOpendialogFetchingdata">
            <v-card style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
                <v-icon icon="autorenew" size="76" color="blue"></v-icon>
                <strong style="color: blue; font-size: 22px;">Fetching master data from server.</strong>
            </v-card>
        </v-dialog>

        <!-- DIALOG EDIT -->
        <v-dialog max-width="700px" persistent v-model="isOpendialog">
            <v-card style="padding: 30px 20px 10px 20px;">
                <v-form ref="myform" v-model="valid" @submit.prevent="fnSubmit">
                    <v-container style="padding-top: 0px;">
                        <v-row>
                            <v-col class="col-column" cols="12" sm="6">
                                <strong>Partname</strong>
                                <v-select
                                    :class="{ 'selector-disable':isEdit }"
                                    :items="mstpartnameitems"
                                    item-title="name"
                                    item-value="id"
                                    variant="solo"
                                    v-model="refSelectpartname"
                                    :rules="[rulerequiredselectObject]"
                                    v-bind="{'return-object':true}"
                                    :readonly="isEdit"
                                ></v-select>
                            </v-col>

                            <v-col class="col-column" cols="12" sm="6">
                                <strong>Processname</strong>
                                <v-select
                                    :class="{ 'selector-disable':isEdit }"
                                    :items="refFillterProcessitems"
                                    item-title="name"
                                    item-value="id"
                                    variant="solo"
                                    v-model="refSelectprocessname"
                                    :rules="[rulerequiredselectObject]"
                                    v-bind="{'return-object':true}"
                                    :readonly="isEdit"
                                ></v-select>
                            </v-col>

                            <v-col class="col-column" cols="12" sm="6">
                                <strong>Measuringtype</strong>
                                <v-select
                                    :class="{ 'selector-disable':isEdit }"
                                    :items="mstmeastypeitems"
                                    item-title="name"
                                    item-value="id"
                                    variant="solo"
                                    v-model="refSelectmeasuretype"
                                    :rules="[rulerequiredselectObject]"
                                    v-bind="{'return-object':true}"
                                    :readonly="isEdit"
                                ></v-select>
                            </v-col>


                            <v-col class="col-column" cols="12" sm="6">
                                <strong>Dataid</strong>
                                <v-select
                                    :class="{ 'selector-disable':isEdit }"
                                    :items="iditem"
                                    variant="solo"
                                    v-model="selectedMasterObj.datano"
                                    :rules="[rulerequiredselectNumber]"
                                    v-bind="{'return-object':true}"
                                    :readonly="isEdit"
                                ></v-select>
                            </v-col>
                        </v-row>

                        <v-row><v-divider></v-divider></v-row>

                        <v-row>
                            <v-col class="col-column" cols="12" sm="6">
                                <strong>Upper</strong>
                                <v-text-field
                                    type="number"
                                    variant="solo"
                                    v-model="selectedMasterObj.upperStd"
                                    :rules="[rulerequiredNumber]"
                                ></v-text-field>
                            </v-col>

                            <v-col class="col-column" cols="12" sm="6">
                                <strong>Lower</strong>
                                <v-text-field
                                    type="number"
                                    variant="solo"
                                    v-model="selectedMasterObj.lowerStd"
                                    :rules="[rulerequiredNumber]"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row><v-divider></v-divider></v-row>

                        <v-row>
                            <v-col class="col-column" cols="12" sm="6">
                                <strong>Filename</strong>
                                <v-text-field
                                    type="text"
                                    variant="solo"
                                    v-model="selectedMasterObj.filename"
                                    :rules="[rulerequired, rulestringconsistCSV]"
                                ></v-text-field>
                            </v-col>

                            <v-col class="col-column" cols="12" sm="6">
                                <strong>Seqname</strong>
                                <v-text-field
                                    type="text"
                                    variant="solo"
                                    v-model="selectedMasterObj.seqname"
                                    :rules="[rulerequired]"
                                ></v-text-field>
                            </v-col>

                            <v-col class="col-column" cols="12" sm="6">
                                <strong>Datarow</strong>
                                <v-text-field
                                    type="number"
                                    variant="solo"
                                    v-model="selectedMasterObj.dataline"
                                    :rules="[rulerequiredNumber]"
                                ></v-text-field>
                            </v-col>

                            <v-col class="col-column" cols="12" sm="6">
                                <strong>Datacolumn</strong>
                                <v-text-field
                                    type="number"
                                    variant="solo"
                                    v-model="selectedMasterObj.dataposition"
                                    :rules="[rulerequiredNumber]"
                                ></v-text-field>
                            </v-col>

                            <v-col class="col-column" cols="12" sm="12">
                                <strong>Name</strong>
                                <v-text-field
                                    type="text"
                                    variant="solo"
                                    v-model="selectedMasterObj.name"
                                    :rules="[rulerequired]"
                                ></v-text-field>
                            </v-col>
                        </v-row>




                        <v-row style="display: flex; flex-direction: row-reverse; padding: 15px 0px 0px 0px;">
                            <v-btn
                                class="text-none text-white ml-2"
                                rounded="0"
                                variant="flat"
                                color="blue-darken-4"
                                prepend-icon="check_circle"
                                type="submit"
                                :disabled="isSending"
                            >
                                <template v-slot:prepend>
                                    <v-icon color="success" type="submit"></v-icon>
                                </template>
                                {{ isSending? 'sending...':'Confirm' }}
                            </v-btn>

                            <v-btn
                                class="text-none"
                                rounded="0"
                                variant="outlined"
                                color="blue-darken-4"
                                prepend-icon="clear"
                                @click="isOpendialog = false"
                            >
                                <template v-slot:prepend>
                                    <v-icon color="error"></v-icon>
                                </template>
                                Cancle
                            </v-btn>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog>


        <!-- <v-card-title>
        </v-card-title> -->

        <v-card-text style="padding: 10px;">
            <v-data-table
                v-model:items-per-page="itemsPerPage"
                v-model:page="currentPage"
                :headers="headers"
                :items="masteritems"
                item-value="name"
                class="elevation-1"
            >
                <template v-slot:top>
                    <div style="display: flex; flex-direction: column;">
                        <div style="display: flex; flex-direction: row-reverse;">
                            <v-btn
                                color="green"
                                class="mt-2 mb-2 mr-2"
                                @click="fnClickAdd"
                                prepend-icon="add"
                                >
                                    <template v-slot:prepend>
                                        <v-icon color="white"></v-icon>
                                    </template>
                                    Add New Item
                            </v-btn>

                            <v-btn
                            color="blue"
                            class="mt-2 mb-2 mr-2"
                            @click="fnClickRefresh"
                            prepend-icon="refresh"
                            >
                                <template v-slot:prepend>
                                    <v-icon color="white"></v-icon>
                                </template>
                                REFRESH
                            </v-btn>
                        </div>
                        <v-divider></v-divider>
                    </div>
                </template>

                <template v-slot:item.id="{index, item}">
                    {{ index+1 }}
                </template>

                <template v-slot:item.name="{index, item}">
                    {{ item.raw.name }}
                </template>

                <template v-slot:item.partId="{index, item}">
                    {{ `${fngetnamePartname(item.raw)}` }}
                </template>

                <template v-slot:item.procId="{index, item}">
                    {{ `${fngetnameProcessname (item.raw)}` }}
                </template>

                <template v-slot:item.measuringId="{index, item}">
                    {{ `${ fngetnameMeasuretype(item.raw)}` }}
                </template>

                <template v-slot:item.datano="{index, item}">
                    {{ `${item.raw.datano}` }}
                </template>

                <template v-slot:item.lowerStd="{index, item}">
                    {{ `${item.raw.lowerStd}` }}
                </template>

                <template v-slot:item.upperStd="{index, item}">
                    {{ `${item.raw.upperStd}` }}
                </template>

                <template v-slot:item.filename="{index, item}">
                    {{ `${item.raw.filename}` }}
                </template>
























                <template v-slot:item.actions="{ item }">
                    <div style="display: flex; align-items: center;">
                        <v-icon
                            icon="edit"
                            size="small"
                            color="orange"
                            @click="fnClickEdit(item.raw)"
                        >
                        </v-icon>

                        <v-divider vertical class="ml-2 mr-2"></v-divider>
                        <v-icon
                            icon="delete"
                            size="small"
                            color="red"
                            @click="fnClickDelete(item.raw)"
                        >
                        </v-icon>
                    </div>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<style scoped>
    .col-column{
        display: flex;
        flex-direction: column;
        padding: 0px 10px !important;
    }

    .v-col-12, .v-col-sm-12{
        padding: 0px;
    }

    .selector-disable ::v-deep.v-select .v-field.v-field{
        background-color: rgb(var(--v-theme-secondary))
    }
</style>