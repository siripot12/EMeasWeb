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

        const isMasterFetching = ref<Boolean>(false);
        const isGetmasterFail = ref<Boolean>(false);

        onMounted(async ()=>{
          isMasterFetching.value = true;
          await masterStore.fetchmaster();


          if(masterStore.isSuccess) isGetmasterFail.value = false;
          else isGetmasterFail.value = true;

          isMasterFetching.value = false;
        });

        const fnHeaderClick = () =>{
          navbarState.value += 1
        }

        return{
          loginstore,
          navbarState,
          fnHeaderClick,
          isMasterFetching,
          isGetmasterFail
        }
    }
})
</script>

<template>
  <v-layout class="container-app-main">
    <!-- Fetching -->
    <v-card v-if="isMasterFetching == true" style="align-self: center; width: 100%;  display: flex; flex-direction: column; justify-content: center; align-items: center; height: 200px; background-color: 'secondary'; margin: 200px;">
      <v-icon icon="autorenew" size="100" color="blue"></v-icon>
      <strong style="color: blue;">Fetching master data from server.</strong>
    </v-card>

     <!-- Get master fail -->
    <v-card v-else-if="isGetmasterFail == true" style="align-self: center; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 200px; background-color: #'secondary'; margin: 200px;">
      <v-icon icon="report" size="100" color="red"></v-icon>
      <strong style="color: red;">Fetch master data from server fail.</strong>
    </v-card>

    <div v-else>
      <div v-if="loginstore.isLoginState === true">
        <header-component title="E-Measurement Web Application" @on-click="fnHeaderClick"/>
        <navbar-component :navbarstate="navbarState"/>
      </div>

      <v-main>
        <RouterView/>
      </v-main>
    </div>
    
  </v-layout>
</template>

<style >
  .container-app-main{
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    background-color: white;
  }

  .swal2-container{
        z-index: 10000 !important;
    }
</style>