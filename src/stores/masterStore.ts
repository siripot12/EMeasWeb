import type { AllMasterResp, MasterMeasInstrument } from "@/types/master.type";
import { defineStore } from "pinia";
import moment from "moment";

export const useMasterStore = defineStore('masterStore',
{
    state:()=>{
        return{
            mastervalue : undefined as AllMasterResp | undefined,
            isError : false,
            isSuccess : false
        }
    },
    actions:{
        async fetchmaster(){
            this.isError = false;
            let response = await this.$axios.get("/Master/GetAllMaster").catch(()=>{
                this.isError = true
            })
            if(this.isError) { return;}
            
            if(response != null){
               const resstatus = response.status as number;
               if(resstatus === 200)
               {
                    const resdata = response.data as AllMasterResp;
                    this.mastervalue = resdata
                    this.isSuccess = true
                    this.isError = false
               }
            }

            //Fetching master measurement instrument.
            let response2 = await this.$axios.get("/Master/GetMasterMeasureIns").catch(()=>{
                this.isError = true
            })
            if(this.isError) { return;}

            if(response2 != null){
                const resstatus = response2.status as number;
                if(resstatus === 200)
                {
                     const resdata = response2.data as MasterMeasInstrument[];
                     this.mastervalue = {...this.mastervalue, measinstrument :resdata} as AllMasterResp;
                     this.isSuccess = true
                     this.isError = false
                }
             }
        },

        //Methods for get name by index.
        getmodenamebyindex(index:number):string{
            let obj = this.mastervalue?.measuremode.find(e=>e.id == index)
            return obj != undefined? obj.name:'-'
        },
        getpartnamebyindex(index:number):string{
            let obj = this.mastervalue?.partname.find(e=>e.id == index)
            return obj != undefined? obj.name:'-'
        },
        getprocessbyindex(index:number):string{
            let obj = this.mastervalue?.processname.find(e=>e.id == index)
            return obj != undefined? obj.name:'-'
        },
        getmachinenumberbyindex(index:number):string{
            let obj = this.mastervalue?.machinename.find(e=>e.id == index)
            return obj != undefined? obj.name:'-'
        },
        getdatetimetext(dt:Date):string{
            return moment(dt).format("YYYY/MM/DD hh:mm:ss")
        },
        getroundtext(round:number):string{
            return round.toFixed(2);
        },
        getitemnumberbyvalue(value:number):string{
            let obj = this.mastervalue?.machineitems.find(e=>e.value == value)
            return obj != undefined? obj.name:'-'
        },
        getroundbyvalue(value:number):string{
            let obj = this.mastervalue?.round.find(e=>e.value == value)
            return obj != undefined? obj.name:'-'
        },
        getjigbyvalue(value:number):string{
            let obj = this.mastervalue?.jignumber.find(e=>e.value == value)
            return obj != undefined? obj.name:'-'
        },
        gettraynumberbyvalue(value:number):string{
            let obj = this.mastervalue?.traynumber.find(e=>e.value == value)
            return obj != undefined? obj.name:'-'
        }

    },
})