import { HttpResponse } from '@/types/global'
import service from '../http'
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree'
export interface TreeData extends TreeDataItem {
  name: string
  pid: string
  nodeId: string
  sort: number
  typeId?: string
  type?:
    | 'model'
    | 'nonModel'
    | 'OrganizationModel'
    | 'UmlClass'
    | 'MatrixModel'
    | 'ActiveModel'
    | 'ProcessModel'
    | 'SequenceModel'
  children?: TreeData[]
}

//封装Framework类型的接口方法
export default class FrameworkService {
  static async getSchemeTree(sid: string): Promise<HttpResponse<TreeData[]>> {
    return service.get('/schemaNav/findTreeBySid', { params: { sid } })
  }
}
