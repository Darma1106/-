import LoginService from '@/services/module/loginService'

interface UserInfo {
  userName?: string
}

interface User {
  userName: string
  password: string
}

class LoginStore {
  private userInfo: UserInfo = {}

  getUserInfo = (): UserInfo => {
    return this.userInfo
  }

  login = async (info: User) => {
    const { state, data } = await LoginService.handleLogin(info)
    if (state == '1' && data) {
      this.userInfo = data
    }
  }
}

const loginInstance = new LoginStore()

export default function useLogin(): LoginStore {
  return loginInstance
}
