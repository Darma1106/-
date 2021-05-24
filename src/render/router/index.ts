import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/layout/index.vue')
  },
  {
    path: '/gojs',
    name: 'gojs',
    component: () => import('../views/gojs/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),

  routes
})

export default router
