import { Module } from 'vuex'

interface StoreUser {
  text: string
}

const store: Module<StoreUser, unknown> = {
  namespaced: true,
  state() {
    return {
      text: '未修改'
    }
  },
  mutations: {
    setTest(state: StoreUser, payload: AnyObject) {
      state.text = payload.text
    }
  },
  actions: {
    setTest(context, payload: AnyObject) {
      context.commit('setText', payload)
    }
  },
  getters: {
    getTest(state: StoreUser) {
      return state.text
    }
  }
}

export default store
