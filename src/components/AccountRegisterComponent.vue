<script lang="ts">
import { defaultIAuthResp, type IAuthResp } from '@/types/user.type'
import {defineComponent, reactive, ref, inject, type PropType, watch} from 'vue'
import {confirmation, alert, success} from "@/components/sweetalert/sweetalert";
import type { AxiosError, AxiosStatic } from 'axios';
import {type IAccount, defaultIAccount } from '@/types/IAccount';
import CryptoJS from "crypto-js";
import { computed } from 'vue';
import { onMounted } from 'vue';
import {type IAuthLevel, Authtiems, defaultIauthlv} from '@/types/IAuthlevel'

const defprops = {
    mode:{type: undefined as PropType<string>|undefined, default: 'add', required:false},
    data:{type: undefined as PropType<IAccount>|undefined, default: undefined, required: false}
}

export default defineComponent({
    props: defprops,
    emits:['onClose', 'onCompete'],
    setup(props, {emit}){
        const axios = inject<AxiosStatic>('$axios')
        var registobj = reactive<IAccount>(props.data? props.data : defaultIAccount);
        //var inSectionCode = computed(()=> registobj.sectionCode.toString())
        //var inNicenet = computed(()=> registobj.niceNet.toString())

        const inNicenet = ref<string>('');
        const inSectionCode = ref<string>('');
        const inAuthlevel = ref<IAuthLevel>(defaultIauthlv)

        const inPasswordConfirm = ref<string>('');
        const valid = ref<boolean>(false)

        onMounted(()=>{
            inNicenet.value = registobj.niceNet.toString();
            inSectionCode.value = registobj.sectionCode.toString();
            let resauthlv = Authtiems.find(x=> x.id == registobj.authlv);
            inAuthlevel.value = resauthlv? resauthlv: defaultIauthlv;
        });

        const rulerequired = (propertyType:any) =>{
            return (v:string)=> (v && v.length > 0) || `${propertyType} is required`
        }
        const ruleminLength = (propertyType:string, minLength: number) => {
            return (v:string)=>(v && v.length >= minLength) || `${propertyType} must be less than ${minLength} characters`
        }
        const rulerequiredcombobox = (value:any) => {
            if(typeof value === 'string' || value instanceof String) return 'Item must be selected';
            //if (value instanceof Array && value.length == 0) return 'This field is required1.';
            //if((value && value.id === 0) || (value == undefined)) return  'This field is Required'
            return true
        }

        const fnClose = ()=>{
            emit('onClose')
        }

        const createMD5 = (text:string):string =>{
            const hash = CryptoJS.MD5(text).toString(CryptoJS.enc.Hex)
            return hash
        }

        const fnSubmitAdd = async()=>{
            if(valid.value)
            {
                if(registobj.password != inPasswordConfirm.value) alert('Error' ,"Password not match with password confirm.")
                else
                {
                    registobj = {...registobj, niceNet: Number(inNicenet.value), sectionCode : Number(inSectionCode.value), password : createMD5(registobj.password)}

                    var res = await axios?.post<any, any>("/Authen/addnewaccount", registobj,{headers:{Accept:'application/json', "Content-Type":'application/json'}})
                    .catch((error:AxiosError)=>{
                        alert('Error', error.response?.data as string);
                    });

                    if(res?.status == 201)
                    {
                        success('Created', 'Account is created');
                        fnClose();
                    }
                }
            }
        }

        const fnSubmitEdit = async()=>{
            let isPawdchange:boolean = false;
            //Incase edit password
            if(inPasswordConfirm.value != '')
            {
                if(registobj.password != inPasswordConfirm.value) {
                    alert('Error' ,"Password not match with password confirm.")
                    return;
                }
                else
                {
                    registobj = {...registobj, niceNet: Number(inNicenet.value), sectionCode : Number(inSectionCode.value), authlv : inAuthlevel.value.id, password : createMD5(registobj.password)}
                    isPawdchange = true;
                }
            }
            else
            {
                registobj = {...registobj, niceNet: Number(inNicenet.value), sectionCode : Number(inSectionCode.value), authlv : inAuthlevel.value.id, password : ''}
            }

            const querystring = `/Authen/editaccount?ispswdchange=${isPawdchange}`
            var res = await axios?.put<any, any>(querystring, registobj,{headers:{Accept:'application/json', "Content-Type":'application/json'}})
            .catch((error:AxiosError)=>{
                alert('Error', error.response?.data as string);
            });

            if(res?.status == 200)
            {
                const item = res.data as IAccount;
                emit('onCompete', item);
                success('Complete', 'Account is edited');
                fnClose();
            }
        }

        return{
            Authtiems,
            props,
            valid,
            rulerequired,
            ruleminLength,
            rulerequiredcombobox,
            registobj,
            fnClose,
            fnSubmitAdd,
            fnSubmitEdit,
            inNicenet,
            inSectionCode,
            inPasswordConfirm,
            inAuthlevel
        }
    }
})
</script>

<template>
    <v-card>
        <v-card-title style="display: flex; flex-direction: column;">
            <span class="text-h5" style="margin-bottom: 10px;">Account Registration [{{ props.mode == 'add'? 'ADD' : 'EDIT' }}]</span>
            <v-card v-if="props.mode != 'add' && inPasswordConfirm != ''"  style="display: flex; align-items: center; padding: 0px 20px; margin: 5px 20px; background-color: orange;">
                <v-icon icon="warning" class="mr-2"></v-icon>
                <p>Edit data with change password</p>
            </v-card>

            <v-card v-if="props.mode != 'add'"  style="display: flex; align-items: center; padding: 0px 20px; margin: 5px 20px; background-color: yellow;">
                <v-icon icon="notifications" class="mr-2"></v-icon>
                <p>Username can not edit in this mode.</p>
            </v-card>
        </v-card-title>

        <v-card-text style="padding-top: 0px;">
            <v-form v-model="valid" @submit.prevent>
                <v-container style="padding-top: 0px;">
                    <v-row>
                        <v-col cols="12" xs="12" sm="12">
                            <strong>Email</strong>
                            <v-text-field
                                v-model="registobj.email"
                                variant="solo"
                                type="email"
                                :rules="[rulerequired('email')]"
                            />
                        </v-col>

                        <v-col cols="12" xs="12" sm="12">
                            <strong>Username</strong>
                            <v-text-field
                                :readonly="props.mode != 'add'"
                                v-model="registobj.username"
                                variant="solo"
                                type="text"
                                :rules="[rulerequired('username'), ruleminLength('username', 6)]"
                            />
                        </v-col>

                        <v-col cols="12" xs="12" sm="6">
                            <strong>Password</strong>
                            <v-text-field
                                v-model="registobj.password"
                                variant="solo"
                                type="password"
                                :rules="[rulerequired('password'), ruleminLength('password', 6)]"
                            />
                        </v-col>

                        <v-col cols="12" xs="12" sm="6">
                            <strong>Password confirm</strong>
                            <v-text-field
                                v-model="inPasswordConfirm"
                                variant="solo"
                                type="password"
                                :rules="(props.mode!='add' && inPasswordConfirm=='')?  undefined : [rulerequired('password confirm'), ruleminLength('password confirm', 6)]"
                            />
                        </v-col>

                        <v-col cols="12" xs="12" sm="7">
                            <strong>Employee name</strong>
                            <v-text-field
                                v-model="registobj.name"
                                variant="solo"
                                type="text"
                                :rules="[rulerequired('employee name')]"
                            />
                        </v-col>

                        <v-col cols="12" xs="12" sm="3">
                            <strong>Employee number</strong>
                            <v-text-field
                                v-model="registobj.employeeNo"
                                variant="solo"
                                type="number"
                                :rules="[rulerequired('employee number')]"
                            />
                        </v-col>

                        <v-col cols="12" xs="12" sm="2">
                            <strong>Department</strong>
                            <v-text-field
                                v-model="registobj.department"
                                variant="solo"
                                type="text"
                                :rules="[rulerequired('department')]"
                            />
                        </v-col>

                        <v-col cols="12" xs="12" sm="6">
                            <strong>Section code</strong>
                            <v-text-field
                                v-model="inSectionCode"
                                variant="solo"
                                type="number"
                                :rules="[rulerequired('section code')]"
                            />
                        </v-col>

                        <v-col cols="12" xs="12" sm="6">
                            <strong>Nicenet</strong>
                            <v-text-field
                                v-model="inNicenet"
                                variant="solo"
                                type="number"
                                :rules="[rulerequired('nice net')]"
                            />
                        </v-col>

                        <v-col v-if="props.mode != 'add'" cols="12" xs="12" sm="12">
                            <strong>Auth. Level</strong>
                            <v-combobox
                                :items="Authtiems"
                                item-title="name"
                                item-value="id"
                                v-model="inAuthlevel"
                                variant="solo"
                                :rules="[rulerequiredcombobox]"
                                return-object
                            ></v-combobox>
                        </v-col>
                    </v-row>

                    <v-row style="display: flex; flex-direction: row-reverse;">
                        <v-btn
                            class="text-none text-white ml-2"
                            rounded="0"
                            variant="flat"
                            color="blue-darken-4"
                            prepend-icon="check_circle"
                            type="submit"
                            v-on="{click: props.mode == 'add'? fnSubmitAdd : fnSubmitEdit}"
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
   .v-col, .v-col-12, .v-col-sm-12{
        padding: 0px 5px;
    }
</style>