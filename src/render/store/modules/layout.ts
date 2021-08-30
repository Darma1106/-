import { defineStore } from 'pinia'

interface LayoutState {
  toolBarState: boolean
  sideBarState: boolean
  editorState: boolean
  porpertyState: boolean
}

type ModuleName = 'toolBarState' | 'sideBarState' | 'editorState' | 'porpertyState'

export const useLayoutStore = defineStore({
  id: 'layout',
  state(): LayoutState {
    return {
      toolBarState: true,
      sideBarState: true,
      editorState: true,
      porpertyState: true
    }
  },
  actions: {
    setState(moduleName: ModuleName, state: boolean): void {
      this[moduleName] = state
    },
    stateToggle(moduleName: ModuleName) {
      this[moduleName] = !this[moduleName]
    }
  }
})
