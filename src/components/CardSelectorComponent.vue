<script lang="ts">
import type { MasterMachineName } from '@/types/master.type'
import type { PropType } from 'vue'
import { watch } from 'vue'
import { computed } from 'vue'
import { onMounted } from 'vue'
import {defineComponent, ref} from 'vue'


const defprops = {
    itemsmaster:{type: undefined as PropType<MasterMachineName[]>|undefined, default: [], required:true},
    bkiconcolor: {type:String, default:'#F46036', required: false},
    iconcolor: {type:String, default:'#0E1428', required: false},
    backcolor: {type: String, default:'#F5F3F5', required: false},
    fontcolor: {type: String, default:'#1b263b', required: false},
    icon: {type: String, default: 'alarm', required:false}
}

export default defineComponent({
    props: defprops,
    emits:['onSelected'],
    setup(props, {emit}){
        const items = computed<MasterMachineName[]>(()=> props.itemsmaster)
        const selected = ref<MasterMachineName>()


        //Initial selection
        watch(items, (items, prevItems)=>{
            if(items != undefined && items.length > 0) selected.value = items[0]
        })

        watch(selected, (items, prevItems)=>{
            emit('onSelected', selected.value);
        })

        return{
            props,
            items,
            selected
        }
    }
})
</script>

<template>
    <v-card class="cardComponentContainer" :style="{'background-color': props.backcolor}">
        <div class="cardComponentIconContainer" :style="{'background-color': props.bkiconcolor}">
            <v-icon :icon="props.icon" size="50" :color="props.iconcolor"></v-icon>
        </div>

        <div :style="{display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'center', marginLeft: '1em', marginRight: '1em'}">
            <div>
                <strong>Measuring station</strong>
            </div>

            <div :style="{fontSize: '1.7em', fontWeight: 'bold', color: props.fontcolor}">
                <v-select
                    v-model="selected"
                    style="text-align: center; height: 65px;"
                    label="Select Machine"
                    :items="items"
                    item-title="name"
                    v-bind="{'return-object':true}"
                    single-line
                    variant="solo"
                >
                            </v-select>
                <!-- v-bind="{'return-object':true}" ifs used to fixed error -->
            </div>
        </div>
    </v-card>
</template>

<style scoped>
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

    ::v-deep .v-field__input{
        font-size: 1.4em;
        padding-bottom: 0px;
        padding-top: 0px;
        text-align: center;
        align-items: center;
        justify-content: center;
    }
    ::v-deep .v-field--variant-solo{
        background: none;
    }

    ::v-deep .v-select__selection {
        width: 100%;
        justify-content: center;
    }

    ::v-deep .v-select--active-menu
    {
        width: 100%;
        text-align: center;
        justify-content: center;
        align-items: center;
    }

    
</style>