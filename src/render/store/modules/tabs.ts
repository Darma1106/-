import { Module } from 'vuex'

export interface Pane {
  title: string
  key: string
  closable: boolean
  component: string
}

export interface StoreTabs {
  activeTab?: Pane | undefined
  panes: Pane[]
}

const store: Module<StoreTabs, unknown> = {
  namespaced: true,
  state() {
    return {
      activeTab: undefined,
      panes: [
        { title: 'Organization', key: '1', closable: true, component: 'OrganizationModel' },
        { title: 'UmlClass', key: '2', closable: true, component: 'UmlClass' },
        { title: 'Matrix', key: '3', closable: true, component: 'MatrixModel' },
        { title: 'Active', key: '4', closable: true, component: 'ActiveModel' },
        { title: 'Active1', key: '7', closable: true, component: 'ActiveModel' },
        { title: 'sequence', key: '5', closable: true, component: 'SequenceModel' }
      ]
    }
  },

  mutations: {
    add(state: StoreTabs, paneInfo: Pane) {
      state.activeTab = paneInfo
      state.panes.push(paneInfo)
    },

    remove(state: StoreTabs, targetKey: string) {
      let lastIndex = 0
      state.panes.forEach((pane, index) => {
        if (pane.key === targetKey) {
          lastIndex = index - 1
        }
      })
      state.panes = state.panes.filter((pane) => pane.key !== targetKey)
      if (state.panes.length && state.activeTab?.key === targetKey) {
        if (lastIndex >= 0) {
          state.activeTab = state.panes[lastIndex]
        } else {
          state.activeTab = state.panes[0]
        }
      }
    },

    change(state: StoreTabs, targetKey: string) {
      const target = state.panes.find((pane) => pane.key === targetKey)
      if (target) {
        state.activeTab = target
      }
    }
  },

  actions: {
    add({ commit }, paneInfo: Pane) {
      commit('add', paneInfo)
    },

    remove({ commit }, targetKey: string) {
      commit('remove', targetKey)
    },

    change({ commit }, targetKey: string) {
      commit('change', targetKey)
    }
  },

  getters: {
    getTest(state: StoreTabs) {
      return state.activeTab
    }
  }
}

export default store
