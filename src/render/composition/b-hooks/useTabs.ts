import { ref } from 'vue'
import type { Ref } from 'vue'

export interface Pane {
  title: string
  key: string
  closable: boolean
  component: string
}

export interface UseTabs {
  tabs: Ref<Pane[]>
  activePane: Ref<Pane | undefined>
  add: (pane: Pane) => void
  remove: (targetKey: string) => void
  change: (targetKey: string) => void
}

export default function useTabs(): UseTabs {
  const tabs = ref<Pane[]>([])
  const activePane = ref<Pane | undefined>(undefined)
  const remove = (targetKey: string): void => {
    let lastIndex = 0
    tabs.value.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1
      }
    })
    tabs.value = tabs.value.filter((pane) => pane.key !== targetKey)
    if (tabs.value.length && activePane.value?.key === targetKey) {
      if (lastIndex >= 0) {
        activePane.value = tabs.value[lastIndex]
      } else {
        activePane.value = tabs.value[0]
      }
    }
  }
  const add = (pane: Pane): void => {
    activePane.value = pane
    tabs.value.push(pane)
  }
  const change = (targetKey: string): void => {
    const target = tabs.value.find((pane) => pane.key === targetKey)
    if (target) {
      activePane.value = target
    }
  }

  return {
    tabs,
    activePane,
    add,
    change,
    remove
  }
}
