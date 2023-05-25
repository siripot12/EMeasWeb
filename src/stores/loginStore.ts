import type { IAuthResp, IUser } from "@/types/user.type";
import { defineStore } from "pinia";
import CryptoJS from "crypto-js";
import { confirmation, alert, success } from "@/components/sweetalert/sweetalert";

const createMD5 = (text:string):string =>{
    const hash = CryptoJS.MD5(text).toString(CryptoJS.enc.Hex)
    return hash
}

export const useLoginStore = defineStore('loginStore',
{
    state:()=>{
        return{
            isLoggingin : false,
            isLoginState : false,
            isError : false,
            isNotpermit : false,
            userdata : undefined as IAuthResp | undefined
        }
    },
    actions:{
        async dologin(data:IUser){
            try
            {
                this.isLoggingin = true;
                data = {...data, password:createMD5(data.password)}
                let response = await this.$axios.post<IUser, any>("/Authen/Dologin", data).catch((error)=>{
                    //alert('Error', 'login failed.');
                })

                this.isError = true
                this.isLoginState = false
                if(response != null){
                    const resstatus = response.status as number;
                    if(resstatus === 200)
                    {
                        const resdata = response.data as IAuthResp;
                        this.isError = false
                        if(resdata.authlevel == 0) {this.isNotpermit = true; return;}
                        this.userdata = resdata
                        this.isLoginState = true
                    }
                }
            }
            catch(err){}
            finally{
                this.isLoggingin = false;
            }
        },
        dologout(){
            this.isLoginState = false;
            this.userdata = undefined;
        }
    }
})