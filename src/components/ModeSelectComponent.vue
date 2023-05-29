<script lang="ts">
import {defineComponent, ref, type PropType, watch} from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import type { DatePickerInstance } from "@vuepic/vue-datepicker"
import '@vuepic/vue-datepicker/dist/main.css'
import type { IModeSelect } from '@/types/IModeSelect';
import { onMounted } from 'vue';
import { useTheme } from 'vuetify/lib/framework.mjs';
import Datepicker from 'vue3-datepicker'

const defprops = {
    bkiconcolor: {type:String, default:'rgb(var(--v-theme-iconBackPrimary))', required: false},
    iconcolor: {type:String, default:'rgb(var(--v-theme-iconPrimary))', required: false},
    backcolor: {type: String, default:'#F5F3F5', required: false},
    fontcolor: {type: String, default:'#1b263b', required: false},
    icon: {type: String, default: 'alarm', required:false}
}

export default defineComponent({
    components:{VueDatePicker, Datepicker},
    props: defprops,
    emits:['onSelectedDate'],
    setup(props, {emit}){
        const theme = useTheme();
        const date = ref<any>();
        const selection = ref<number>(0);
        const isDisablePicker = ref<boolean>(true);
        const isDialog = ref<boolean>(false)
        const pickeddate = ref<Date>(new Date);

        onMounted(()=>{
            date.value = Date.now();
            selection.value = 0;

        })

        watch(selection,(item)=>{
            //Realtime
            if(item == 0){
                isDisablePicker.value = true;
                date.value = Date.now();

                const resultObj:IModeSelect = {date: new Date(date.value), mode: 'realtimeselected'}
                emit('onSelectedDate', resultObj)
            }
            //History
            else{
                const resultObj:IModeSelect = {date: new Date(), mode: 'historyactive'}
                emit('onSelectedDate', resultObj)
                isDisablePicker.value = false;
                date.value = undefined;
                //isDialog.value = true;
                // @ts-ignore
                //console.log(dp.value?.openMenu())


            }
        });

        const fnOnPickerSelected = (item:Date)=>{
            //Fix hour to 8 for history mode.
            item.setHours(8);
            const resultObj:IModeSelect = {date: item, mode: 'historyselected'}
            emit('onSelectedDate', resultObj)
        }

        return{
            props,
            date,
            selection,
            isDisablePicker,
            fnOnPickerSelected,
            theme,
            isDialog,
            pickeddate
        }
    }
})
</script>

<template>
    <v-card class="cardComponentContainer" :style="{'background-color': props.backcolor}">
        <div class="cardComponentIconContainer" :style="{'background-color': props.bkiconcolor}">
            <v-icon :icon="props.icon" size="50" :color="props.iconcolor"></v-icon>
        </div>

        <div :style="{display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center'}">
            <v-row style="margin: 0px;">
                <v-item-group v-model="selection" mandatory style="display: flex; justify-content: stretch; width: 100%; padding: 5px 5px;">
                        <v-col sm="6" style="display: flex; justify-content: center; padding-right: 3px;">
                            <v-item v-slot="{ isSelected, toggle }">
                                <v-card
                                    style="height: 2.7em; width:100%"
                                    :color="isSelected ? 'iconBackPrimary' : ''"
                                    class="d-flex align-center justify-center"
                                    @click="toggle"
                                >
                                    <div style="font-size: 1.3em;">
                                        <strong :class="{'selectorTextSelected' : isSelected, 'selectorTextDeselected' : !isSelected}">RealTime</strong>
                                    </div>
                                </v-card>
                            </v-item>
                        </v-col>

                        <v-col sm="6" style="display: flex; justify-content: center; padding-left: 3px;">
                            <v-item v-slot="{ isSelected, toggle }">
                                <v-card
                                    style="height: 2.7em; width: 100%"
                                    :color="isSelected ? 'iconBackPrimary' : ''"
                                    class="d-flex align-center justify-center"
                                    dark
                                    @click="toggle"
                                >
                                    <div style="font-size: 1.3em; ">
                                        <strong :class="{'selectorTextSelected' : isSelected, 'selectorTextDeselected' : !isSelected}">History</strong>
                                    </div>
                                </v-card>
                            </v-item>
                        </v-col>
                </v-item-group>
            </v-row>

            <v-row style="margin: 0px; padding: 0px 5px 5px 5px;">
                <VueDatePicker :teleport="true" :enable-time-picker="false" :state="true" v-model="date" :disabled="isDisablePicker" @update:model-value="fnOnPickerSelected" style="width: 100%; " auto-apply show-now-button/>
            </v-row>

            <!-- <v-dialog v-model="isDialog" style="left: 40%;">
                <VueDatePicker v-model="date" inline model-auto/>

            </v-dialog> -->
        </div>
    </v-card>


</template>

<style scoped>
    .v-col{
        padding: 0px;
    }

    .selectorTextSelected{
        color: rgb(var(--v-theme-textSecondary));
    }

    .selectorTextDeselected{
        color: rgb(var(--v-theme-textPrimary));
    }
</style>