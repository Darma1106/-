import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'
import type { SchemeInfo, SchemeTree } from '@/services/module/schemeService'
import SchemeService from '@/services/module/schemeService'

interface SchemeState {
  scheme?: SchemeInfo
  schemeMenu?: SchemeTree[]
  defaultExpand?: string[]
}

const localScheme = localStorage.getItem('last-scheme')

const lastScheme = localScheme ? (JSON.parse(localScheme) as SchemeInfo) : undefined
export const useSchemeStore = defineStore({
  id: 'scheme',
  state(): SchemeState {
    return {
      scheme: lastScheme,
      schemeMenu: [],
      defaultExpand: []
    }
  },
  actions: {
    async open(schemeInfo?: SchemeInfo) {
      if (schemeInfo == undefined) {
        schemeInfo = this.scheme
      }
      if (schemeInfo) {
        // 接口获取方案目录
        const { code, data } = await SchemeService.openScheme(schemeInfo.id)
        // 成功
        if (code === 1 && data && data.length != 0) {
          // 把信息保存到local
          localStorage.setItem('last-scheme', JSON.stringify(schemeInfo))
          this.schemeMenu = data
          this.scheme = cloneDeep(schemeInfo)
        }
        // 失败
        // 失败提示
      }
      // 默认展开项
      this.defaultExpand = this.schemeMenu ? [this.schemeMenu?.[0].nodeId] : []
    }
  }
})
