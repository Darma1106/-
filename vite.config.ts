/**
 * 参考链接: https://vitejs.dev/config/
 */
import { join, resolve } from 'path'
import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import'

dotenv.config({ path: join(__dirname, '.env') })
const root = join(__dirname, 'src/render')

export default defineConfig({
  root,
  resolve: {
    alias: {
      '@': root
    }
  },
  base: './',
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 更改主题在这里
          hack: `true; @import (reference) "${resolve('src/render/style/var.less')}";`
          // 'primary-color': '#ddd'
          // 'link-color': '#1DA57A',
          // 'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    }
  },
  build: {
    outDir: join('../../dist/render'),
    emptyOutDir: true
  },
  server: {
    port: +process.env.PORT,
    cors: true, // 允许跨域
    open: true, // 设置服务启动时是否自动打开浏览器
    // 设置代理，根据我们项目实际情况配置
    proxy: {
      '/api': {
        target: 'http://xxx.xxx.xxx.xxx:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/api/', '/')
      }
    }
  },
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`
          }
        }
      ]
    })
  ],
  optimizeDeps: {
    exclude: ['electron-is-dev', 'electron-store']
  }
})

// export default config
