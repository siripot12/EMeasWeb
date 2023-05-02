<script lang="ts">
import {defineComponent} from 'vue'
import type { IUser } from './types/user.type';
import HeaderComponent from "./components/HeaderComponent.vue";
import NavbarComponent from "./components/NavbarComponent.vue";
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useLoginStore } from './stores/loginStore';
import { RouterView } from 'vue-router'
import { useMasterStore } from './stores/masterStore';

interface Istates{
  account: IUser
}

const defaultAccountObj: IUser ={username:'', password:''}


export default defineComponent({
    components:{
      HeaderComponent,
      NavbarComponent
    },

    setup(){
        const masterStore = useMasterStore();
        let navbarState = ref<number>(0)
        const loginstore = useLoginStore()

        onMounted(async ()=>{
          await masterStore.fetchmaster();
          //console.log(masterStore.mastervalue);
        });

        const fnHeaderClick = () =>{
          navbarState.value += 1
        }

        return{
          loginstore,
          navbarState,
          fnHeaderClick
        }
    }
})
</script>

<template>
  <v-layout class="container-app-main">
    <div v-if="loginstore.isLoginState === true">
      <header-component title="Web application" @on-click="fnHeaderClick"/>
      <navbar-component :navbarstate="navbarState"/>
    </div>

    <v-main>
      <RouterView/>
    </v-main>
  </v-layout>
</template>

<style >
  .container-app-main{
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
  }

  .swal2-container{
        z-index: 10000 !important;
    }
</style>