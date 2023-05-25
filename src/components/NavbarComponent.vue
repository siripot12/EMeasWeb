<script lang="ts">
import { useLoginStore } from '@/stores/loginStore';
import {defineComponent, ref} from 'vue'
import { useRouter } from 'vue-router';

export default defineComponent({
   props: ['navbarstate'],
   watch: {
    navbarstate(){
        this.drawer = !this.drawer;
    }
   },
    setup(props){
        const router = useRouter()
        const loginStore = useLoginStore();

        let drawer = ref<boolean>(false)
        var drawerstate:boolean = false;
        
        const onClickoutside = ()=>{
            if(!drawer.value) return;
            setInterval(()=>{ drawerstate = drawer.value},200)
            if(drawerstate) drawer.value = false;
        }

        const fnGotoRequestView = () =>{
            router.push('/request')
        }

        const fnGotoDashboardView = ()=>{
            router.push('/dashboard')
        }

        const fnGotoAccountmanagementView = ()=>{
            router.push('/accountmanagement')
        }

        const fnLogOut = ()=>{
            loginStore.dologout();
            router.push('/login')
        }

        return{
            loginStore,
            drawer,
            fnGotoRequestView,
            fnGotoDashboardView,
            fnGotoAccountmanagementView,
            fnLogOut,
            onClickoutside
        }
    }
})
</script>

<template>
    <!-- image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg" -->
    <v-navigation-drawer
        background-color="secondary"
        v-model="drawer"
        temporary
    >
        <v-list-item
            class="header-item"
            style="margin: 12px 0px;"
            prepend-icon="account_circle"
            :title="loginStore.userdata?.username"
            v-click-outside="onClickoutside"
        >
        </v-list-item>
        
        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item prepend-icon="playlist_add_check" title="Measuring Request" value="home" @click="fnGotoRequestView"></v-list-item>
            <v-list-item prepend-icon="dashboard" title="Dashboard" value="about" @click="fnGotoDashboardView"></v-list-item>
            <v-list-item v-if="loginStore.userdata?.authlevel == 1" prepend-icon="account_box" title="Account Management" @click="fnGotoAccountmanagementView"></v-list-item>
            <v-divider></v-divider>
            <v-list-item>
                <v-btn block variant="flat" color="red" @click="fnLogOut">
                    <template v-slot:prepend>
                        <v-icon icon="power_settings_new"></v-icon>
                    </template>
                    Logout
                </v-btn>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<style scoped>
    .header-item ::v-deep .v-list-item__prepend > .v-icon{
        font-size: 40px;
    }
</style>