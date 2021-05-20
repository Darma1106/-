import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/layout/index.vue'),
    meta: {
      hidden: false
    }
  },
  {
    path: '/antd/:componentName',
    name: 'Antd-vue-2.x',
    component: () => import('../views/antd/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),

  routes
})

export default router
