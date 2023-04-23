import type { IAuthResp, IUser } from "@/types/user.type";
import { defineStore } from "pinia";
import CryptoJS from "crypto-js";

const createMD5 = (text:string):string =>{
    const hash = CryptoJS.MD5(text).toString(CryptoJS.enc.Hex)
    return hash
}

export const useLoginStore = defineStore('loginStore',
{
    state:()=>{
        return{
            isLoginState : false,
            isError : false,
            userdata : undefined as IAuthResp | undefined
        }
    },
    actions:{
        async dologin(data:IUser){
            data = {...data, password:createMD5(data.password)}
            console.log(data);
            let response = await this.$axios.post<IUser, any>("/Authen/Dologin", data)

            this.isError = true
            this.isLoginState = false
            
            if(response != null){
               const resstatus = response.status as number;
               if(resstatus === 200)
               {
                    const resdata = response.data as IAuthResp;
                    this.userdata = resdata
                    this.isLoginState = true
                    this.isError = false
               }
            }
        },
        dologout(){
            this.isLoginState = false;
            this.userdata = undefined;
        }
    }
})