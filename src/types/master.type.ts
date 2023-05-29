export interface MasterMeasuretype{
    id : number;
    name : string;
    mode : number;
}

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
    partnameId: number;
    processId : number;
    name : string;
}

export const defaultMasterProcessname:MasterProcessName = {
    id : 0,
    partnameId: 0,
    processId: 0,
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
    partName : number;
    processName : number;
}

export const defaultMastermachinename:MasterMachineName = {
    id : 0,
    name : '',
    partName : 0,
    processName : 0
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

export interface MasterTrayNumber{
    id : number;
    value : number;
    name : string;
}

export const defaultMastertraynumber:MasterTrayNumber = {
    id : 0,
    value : 0,
    name : ''
}

export interface MasterMeasInstrument{
    id: number,
    datano:number,
    partId:number,
    procId:number,
    measuringId:number,
    programGroup:number,
    upperStd:number,
    lowerStd:number,
    dataline:number,
    dataposition:number,
    filename:String,
    seqname:String,
    name:String
}

export const defaultMasterMeasInstrument: MasterMeasInstrument = {
    id : 0,
    datano : 0,
    partId : 0,
    procId : 0,
    measuringId : 0,
    programGroup : 0,
    upperStd : 0,
    lowerStd : 0,
    dataline : 0,
    dataposition : 0,
    filename : '',
    seqname : '',
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
    traynumber : MasterTrayNumber[];
    measinstrument: MasterMeasInstrument[];
    measuretype : MasterMeasuretype[];
}