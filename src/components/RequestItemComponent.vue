<script lang="ts">
import {defineComponent} from 'vue'
import ValueDisplayComponent from './ValueDisplayComponent.vue';

const defprops = {
    qrcode:{
        type:String,
        default:'',
        required : true
    },
    itemnumber:{
        type:Number,
        default:'',
        required : true
    },
    machinenumber:{
        type:String,
        default:'',
        required : true
    },
    jignumber:{
        type:Number,
        default:'',
        required : true
    },
    lot:{
        type:String,
        default:'',
        required : true
    },
    remark:{
        type:String,
        default:'',
        required : true
    },
}


export default defineComponent({
    props:defprops,
    setup(props) {
        return {
            props
        };
    },
    components: { ValueDisplayComponent }
})
</script>

<template>
    <div class="containermain">
        <ValueDisplayComponent class="ma-2" header="QR code" :value="props.qrcode"/>
        <ValueDisplayComponent class="ma-2" header="Item number" :value="props.itemnumber.toString()"/>
        <ValueDisplayComponent class="ma-2" header="Machine number" :value="props.machinenumber.toString()"/>
        <ValueDisplayComponent class="ma-2" header="Jig number" :value="props.jignumber.toString()"/>
        <ValueDisplayComponent class="ma-2" header="Lot" :value="props.lot"/>
        <ValueDisplayComponent class="ma-2" header="Remark" :value="props.remark"/>
    </div>
</template>

<style scoped>
.containermain{
    display: flex;
    flex-direction: row;
    justify-content: start;
}
</style>