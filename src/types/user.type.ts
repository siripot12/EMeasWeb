export interface IUser{
    username : string;
    password : string;
}

export const defaultIUser:IUser =
{
    username : "",
    password : ""
}

export interface IAuthResp{
    username : string;
    authlevel : number;
    employeeno : string;
    name : string;
    department : string;
    sectioncode : number;
    email : string;
    nicenet : number;
}

export const defaultIAuthResp: IAuthResp =
{
    username : "",
    authlevel : 0,
    employeeno : "",
    name : "",
    department : "",
    sectioncode : 0,
    email : "",
    nicenet : 0
}
