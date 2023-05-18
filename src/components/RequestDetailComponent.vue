<script lang="ts">
import {defineComponent, reactive, ref} from 'vue'
import type { IPartRegisterReq, IRequest } from '@/types/request.type';
import { defaultIRequest } from '@/types/request.type';
import type { PropType } from 'vue';
import { onMounted } from 'vue';
import { useMasterStore } from '@/stores/masterStore';
import moment from "moment";

import type { MasterMeasureMode, MasterPartnumber, MasterPartName, MasterProcessName, MasterItemNumber, MasterRound, MasterMachineName, MasterJigNumber,  MasterTrayNumber} from "@/types/master.type";
import { defaultIMasterMeasureMode, defaultMasterpartnumber, defaultMasterPartname, defaultMasterProcessname,  defaultMasterItemnumber, defaultMasterround, defaultMastermachinename, defaultMasterjignumber, defaultMastertraynumber} from "@/types/master.type";
import { watch } from 'vue';
import { useLoginStore } from '@/stores/loginStore';
import { inject } from 'vue';
import type { AxiosStatic } from 'axios';

import {confirmation, alert, success} from "@/components/sweetalert/sweetalert";


const defprops = {
    data: Object as PropType<IRequest>,
    mode: Number,
}




export default defineComponent({

    props: defprops,
    emits:['onAdd', 'onEdit', 'onClose'],
    setup(props,{emit}){
        const axios = inject<AxiosStatic>('$axios')

        const loginstore = useLoginStore();
        const masterStore = useMasterStore();

        var isOperationMode : 'add'|'edit';

        const titel = ref<string>('');
        const isQrReadonly = ref<boolean>(false)
        const inQrcode = ref<string>('')
        const inDate = ref<Date>()
        const inmeasuremode = ref<MasterMeasureMode>({...defaultIMasterMeasureMode})
        const inpartnumber = ref<MasterPartnumber>({...defaultMasterpartnumber})
        const inpartname = ref<MasterPartName>({...defaultMasterPartname})
        const inprocess = ref<MasterProcessName>({...defaultMasterProcessname})
        const initemnumber = ref<MasterItemNumber>({...defaultMasterItemnumber})
        const inround = ref<MasterRound>({...defaultMasterround})
        const inmachinenumber = ref<MasterMachineName>({...defaultMastermachinename})
        const injig = ref<MasterJigNumber>({...defaultMasterjignumber});
        const inlot = ref<string>('');
        const inremark = ref<string>('')
        const intraynumber = ref<MasterTrayNumber>({...defaultMastertraynumber})

        const originaldata = ref<IRequest>({...props.data!})
        const editeddata = ref<IRequest>({...props.data!})

        const memoryQrcode = ref<string>('')
        const isUseOriginalQr = ref<boolean>(false);
        const isQrChanged = ref<boolean>(false);
        const isLockConfirm = ref<boolean>(false);

        //Rules
        var valid = ref<boolean>(false)
        const required = (propertyType:any) =>{
            return (v:string)=> (v && v.length > 0) || `You must input a ${propertyType}`
        }
        const requiredcombobox = (value:any) => {
            if(typeof value === 'string' || value instanceof String) return 'Item must be selected';
            //if (value instanceof Array && value.length == 0) return 'This field is required1.';
            if((value && value.id === 0) || (value == undefined)) return  'This field is Required'
            return true
        }
        const minLength = (propertyType:string, minLength: number) => {
            return (v:string)=>(v && v.length >= minLength) || `${propertyType} must be less than ${minLength} characters`
        }

        onMounted(()=>{
            if(props.data === undefined || props.data.id === 0){
                isOperationMode = 'add'
                titel.value = "Request new item"
                originaldata.value = props.data? {...props.data, itemnumber:props.data.itemnumber+1} : {...defaultIRequest}
                inDate.value = new Date()
            }
            else{
                isOperationMode = 'edit'
                titel.value = "Edit item"
                inDate.value = originaldata.value.dateTime;
                //Memmory scanned qrcode.
                memoryQrcode.value = originaldata.value.qrcode
                editeddata.value = {...originaldata.value}
            }

            initialUi();
        });

        const initialUi = ()=>{
            const measuremode = masterStore.mastervalue?.measuremode.find(e=>e.id == originaldata.value.measuringMode)
            inmeasuremode.value = measuremode? measuremode: {...defaultIMasterMeasureMode}
            const partnumber = masterStore.mastervalue?.partnumber.find(e=>e.name == originaldata.value.partnumber)
            inpartnumber.value = partnumber? partnumber:{...defaultMasterpartnumber}
            const partname = masterStore.mastervalue?.partname.find(e=>e.id == originaldata.value.partname)
            inpartname.value = partname? partname: {...defaultMasterPartname}
            const processname = masterStore.mastervalue?.processname.find(e=>e.id == originaldata.value.process)
            inprocess.value = processname? processname:{...defaultMasterProcessname}
            const machineitem = masterStore.mastervalue?.machineitems.find(e=>e.value == originaldata.value.itemnumber)
            initemnumber.value = machineitem? machineitem:{...defaultMasterItemnumber}
            const round = masterStore.mastervalue?.round.find(e=>e.value == originaldata.value.round)
            inround.value = round? round:{...defaultMasterround}
            const machinename = masterStore.mastervalue?.machinename.find(e=>e.id == originaldata.value.machinenumber)
            inmachinenumber.value = machinename? machinename:{...defaultMastermachinename}
            const jignumber = masterStore.mastervalue?.jignumber.find(e=>e.value == originaldata.value.jignumber)
            injig.value = jignumber? jignumber:{...defaultMasterjignumber}
            const traynumber = masterStore.mastervalue?.traynumber.find(e=>e.value == originaldata.value.traynumber)
            intraynumber.value = traynumber? traynumber:{...defaultMastertraynumber}

            inlot.value = originaldata.value.lotMachining? originaldata.value.lotMachining: ''
            inremark.value = originaldata.value.remark? originaldata.value.remark:''

            inQrcode.value = originaldata.value.qrcode;
        }

        
        const fnModeSelectChanged = ()=>{
            if(inmeasuremode.value.id == 1) {
                fnQrgenerate()
                isQrReadonly.value = true
            }
            else
            {
                if(isUseOriginalQr.value == false) inQrcode.value = memoryQrcode.value
                isQrReadonly.value = false
            }
        }

        const fndateTostring = (dt:Date | undefined):string=>{
            return moment(dt).format("YYYY/MM/DD hh:mm:ss")
        }

        function zeroPad(num:number, places:number) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        }

        const fnQrgenerate = ():string=>{
            if(editeddata.value.measuringMode != 1 || isUseOriginalQr.value == true) return editeddata.value.qrcode
            let qrcode = `${moment(editeddata.value.dateTime).format("DDMMYYYYhhmmss") + zeroPad(editeddata.value.partname,3)
            + zeroPad(editeddata.value.process,5) + zeroPad(editeddata.value.measuringMode,2) + zeroPad(editeddata.value.machinenumber,2)
            + zeroPad(editeddata.value.jignumber,2)}`

            inQrcode.value = qrcode;
            return qrcode
        }

        const fnSendAddData = async():Promise<any>=>{
            let data:IPartRegisterReq = {auth: {...loginstore.userdata!}, partdetail: {...editeddata.value}}
            data.partdetail.state = 1;
            let res = await axios?.post<IPartRegisterReq, any>("/PartRegister/ItemAdd", data,{headers:{Accept:'application/json', "Content-Type":'application/json'}})
            .catch((error)=>{
                return {status:error.response.status, data:error.response.data}
            })

            return res
        }

        const fnSendEditData = async():Promise<any>=>{
            let data:IPartRegisterReq = {auth: {...loginstore.userdata!}, partdetail: {...editeddata.value}}
            let res = await axios?.put<IPartRegisterReq, any>("/PartRegister/Itemedit", data,{headers:{Accept:'application/json', "Content-Type":'application/json'}})
            .catch((error)=>{
                return {status:error.response.status, data:error.response.data}
            })
            return res
        }

        const fnclick = async()=>{
            let res:any
            if(isOperationMode === 'add') res = await fnSendAddData()
            else if(isOperationMode === 'edit') res = await fnSendEditData()

            if(res.status == 200){
                if(isOperationMode == 'add') emit('onAdd', res.data)
                else if(isOperationMode == 'edit') emit('onEdit', res.data)
                await success('Success', 'Request item successfully to add/edit.')
            }
            else{
                await alert('Fail', `Code : ${res.status} Message : ${res.data}`)
            }
        }

        const fncancle = async()=>{
            const res = await confirmation('Confirmation' ,'Do you want to cancle this registration?')
            if(res.isconfirm){
                emit('onClose')
            }
        }

        const fncheckLockConfirm = ()=>{
            console.log(inmeasuremode.value.id);
            if(isUseOriginalQr.value && inmeasuremode.value.id == 1) isLockConfirm.value = true;
            else isLockConfirm.value = false;
        }

        return{
            titel,
            fnModeSelectChanged,
            fnQrgenerate,
            fndateTostring,
            fnclick,
            fncancle,
            fncheckLockConfirm,
            isQrReadonly,
            editeddata,
            originaldata,
            masterStore,
            memoryQrcode,
            inQrcode,
            inDate,
            inmeasuremode,
            inpartnumber,
            inpartname,
            inprocess,
            initemnumber,
            inround,
            inmachinenumber,
            injig,
            inlot,
            inremark,
            intraynumber,
            valid,
            required,
            requiredcombobox,
            minLength,
            isUseOriginalQr,
            isQrChanged,
            isLockConfirm
        }
    },
    watch:{
        isUseOriginalQr(){
            //Normal mode then disable confirm button.
            this.fncheckLockConfirm();
            if(this.isUseOriginalQr) this.inQrcode = this.originaldata.qrcode;
            else this.inQrcode = this.fnQrgenerate();
            
        },
        inQrcode(){
            this.editeddata = {...this.editeddata, qrcode:this.inQrcode};
            //If selected modes except normal mode store input qr code to memory.
            if(this.inmeasuremode.id != 1) this.memoryQrcode = this.inQrcode!

            if(this.originaldata.qrcode && (this.editeddata.qrcode != this.originaldata.qrcode)) this.isQrChanged = true;
            else this.isQrChanged = false;
        },
        inDate(){this.editeddata = {...this.editeddata, dateTime:this.inDate!}; this.fnQrgenerate();},
        inmeasuremode(){
            this.fncheckLockConfirm();
            this.editeddata = {...this.editeddata, measuringMode: this.inmeasuremode? this.inmeasuremode.id : 0}
            this.fnModeSelectChanged();
        },
        inpartnumber(){this.editeddata = {...this.editeddata, partnumber: this.inpartnumber? this.inpartnumber.name : ''}; this.fnQrgenerate();},
        inpartname(){if(typeof this.inpartname === 'string') return; this.editeddata = {...this.editeddata, partname: this.inpartname? this.inpartname.id:0}; this.fnQrgenerate();},
        inprocess(){if(typeof this.inprocess === 'string') return; this.editeddata = {...this.editeddata, process: this.inprocess? this.inprocess.id:0}; this.fnQrgenerate();},
        initemnumber(){if(typeof this.initemnumber === 'string') return; this.editeddata = {...this.editeddata, itemnumber: this.initemnumber? this.initemnumber.value:0}; this.fnQrgenerate();},
        inmachinenumber(){if(typeof this.inmachinenumber === 'string') return; this.editeddata = {...this.editeddata, machinenumber: this.inmachinenumber? this.inmachinenumber.id:0}; this.fnQrgenerate();},
        inround(){if(typeof this.inround === 'string') return; this.editeddata = {...this.editeddata, round: this.inround? this.inround.value:0}; this.fnQrgenerate();},
        injig(){if(typeof this.injig === 'string') return; this.editeddata = {...this.editeddata, jignumber: this.injig? this.injig.value:0}; this.fnQrgenerate();},
        inlot(){this.editeddata = {...this.editeddata, lotMachining:this.inlot}},
        inremark(){this.editeddata = {...this.editeddata, remark:this.inremark}},
        intraynumber(){if(typeof this.intraynumber === 'string') return; this.editeddata = {...this.editeddata, traynumber: this.intraynumber? this.intraynumber.id:0};}
    }
})
</script>

<template>
    <v-card>
        <v-card-title style="display: flex; flex-direction: column;">
            <span class="text-h5" style="margin-bottom: 10px;">{{titel}}</span>
            <v-card v-if="isQrChanged == true"  style="display: flex; align-items: center; padding: 0px 20px; margin: 5px 20px; background-color: orange;">
                <v-icon icon="warning" class="mr-2"></v-icon>
                <p>QR code is different with original</p>
            </v-card>

            <v-card v-if="isLockConfirm == true"  style="display: flex; align-items: center; padding: 0px 20px; margin: 5px 20px; background-color:yellow;">
                <v-icon icon="warning" class="mr-2"></v-icon>
                <p>Can not use original qrcode for normal measuring mode.</p>
            </v-card>
        </v-card-title>

        <v-card-text style="padding-top: 0px;">
            <v-form v-model="valid">
                <v-container style="padding-top: 0px;">
                <v-row>
                    <v-col cols="8" offset="0" style="display: flex;">
                        <v-text-field
                            style="width: 100%;"
                            label="Qr code"
                            :readonly="isQrReadonly"
                            v-model="inQrcode"
                            variant="solo"
                            type="qrcode"
                            :rules="[required('qrcode'), minLength('qrcode', 28)]"
                        ></v-text-field>
                        <div style="width: 140px; display: flex; flex-direction: column;" >
                            <v-checkbox label="Lock" v-model="isUseOriginalQr" color="#F46036" messages="(Except normal)"></v-checkbox>
                        </div>
                    </v-col>

                    <v-col cols="4" offset="0">
                        <v-text-field
                            label="Issue date/time"
                            variant="solo"
                            :model-value="fndateTostring(inDate)"
                            readonly
                        ></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-divider class="mb-3"></v-divider>
                </v-row>

                <v-row>
                    <v-col cols="3" class="colcontainer">
                        <v-combobox
                            label="Measuring mode"
                            :items="masterStore.mastervalue?.measuremode"
                            item-title="name"
                            item-value="id"
                            variant="solo"
                            v-model="inmeasuremode"
                            :rules="[requiredcombobox]"
                        ></v-combobox>
                    </v-col>

                    <v-col cols="3" class="colcontainer">
                        <v-combobox
                            label="Part number"
                            :items="masterStore.mastervalue?.partnumber"
                            item-title="name"
                            item-value="id"
                            v-model="inpartnumber"
                            variant="solo"
                            :rules="[requiredcombobox]"
                        ></v-combobox>
                    </v-col>

                    <v-col cols="2" class="colcontainer">
                        <v-combobox
                            label="Part name"
                            :items="masterStore.mastervalue?.partname"
                            item-title="name"
                            item-value="id"
                            v-model="inpartname"
                            variant="solo"
                            :rules="[requiredcombobox]"
                        ></v-combobox>
                    </v-col>

                    <v-col cols="4" class="colcontainer">
                        <v-combobox
                            label="Process"
                            :items="masterStore.mastervalue?.processname"
                            item-title="name"
                            item-value="id"
                            v-model="inprocess"
                            variant="solo"
                            :rules="[requiredcombobox]"
                        ></v-combobox>
                    </v-col>
                </v-row>

                <v-row >
                    <v-col cols="3" class="colcontainer">
                        <v-combobox
                            label="Item number"
                            :items="masterStore.mastervalue?.machineitems"
                            item-title="name"
                            item-value="id"
                            v-model="initemnumber"
                            variant="solo"
                            :rules="[requiredcombobox]"
                        ></v-combobox>
                    </v-col>

                    <v-col cols="3" class="colcontainer">
                        <v-combobox
                            label="Round"
                            :items="masterStore.mastervalue?.round"
                            item-title="name"
                            item-value="id"
                            variant="solo"
                            v-model="inround"
                            :rules="[requiredcombobox]"
                        ></v-combobox>
                    </v-col>

                    <v-col cols="3" class="colcontainer">
                        <v-combobox
                            label="Machine number"
                            :items="masterStore.mastervalue?.machinename"
                            item-title="name"
                            item-value="id"
                            v-model="inmachinenumber"
                            variant="solo"
                            :rules="[requiredcombobox]"
                        ></v-combobox>
                    </v-col>

                    <v-col cols="3" class="colcontainer">
                        <v-combobox
                            label="Jig number"
                            :items="masterStore.mastervalue?.jignumber"
                            item-title="name"
                            item-value="id"
                            v-model="injig"
                            variant="solo"
                            :rules="[requiredcombobox]"
                        ></v-combobox>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="3" class="colcontainer">
                        <v-combobox
                            label="Tray number"
                            :items="masterStore.mastervalue?.traynumber"
                            item-title="name"
                            item-value="id"
                            v-model="intraynumber"
                            variant="solo"
                            :rules="[requiredcombobox]"
                        ></v-combobox>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="6" class="colcontainer">
                        <v-text-field
                            label="Lot machining"
                            variant="solo"
                            v-model="inlot"
                            required
                        ></v-text-field>
                    </v-col>

                    <v-col cols="6" class="colcontainer">
                        <v-text-field
                            type="remark"
                            label="Remark"
                            variant="solo"
                            v-model="inremark"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <v-row style="display: flex; flex-direction: row-reverse;">
                    <v-btn
                        class="text-none text-white ml-2"
                        rounded="0"
                        variant="flat"
                        color="blue-darken-4"
                        prepend-icon="check_circle"
                        @click="fnclick"
                        :disabled="!valid || isLockConfirm"
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
                        @click="fncancle"
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
    ::v-deep .v-row + .v-row{
        margin: 0px;
    }

    .colcontainer{
        padding: 0px 3px;
    }

    ::v-deep .v-text-field .v-input__details {
        align-items: center;
        padding: 0px;
    }

    ::v-deep .v-messages__message{
        color: red;
        text-align: center;
        font-size: 12px;
        font-weight: 600;
    }
</style>