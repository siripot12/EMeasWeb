<script lang="ts">
import { defineComponent, ref, reactive, inject } from "vue";
import { useLoginStore } from "../stores/loginStore";
import type { IUser } from "@/types/user.type";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

export default defineComponent({
    setup(){
        onMounted(async()=>{
        });


        //let loginObj = reactive<IUser>({...defaultIUser});
          let loginObj = reactive<IUser>({username:'admin', password:'1234'})

        //Use store.
        const loginstore = useLoginStore();
        //Use router
        const router = useRouter();

        const fnDologin = async() => {
            await loginstore.dologin(loginObj);

            if (loginstore.isLoginState) {
                router.push("/request");
            } else console.log("Login Fail");
        };

        return {
        loginstore,
        fnDologin,
        loginObj,
        };
    }
})
</script>

<template>
    <div class="container">
    <v-card style="width: 500px;" class="rounded-lg elevation-20">
      <v-img
        src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
        height="300px"
        cover
      ></v-img>

      <v-card-title>
        <div class="headerTitleFont">
          LOG IN
        </div>

        <div class="bodyContainer">
          <h3>Username</h3>
          <v-text-field
            v-model="loginObj.username"
            type="text"
            label="Enter your username or email"
          ></v-text-field>
          <h3>Password</h3>
          <v-text-field
            v-model="loginObj.password"
            type="password"
            label="Enter your password"
          ></v-text-field>

          <v-alert v-if="loginstore.isError === true" style="padding: 5px;" variant="outlined" type="error" text="Incorrect username and password.">
          </v-alert>

          <v-btn
            @click="fnDologin"
            class="mt-3"
            height="3em"
            style="font-size: 0.9em;"
          >
            Login
          </v-btn>
        </div>
      </v-card-title>

      <v-card-actions class="d-flex flex-column">
        <h4 style="color: #6c757d;">Powered by MiniRW co.,ltd.</h4>
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

h3 {
  font-size: 18px;
  font-weight: bold;
}

::v-deep .v-text-field input {
  background-color: white;
  font-size: 20px;
  padding: 0px 0px 0px 0px;
}
</style>