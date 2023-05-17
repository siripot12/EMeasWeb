export interface ValuePositionModel{
    qrcode : string;
    value : number;
    index : number;
    filepath: string;
    machininglot : string;
    remark : string;
    jignumber : number;
    itemnumber : number;
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
    values : TypevalueResponse[];

}