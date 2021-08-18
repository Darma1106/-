import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAntd } from './common/useAntd'

import App from './App.vue'
import router from './router/index'
import { arrayExtend } from '@/common/arrayExtend'
import '@/assets/style/var.less'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia).use(router).mount('#app')

useAntd(app)

arrayExtend()
