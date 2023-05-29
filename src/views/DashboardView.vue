<script lang="ts">
import { defineComponent, inject, ref} from 'vue'
import ScatterChart from '@/components/ScatterChartComponent.vue'
import { useMasterStore } from '@/stores/masterStore'
import { onMounted } from 'vue'
import type { MasterMachineName, MasterMeasInstrument, MasterMeasureMode, MasterPartName, MasterProcessName, MasterRound } from '@/types/master.type'
import CardComponent from '@/components/CardComponent.vue'
import CardselectorComponent from '@/components/CardSelectorComponent.vue';
import PDFSelectorComponent from '@/components/PDFSelector.vue';
import VuePdfEmbed from 'vue-pdf-embed'
import ModeSelectComponent from '@/components/ModeSelectComponent.vue';
import DataactionComponent from '@/components/DataactionSelector.vue';
import DataeditorComponent from '@/components/DataEditorComponent.vue'

import type { AxiosStatic } from 'axios';
import type { DashboardItemsResponse, ValuePositionModel, ValueitemsResponse } from '@/types/dashboard.type'
import moment from 'moment'
import { onUnmounted } from 'vue'
import type { IModeSelect } from '@/types/IModeSelect'
import type { IPointObject } from '@/types/IPointObject'
import {confirmation, alert, success} from "@/components/sweetalert/sweetalert";
import type VueSweetalert2 from 'vue-sweetalert2'

export default defineComponent({
    components:{ScatterChart, CardComponent, CardselectorComponent, PDFSelectorComponent, VuePdfEmbed, ModeSelectComponent, DataactionComponent, DataeditorComponent},
    setup(){
        const axios = inject<AxiosStatic>('$axios')

        const masterstore = useMasterStore()
        const selMeasInstrument = ref<MasterMeasInstrument[]|undefined>(undefined);
        const selRoundMaster = ref<MasterRound[] | undefined>();
        const selMeasuremode = ref<MasterMeasureMode[] | undefined>();
        const selMachinemster = ref<MasterMachineName[]>([]);

        const selProcessObj = ref<MasterProcessName | undefined>(undefined);
        const selPartnameObj = ref<MasterPartName | undefined>(undefined);

        const data = ref<ValueitemsResponse[]|undefined>(undefined);
        const datatimestamp = ref<string>();
        const isClear = ref<Boolean>(false);

        const pdfitems = ref<String[]>([]);

        const isOpendialogPDFList = ref<boolean>(false)
        const isOpendialogPDFViewer = ref<boolean>(false);
        const isOpendialogIsfetching = ref<boolean>(false);
        const isOpendialogDataAction = ref<boolean>(false);
        const isOpendialogDataeditor = ref<boolean>(false);
        const isOpendialogFetchingdata = ref<boolean>(false);

        const pdfSource = ref<String|Uint8Array>('');
        const pdfPage:number|undefined = undefined;
        const selectedDate = ref();

        const stateisFetching = ref<boolean>(false);

        const fnFetchdata = async(date:Date|undefined)=>{
            stateisFetching.value = true;
            if(date == undefined) date = new Date();
            let res = await axios?.get<any, any>(`/Dashboard/Getdashboardvalues?partnameid=${selPartnameObj.value?.id}&processid=${selProcessObj.value?.id}&date=${date.toLocaleString()}`).catch((error)=>{
                alert(`Error`, `Code : ${res.status} Message : ${res.data}`)
            })

            if(res.status === 200){
                const obj = res.data as DashboardItemsResponse;
                data.value = obj.values;
                datatimestamp.value = moment(obj.timestamp).format("hh:mm:ss");
            }
            isOpendialogFetchingdata.value = false;
            stateisFetching.value = false;
        }

        var timerId:any = 0;
        onMounted(()=>{
            selRoundMaster.value = masterstore.mastervalue?.round as MasterRound[];
            selMeasuremode.value = masterstore.mastervalue?.measuremode as MasterMeasureMode[];
            selMachinemster.value = masterstore.mastervalue?.machinename as MasterMachineName[];
        })

        onUnmounted(()=>{
            if(timerId != 0) clearInterval(timerId)
        })

        const pollingDelay:number = 10000;
        var memoryIModeSelect:IModeSelect|undefined;
        const fnOnModeselectionChanged = (item:IModeSelect|undefined)=>{
            //Update memory
            if(item == undefined) item = memoryIModeSelect;
            else memoryIModeSelect = item;

            //Clear interval
            if(timerId != 0) clearInterval(timerId)
            if(item?.mode == 'realtimeselected')
            {
                isOpendialogFetchingdata.value = true;
                fnFetchdata(item.date)
                timerId = setInterval(fnFetchdata, pollingDelay)
            }
            else if(item?.mode == 'historyactive'){}
            else if(item?.mode == 'historyselected'){ isOpendialogFetchingdata.value = true; fnFetchdata(item.date);}
        }

        const fnMachineselected = (value:MasterMachineName) =>{
            selProcessObj.value = masterstore.mastervalue?.processname.find(e=>e.id == value.processName);
            selPartnameObj.value = masterstore.mastervalue?.partname.find(e=>e.id == value.partName);

            selMeasInstrument.value = selectedMasterItem(selPartnameObj?.value?.id, selProcessObj?.value?.id);

            //Trigger clear charts data.
            isClear.value = !isClear.value
            fnFetchdata(undefined);
            //Set interval
            if(timerId != 0) clearInterval(timerId)
            timerId = setInterval(fnFetchdata, pollingDelay)
        }

        const selectedMasterItem = (partnameid:number|undefined, processid:number|undefined):MasterMeasInstrument[] => {
            const master = masterstore.mastervalue?.measinstrument;
            var result = master?.filter((e) => e.procId == processid && e.partId == partnameid);
            return result as MasterMeasInstrument[];
        }

        var mempointsitem : IPointObject;
        const fnOnpointClick = async(items:IPointObject)=>{
            if(items.pointobject.length == 0) return;
            mempointsitem = items;
            isOpendialogDataAction.value = true;
        }

        const fnCloseDialog = ()=>{
            isOpendialogPDFList.value = false;
        }

        const selectedDataitem = ref<ValuePositionModel>();
        const fnOnselectedDataAction = (item:string)=>{
            isOpendialogDataAction.value = false;
            if(item == 'dataeditor'){
                if(mempointsitem.pointobject.length > 0)
                {
                    selectedDataitem.value = mempointsitem.pointobject[0];
                    isOpendialogDataeditor.value = true;
                }
            }
            else if(item == 'pdfselector') {
                pdfitems.value = mempointsitem.pdfpath;
                isOpendialogPDFList.value = true;
            }
        }

        const fnConfirmOpenPdf = async(filepath:string)=>{
            //console.log(filepath)
            //pdfSource.value = 'http://localhost:7118/api/Pdf/readpdffromserver?filesubpath=%2FNeedle%2FEdgeless%2FRoundness%2F2023%2F05%2F20%2FEMEAS_20230520_072036-RE.pdf'
            isOpendialogIsfetching.value = true;
            let res = await axios?.get<any, any>(`/Pdf/readpdffromserver?filesubpath=${filepath}`, {responseType:'blob'}).catch((error)=>{
                alert(`Error`, `Code : ${res.status} Message : ${res.data}`)
            })

            if(res.status == 200)
            {
                const blob = new Blob([res.data]);
                const objectUrl = URL.createObjectURL(blob);
                pdfSource.value = objectUrl;
            }
            else{pdfSource.value = ''}

            isOpendialogIsfetching.value = false;
            isOpendialogPDFList.value = false;
            isOpendialogPDFViewer.value = true;
        }

        const fncloseDataEditor = ()=>{
            isOpendialogDataeditor.value = false;
        }

        const fnOnsubmitDataEditor = async()=>{
            isOpendialogDataeditor.value = false;
            success('Complete', 'Edit data complete')
            fnOnModeselectionChanged(undefined);
        }

        return{
            fnFetchdata,
            fnMachineselected,
            fnOnpointClick,
            fnCloseDialog,
            fnConfirmOpenPdf,
            fnOnModeselectionChanged,
            fncloseDataEditor,
            selMeasInstrument,
            selRoundMaster,
            selMeasuremode,
            selMachinemster,
            selProcessObj,
            selPartnameObj,
            data,
            datatimestamp,
            isClear,
            isOpendialogPDFList,
            pdfitems,
            pdfSource,
            isOpendialogPDFViewer,
            isOpendialogIsfetching,
            isOpendialogDataAction,
            isOpendialogDataeditor,
            isOpendialogFetchingdata,
            stateisFetching,
            pdfPage,
            fnOnselectedDataAction,
            fnOnsubmitDataEditor,
            selectedDataitem
        }
    }
})
</script>

<template>
    <div class="container">
        <v-dialog max-width="400px" persistent v-model="isOpendialogFetchingdata">
            <v-card style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
                <v-icon icon="autorenew" size="76" color="blue"></v-icon>
                <strong style="color: blue; font-size: 22px;">Fetching master data from server.</strong>
            </v-card>
        </v-dialog>

        <v-dialog max-width="850px" persistent v-model="isOpendialogPDFList">
            <PDFSelectorComponent :items="pdfitems" @on-close="fnCloseDialog" @on-confirm="fnConfirmOpenPdf"/>
        </v-dialog>

        <v-dialog persistent v-model="isOpendialogIsfetching" max-width="300px" min-width="100px">
            <v-card style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px;">
                <v-icon icon="autorenew" size="100" class="mb-3"></v-icon>
                <div color="#3772ff" style="font-size: large;">Fetching PDF from server.....</div>
            </v-card>
        </v-dialog>

        <v-dialog max-width="850px" v-model="isOpendialogPDFViewer">
            <div style="background-color: rgb(var(--v-theme-primary)); height: 55px; display: flex; justify-content: center; align-items: center;">
                <strong>PDF Viewer</strong>
            </div>

            <div style="overflow-y: scroll;">
                <vue-pdf-embed :source="pdfSource" :page="pdfPage"/>
            </div>
        </v-dialog>

        <v-dialog max-width="500px" v-model="isOpendialogDataAction">
            <DataactionComponent @on-selected="fnOnselectedDataAction"/>
        </v-dialog>

        <v-dialog persistent max-width="800px" v-model="isOpendialogDataeditor">
            <DataeditorComponent :data="selectedDataitem" @on-close="fncloseDataEditor" @on-submitted="fnOnsubmitDataEditor"/>
        </v-dialog>


        <v-card style="margin: 5px 5px; z-index: 1;">
            <div style="background-color: rgb(var(--v-theme-primary));">
                <strong style="color: rgb(var(--v-theme-textSecondary));">Process Measuring Dashboard</strong>
                <v-icon v-if="stateisFetching" style="position: absolute; top: 20%; left: 97%; color: lime;" icon="downloading"></v-icon>
                <!-- <v-btn @click="fnFetchdata">Fetch</v-btn> -->
            </div>

            <div style="padding: 15px;">
                <v-row>
                    <v-col cols="12"  sm="6" md="6" lg="3"> <ModeSelectComponent icon="calendar_month" @on-selected-date="fnOnModeselectionChanged"/> </v-col>
                    <v-col cols="12"  sm="6" md="6" lg="3"> <CardselectorComponent :itemsmaster="selMachinemster" icon="laptop_mac" @on-selected="fnMachineselected"/> </v-col>
                    <v-col cols="12"  sm="6" md="6" lg="2"> <CardComponent title="Partname" :content="selPartnameObj?.name" icon="memory"/> </v-col>
                    <v-col cols="12"  sm="6" md="6" lg="2"> <CardComponent title="Process" :content="selProcessObj?.name" icon="developer_board"/> </v-col>
                    <v-col cols="12"  sm="6" md="6" lg="2"> <CardComponent title="Timestamp" :content="datatimestamp"/> </v-col>
                </v-row>
            </div>
        </v-card>

        <!-- No register item -->
        <div v-if="selMeasInstrument == undefined || selMeasInstrument.length == 0" style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 200px; background-color: rgb(var(--v-theme-primary)); margin: 10px;">
            <v-icon icon="report" size="100" color="red"></v-icon>
            <strong>No Registering item.</strong>
        </div>
        
        <div v-else style="padding:  0px 10px;">
            <v-row class="mt-0">
                <v-col cols="12" sm="12" md="12" lg="12" xl="6" xxl="6" v-for="(item, index) in selMeasInstrument" style="padding: 0px;">
                    <ScatterChart :title='(item.name as string)' @on-point-click="fnOnpointClick" :roundmster="selRoundMaster" :measuremodemaster="selMeasuremode" :data="data?.find(e=>e.id == item.id)" :clear="isClear"></ScatterChart>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: start;
        align-items: stretch;
        /* width: 99vw; */
        /* height: 96vh; */
        /* background-color: white; */
    }

    .v-col {
        padding: 5px 5px;
        position: fixed;
        z-index: 0;
    }

    .v-col-md-6{
        padding: 4px;
    }

    div strong{
        display: block;
        text-align: center;
        color: white;
        font-size: 24px;
    }

    /* .v-col-md-3{
        padding: 5px 5px;
    } */
</style>