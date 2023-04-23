<script lang="ts">
import {defineComponent} from 'vue'
import type { IUser } from './types/user.type';
import HeaderComponent from "./components/HeaderComponent.vue";
import NavbarComponent from "./components/NavbarComponent.vue";
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useLoginStore } from './stores/loginStore';
import { RouterView } from 'vue-router'

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
        let navbarState = ref<number>(0)
        const loginstore = useLoginStore()

        onMounted(()=>{

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
  <v-layout class="container">
    <div v-if="loginstore.isLoginState === true">
      <header-component title="Web application" @on-click="fnHeaderClick"/>
      <navbar-component :navbarstate="navbarState"/>
    </div>

    <v-main>
      <RouterView/>
    </v-main>
  </v-layout>
</template>

<style scoped>
  .container{
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
  }
</style>