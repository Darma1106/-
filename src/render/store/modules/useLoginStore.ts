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

  login = async (info: User): Promise<boolean> => {
    const { code, data } = await LoginService.handleLogin(info)
    if (code == 1 && data) {
      this.userInfo = data
    }
    return code == 1
  }
}

const loginInstance = new LoginStore()

export default function useLogin(): LoginStore {
  return loginInstance
}
