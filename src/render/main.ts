import { createApp } from 'vue'
import { arrayExtend } from '@/common/arrayExtend'

import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router/index'
import store from './store'

import 'ant-design-vue/dist/antd.css'
import '@/assets/style/var.less'

createApp(App).use(router).use(store).use(Antd).mount('#app')

arrayExtend()
