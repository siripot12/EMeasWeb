import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import RequestView from "@/views/RequestView.vue";
import { useLoginStore } from '@/stores/loginStore';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/request',
      name: 'request',
      component: RequestView
    }
  ]
})

router.beforeEach((to, from)=>{
  //Hook login store
  const loginstore = useLoginStore();
  if(to.name !== 'login' && !loginstore.isLoginState) return '/login';
  else true;
})

export default router
