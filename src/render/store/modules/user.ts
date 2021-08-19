import { defineStore } from 'pinia'
import LoginService from '@/services/module/loginService'

interface UserInfo {
  userName?: string
}

interface User {
  userName: string
  password: string
}

interface UserState {
  userInfo: UserInfo
}

export const useUserStore = defineStore({
  id: 'user',
  state(): UserState {
    return {
      userInfo: { userName: 'admin' }
    }
  },
  actions: {
    getUserInfo(): UserInfo {
      return this.userInfo
    },

    async login(info: User): Promise<boolean> {
      const { code, data } = await LoginService.handleLogin(info)
      if (code == 1 && data) {
        this.userInfo = data
      }
      return code == 1
    }
  }
})
