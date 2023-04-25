export interface MasterMeasureMode{
    id : number;
    name : string;
}

export const defaultIMasterMeasureMode:MasterMeasureMode = {
    id : 0,
    name :''
}

export interface MasterPartnumber{
    id : number;
    name : string;
}

export const defaultMasterpartnumber:MasterPartnumber = {
    id:0,
    name:''
}

export interface MasterPartName{
    id : number;
    name : string;
}

export const defaultMasterPartname:MasterPartName = {
    id : 0,
    name : ''
}

export interface MasterProcessName{
    id : number;
    name : string;
}

export const defaultMasterProcessname:MasterProcessName = {
    id : 0,
    name : ''
}

export interface MasterItemNumber{
    id : number;
    value : number;
    name : string;
}

export const defaultMasterItemnumber : MasterItemNumber = {
    id : 0,
    value : 0,
    name : ''
}

export interface MasterRound{
    id : number;
    value : number;
    name : string;
}

export const defaultMasterround : MasterRound = {
    id : 0,
    value : 0,
    name : ''
}

export interface MasterMachineName{
    id : number;
    name : string;
    partname : number;
    processname : number;
}

export const defaultMastermachinename:MasterMachineName = {
    id : 0,
    name : '',
    partname : 0,
    processname : 0
}

export interface MasterJigNumber{
    id : number;
    value : number;
    name : string;
}

export const defaultMasterjignumber:MasterJigNumber = {
    id : 0,
    value : 0,
    name : ''
}

export interface AllMasterResp{
    measuremode : MasterMeasureMode[];
    partnumber : MasterPartnumber[];
    partname : MasterPartName[];
    processname : MasterProcessName[];
    machineitems : MasterItemNumber[];
    machinename : MasterMachineName[];
    jignumber: MasterJigNumber[];
    round : MasterRound[];
}