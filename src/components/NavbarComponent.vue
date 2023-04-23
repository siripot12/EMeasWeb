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

        const fnGotoHomeView = () =>{
            router.push('/home')
        }

        const fnGotoAboutView = ()=>{
            router.push('/about')
        }

        const fnLogOut = ()=>{
            loginStore.dologout();
            router.push('/login')
        }

        return{
            loginStore,
            drawer,
            fnGotoHomeView,
            fnGotoAboutView,
            fnLogOut
        }
    }
})
</script>

<template>
    <v-navigation-drawer 
        image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
        v-model="drawer"
        temporary
    >
        <v-list-item
            class="header-item"
            style="margin: 12px 0px;"
            prepend-icon="account_circle"
            :title="loginStore.userdata?.username"
        >
        </v-list-item>
        
        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item prepend-icon="home" title="Home" value="home" @click="fnGotoHomeView"></v-list-item>
            <v-list-item prepend-icon="homemax" title="About" value="about" @click="fnGotoAboutView"></v-list-item>
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