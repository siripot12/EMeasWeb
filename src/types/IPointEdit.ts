export interface IPointEditReq{
    metaid?: number;
    dataid?: number;
    measuringitemid?: number;
    measuringtypeid?: number;
    value?: number;
    comment?: string;
}

export interface IPointEditRes{
    value : number;
    comment : string;
}