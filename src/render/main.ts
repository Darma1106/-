import { createApp } from 'vue'

import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router/index'

import 'ant-design-vue/dist/antd.css'
import './style/var.less'

createApp(App).use(router).use(Antd).mount('#app')

Array.prototype.clean = function () {
  this.length = 0
}

Array.prototype.delete = function (index: number) {
  return this.splice(index, 1)[0]
}
