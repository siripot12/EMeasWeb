<script lang="ts">
import { useMasterStore } from '@/stores/masterStore';
import type { IRequest } from '@/types/request.type';
import { inject, onMounted, ref } from 'vue';
import {defineComponent} from 'vue'
import * as labs from "vuetify/labs/VDataTable";
import RequestItemComponent from '../components/RequestItemComponent.vue';
import RequestDetailComponent from "../components/RequestDetailComponent.vue";
import { reactive } from 'vue';

import { confirmation, alert, success } from "@/components/sweetalert/sweetalert";
import type { AxiosStatic } from 'axios';
import { useLoginStore } from '@/stores/loginStore';

export default defineComponent({
    components:{
    ...labs,
    RequestItemComponent,
    RequestDetailComponent
},
    setup(){
        const axios = inject<AxiosStatic>('$axios')
        const loginstore = useLoginStore()
        const masterstore = useMasterStore()

        const isOpendialog = ref<boolean>(false)
        const selectedData = ref<IRequest | undefined>()

        const itemsPerPage:number = 99
        const headers:any =
        [
            {title: 'Item', sortable: false, align: 'start', key:'number'},
            {title: 'Mode', sortable: false, key: 'measuringMode'},
            {title: 'Item number', sortable: false, key: 'itmnumber'},
            {title: 'Round', sortable: false, key: 'round'},
            {title: 'Tray number', sortable: false, key: 'traynumber'},
            {title: 'Part number', sortable: false, key: 'partnumber'},
            {title: 'Part name', sortable: false, key: 'partname'},
            {title: 'Process', sortable: false, key: 'process'},
            { title: 'Actions', key: 'actions', sortable: false },
        ]

        var data: IRequest[] = reactive([])
        let expanded = ref([])

        onMounted(async()=>{
            fnFetchingItems();
        })

        const fnFetchingItems = async()=>{
            //Get reguster items from API by login id.
            const res = await axios?.get<string,any>(`/PartRegister/ItemsReadByRequesterId?req=${loginstore.userdata?.employeeno}`).catch((error)=>{
                alert('Fail', `Code : ${res.status} Message : ${res.data}`)
            })

            if(res.status === 200)
            {
                data.splice(0, data.length);
                const items = res.data as IRequest[]
                items.map(x=>data.push(x))
            }
        }

        const fnDialogClose = ()=>{
            isOpendialog.value = false
        }

        const fnRegisterAdd = (value:IRequest)=>{
            //data.push(value)
            data.splice(0, 0, value);
            fnDialogClose();
        }

        const dataEditItem = (item:IRequest)=>{
            let editIndex = data.findIndex(a=>a.id === item.id)
            if(editIndex > -1){
                data[editIndex] = {...item}
                fnDialogClose();
            }
        }

        const dataDeleteItem = (item:IRequest)=>{
            let deleteIndex = data.indexOf(item);
            if(deleteIndex > -1){
                data.splice(deleteIndex, 1)
            }
        }

        const fnClickRefresh = async()=>{
            await fnFetchingItems();
        }

        const fnClickAdd = ()=>{
            selectedData.value = undefined
            isOpendialog.value = true
        }

        const fnClickEdit = (item:IRequest)=>{
            //Load object to selected item.
            selectedData.value = {...item}
            isOpendialog.value = true
        }

        const fnClickCopy = (item:IRequest)=>{
            selectedData.value = {...item}
            selectedData.value.id = 0
            isOpendialog.value = true
        }

        const fnClickDelete = async(item:IRequest)=>{
            const res = await confirmation('Confirmation' ,'Do you want to delete this item?')
            if(res.isconfirm){
                const res = await axios?.delete<number,any>(`/PartRegister/Itemdelete?itemid=${item.id}`).catch((error)=>{
                    alert('Fail', `Code : ${res.status} Message : ${res.data}`)
                })

                if(res.status === 200){
                    dataDeleteItem(item)
                    await success('Success', 'Request item successfully to remove.')
                }
            }
        }

        return{
            isOpendialog,
            fnDialogClose,
            fnRegisterAdd,
            fnClickRefresh,
            fnClickAdd,
            fnClickEdit,
            fnClickCopy,
            fnClickDelete,
            dataEditItem,
            selectedData,
            masterstore,
            expanded,
            itemsPerPage,
            headers,
            data
        }
    }
})
</script>

<template>
    <div class="container">
        <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="data"
            item-value="name"
            class="elevation-1"
            v-model:expanded="expanded"
            show-expand
        >
            <template v-slot:top>

                <v-card style="background-color: #F5F3F5; margin: 5px 5px;">
                    <div style="background-color: #6C757D; height: 55px; display: flex; justify-content: center; align-items: center;">
                        <strong>Measuring Request</strong>
                    </div>
                </v-card>

                <div style="display: flex; flex-direction: column;">
                    <v-divider></v-divider>
                    <div style="display: flex; flex-direction: row-reverse;">
                        <v-dialog max-width="850px" persistent v-model="isOpendialog">
                            <template v-slot:activator="{ props }" >
                                <v-btn
                                color="green"
                                class="mt-2 mb-2 mr-2"
                                v-bind="props"
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
                            </template>
                            <request-detail-component :data="selectedData" @on-close="fnDialogClose" @on-add="fnRegisterAdd" @on-edit="dataEditItem"/>
                        </v-dialog>
                    </div>
                    <v-divider></v-divider>
                </div>

            </template>

            <template v-slot:expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length">
                        <request-item-component
                            :qrcode="item.raw.qrcode"
                            :datetime="masterstore.getdatetimetext(item.raw.dateTime)"
                            :machinenumber="masterstore.getmachinenumberbyindex(item.raw.machinenumber)"
                            :jignumber="item.raw.jignumber"
                            :lot="item.raw.lotMachining"
                            :remark="item.raw.remark"
                        />
                    </td>
                </tr>
            </template>

            <template v-slot:item.number="{index}">
                {{index+1}}
            </template>

            <template v-slot:item.itmnumber="{item}">
                {{ masterstore.getitemnumberbyvalue(item.raw.itemnumber) }}
            </template>

            <template v-slot:item.partname="{item}">
                {{masterstore.getpartnamebyindex(item.raw.partname)}}
            </template>

            <template v-slot:item.measuringMode="{item}">
                {{masterstore.getmodenamebyindex(item.raw.measuringMode)}}
            </template>

            <template v-slot:item.process="{item}">
                {{masterstore.getprocessbyindex(item.raw.process)}}
            </template>

            <template v-slot:item.round="{item}">
                {{masterstore.getroundtext(item.raw.round)}}
            </template>

            <template v-slot:item.traynumber="{item}">
                {{masterstore.gettraynumberbyvalue(item.raw.round)}}
            </template>




            <template v-slot:item.actions="{ item }">
                <div style="display: flex; align-items: center;">
                    <v-icon
                    icon="file_copy"
                    size="small"
                    color="green"
                    @click="fnClickCopy(item.raw)"
                    >
                    </v-icon>

                    <v-divider v-if="item.raw.state != 2 && item.raw.state != 3" vertical class="ml-2 mr-2"></v-divider>
                    <v-icon
                        v-if="item.raw.state != 2 && item.raw.state != 3"
                        icon="edit"
                        size="small"
                        color="orange"
                        @click="fnClickEdit(item.raw)"
                    >
                    </v-icon>

                    <v-divider v-if="item.raw.state != 3" vertical class="ml-2 mr-2"></v-divider>
                    <v-icon
                        v-if="item.raw.state != 3"
                        icon="delete"
                        size="small"
                        color="red"
                        @click="fnClickDelete(item.raw)"
                    >
                    </v-icon>

                    <div v-if="item.raw.state != 1" style="display: flex;">

                    </div>
                </div>
            </template>
        </v-data-table>
    </div>

    <!-- <div class="container">
        <template>
            <v-data-table
                v-model:items-per-page="itemsPerPage"
                :headers="headers"
                :items="desserts"
                item-value="name"
                class="elevation-1"
            ></v-data-table>
        </template>
    </div> -->
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: stretch;
        width: 99vw;
        height: 96vh;
        background-color: white;
    }

    div strong{
        text-align: center;
        color: white;
        font-size: 24px;
    }

    ::v-deep .v-toolbar__content{
        background: #96e072;
    }

    table thead th {
        font-size: 18px;
        font-weight: 600;
    }

    ::v-deep .v-data-table-header__content {
        justify-content: center;
        font-size: 18px;
    }

    ::v-deep .v-table > .v-table__wrapper > table > tbody > tr > td, .v-table > .v-table__wrapper > table > tbody > tr > th, .v-table > .v-table__wrapper > table > thead > tr > td, .v-table > .v-table__wrapper > table > thead > tr > th, .v-table > .v-table__wrapper > table > tfoot > tr > td, .v-table > .v-table__wrapper > table > tfoot > tr > th {
        text-align: center;
    }
</style>