export interface IAuthLevel{
    id : number;
    name : string;
}

export const defaultIauthlv:IAuthLevel = {
    id:0,
    name:'Unpermitted'
}

export const Authtiems:IAuthLevel[] = [
    {id:0, name:'Unpermitted'},
    {id:1, name:'Admin'},
    {id:2, name:'Senior'},
    {id:3, name:'Operator'},
    {id:4, name:'Requester'},
]