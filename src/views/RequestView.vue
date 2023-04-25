<script lang="ts">
import { useMasterStore } from '@/stores/masterStore';
import type { IRequest } from '@/types/request.type';
import { onMounted, ref } from 'vue';
import {defineComponent} from 'vue'
import * as labs from "vuetify/labs/VDataTable";
import RequestItemComponent from '../components/RequestItemComponent.vue';
import RequestDetailComponent from "../components/RequestDetailComponent.vue";


export default defineComponent({
    components:{
    ...labs,
    RequestItemComponent,
    RequestDetailComponent
},
    setup(){
        const masterstore = useMasterStore();

        const itemsPerPage:number = 99
        const headers = 
        [
            {title: 'Id', sortable: false, align: 'start', key:'id'},
            {title: 'Mode', sortable: false, key: 'measuringMode'},
            {title: 'Date', sortable: false, key: 'dateTime'},
            {title: 'Round', sortable: false, key: 'round'},
            {title: 'Part number', sortable: false, key: 'partnumber'},
            {title: 'Part name', sortable: false, key: 'partname'},
            {title: 'Process', sortable: false, key: 'process'},
            // { title: 'Actions', key: 'actions', sortable: false },
        ]
        
        const data: IRequest[] = 
        [
            {id: 1, qrcode:'123456s22', measuringMode: 1, dateTime: new Date(2023, 12, 24, 10, 33, 31), partnumber:'SM0000-0001', partname: 1, process: 1, itemnumber: 1, round: 1, machinenumber: 1, jignumber: 1, lotMachining: 'lot', remark:'mark'},
            {id: 2, qrcode:'123457ss', measuringMode: 1, dateTime: new Date(2023, 12, 24, 10, 33, 32), partnumber:'SM0000-0001', partname: 1, process: 1, itemnumber: 1, round: 1, machinenumber: 1, jignumber: 1, lotMachining: 'lot', remark:'mark'},
            {id: 3, qrcode:'123458', measuringMode: 1, dateTime: new Date(2023, 12, 24, 10, 33, 33), partnumber:'SM0000-0001', partname: 1, process: 1, itemnumber: 1, round: 1, machinenumber: 1, jignumber: 1, lotMachining: 'lot', remark:'mark'},
            {id: 4, qrcode:'123458', measuringMode: 1, dateTime: new Date(2023, 12, 24, 10, 33, 33), partnumber:'SM0000-0001', partname: 1, process: 1, itemnumber: 1, round: 1, machinenumber: 1, jignumber: 1, lotMachining: 'lot', remark:'mark'}
        ]

        let expanded = ref([])

        return{
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
                <v-toolbar flat>
                    <v-toolbar-title>Requestion Table</v-toolbar-title>
                </v-toolbar>

                <div style="display: flex; flex-direction: row-reverse;">
                    <v-dialog max-width="800px">
                        <template v-slot:activator="{ props }">
                            <v-btn
                            color="primary"
                            dark
                            class="mt-2 mb-2"
                            v-bind="props"
                            >
                                New Item
                            </v-btn>
                        </template>

                        <request-detail-component/>
                    </v-dialog>
                </div>
                
            </template>

            <template v-slot:expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length">
                        <request-item-component
                            :qrcode="item.raw.qrcode"
                            :itemnumber="item.raw.itemnumber"
                            :machinenumber="masterstore.getmachinenumberbyindex(item.raw.machinenumber)"
                            :jignumber="item.raw.jignumber"
                            :lot="item.raw.lotMachining"
                            :remark="item.raw.remark"
                        />
                    </td>
                </tr>
            </template>

            <template v-slot:item.dateTime="{item}">
                {{masterstore.getdatetimetext(item.raw.dateTime)}}
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




            <!-- <template v-slot:item.actions="{ item }">
            <v-icon
                icon="edit"
                size="small"
                class="me-2"
            >
            </v-icon>
            <v-icon
                icon="delete"
                size="small"
            >
            </v-icon>
            </template>
            <template v-slot:no-data>
            <v-btn
                color="primary"
            >
                Reset
            </v-btn>
            </template> -->

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