import service from '../http'
import { HttpResponse } from '@/services/type'
/**
 * @interface ProjectInfo -工程信息
 * @property {string} id -工程编号
 * @property {string} name -工程名称
 * @property {string} background -工程背景
 * @property {string} cjid -采集编号
 * @property {string} createTime -创建时间
 */
export interface ProjectInfo {
  id?: string
  name?: string
  background?: string
  cjid?: string
  createTime?: string
}
//封装Project类型的接口方法
export default class ProjectService {
  /**
   * @description 查询Project的信息
   * @param {number} ProjectInfo - 模糊查询条件
   * @return {HttpResponse} result
   */
  static async gettingProjects(filter?: ProjectInfo): Promise<HttpResponse<ProjectInfo[]>> {
    return service.get('/project/findLike', { params: filter })
  }

  static async addProject(project: ProjectInfo): Promise<HttpResponse<string>> {
    return service.post('/project/edit', project)
  }

  static async deleteProject(projectId: string): Promise<HttpResponse<string>> {
    return service.delete('/project/delete', { params: { id: projectId } })
  }
}
