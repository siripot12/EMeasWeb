<script lang="ts">
import { computed } from 'vue'
import { onMounted } from 'vue'
import {defineComponent, ref} from 'vue'
import type { PropType } from 'vue';

const defprops = {
    title: {type: String, default: '-', required: false},
    content: {type: undefined as unknown as PropType<String>, default: '-', required: false},
    bkiconcolor: {type:String, default:'#F46036', required: false},
    iconcolor: {type:String, default:'#0E1428', required: false},
    backcolor: {type: String, default:'#F5F3F5', required: false},
    fontcolor: {type: String, default:'#0E1428', required: false},
    icon: {type: String, default: 'alarm', required:false}
}

export default defineComponent({
    props: defprops,
    emits:[],
    setup(props, {emit}){

        return{
            props
        }
    }
})
</script>

<template>
    <v-card class="cardComponentContainer" :style="{'background-color': props.backcolor}">
        <div class="cardComponentIconContainer" :style="{'background-color': props.bkiconcolor}">
            <v-icon :icon="props.icon" size="50" :color="props.iconcolor"></v-icon>
        </div>

        <div :style="{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', marginLeft: '1em'}">
            <div :style="{fontSize: '1.7em', fontWeight: 600, color: props.fontcolor}">{{props.content}}</div>
            <div :style="{fontSize: '1.4em', fontWeight: 500, color: '#415a77'}">{{props.title}}</div>
        </div>
    </v-card>
</template>

<style>
    .cardComponentContainer{
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
    }

    .cardComponentIconContainer{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30%;
        max-width: 100px;
        padding: 10px;
    }
</style>