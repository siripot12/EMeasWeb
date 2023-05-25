import { createApp, markRaw, onMounted, ref } from 'vue'
import { createPinia } from 'pinia'

//Vuetify
import 'vuetify/styles'
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import { aliases, md } from "vuetify/iconsets/md";
import { fa } from "vuetify/iconsets/fa";
import '@fortawesome/fontawesome-free/css/all.css'

import App from './App.vue'
import router from './router'
import axios, { Axios } from 'axios'
import VueAxios from "vue-axios";
import './assets/main.css'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

//Vuetify global styles
const vuetify = createVuetify({
    theme:{
        defaultTheme: 'myCustomTheme',
        themes:{
            myCustomTheme:{
                dark:false,
                colors:{
                    primary: '#6c757d',
                    secondary: '#F5F3F5',
                    buttonPrimary: '#3F51B5',
                    buttonSecondary: '#424242',
                    textPrimary:'#0A1128',
                    textSecondary:'#FFFAFB',
                    iconBackPrimary:'#F46036',
                    iconBackSecondary:'#424242',
                    iconPrimary:'#424242',
                    iconSecondary:'#FFFAFB'
                }
            },
        },
        // variations:{
        //     colors:['primary', 'secondary'],
        //     lighten: 1,
        //     darken: 2
        // }
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
            md,
            fa
        }
    },
    components,
    directives
});

//Fetch config file
const configpath = process.env.NODE_ENV == 'development'? '/public/config.json' : '/config.json';
const runtimeConf = await fetch(configpath);
const confobj:any =  await runtimeConf.json();
const url = process.env.NODE_ENV == 'development'? confobj.apiURLDevelop : confobj.apiURLProd;

axios.defaults.baseURL = url;
//axios.defaults.baseURL = "http://10.122.79.129:7000/api";

const app = createApp(App)

app.use(vuetify)
app.use(router)

//console.log(confobj.apiURL);
app.provide('$axios', axios)


const pinia = createPinia();
pinia.use(({store})=>{
    store.$axios = markRaw(axios);
});

app.use(pinia)

app.mount('#app')

//axios.defaults.baseURL = "http://192.168.68.59:7000/api"
//app.use(VueAxios, axios);

//Add axios to global instance for composition api usage.


//Create and add context to pinia.

