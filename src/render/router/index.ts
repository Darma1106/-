import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import useLogin from '@/store/modules/useLoginStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/layout/Layout.vue')
    // ]
  }
  // {
  //   path: '/contextMenu',
  //   name: '右键菜单模板',
  //   component: () => import('@/component/baseDiagram/ContextMenu.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),

  routes
})

router.beforeEach((to, from, next) => {
  const loginStore = useLogin()
  if (to.name == 'login') {
    next()
  } else {
    if (Object.getOwnPropertyNames(loginStore.getUserInfo()).length != 0) next()
    else next({ path: '/login' })
  }
})
export default router
