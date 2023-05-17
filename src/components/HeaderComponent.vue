<script lang="ts">
import {defineComponent} from 'vue'

const defProps ={
    title: {
        type: String,
        default: '',
        required: true
    }
}

export default defineComponent({
    props: defProps,
    emits:['onClick'],
    setup(props, { emit }){
        const fnChangeDrawer = ()=>{
            emit('onClick')
        }
        
        return{
            fnChangeDrawer,
        }
    }
})
</script>

<template>
    <v-app-bar :elevation="4" color="primary" density="compact">
        <template v-slot:prepend>
            <v-app-bar-nav-icon @click.stop="fnChangeDrawer" style=""></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>
            {{ title }}
        </v-app-bar-title>

        <template v-slot:append>
                
        </template>
    </v-app-bar>
</template>

<style scoped>
    ::v-deep .v-btn--icon .v-icon{
        color: white;
        font-size: 32px;
    }
</style>