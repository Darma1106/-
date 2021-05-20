import service from '../http'
import { HttpResponse, ProjectInfo } from '../../types'
/**
 * @interface loginParams -登录参数
 * @property {string} username -用户名
 * @property {string} password -用户密码
 */
interface LoginParams {
  username: string
  password: string
}
//封装User类型的接口方法
export default class UserService {
  /**
   * @description 查询User的信息
   * @param {number} teamId - 所要查询的团队ID
   * @return {HttpResponse} result
   */
  static async login(params: LoginParams): Promise<HttpResponse<ProjectInfo>> {
    return service('/api/user', {
      method: 'get',
      responseType: 'json',
      params: {
        ...params
      }
    })
  }

  static async gettingProjects(): Promise<HttpResponse<ProjectInfo>> {
    return service.get('/project/findLike')
  }

  // static async gettingProjects(): Promise<HttpResponse> {
  //   return service.post('/project/edit', {})
  // }

  static async resgister(params: LoginParams): Promise<HttpResponse<ProjectInfo>> {
    return service('/api/user/resgister', {
      method: 'get',
      responseType: 'json',
      params: {
        ...params
      }
    })
  }
}
