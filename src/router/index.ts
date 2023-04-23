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
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/request',
      name: 'request',
      component: RequestView
    }
  ]
})

router.beforeEach((to, from, next)=>{
  //Hook login store
  const loginstore = useLoginStore();

  if(to.name !== 'login'){next({path:'/login'})}
  



  else if(to.name === 'login')
  {
    if(loginstore.isLoginState) next({name: 'request'})
    else if(!loginstore.isLoginState) next({name: 'login'})
  }
  else next(true);
})

export default router
