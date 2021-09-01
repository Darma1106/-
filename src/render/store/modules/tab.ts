import { defineStore } from 'pinia'
export interface Pane {
  title: string
  key: string
  closable: boolean
  component: string
  typeId: string
}

interface TabStore {
  tabs: Pane[]
  activeTab?: string
}
export const useTabStore = defineStore({
  id: 'tab',
  state(): TabStore {
    return {
      tabs: [],
      activeTab: undefined
    }
  },
  actions: {
    remove(targetKey: string): void {
      let lastIndex = 0
      this.tabs.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1
        }
      })
      this.tabs = this.tabs.filter((pane) => pane.key !== targetKey)
      if (this.tabs.length && this.activeTab === targetKey) {
        if (lastIndex >= 0) {
          this.activeTab = this.tabs[lastIndex].key
        } else {
          this.activeTab = this.tabs[0].key
        }
      }
    },
    add(pane: Pane): void {
      this.activeTab = pane.key
      console.log(pane)
      this.tabs.push(pane)
    },
    change(targetKey: string): void {
      this.activeTab = targetKey
    },

    search(targetKey: string): Pane | undefined {
      return this.tabs.find((pane) => pane.key == targetKey)
    }
  }
})
