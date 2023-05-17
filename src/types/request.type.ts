import type { IAuthResp } from "./user.type";

export interface IPartRegisterReq{
    auth : IAuthResp;
    partdetail : IRequest;
}

export interface IRequest{
    id : number;
    state : number;
    completedate? : Date;
    qrcode : string;
    measuringMode: number;
    dateTime: Date;
    partnumber : string;
    partname : number;
    process:number;
    itemnumber:number;
    round: number;
    machinenumber : number;
    jignumber : number;
    lotMachining : string;
    remark: string;
    traynumber: number;
}

export const defaultIRequest:IRequest = {
    id : 0,
    state : 0,
    completedate : undefined,
    qrcode : '',
    measuringMode : 1,
    dateTime : new Date(2023, 12, 24, 10, 33, 31),
    partnumber : '',
    partname : 1,
    process : 1,
    itemnumber : 1,
    round : 1,
    machinenumber : 1,
    jignumber : 1,
    lotMachining : '',
    remark : '',
    traynumber : 1
}