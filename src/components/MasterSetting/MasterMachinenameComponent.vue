<script lang="ts">
import type { MasterMachineName, MasterPartName, MasterProcessName } from '@/types/master.type';
import {defineComponent, inject, ref, type PropType, onMounted} from 'vue'
import * as labs from "vuetify/labs/VDataTable";
import {confirmation, alert, success} from "@/components/sweetalert/sweetalert";
import type { AxiosStatic } from 'axios';
import { useMasterStore } from '@/stores/masterStore';
import { watch } from 'vue';
import {rulerequired, rulerequiredselectNumber, rulerequiredselectObject} from './validationrule'


const defprops = {
    masteritems: {type: Array as PropType<MasterMachineName[]>, default: undefined, required: true},
    masterprocess: {type: Array as PropType<MasterProcessName[]>, default: undefined, required: true},
    masterpartname: {type: Array as PropType<MasterPartName[]>, default: undefined, required: true},
}

export default defineComponent({

    props: defprops,
    emits: [],
    components:{...labs},
    setup(props, {emit}){
        const axios = inject<AxiosStatic>('$axios');
        var masterstore = useMasterStore();
        var valid = ref<boolean>(false)
        const itemsPerPage:number = 50
        const currentPage = ref<number>(1);
        const isOpendialog = ref<boolean>(false);
        const isOpendialogFetchingdata = ref<boolean>(false);
        const isSending = ref<boolean>(false);
        const isEdit = ref<boolean>(false);

        const myform = ref(null)
        const mstitems = ref<MasterMachineName[]|undefined>();
        var mstprocessitems = props.masterprocess;
        var mstpartnameitems =  props.masterpartname;

        const fillteredMstprocessitems = ref<MasterProcessName[]>();
        const selectPartnameobj = ref<MasterPartName>();
        const selectProcessnameobj = ref<MasterProcessName>();

        const headers:any =
        [
            {title: 'Id', sortable: false, align: 'start', key:'id'},
            {title: 'Partname', sortable: false, key:'partName'},
            {title: 'Processname', sortable: false, key:'processName'},
            {title: 'Name', sortable: false, key: 'name'},
            {title: 'Actions', key: 'actions', sortable: false, width: '100px'},
        ]

        onMounted(()=>{
            mstitems.value = props.masteritems ? props.masteritems : undefined;
            //mstprocessitems = props.masterprocess;
            //mstpartnameitems = props.masterpartname;
        })

        const fnFetchmaster = async():Promise<MasterMachineName[]> =>{
            return new Promise(async(res, rej)=>{
                isOpendialogFetchingdata.value = true;
                const result = await axios?.get<string,any>(`/Master/GetMasterMachinename`).catch((error)=>{
                    alert('Fail', `Code : ${result.status} Message : ${result.data}`)
                })
                isOpendialogFetchingdata.value = false;
                if(result.status == 200)
                {
                    res(result.data as MasterMachineName[]);
                }
                rej([]);
            })
        }

        const iditem = ref<number[]>([]);
        const selectedMasterObj = ref<MasterMachineName>({id:1, name:'', processName:0, partName :0});
        const constructIditems = ()=>{
            for(let count = 1; count <= 100; count++) iditem.value.push(count);
            //remove  selected item
            mstitems.value?.forEach(e => {
                const index = iditem.value.findIndex(f=>f == e.id);
                iditem.value.splice(index,1);
            });
        }

        const fnClickAdd = ()=>{
            isEdit.value = false;
            initialSelections(undefined);
            constructIditems();
            //Find nearest not used value.
            selectedMasterObj.value = {id:iditem.value[0], name:'', partName:0, processName:0}
            isOpendialog.value = true;
        }

        const fnClickRefresh = async()=>{
            const master = await fnFetchmaster()
            //Copy master items to store.
            masterstore.mastervalue!.machinename = [...master];
            //Reassign reference to variable.
            mstitems.value = masterstore.mastervalue?.machinename;
        }

        const initialSelections = (item:MasterMachineName|undefined)=>{
            selectPartnameobj.value = mstpartnameitems?.find(e=>e.id == item?.partName);
            selectProcessnameobj.value = mstprocessitems?.find(e=>e.processId == item?.processName && e.partnameId == item?.partName);
        }

        //Change process items when partname is changed.
        watch(selectPartnameobj,()=>{
            selectProcessnameobj.value = undefined;
            fillteredMstprocessitems.value = mstprocessitems?.filter(e=>e.partnameId == selectPartnameobj.value?.id);
        })

        const fnClickEdit = (item:MasterMachineName)=>{
            isEdit.value = true;
            initialSelections(item);
            selectedMasterObj.value = {...item};
            isOpendialog.value = true;
        }

        const fngetProcessnameById = (partid:number, processid:number):string =>{
            const obj = mstprocessitems?.find(e=>e.processId == processid && e.partnameId == partid);
            return obj?obj.name:'';
        }

        const fngetPartnameById = (partid:number) =>{
            const obj = mstpartnameitems?.find!(e=>e.id == partid);
            return obj?obj.name:'';
        }

        const fnClickDelete = async(item:MasterMachineName)=>{
            const result = await confirmation('Confirmation' ,'Do you want to delete this item?')

            if(result.isconfirm)
            {
                const query = `/Master/DeleteMasterMachinename?id=${item.id}`
                let res = await axios?.delete<MasterMachineName, any>(query,{headers:{Accept:'application/json', "Content-Type":'application/json'}})
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

        const fnSubmit = async()=>
        {
            //Recall validate.
            // @ts-ignore
            if(valid.value == null || !valid.value) await myform.value?.validate();
            if(!valid.value) return;
            
            //Assign ref variable to selectedobject.
            selectedMasterObj.value.partName = selectPartnameobj.value?.id!;
            selectedMasterObj.value.processName = selectProcessnameobj.value?.processId!;

            isSending.value = true;
            if(isEdit.value)
            {
                let item = mstitems.value?.find(e=>e.id == selectedMasterObj.value.id);
                if(item == undefined) return;
                const query = `/Master/UpdateMasterMachinename?id=${selectedMasterObj.value.id}`
                let res = await axios?.put<MasterMachineName, any>(query, selectedMasterObj.value,{headers:{Accept:'application/json', "Content-Type":'application/json'}})
                .catch(async(error)=>{
                    await alert(`Error`, `Code : ${res.status} Message : ${res.data}`)
                    return;
                })

                if(res?.status == 200)
                {
                    //Individual assign item because losting of proxy.
                    item.id = selectedMasterObj.value.id;
                    item.name = selectedMasterObj.value.name;
                    item.partName = selectedMasterObj.value.partName;
                    item.processName = selectedMasterObj.value.processName

                    await success('Complete', 'Update value success.');
                    isOpendialog.value = false;
                }
            }
            else
            {
                let res = await axios?.post<MasterMachineName, any>("/Master/AddMasterMachinename", selectedMasterObj.value,{headers:{Accept:'application/json', "Content-Type":'application/json'}})
                .catch(async(error)=>{
                    await alert(`Error`, `Code : ${res.status} Message : ${res.data}`)
                    return;
                })

                if(res && res.status == 200)
                {
                    mstitems.value?.push(selectedMasterObj.value);
                    await success('Complete', 'Add new item success.');
                    isOpendialog.value = false;
                }
            }
            isSending.value = false;
        }

        return{
            myform,
            rulerequiredselectNumber,
            rulerequiredselectObject,
            rulerequired,
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
            fngetProcessnameById,
            fngetPartnameById,
            mstprocessitems,
            mstpartnameitems,
            fillteredMstprocessitems,
            selectPartnameobj,
            selectProcessnameobj
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
        <v-dialog max-width="400px" persistent v-model="isOpendialog">
            <v-card style="padding: 30px 20px 10px 20px;">
                <v-form ref="myform" v-model="valid" @submit.prevent="fnSubmit">
                    <v-container style="padding-top: 0px;">
                        <v-row>
                            <v-col class="col-column" cols="12" sm="12" style="display: flex;">
                                <strong>Id</strong>
                                <v-select
                                    :items="iditem"
                                    variant="solo"
                                    v-model="selectedMasterObj.id"
                                    :readonly="isEdit"
                                    :rules="[rulerequiredselectNumber]"
                                ></v-select>
                            </v-col>

                            <v-col class="col-column" cols="12" sm="12" style="display: flex;">
                                <strong>Partname</strong>
                                <v-select
                                    :items="mstpartnameitems"
                                    item-title="name"
                                    item-value="id"
                                    variant="solo"
                                    v-model="selectPartnameobj"
                                    :rules="[rulerequiredselectObject]"
                                    v-bind="{'return-object':true}"
                                ></v-select>
                            </v-col>

                            <v-col class="col-column" cols="12" sm="12" style="display: flex;">
                                <strong>Processname</strong>
                                <v-combobox
                                    :items="fillteredMstprocessitems"
                                    item-title="name"
                                    item-value="id"
                                    variant="solo"
                                    v-model="selectProcessnameobj"
                                    :rules="[rulerequiredselectObject]"
                                ></v-combobox>
                            </v-col>

                            <v-col class="col-column" cols="12" sm="12" style="display: flex;">
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

        <v-card-text>
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
                    {{ item.raw.id }}
                </template>

                <template v-slot:item.processName="{index, item}">
                    {{ `${fngetProcessnameById(item.raw.partName ,item.raw.processName)}` }}
                </template>

                <template v-slot:item.partName="{index, item}">
                    {{ `${fngetPartnameById(item.raw.partName)}` }}
                </template>

                <template v-slot:item.name="{index, item}">
                    {{ item.raw.name }}
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
    }

    .v-col-12, .v-col-sm-12{
        padding: 0px;
    }
</style>