<script lang="ts">
import {computed, defineComponent, ref, type PropType, watch} from 'vue'
import { ScatterChart, useScatterChart } from 'vue-chart-3';
import { Chart, registerables, type ChartDataset, type ChartTypeRegistry, type ScatterDataPoint, type TooltipItem } from "chart.js";
import type{ChartData, ChartOptions} from 'chart.js'
import type { Point } from 'chart.js/dist/core/core.controller';
import annotationPlugin from 'chartjs-plugin-annotation';
import type {MasterMeasureMode, MasterRound} from '@/types/master.type';
import { onMounted } from 'vue';
import type { ValuePositionModel, ValueitemsResponse } from '@/types/dashboard.type';


Chart.register(...registerables, annotationPlugin);

const colors:string[] = ['#00d62a', '#3772ff', '#4f772d', '#5e548e', '#df2935', '#fdca40']

const defprops = {
    title:{type: String, default: '', required:true},
    roundmster:{type: undefined as PropType<MasterRound[]> | undefined, default: [], required:true},
    measuremodemaster:{type: undefined as PropType<MasterMeasureMode[]>|undefined, default: [], required:true},
    data: {type: undefined as unknown as PropType<ValueitemsResponse> | undefined, default: undefined, required: false},
    clear: {type: undefined as unknown as PropType<Boolean>|undefined, default: false, required:false}
}

const standardlineStyle:any = {
    type: 'line',
    yMin: 0,
    yMax: 0,
    borderColor : 'rgba(255, 0, 0, 0.8)',
    borderWidth : 2,
    borderDash: [6, 4]
}

const dataset:ChartDataset<"scatter", (number | Point | null)> ={
    data : null,
    label: '-',
    backgroundColor: "#f87979", //Point color
    borderColor: "#6C757D",
    fill: "false",
    pointRadius: 5,
    borderWidth:1.5,
}

export default defineComponent({
    props: defprops,
    emits:[],
    components:{ ScatterChart },
    setup(props, { emit }){
        //const dataValues = ref<Point[]>([{x:0,y:1},{x:2,y:2},{x:3,y:3},{x:4,y:4}]);
        const suggestXMax = ref<number>(0);
        const _datasets = ref<ChartDataset<"scatter", ValuePositionModel[]>[]>([]);
        const testData = computed<ChartData<"scatter", ValuePositionModel[]>>(() => ({
            datasets: _datasets.value
        }));


        const cData = computed<ValueitemsResponse|undefined>(() => { return props.data})
        watch(cData, (items, prevItems)=>{
            cData.value?.values.map((element, index)=>{
                _datasets.value[index] = {..._datasets.value[index], data:[...element.values]}
            })
        })

        const cClear = computed<Boolean>(()=> props.clear)
        watch(cClear, ()=> { cleardata()});

        const cleardata = () =>{
            _datasets.value.map(e=>{
                e.data = []
            })
        }

        const options = computed<ChartOptions<"scatter">>(() => ({
        responsive: true,
        maintainAspectRatio: false,
        parsing:{
            xAxisKey: 'index',
            yAxisKey: 'value'
        },
        scales: {
            x:{
                //grace:'20%',
                ticks:{callback: roundMapping, font:{weight: 'bold', size: 14}, stepSize:1},
                suggestedMin: 0,
                suggestedMax: suggestXMax.value+1
            },
            y:{
                grace:'10%',
                ticks:{font:{weight: 'bold', size: 14}}
            },
        },
        plugins: {
            legend: {
                position: "bottom",
                labels:{font:{size:16, weight:'bold'}}
            },
            title: {
                display: false,
                text: props.title,
            },
            annotation:{
                annotations:{
                    lineupper: {...standardlineStyle, yMin: 2.5, yMax: 2.5},
                    linelower: {...standardlineStyle, yMin: 1.5, yMax: 1.5},
                }
            },
            tooltip:{
                callbacks:{
                    footer: tooltip
                }
            }
        }
        }));

        onMounted(()=>{
            suggestXMax.value = props.roundmster.length;
            _datasets.value = datasetMapping();
        })



        const tooltip = (tooltipitems:TooltipItem<"scatter">[]):string =>{
            let context:String = '-';
            tooltipitems.map(e=> {
                context +=`Measuringmode [${e.dataset.label}]\n`
                context +=`Round : ${(e.raw as ValuePositionModel).round}\n`
                context +=`Qr code : ${(e.raw as ValuePositionModel).qrcode}\n`
                context +=`Value : ${(e.raw as ValuePositionModel).value.toFixed(4)} Jignumber : ${(e.raw as ValuePositionModel).jignumber} Itemnumber : ${(e.raw as ValuePositionModel).itemnumber}\n`

                let filepathitems = (e.raw as ValuePositionModel).filepath;
                filepathitems.forEach((item, index, arr)=>{
                    context += `PDF[${index+1}] : ${item}\n`
                })
                //context += `PDF : ${(e.raw as ValuePositionModel).filepath}\n`

                context += `Machining lot : ${(e.raw as ValuePositionModel).machininglot}\n`
                context += `Remark : ${(e.raw as ValuePositionModel).remark}\n`
                context +=`-------------------------------------------------\n`
            })
            return `${context}`
        }

        const datasetMapping = ():ChartDataset<"scatter", ValuePositionModel[]>[]=>{
            var items = props.measuremodemaster.map((e, index) => {
                return {...dataset, label: e.name, data: [], backgroundColor: colors[index]}
            });
            return items;
        }

        const roundMapping = (elementitem:any):string=>{
            var result = props.roundmster.find(e=>e.id === elementitem as number)?.name;
            return result as string;
        }

        //Hook for vue-chart.js
        const { scatterChartProps, scatterChartRef } = useScatterChart({
            chartData: testData as any,
            options,
        });


        return{
            props,
            options,
            scatterChartRef,
            scatterChartProps,
        }
    }
})
</script>

<template>
    <div class="container">
        <v-card style="margin: 5px;">
            <div class="header">
                {{props.title}}
            </div>
            <ScatterChart style="padding: 20px;" v-bind="scatterChartProps" />
        </v-card>
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
        background-color: white;
    }

    .header{
        background-color: #6C757D;
        padding: 5px 0 5px 10px;
        font-size: 24px;
        font-weight: 600;
        color: white;
    }
</style>