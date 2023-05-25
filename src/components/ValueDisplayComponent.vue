<script lang="ts">
import {defineComponent} from 'vue'


const defprops = {
    header:{
        type: String,
        default: '',
        required : true
    },
    value:{
        type: String,
        default: '',
        required : true
    },
}

export default defineComponent({
    props: defprops,

    setup({header, value}){

        return{
            header,
            value
        }
    }
})
</script>
    
<template>
    <v-card style="min-width: 100px; min-height: 50px;">
        <template v-slot:title>
            <strong>{{header}}</strong>
            
        </template>
        <v-divider/>
        <template v-slot:text>
            {{value == undefined || value == ''? '-':value}}
        </template>
    </v-card>
</template>

<style scoped>
::v-deep .v-card-item{
    padding: 0px 20px;
    margin-bottom: 15px;
    background-color: rgb(var(--v-theme-secondary));
}
::v-deep .v-card-item .v-card-title{
    font-size: 12px;
    font-weight: 600;
    text-align: center;
}

::v-deep .v-card-item + .v-card-text {
    font-size: 18px;
    font-weight: 600;
    text-align: center;
}
</style>