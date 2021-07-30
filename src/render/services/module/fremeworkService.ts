import { HttpResponse } from '@/types/global'
// import service from '../http'
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree'
export interface TreeData extends TreeDataItem {
  type:
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
  static async getFrameworkList(): Promise<HttpResponse<TreeData[]>> {
    return new Promise((reslove) => {
      const data: HttpResponse<TreeData[]> = {
        state: '1',
        msg: '成功',
        data: [
          {
            title: '方案名称',
            key: '0-0',
            slots: {
              icon: 'category'
            },
            type: 'nonModel',
            children: [
              { title: '组织结构模型', key: '0-0-0', slots: { icon: 'model' }, type: 'OrganizationModel' },
              { title: '矩阵模型', key: '0-0-1', slots: { icon: 'model' }, type: 'MatrixModel' },
              { title: '流程模型', key: '0-0-2', slots: { icon: 'model' }, type: 'ProcessModel' },
              { title: '活动模型', key: '0-0-3', slots: { icon: 'model' }, type: 'ActiveModel' },
              { title: '时序模型', key: '0-0-4', slots: { title: 'meca', icon: 'model' }, type: 'SequenceModel' }
            ]
          }
        ]
      }
      reslove(data)
    })
  }
}
