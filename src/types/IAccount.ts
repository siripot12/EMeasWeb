export interface IAccount{
    username : string;
    password : string;
    authlv : number;
    employeeNo : string;
    name : string;
    department : string;
    sectionCode : number;
    email : string;
    niceNet : number;
}

export const defaultIAccount: IAccount = {
    username : '',
    password : '',
    authlv : 0,
    employeeNo : '',
    name : '',
    department : '',
    sectionCode : 0,
    email : '',
    niceNet : 0
}