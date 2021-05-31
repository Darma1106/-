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
    children: [
      {
        path: '/home/activeModel',
        name: '活动模型',
        component: () => import('../views/gojs/activeModel.vue')
      }
    ]
  }
  // {
  //   path: '/home/activeModel',
  //   name: '活动模型',
  //   component: () => import('../views/gojs/activeModel.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),

  routes
})

export default router
