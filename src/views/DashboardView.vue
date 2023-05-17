<script lang="ts">
import { defineComponent, inject, ref} from 'vue'
import ScatterChart from '@/components/ScatterChartComponent.vue'
import { useMasterStore } from '@/stores/masterStore'
import { onMounted } from 'vue'
import type { MasterMachineName, MasterMeasInstrument, MasterMeasureMode, MasterPartName, MasterProcessName, MasterRound } from '@/types/master.type'
import CardComponent from '@/components/CardComponent.vue'
import CardselectorComponent from '@/components/CardSelectorComponent.vue';

import type { AxiosStatic } from 'axios';
import type { ValueitemsResponse } from '@/types/dashboard.type'

export default defineComponent({
    components:{ScatterChart, CardComponent, CardselectorComponent},
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
        const isClear = ref<Boolean>(false);

        const fnFetchdata = async()=>{
            console.log("Fetching dashboard data");
            let res = await axios?.get<any, any>(`/Dashboard/Getdashboardvalues?partnameid=${selPartnameObj.value?.id}&processid=${selProcessObj.value?.id}`).catch((error)=>{
                alert(`Code : ${res.status} Message : ${res.data}`)
            })

            if(res.status === 200){
                data.value = res.data as ValueitemsResponse[];
            }
        }

        var timerId:number = 0;
        onMounted(()=>{
            selRoundMaster.value = masterstore.mastervalue?.round as MasterRound[];
            selMeasuremode.value = masterstore.mastervalue?.measuremode as MasterMeasureMode[];
            selMachinemster.value = masterstore.mastervalue?.machinename as MasterMachineName[];
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
            //timerId = setInterval(fnFetchdata, 10000)
        }

        const selectedMasterItem = (partnameid:number|undefined, processid:number|undefined):MasterMeasInstrument[] => {
            const master = masterstore.mastervalue?.measinstrument;
            var result = master?.filter((e) => e.procId == processid && e.partId == partnameid);
            return result as MasterMeasInstrument[];
        }

        return{
            fnFetchdata,
            fnMachineselected,
            selMeasInstrument,
            selRoundMaster,
            selMeasuremode,
            selMachinemster,
            selProcessObj,
            selPartnameObj,
            data,
            isClear
        }
    }
})
</script>

<template>
    <div class="container">

        <v-card style="background-color: #F5F3F5; margin: 5px 5px;">
            <div style="background-color: #6C757D;">
                <strong>Process Measuring Dashboard</strong>
                <v-btn @click="fnFetchdata">Fetch</v-btn>
            </div>
            <div style="padding: 15px;">
                <v-row>
                    <v-col sm="6" md="3"> <CardselectorComponent :itemsmaster="selMachinemster" icon="laptop_mac" @on-selected="fnMachineselected"/> </v-col>
                    <v-col sm="6" md="3"> <CardComponent title="Partname" :content="selPartnameObj?.name" icon="memory"/> </v-col>
                    <v-col sm="6" md="3"> <CardComponent title="Process" :content="selProcessObj?.name" icon="developer_board"/> </v-col>
                    <v-col sm="6" md="3"> <CardComponent title="Timestamp"/> </v-col>
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
                <ScatterChart :title='(item.name as string)' :roundmster="selRoundMaster" :measuremodemaster="selMeasuremode" :data="data?.find(e=>e.id == item.id)" :clear="isClear"></ScatterChart>
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