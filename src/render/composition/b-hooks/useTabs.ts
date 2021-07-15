import { ref } from 'vue'
export interface Pane {
  title: string
  key: string
  closable: boolean
  component: string
}

class UseTabs {
  public tabs = ref<Pane[]>([
    { title: 'Organization', key: '1', closable: true, component: 'OrganizationModel' },
    { title: 'UmlClass', key: '2', closable: true, component: 'UmlClass' },
    { title: 'Matrix', key: '3', closable: true, component: 'MatrixModel' },
    { title: 'Active', key: '4', closable: true, component: 'ActiveModel' },
    { title: 'ProcessModel', key: '7', closable: true, component: 'ProcessModel' },
    { title: 'sequence', key: '5', closable: true, component: 'SequenceModel' }
  ])

  public activeTab = ref<string | undefined>(undefined)

  remove = (targetKey: string): void => {
    let lastIndex = 0
    this.tabs.value.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1
      }
    })
    this.tabs.value = this.tabs.value.filter((pane) => pane.key !== targetKey)
    if (this.tabs.value.length && this.activeTab.value === targetKey) {
      if (lastIndex >= 0) {
        this.activeTab.value = this.tabs.value[lastIndex].key
      } else {
        this.activeTab.value = this.tabs.value[0].key
      }
    }
  }

  add = (pane: Pane): void => {
    this.activeTab.value = pane.key
    this.tabs.value.push(pane)
  }

  change = (targetKey: string): void => {
    this.activeTab.value = targetKey
  }

  search = (targetKey: string): Pane | undefined => {
    return this.tabs.value.find((pane) => pane.key == targetKey)
  }
}

const tabsInstance = new UseTabs()

export default function useTabs(): UseTabs {
  return tabsInstance
}
