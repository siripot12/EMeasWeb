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

import type { AxiosStatic } from 'axios';
import type { DashboardItemsResponse, ValueitemsResponse } from '@/types/dashboard.type'
import moment from 'moment'
import { onUnmounted } from 'vue'

export default defineComponent({
    components:{ScatterChart, CardComponent, CardselectorComponent, PDFSelectorComponent, VuePdfEmbed},
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

        const isOpendialog = ref<boolean>(false)
        const isOpendialogPDFViewer = ref<boolean>(false);
        const isOpendialogIsfetching = ref<boolean>(false);

        const pdfSource = ref<String|Uint8Array>('');
        const pdfPage:number|undefined = undefined;

        const fnFetchdata = async()=>{
            console.log("Fetching dashboard data");
            let res = await axios?.get<any, any>(`/Dashboard/Getdashboardvalues?partnameid=${selPartnameObj.value?.id}&processid=${selProcessObj.value?.id}`).catch((error)=>{
                alert(`Code : ${res.status} Message : ${res.data}`)
            })

            if(res.status === 200){
                const obj = res.data as DashboardItemsResponse;
                data.value = obj.values;
                datatimestamp.value = moment(obj.timestamp).format("hh:mm:ss");
            }
        }

        var timerId:number = 0;
        onMounted(()=>{
            selRoundMaster.value = masterstore.mastervalue?.round as MasterRound[];
            selMeasuremode.value = masterstore.mastervalue?.measuremode as MasterMeasureMode[];
            selMachinemster.value = masterstore.mastervalue?.machinename as MasterMachineName[];
        })

        onUnmounted(()=>{
            if(timerId != 0) clearInterval(timerId)
        })

        const fnMachineselected = (value:MasterMachineName) =>{
            selProcessObj.value = masterstore.mastervalue?.processname.find(e=>e.id == value.processName);
            selPartnameObj.value = masterstore.mastervalue?.partname.find(e=>e.id == value.partName);

            selMeasInstrument.value = selectedMasterItem(selPartnameObj?.value?.id, selProcessObj?.value?.id);

            //Trigger clear charts data.
            isClear.value = !isClear.value
            fnFetchdata();
            //Set interval
            if(timerId != 0) clearInterval(timerId)
            timerId = setInterval(fnFetchdata, 10000)
        }

        const selectedMasterItem = (partnameid:number|undefined, processid:number|undefined):MasterMeasInstrument[] => {
            const master = masterstore.mastervalue?.measinstrument;
            var result = master?.filter((e) => e.procId == processid && e.partId == partnameid);
            return result as MasterMeasInstrument[];
        }

        const fnOnpointClick = (items:string[])=>{
            if(items.length == 0) return;
            pdfitems.value = items;
            isOpendialog.value = true;
        }

        const fnCloseDialog = ()=>{
            isOpendialog.value = false;
        }

        const fnConfirmOpenPdf = async(filepath:string)=>{
            //console.log(filepath)
            //pdfSource.value = 'http://localhost:7118/api/Pdf/readpdffromserver?filesubpath=%2FNeedle%2FEdgeless%2FRoundness%2F2023%2F05%2F20%2FEMEAS_20230520_072036-RE.pdf'
            isOpendialogIsfetching.value = true;
            let res = await axios?.get<any, any>(`/Pdf/readpdffromserver?filesubpath=${filepath}`, {responseType:'blob'}).catch((error)=>{
                alert(`Code : ${res.status} Message : ${res.data}`)
            })

            if(res.status == 200)
            {
                const blob = new Blob([res.data]);
                const objectUrl = URL.createObjectURL(blob);
                pdfSource.value = objectUrl;
            }
            else{pdfSource.value = ''}

            isOpendialogIsfetching.value = false;
            isOpendialog.value = false;
            isOpendialogPDFViewer.value = true;
        }

        return{
            fnFetchdata,
            fnMachineselected,
            fnOnpointClick,
            fnCloseDialog,
            fnConfirmOpenPdf,
            selMeasInstrument,
            selRoundMaster,
            selMeasuremode,
            selMachinemster,
            selProcessObj,
            selPartnameObj,
            data,
            datatimestamp,
            isClear,
            isOpendialog,
            pdfitems,
            pdfSource,
            isOpendialogPDFViewer,
            isOpendialogIsfetching,
            pdfPage
        }
    }
})
</script>

<template>
    <div class="container">

        <v-dialog max-width="850px" persistent v-model="isOpendialog">
            <PDFSelectorComponent :items="pdfitems" @on-close="fnCloseDialog" @on-confirm="fnConfirmOpenPdf"/>
        </v-dialog>

        <v-dialog persistent v-model="isOpendialogIsfetching" max-width="300px" min-width="100px">
            <v-card style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px;">
                <v-icon icon="autorenew" size="100" class="mb-3"></v-icon>
                <div color="#3772ff" style="font-size: large;">Fetching PDF from server.....</div>
            </v-card>
        </v-dialog>

        <v-dialog max-width="850px" v-model="isOpendialogPDFViewer">
            <div style="background-color: #6C757D; height: 55px; display: flex; justify-content: center; align-items: center;">
                <strong>PDF Viewer</strong>
            </div>

            <div style="overflow-y: scroll;">
                <vue-pdf-embed :source="pdfSource" :page="pdfPage"/>
            </div>
        </v-dialog>


        <v-card style="background-color: #F5F3F5; margin: 5px 5px;">
            <div style="background-color: #6C757D;">
                <strong>Process Measuring Dashboard</strong>
                <!-- <v-btn @click="fnFetchdata">Fetch</v-btn> -->
            </div>
            <div style="padding: 15px;">
                <v-row>
                    <v-col sm="6" md="3"> <CardselectorComponent :itemsmaster="selMachinemster" icon="laptop_mac" @on-selected="fnMachineselected"/> </v-col>
                    <v-col sm="6" md="3"> <CardComponent title="Partname" :content="selPartnameObj?.name" icon="memory"/> </v-col>
                    <v-col sm="6" md="3"> <CardComponent title="Process" :content="selProcessObj?.name" icon="developer_board"/> </v-col>
                    <v-col sm="6" md="3"> <CardComponent title="Timestamp" :content="datatimestamp"/> </v-col>
                </v-row>
            </div>
        </v-card>

        <!-- No register item -->
        <div v-if="selMeasInstrument == undefined || selMeasInstrument.length == 0" style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 200px; background-color: #6C757D; margin: 10px;">
            <v-icon icon="report" size="100" color="red"></v-icon>
            <strong>No Registering item.</strong>
        </div>
        <ul v-else>
            <li v-for="(item, index) in selMeasInstrument">
                <ScatterChart :title='(item.name as string)' @on-point-click="fnOnpointClick" :roundmster="selRoundMaster" :measuremodemaster="selMeasuremode" :data="data?.find(e=>e.id == item.id)" :clear="isClear"></ScatterChart>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        width: 100vw;
        flex-direction: column;
        justify-content: start;
        align-items: stretch;
        /* width: 99vw; */
        /* height: 96vh; */
        /* background-color: white; */
    }

    .v-col {
        padding: 5px 5px;
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