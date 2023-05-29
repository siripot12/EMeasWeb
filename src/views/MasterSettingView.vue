<script lang="ts">
import {defineComponent, ref} from 'vue'
import MastermeasuremodeComponent from '@/components/MasterSetting/MasterMeasuremodeComponent.vue'
import MasterPartnumberComponent from '@/components/MasterSetting/MasterPartnumberComponent.vue';
import MasterPartnameComponent from '@/components/MasterSetting/MasterPartnameComponent.vue';
import MasterRoundComponent from '@/components/MasterSetting/MasterRoundComponent.vue'
import MasterMachinenameComponent from '@/components/MasterSetting/MasterMachinenameComponent.vue';
import MasterProcessnameComponent from '@/components/MasterSetting/MasterProcessnameComponent.vue';
import MasterMeasuretypeComponent from '@/components/MasterSetting/MasterMeasuretypeComponent.vue'
import { useMasterStore } from '@/stores/masterStore';
import type { MasterMeasureMode } from '@/types/master.type';


export default defineComponent({
    components:{MastermeasuremodeComponent, MasterPartnumberComponent, MasterPartnameComponent, MasterRoundComponent, MasterMachinenameComponent, MasterProcessnameComponent, MasterMeasuretypeComponent},
    setup(){
        const selection = ref<number>(0);
        const masterstore = useMasterStore();

        return{
            selection,
            masterstore,
        }
    }
})
</script>

<template>
    <div class="container">
        <v-card style="margin: 5px 5px;">
            <div style="background-color: rgb(var(--v-theme-primary)); height: 55px; display: flex; justify-content: center; align-items: center;">
                <strong style="color: rgb(var(--v-theme-textSecondary));">Master Setting</strong>
            </div>
        </v-card>

        <v-card style="display: flex;">
            <v-item-group v-model="selection" mandatory style="max-width: 200px;">
                <v-row style="margin: 0px;">
                    <v-col cols="12" style="display: flex; justify-content: center;">
                        <v-item v-slot="{ isSelected, toggle }">
                            <v-card
                                style="height: 5em; width:100%"
                                :color="isSelected ? 'iconBackPrimary' : ''"
                                class="d-flex align-center justify-center"
                                @click="toggle"
                            >
                                <div style="font-size: 0.5em; text-align: center;">
                                    <strong :class="{'selectorTextSelected' : isSelected, 'selectorTextDeselected' : !isSelected}">Measure Mode</strong>
                                </div>
                            </v-card>
                        </v-item>
                    </v-col>

                    <v-col cols="12" style="display: flex; justify-content: center; width: 100%;">
                        <v-item v-slot="{ isSelected, toggle }">
                            <v-card
                                style="height: 5em; width:100%"
                                :color="isSelected ? 'iconBackPrimary' : ''"
                                class="d-flex align-center justify-center"
                                @click="toggle"
                            >
                                <div style="font-size: 0.5em; text-align: center;">
                                    <strong :class="{'selectorTextSelected' : isSelected, 'selectorTextDeselected' : !isSelected}">Partnumber</strong>
                                </div>
                            </v-card>
                        </v-item>
                    </v-col>

                    <v-col cols="12" style="display: flex; justify-content: center; width: 100%;">
                        <v-item v-slot="{ isSelected, toggle }">
                            <v-card
                                style="height: 5em; width:100%"
                                :color="isSelected ? 'iconBackPrimary' : ''"
                                class="d-flex align-center justify-center"
                                @click="toggle"
                            >
                                <div style="font-size: 0.5em; text-align: center;">
                                    <strong :class="{'selectorTextSelected' : isSelected, 'selectorTextDeselected' : !isSelected}">Partname</strong>
                                </div>
                            </v-card>
                        </v-item>
                    </v-col>

                    <v-col cols="12" style="display: flex; justify-content: center; width: 100%;">
                        <v-item v-slot="{ isSelected, toggle }">
                            <v-card
                                style="height: 5em; width:100%"
                                :color="isSelected ? 'iconBackPrimary' : ''"
                                class="d-flex align-center justify-center"
                                @click="toggle"
                            >
                                <div style="font-size: 0.5em; text-align: center;">
                                    <strong :class="{'selectorTextSelected' : isSelected, 'selectorTextDeselected' : !isSelected}">Round</strong>
                                </div>
                            </v-card>
                        </v-item>
                    </v-col>

                    <v-col cols="12" style="display: flex; justify-content: center; width: 100%;">
                        <v-item v-slot="{ isSelected, toggle }">
                            <v-card
                                style="height: 5em; width:100%"
                                :color="isSelected ? 'iconBackPrimary' : ''"
                                class="d-flex align-center justify-center"
                                @click="toggle"
                            >
                                <div style="font-size: 0.5em; text-align: center;">
                                    <strong :class="{'selectorTextSelected' : isSelected, 'selectorTextDeselected' : !isSelected}">Machine Name</strong>
                                </div>
                            </v-card>
                        </v-item>
                    </v-col>

                    <v-col cols="12" style="display: flex; justify-content: center; width: 100%;">
                        <v-item v-slot="{ isSelected, toggle }">
                            <v-card
                                style="height: 5em; width:100%"
                                :color="isSelected ? 'iconBackPrimary' : ''"
                                class="d-flex align-center justify-center"
                                @click="toggle"
                            >
                                <div style="font-size: 0.5em; text-align: center;">
                                    <strong :class="{'selectorTextSelected' : isSelected, 'selectorTextDeselected' : !isSelected}">Processname</strong>
                                </div>
                            </v-card>
                        </v-item>
                    </v-col>

                    <v-col cols="12" style="display: flex; justify-content: center; width: 100%;">
                        <v-item v-slot="{ isSelected, toggle }">
                            <v-card
                                style="height: 5em; width:100%"
                                :color="isSelected ? 'iconBackPrimary' : ''"
                                class="d-flex align-center justify-center"
                                @click="toggle"
                            >
                                <div style="font-size: 0.5em; text-align: center;">
                                    <strong :class="{'selectorTextSelected' : isSelected, 'selectorTextDeselected' : !isSelected}">Measure Type</strong>
                                </div>
                            </v-card>
                        </v-item>
                    </v-col>
                </v-row>
            </v-item-group>

            <div style="background-color: red; width: 100%; height: 100%;">
                <div v-if="selection == 0">
                    <mastermeasuremode-component :masteritems="(masterstore.mastervalue?.measuremode)"/>
                </div>

                <div v-if="selection == 1">
                    <master-partnumber-component :masteritems="(masterstore.mastervalue?.partnumber)"/>
                </div>

                <div v-if="selection == 2">
                    <master-partname-component :masteritems="(masterstore.mastervalue?.partname)"/>
                </div>

                <div v-if="selection == 3">
                    <master-round-component :masteritems="(masterstore.mastervalue?.round)"/>
                </div>

                <div v-if="selection == 4">
                    <master-machinename-component :masteritems="masterstore.mastervalue?.machinename" :masterprocess="masterstore.mastervalue?.processname" :masterpartname="masterstore.mastervalue?.partname"/>
                </div>

                <div v-if="selection == 5">
                    <master-processname-component :masteritems="masterstore.mastervalue?.processname" :masterprocess="masterstore.mastervalue?.processname" :masterpartname="masterstore.mastervalue?.partname"/>
                </div>

                <div v-if="selection == 6">
                    <master-measuretype-component :masteritems="masterstore.mastervalue?.measuretype"/>
                </div>
            </div>
        </v-card>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: stretch;
        width: 100vw;
        height: 100%;
    }

    div strong{
        text-align: center;
        color: white;
        font-size: 24px;
    }

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