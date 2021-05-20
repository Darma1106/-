import service from '../http'
import { HttpResponse } from '../../types'
/**
 * @interface loginParams -登录参数
 * @property {string} username -用户名
 * @property {string} password -用户密码
 */
export interface ProjectInfo {
  id?: string
  name?: string
  background?: string
  cjid?: string
  createTime?: string
}
//封装User类型的接口方法
export default class ProjectService {
  /**
   * @description 查询User的信息
   * @param {number} teamId - 所要查询的团队ID
   * @return {HttpResponse} result
   */
  static async gettingProjects(
    filter?: ProjectInfo
  ): Promise<HttpResponse<ProjectInfo[]>> {
    return service.get('/project/findLike', { params: filter })
  }

  static async addProject(project: ProjectInfo): Promise<HttpResponse<string>> {
    return service.post('/project/edit', project)
  }

  static async deleteProject(projectId: string): Promise<HttpResponse<string>> {
    return service.delete('/project/delete', { params: { id: projectId } })
  }
}
