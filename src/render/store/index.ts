import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { loadModules, context, modules } from './modules'

export interface State {
  [key: string]: any
}

export const key: InjectionKey<Store<State>> = Symbol()

const store = createStore({
  modules
})

export function useStore(): Store<any> {
  return baseUseStore()
}

// 热重载
if (import.meta.hot) {
  import.meta.hot?.accept(context.id, () => {
    const { modules } = loadModules()
    store.hotUpdate({
      modules
    })
  })
}

export default store
