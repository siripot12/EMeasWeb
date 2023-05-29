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
import type { IPointObject } from '@/types/IPointObject';


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
    emits:['onPointClick'],
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
                grace:'0.001%',
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
                    lineupper: {...standardlineStyle, yMin: cData.value?.upperstd, yMax: cData.value?.upperstd},
                    linelower: {...standardlineStyle, yMin: cData.value?.lowerstd, yMax: cData.value?.lowerstd},
                }
            },
            tooltip:{
                callbacks:{
                    footer: tooltip
                }
            }
        },
        onClick:(evt, item:any)=>{
            if(item.length > 0) fnPointClick(item);
        }
        }));

        onMounted(()=>{
            // suggestXMax.value = props.roundmster.length;
            let iditems = props.roundmster.map(e=>e.id)
            suggestXMax.value = Math.max(...iditems);
            _datasets.value = datasetMapping();
        })

        const fnPointClick = (items: any)=>{
            let files:string[] = [];
            let pointsObject:ValuePositionModel[] = [];

            items.forEach((item:any, index:number)=>{
                const obj = item.element.$context.raw as ValuePositionModel;
                pointsObject.push(obj);

                obj.filepath.forEach((item2)=> files.push(item2))
            })
            if(files.length == 1 && files[0] == '') files = [];

            const result:IPointObject = { pdfpath:files, pointobject: pointsObject}
            emit('onPointClick', result)
        }

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
                context += `Comment : ${(e.raw as ValuePositionModel).comment}\n`
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
            var result = props.roundmster.find(e =>e.id === elementitem as number)?.name;
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

<template scoped>
    <div class="container">
        <v-card style="margin: 5px;">
            <div class="header">
                {{props.title}}
            </div>
            <ScatterChart
            style="padding: 20px;"
            v-bind="scatterChartProps"
            />
        </v-card>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        width: auto;
        flex-direction: column;
        justify-content: start;
        align-items: stretch;
    }

    .header{
        background-color: rgb(var(--v-theme-primary));
        padding: 5px 0 5px 10px;
        font-size: 24px;
        font-weight: 600;
        color: rgb(var(--v-theme-textSecondary));
    }
</style>