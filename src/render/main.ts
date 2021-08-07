import { createApp } from 'vue'
import { arrayExtend } from '@/common/arrayExtend'
import { useAntd } from './common/useAntd'

// import Antd from 'ant-design-vue'

import App from './App.vue'
import router from './router/index'
// import store, { key } from './store'

// import 'ant-design-vue/dist/antd.css'
import '@/assets/style/var.less'

const app = createApp(App)

app.use(router).mount('#app')

useAntd(app)

arrayExtend()
