import { createApp } from 'vue'
import { useAntd } from './common/useAntd'

// import Antd from 'ant-design-vue'

import App from './App.vue'
import router from './router/index'
import * as Store from '@/store'
import { arrayExtend } from '@/common/arrayExtend'
// import store, { key } from './store'

// import 'ant-design-vue/dist/antd.css'
import '@/assets/style/var.less'

console.log(Store)

const app = createApp(App)

app.use(router).mount('#app')

useAntd(app)

arrayExtend()
