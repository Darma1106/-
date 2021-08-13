// import service from '../http'
import { HttpResponse } from '@/types/global'

interface UserInfo {
  userName?: string
}

interface User {
  userName: string
  password: string
}

//封装Framework类型的接口方法
export default class LoginService {
  static async handleLogin(loginInfo: User): Promise<HttpResponse<UserInfo>> {
    const data: HttpResponse<UserInfo> = {
      state: '1',
      msg: '成功',
      data: {
        userName: 'admin'
      }
    }
    return new Promise((resolve, reject) => {
      if (loginInfo.userName == 'admin' && loginInfo.password == 'admin') {
        resolve(data)
      } else {
        reject()
      }
    })
  }
}
