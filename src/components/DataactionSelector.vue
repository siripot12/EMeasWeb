<script lang="ts">
import { useLoginStore } from '@/stores/loginStore';
import { watch } from 'vue';
import {defineComponent, ref, type PropType} from 'vue'

export default defineComponent({
    emits:['onSelected'],
    setup(props, {emit}){
        const loginstore = useLoginStore();
        const selection = ref<number|undefined>(undefined);

        watch(selection,(item)=>{
            let result:string = '';
            if(item == 0) result = 'dataeditor'
            else if(item == 1) result = 'pdfselector'

            emit('onSelected', result)
        })
        return{
            selection,
            loginstore
        }
    }
})
</script>

<template>
    <v-card>
        <v-card-title style="display: flex; flex-direction: column;">
            <span class="text-h5" style="margin-bottom: 10px;">Data Action Selector</span>
        </v-card-title>

        <v-card-text style="padding-top: 0px; display: flex; flex-direction: column;">
            <v-card style="margin-bottom: 20px;">
                <v-item-group mandatory v-model="selection">
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-item v-slot="{ isSelected, toggle }">
                                    <v-card
                                    :disabled="loginstore.userdata?.authlevel != 1"
                                    :color="isSelected ? 'iconBackPrimary' : 'secondary'"
                                    class="align-center"
                                    style="display: flex; flex-direction: column; justify-content: center; padding: 10px;"
                                    @click="toggle"
                                    >
                                        <v-icon class="material-symbols-outlined" icon="app_registration" size="40"></v-icon>
                                        <div class="text-h6 text-center prevent-select" >
                                            <strong>DATA EDITOR</strong>
                                        </div>
                                    </v-card>
                                </v-item>
                            </v-col>

                            <v-col cols="12" sm="6" md="6">
                                <v-item v-slot="{ isSelected, toggle }">
                                    <v-card
                                        :color="isSelected ? 'iconBackPrimary' : 'secondary'"
                                        class="align-center"
                                        style="display: flex; flex-direction: column; justify-content: center; padding: 10px;"
                                        @click="toggle"
                                    >
                                        <v-icon class="material-symbols-outlined" icon="picture_as_pdf" size="40"></v-icon>
                                        <div class="text-h6 text-center prevent-select" >
                                            <strong>PDF SELECTOR</strong>
                                        </div>
                                    </v-card>
                                </v-item>
                            </v-col>

                            <!-- <v-col cols="12" sm="4" md="4">
                                <v-item v-slot="{ isSelected, toggle }">
                                    <v-card
                                        :color="isSelected ? 'iconBackPrimary' : 'secondary'"
                                        class="align-center"
                                        style="display: flex; flex-direction: column; justify-content: center; padding: 10px;"
                                        @click="toggle"
                                    >
                                        <v-icon class="material-symbols-outlined" icon="picture_as_pdf" size="40"></v-icon>
                                        <div class="text-h6 text-center prevent-select" >
                                            <strong>PDF</strong>
                                        </div>
                                    </v-card>
                                </v-item>
                            </v-col> -->
                            
                        </v-row>
                    </v-container>
                </v-item-group>
            </v-card>
        </v-card-text>
    </v-card>
</template>

<style>
</style>