export interface ValuePositionModel{
    metaid : number;
    dataid : number;
    measuringitemid : number;
    measuringtypeid : number;
    round : number;
    qrcode : string;
    value : number;
    index : number;
    filepath: string[];
    machininglot : string;
    remark : string;
    jignumber : number;
    itemnumber : number;
    comment : string;
}

// export const defaultValuePositionModel: ValuePositionModel = {
//     qrcode:'',
//     value:0,
//     index:0

// }

export interface TypevalueResponse{
    typeindex : number;
    values : ValuePositionModel[];
}

export interface ValueitemsResponse{
    itemname: string;
    id : number;
    upperstd : number;
    lowerstd : number;
    values : TypevalueResponse[];
}

export interface DashboardItemsResponse{
    timestamp : Date;
    values : ValueitemsResponse[];
}