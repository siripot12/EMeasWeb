import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/LoginView.vue";
import RequestView from "@/views/RequestView.vue";
import DashboardView from '@/views/DashboardView.vue';
import { useLoginStore } from '@/stores/loginStore';
import AccountmanageView from '@/views/AccountManageView.vue';
import Mastersettingview from '@/views/MasterSettingView.vue';


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
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/accountmanagement',
      name: 'accountmanagement',
      component: AccountmanageView
    },
    {
      path: '/mastersetting',
      name: 'mastersetting',
      component: Mastersettingview
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
