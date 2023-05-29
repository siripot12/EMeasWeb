<script lang="ts">
import { useMasterStore } from '@/stores/masterStore'
import type { IPointEditReq } from '@/types/IPointEdit'
import type { ValuePositionModel } from '@/types/dashboard.type'
import type { AxiosStatic } from 'axios'
import { reactive, computed, inject, onMounted, defineComponent, ref, type PropType, watch} from 'vue'
import {confirmation, alert, success} from "@/components/sweetalert/sweetalert";

const defprops = {
    data: {type: Object as PropType<ValuePositionModel>, default: null, required: true},
}

export default defineComponent({
    emits:['onClose', 'onBeginSubmit','onSubmitted'],
    props: defprops,
    setup(props, {emit}){
        const axios = inject<AxiosStatic>('$axios');
        const masterstore = useMasterStore();
        var valid = ref<boolean>(false)
        const data = ref<ValuePositionModel>({...props.data});

        const dataValue = ref<string>('');
        watch(data, (item)=>{
            dataValue.value = item? item?.value.toFixed(6) : '';
        })

        onMounted(()=>{
            data.value = {...props.data}
        })

        const measuretype = masterstore.mastervalue?.measuretype.find(e=>e.id == data.value?.measuringtypeid)?.name;
        const round = masterstore.mastervalue?.round.find(e=>e.id == data.value?.round)?.name;
        const measuringitem = masterstore.mastervalue?.measinstrument.find(e=>e.id == data.value?.measuringitemid)?.name;

        const isSending = ref<boolean>(false);


        const fnClose = ()=>{
            emit('onClose');
        }

        const fnSubmit = async()=>{
            if(!valid.value) return;
            emit('onBeginSubmit');
            isSending.value == true;
            const reqdata:IPointEditReq = {
                metaid:data.value?.metaid,
                dataid:data.value?.dataid,
                measuringitemid:data.value?.measuringitemid,
                measuringtypeid:data.value?.measuringtypeid,
                value:parseFloat(dataValue.value),
                comment:data.value?.comment};
            let res = await axios?.post<IPointEditReq, any>("/Dashboard/Editdatapoint", reqdata,{headers:{Accept:'application/json', "Content-Type":'application/json'}})
            .catch(async(error)=>{
                await alert(`Error`, `Code : ${res.status} Message : ${res.data}`)
                return;
            })
            isSending.value == false;
            if(res.status == 200)
            {
                emit('onSubmitted')
            }
        }

        const ruletextrequired = (propertyType:any) =>{
                return (v:string)=> (v && v.length > 0 && (/^\d+\.\d+$|^\d+$/.test(v))) || `You must input a number/float ${propertyType}`
        }

        return{
            valid,
            ruletextrequired,
            data,
            masterstore,
            measuretype,
            measuringitem,
            round,
            fnClose,
            fnSubmit,
            isSending,
            dataValue
        }
    }
})
</script>

<template>
    <v-card>
        <v-card-title style="display: flex; flex-direction: column;">
            <span class="text-h5" style="margin-bottom: 10px;">Data Editor</span>
        </v-card-title>

        <v-card-text style="padding-top: 0px;">
            <v-form v-model="valid" @submit.prevent="fnSubmit">
                <v-container style="padding-top: 0px;">
                    <v-row>
                        <v-col class="col-column" cols="12" sm="6" style="display: flex;">
                            <strong>Measure type</strong>
                            <v-text-field
                                type="text"
                                variant="solo"
                                v-model="measuretype"
                                :readonly="true"
                                :hide-details="true"
                            ></v-text-field>
                        </v-col>

                        <v-col class="col-column" cols="12" sm="6" style="display: flex;">
                            <strong>Measure item</strong>
                            <v-text-field
                                type="text"
                                variant="solo"
                                v-model="measuringitem"
                                :readonly="true"
                                :hide-details="true"
                            ></v-text-field>
                        </v-col>

                        <v-col class="col-column" cols="12" sm="12" style="display: flex;">
                            <strong>Qrcode</strong>
                            <v-text-field
                                type="text"
                                variant="solo"
                                v-model="data.qrcode"
                                :readonly="true"
                                :hide-details="true"
                            ></v-text-field>
                        </v-col>

                        <v-col class="col-column" cols="6" sm="3" style="display: flex;">
                            <strong>Round</strong>
                            <v-text-field
                                type="text"
                                variant="solo"
                                v-model="round"
                                :readonly="true"
                                :hide-details="true"
                            ></v-text-field>
                        </v-col>

                        <v-col class="col-column" cols="6" sm="3" style="display: flex;">
                            <strong>Item number</strong>
                            <v-text-field
                                type="text"
                                variant="solo"
                                v-model="data.itemnumber"
                                :readonly="true"
                                :hide-details="true"
                            ></v-text-field>
                        </v-col>

                        <v-col class="col-column" cols="6" sm="3" style="display: flex;">
                            <strong>Jig number</strong>
                            <v-text-field
                                type="text"
                                variant="solo"
                                v-model="data.jignumber"
                                :readonly="true"
                                :hide-details="true"
                            ></v-text-field>
                        </v-col>

                        <v-col class="col-column" cols="6" sm="3" style="display: flex;">
                            <strong>MC. lot</strong>
                            <v-text-field
                                type="text"
                                variant="solo"
                                v-model="data.machininglot"
                                :readonly="true"
                                :hide-details="true"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-divider style="margin: 15px 0px;"></v-divider>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col class="col-column" cols="12" sm="12" style="display: flex;">
                            <strong>Value</strong>
                            <v-text-field
                                type="text"
                                variant="solo"
                                v-model="dataValue"
                                :rules="[ruletextrequired('value')]"
                            ></v-text-field>
                        </v-col>

                        <v-col class="col-column" cols="12" sm="12" style="display: flex;">
                            <strong>Comment</strong>
                            <v-text-field
                                type="text"
                                variant="solo"
                                v-model="data.comment"
                                :hide-details="valid? true: false"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row style="display: flex; flex-direction: row-reverse; padding: 15px 0px 0px 0px;">
                    <v-btn
                        class="text-none text-white ml-2"
                        rounded="0"
                        variant="flat"
                        color="blue-darken-4"
                        prepend-icon="check_circle"
                        type="submit"
                        :disabled="isSending"
                    >
                        <template v-slot:prepend>
                            <v-icon color="success" type="submit"></v-icon>
                        </template>
                        {{ isSending? 'sending...':'Confirm' }}
                    </v-btn>

                    <v-btn
                        class="text-none"
                        rounded="0"
                        variant="outlined"
                        color="blue-darken-4"
                        prepend-icon="clear"
                        @click="fnClose"
                    >
                        <template v-slot:prepend>
                            <v-icon color="error"></v-icon>
                        </template>
                        Cancle
                    </v-btn>
                </v-row>
                </v-container>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<style scoped>
    ::v-deep .v-text-field input {
    text-align: center
    }
    .col-column{
        display: flex;
        flex-direction: column;
    }

    .v-col, .v-col-12, .v-col-sm-6, .v-col-sm-3{
        padding: 0px 3px;
    }
</style>