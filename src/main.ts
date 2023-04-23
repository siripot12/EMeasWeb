import { createApp, markRaw, ref } from 'vue'
import { createPinia } from 'pinia'

//Vuetify
import 'vuetify/styles'
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { aliases, md } from "vuetify/iconsets/md";

import App from './App.vue'
import router from './router'
import axios, { Axios } from 'axios'
import VueAxios from "vue-axios";
import './assets/main.css'

//Vuetify global styles
const vuetify = createVuetify({
    theme:{
        defaultTheme: 'myCustomTheme',
        themes:{
            myCustomTheme:{
                dark:false,
                colors:{
                    primary: '#43A047',
                    secondary: '#81C784',
                    buttonPrimary: '#3F51B5',
                    buttonSecondary: '#424242'
                },
            }
        },
        variations:{
            colors:['primary', 'secondary'],
            lighten: 1,
            darken: 2
        }
    },
    defaults:{
        VBtn:{
            color: 'buttonPrimary',
            variation: 'flat',
            rounded: false
        }
    },
    icons:{
        defaultSet: 'md',
        aliases,
        sets:{
            md
        }
    },
    components,
    directives
});


const app = createApp(App)

app.use(vuetify)
app.use(router)

axios.defaults.baseURL = 'http://192.168.1.29:7118/api';
//app.use(VueAxios, axios);

//Add axios to global instance for composition api usage.
app.provide('$axios', axios)

//Create and add context to pinia.
const pinia = createPinia();
pinia.use(({store})=>{
    store.$axios = markRaw(axios);
});
app.use(pinia)

app.mount('#app')
