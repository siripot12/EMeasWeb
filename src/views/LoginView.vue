<script lang="ts">
import { defineComponent, ref, reactive, inject } from "vue";
import { useLoginStore } from "../stores/loginStore";
import type { IUser } from "@/types/user.type";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

import AccountRegisterComponent from '@/components/AccountRegisterComponent.vue';

export default defineComponent({
    components:{AccountRegisterComponent},
    setup(){
      const isOpenRegisterdialog = ref<boolean>(false);

        onMounted(async()=>{
          const persistusername = localStorage.getItem("username")
          if(persistusername) loginObj.username = persistusername;
        });


        //let loginObj = reactive<IUser>({...defaultIUser});
          let loginObj = reactive<IUser>({username:'', password:''})

        //Use store.
        const loginstore = useLoginStore();
        //Use router
        const router = useRouter();

        const fnDologin = async() => {
            await loginstore.dologin(loginObj);

            if (loginstore.isLoginState) {
                localStorage.setItem('username', loginObj.username)
                router.push("/dashboard");
            }
            else if(loginstore.isNotpermit) console.log("Not permit");
            else console.log("Login Fail");
        };

        const fnOnclickregister = ()=>{
          isOpenRegisterdialog.value = true;
        };

        const fnDialogCreateAccountClose = ()=>{
          isOpenRegisterdialog.value = false;
        }

        return {
        loginstore,
        fnDologin,
        loginObj,
        isOpenRegisterdialog,
        fnOnclickregister,
        fnDialogCreateAccountClose
        };
    }
})
</script>

<template>
    <div class="container">
    <v-dialog persistent v-model="isOpenRegisterdialog" max-width="800px" min-width="100px">
      <account-register-component @on-close="fnDialogCreateAccountClose"/>
    </v-dialog>

    <v-card style="width: 500px;" class="rounded-lg elevation-20">
      <v-img
        src="../../public/densologo.png"
        height="220px"
        cover
      ></v-img>

      <v-card-title>
        <div class="bodyContainer">
          <h3>Username</h3>
          <v-text-field
            v-model="loginObj.username"
            type="text"
            label="Enter your username or email"
            @keydown.enter="fnDologin"
          ></v-text-field>
          <h3>Password</h3>
          <v-text-field
            v-model="loginObj.password"
            type="password"
            label="Enter your password"
            @keydown.enter="fnDologin"
          ></v-text-field>

          <v-alert v-if="loginstore.isError === true" style="padding: 5px;" variant="outlined" type="error" text="Incorrect username and password.">
          </v-alert>

          <v-alert v-if="loginstore.isNotpermit === true" style="padding: 5px;" variant="outlined" type="error" text="Please contact admin for permission.">
          </v-alert>

          <v-btn
            @click="fnDologin"
            class="mt-3"
            height="3em"
            style="font-size: 0.9em;"
            :disabled="loginstore.isLoggingin"
          >
            {{ loginstore.isLoggingin? 'Logging in': 'Login'}}
          </v-btn>

          <div style="font-size: 14px; display: flex; justify-content: center; margin-top: 10px;">
            <strong>For registration click</strong>
            <a style="margin-left: 5px; font-weight: bolder; text-decoration: underline;" @click="fnOnclickregister">Here</a>
          </div>
        </div>
      </v-card-title>

      <v-card-actions class="d-flex flex-column">
        <strong style="color: #6c757d; font-size: 13px;">Powered by MiniRW co.,ltd.</strong>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: white;
}

.headerTitleFont {
  font-size: 24px;
  margin-top: 10px;
  font-weight: bolder;
  text-align: center;
}

.bodyContainer {
  display: flex;
  flex-direction: column;
  padding: 10px 40px 30px 40px;
}

a:hover{
  cursor: pointer;
}

h3 {
  font-size: 18px;
  font-weight: bold;
}

::v-deep .v-text-field input {
  background-color: white;
  font-size: 20px;
  padding: 0px 0px 0px 10px;
}
</style>