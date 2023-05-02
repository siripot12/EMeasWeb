import Swal from 'sweetalert2'
import type {SweetAlertResult} from 'sweetalert2'

export interface IconfirmationRes{
    isconfirm : boolean;
    isdimiss : boolean;
}

const defaultConfirmationRes: IconfirmationRes = {
    isconfirm: false,
    isdimiss: false
}


export async function confirmation(title:string, text:string, ): Promise<IconfirmationRes>
{
    var res = await Swal.fire({
        icon: 'question',
        title: title,
        text: text,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    })

    if(res.dismiss) return {...defaultConfirmationRes, isdimiss: true}
    else if(res.isConfirmed) return {...defaultConfirmationRes, isconfirm: true}
    else return {...defaultConfirmationRes}
}

export async function alert(title:string, text:string):Promise<any>
{
    var res = await Swal.fire({
        icon:'error',
        title:title,
        text:text,
        allowOutsideClick: false,
        showCancelButton:false,
        showConfirmButton:true,
        confirmButtonText: 'Acknowledge'
    })

    return true
}

export async function success(title:string, text:string):Promise<any>
{
    var res = await Swal.fire({
        icon:'success',
        title:title,
        text:text,
        allowOutsideClick: false,
        showCancelButton:false,
        showConfirmButton:true,
        confirmButtonText: 'Acknowledge'
    })

    return true
}