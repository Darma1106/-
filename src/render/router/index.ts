import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/layout/Layout.vue')
    // ]
  },
  {
    path: '/contextMenu',
    name: '右键菜单模板',
    component: () => import('@/component/baseDiagram/ContextMenu.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),

  routes
})

export default router
