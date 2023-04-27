<script lang="ts">
import {defineComponent, reactive, ref} from 'vue'
import type { IPartRegisterReq, IRequest } from '@/types/request.type';
import { defaultIRequest } from '@/types/request.type';
import type { PropType } from 'vue';
import { onMounted } from 'vue';
import { useMasterStore } from '@/stores/masterStore';
import moment from "moment";

import type { MasterMeasureMode, MasterPartnumber, MasterPartName, MasterProcessName, MasterItemNumber, MasterRound, MasterMachineName, MasterJigNumber,  } from "@/types/master.type";
import { defaultIMasterMeasureMode, defaultMasterpartnumber, defaultMasterPartname, defaultMasterProcessname,  defaultMasterItemnumber, defaultMasterround, defaultMastermachinename, defaultMasterjignumber} from "@/types/master.type";
import { watch } from 'vue';
import { useLoginStore } from '@/stores/loginStore';
import { inject } from 'vue';
import type { AxiosStatic } from 'axios';
const defprops = {
    data: Object as PropType<IRequest>,
    mode: Number,
}


export default defineComponent({
        
    props: defprops,
    emits:['onSubmit', 'onClose'],
    setup(props,{emit}){
        const axios = inject<AxiosStatic>('$axios')
        const loginstore = useLoginStore();
        const masterStore = useMasterStore();

        var isQrReadonly = ref<boolean>(false)
        var inQrcode = ref<string>('')
        var inDate = ref<Date>()
        var inmeasuremode = ref<MasterMeasureMode>({...defaultIMasterMeasureMode})
        var inpartnumber = ref<MasterPartnumber>({...defaultMasterpartnumber})
        var inpartname = ref<MasterPartName>({...defaultMasterPartname})
        var inprocess = ref<MasterProcessName>({...defaultMasterProcessname})
        var initemnumber = ref<MasterItemNumber>({...defaultMasterItemnumber})
        var inround = ref<MasterRound>({...defaultMasterround})
        var inmachinenumber = ref<MasterMachineName>({...defaultMastermachinename})
        var injig = ref<MasterJigNumber>({...defaultMasterjignumber});
        var inlot = ref<string>('');
        var inremark = ref<string>('')

        var originaldata = {...props.data}
        var editeddata = ref<IRequest>({...props.data!})

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
            if(props.data === undefined){
                originaldata = {...defaultIRequest}
                editeddata.value = {...defaultIRequest}
                inDate.value = new Date()
            }

            initialUi();
        });

        const initialUi = ()=>{
            const measuremode = masterStore.mastervalue?.measuremode.find(e=>e.id == originaldata.measuringMode)
            inmeasuremode.value = measuremode? measuremode: {...defaultIMasterMeasureMode}
            const partnumber = masterStore.mastervalue?.partnumber.find(e=>e.name == originaldata.partnumber)
            inpartnumber.value = partnumber? partnumber:{...defaultMasterpartnumber}
            const partname = masterStore.mastervalue?.partname.find(e=>e.id == originaldata.partname)
            inpartname.value = partname? partname: {...defaultMasterPartname}
            const processname = masterStore.mastervalue?.processname.find(e=>e.id == originaldata.process)
            inprocess.value = processname? processname:{...defaultMasterProcessname}
            const machineitem = masterStore.mastervalue?.machineitems.find(e=>e.value == originaldata.itemnumber)
            initemnumber.value = machineitem? machineitem:{...defaultMasterItemnumber}
            const round = masterStore.mastervalue?.round.find(e=>e.value == originaldata.round)
            inround.value = round? round:{...defaultMasterround}
            const machinename = masterStore.mastervalue?.machinename.find(e=>e.id == originaldata.machinenumber)
            inmachinenumber.value = machinename? machinename:{...defaultMastermachinename}
            const jignumber = masterStore.mastervalue?.jignumber.find(e=>e.value == originaldata.jignumber)
            injig.value = jignumber? jignumber:{...defaultMasterjignumber}
            inlot.value = originaldata.lotMachining? originaldata.lotMachining: '' 
            inremark.value = originaldata.remark? originaldata.remark:''
        }

        const fnModeSelectChanged = ()=>{
            if(inmeasuremode.value.id == 1) {
                fnQrgenerate()
                isQrReadonly.value = true
            }
            else 
            {
                inQrcode.value = ''
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
            if(editeddata.value.measuringMode != 1) return editeddata.value.qrcode
            let qrcode = `${moment(editeddata.value.dateTime).format("DDMMYYYYhhmmss") + zeroPad(editeddata.value.partname,3)
            + zeroPad(editeddata.value.process,5) + zeroPad(editeddata.value.measuringMode,2) + zeroPad(editeddata.value.machinenumber,2)
            + zeroPad(editeddata.value.jignumber,2)}`
            
            inQrcode.value = qrcode;
            return qrcode
        }

        const fnSendData = async():Promise<IRequest>=>{
            let data:IPartRegisterReq = {auth: {...loginstore.userdata!}, partdetail: {...editeddata.value}}
            let res = await axios?.post<IPartRegisterReq, any>("/PartRegister/Partregist", data,{headers:{Accept:'application/json', "Content-Type":'application/json'}})
            return res.data!
        }

        const fnclick = async()=>{
            const res = await fnSendData()
            emit('onSubmit', res)
        }

        const fncancle = ()=>{
            emit('onClose')
        }

        return{
            fnModeSelectChanged,
            fnQrgenerate,
            fndateTostring,
            fnclick,
            fncancle,
            isQrReadonly,
            editeddata,
            masterStore,
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
            valid,
            required,
            requiredcombobox,
            minLength
        }
    },
    watch:{
        inQrcode(){this.editeddata = {...this.editeddata, qrcode:this.inQrcode}},
        inDate(){this.editeddata = {...this.editeddata, dateTime:this.inDate!}; this.fnQrgenerate();},
        inmeasuremode(){
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
    }
})
</script>

<template>
    <v-card>
        <v-card-title>
            <span class="text-h5">Request new item</span>
        </v-card-title>

        <v-card-text>
            <v-form v-model="valid">
                <v-container>
                <v-row>
                    <v-col cols="8" offset="0">
                        <v-text-field
                            label="Qr code"
                            :readonly="isQrReadonly"
                            v-model="inQrcode"
                            variant="solo"
                            type="qrcode"
                            :rules="[required('qrcode'), minLength('qrcode', 28)]"
                        ></v-text-field>
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
                        :disabled="!valid"
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
</style>