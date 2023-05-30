<script lang="ts">
import { onMounted } from 'vue';
import { watch } from 'vue';
import {defineComponent, ref, type PropType} from 'vue'

const defprops = {
    items: {type: Array as PropType<String[]>, default: ()=>[], required:false},
}

export default defineComponent({
    props: defprops,
    emits:['onClose', 'onConfirm'],
    setup(props, {emit}){
        const pdfitems = ref<String[]>(props.items);
        const selection = ref<number|undefined>(undefined);
        const selectpdf = ref<String>('');

        watch(selection, ()=>{
            selectpdf.value= pdfitems.value[selection.value?selection.value:0];
        })

        onMounted(()=>{
        })

        const fnconfirmClick = ()=>{
            console.log(selectpdf.value);
            emit('onConfirm', selectpdf.value)
        }

        const fnclncleClick = ()=>{
            emit('onClose');
        }

        return{
            pdfitems,
            selection,
            selectpdf,
            fnconfirmClick,
            fnclncleClick
        }
    }
})
</script>

<template>
    <v-card>
        <v-card-title style="display: flex; flex-direction: column;">
            <span class="text-h5" style="margin-bottom: 10px;">PDF Selection</span>
        </v-card-title>

        <v-card-text style="padding-top: 0px; display: flex; flex-direction: column;">
            <v-card style="margin-bottom: 20px;">
                <v-item-group mandatory v-model="selection">
                    <v-container>
                    <v-row
                        v-for="(item, index) in pdfitems"
                        :key="index"
                    >
                        <v-col
                            cols="12"
                        >
                            <v-item v-slot="{ isSelected, toggle }">
                                <v-card
                                    :color="isSelected ? 'iconBackPrimary' : 'secondary'"
                                    class="align-center"
                                    style="display: flex; flex-direction: column; justify-content: center;"
                                    :height="isSelected ? '80px' : '50px'"
                                    :disabled="item == ''? true:false"
                                    @click="toggle"
                                >
                                    <div v-if="isSelected" class="text-h5 text-center prevent-select">
                                        [Selected]
                                    </div>

                                    <div class="text-h6 text-center prevent-select" >
                                        {{item==''? 'No file':item}}
                                    </div>

                                    <!-- <v-scroll-y-transition style="display: flex; flex-direction: column;">

                                    </v-scroll-y-transition> -->
                                </v-card>
                            </v-item>
                        </v-col>
                    </v-row>
                </v-container>
                </v-item-group>




            </v-card>

            <div style="display: flex; flex-direction: row-reverse;">
                <v-btn
                    class="text-none text-white ml-2"
                    rounded="0"
                    variant="flat"
                    color="blue-darken-4"
                    prepend-icon="check_circle"
                    @click="fnconfirmClick"
                    :disabled="selection == undefined || selectpdf == ''"
                    >
                        <template v-slot:prepend>
                            <v-icon color="success" type="submit"></v-icon>
                        </template>
                        Confirm
                    </v-btn>

                    <v-btn
                    class="text-none"
                    rounded="0"
                    variant="outlined"
                    color="blue-darken-4"
                    prepend-icon="clear"
                    @click="fnclncleClick"
                    >
                        <template v-slot:prepend>
                            <v-icon color="error"></v-icon>
                        </template>
                        Cancle
                    </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<style>
.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>