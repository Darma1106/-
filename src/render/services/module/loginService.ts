// import service from '../http'
import { message } from 'ant-design-vue'
import { HttpResponse } from '@/types/global'

interface UserInfo {
  userName?: string
}

export interface User {
  userName: string
  password: string
}

//封装Framework类型的接口方法
export default class LoginService {
  static async handleLogin(loginInfo: User): Promise<HttpResponse<UserInfo>> {
    const data: HttpResponse<UserInfo> = {
      code: 1,
      msg: '成功',
      data: {
        userName: 'admin'
      }
    }
    return new Promise((resolve, reject) => {
      if (loginInfo.userName == 'admin' && loginInfo.password == 'admin') {
        resolve(data)
      } else {
        message.error('用户名或密码错误')

        reject()
      }
    })
  }
}
