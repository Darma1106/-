import service from '../http'
import { HttpResponse } from '../../types/global'
/**
 * @interface loginParams -登录参数
 * @property {string} createDate  - 创建时间
 * @property {string} endDate  - 结束时间
 * @property {string} experimentId  - 试验方案id
 * @property {string} id  - 任务id
 * @property {string} model  - 型号
 * @property {number} sortno  - 排序
 * @property {string} startDate  - 开始时间
 * @property {string} taskDescribe  - 任务描述
 * @property {string} taskName  - 任务名称
 * @property {string} taskSource  - 任务来源
 * @property {string} createDate  - 创建时间
 * @property {string} endDate  - 结束时间
 * @property {string} experimentId  - 试验方案id
 * @property {string} id  - 任务id
 * @property {string} model  - 型号
 * @property {number} sortno  - 排序
 * @property {string} startDate  - 开始时间
 * @property {string} taskDescribe  - 任务描述
 * @property {string} taskName  - 任务名称
 * @property {string} taskSource  - 任务来源
 */
export interface TaskInfo {
  createDate?: string
  endDate?: string
  experimentId?: string
  id?: string
  model?: string
  sortno?: number
  startDate?: string
  taskDescribe?: string
  taskName?: string
  taskSource?: string
}

//封装User类型的接口方法
export default class TaskService {
  /**
   * @description 查询任务列表
   * @param {TaskInfo} params  - 查询条件
   * @return {HttpResponse<TaskInfo>} result
   */
  static async getTaskList(params?: TaskInfo): Promise<HttpResponse<TaskInfo[]>> {
    return service.get('/task/find', { params: params })
  }

  static async addTask(params?: TaskInfo): Promise<HttpResponse<string>> {
    return service.post('/task/edit', params)
  }

  static async deleteTask(taskId: string): Promise<HttpResponse<string>> {
    return service.delete('/task/delete', { params: { id: taskId } })
  }
}
