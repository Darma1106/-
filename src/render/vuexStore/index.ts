import type { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore } from 'vuex'
import type { Store } from 'vuex'
import { loadModules, context, modules } from './modules'

import type { StoreTabs } from './modules/tabs'

export interface State {
  tabs: StoreTabs
  test: { text: string }
}

export const key: InjectionKey<Store<State>> = Symbol('vue-store')

const store: Store<State> = createStore({
  modules
})

console.log(store, 'store')

// 重写useStore
export function useStore<T = State>(): Store<T> {
  return baseUseStore<T>(key)
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
