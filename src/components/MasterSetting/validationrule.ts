export const rulerequired = (v:string) =>{
    return (!!v && v.length > 0) || `This field is required`
}

export const rulerequiredNumber = (v:any) =>{
    if(v === 0) return true
    else if(v === null || v === undefined || v === '') return `This field is required`
    else return true
}

export const rulerequiredselectNumber = (value:any)=>{
    if(value == null || typeof value !== 'number' || value == 0) return 'Item selection is required'
    else return true;
}

export const rulerequiredselectNumberWith0 = (value:any)=>{
    if(value == null || typeof value !== 'number' || value == 0) return 'Item selection is required'
    else return true;
}

export const rulerequiredselectObject = (value:any) =>{
    if(value == null || typeof value !== 'object') return 'Item selection is required'
    else return true
}

export const rulevaluelessthan24 = (value:number) =>{
    if(value && (value > 23 || value < 0)) return `Value must be 0 - 23`
    else return true;
}

export const rulestringconsistCSV = (value:string) =>{
    const checkcond = /.csv$/.exec(value)
    if(!checkcond) return `Value must be end with .csv`
    else return true;
}