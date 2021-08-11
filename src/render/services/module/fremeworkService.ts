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
    | 'TableModel'
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
            title: '体系建模',
            key: '0-0',
            slots: {
              icon: 'category'
            },
            type: 'nonModel',
            children: [
              {
                title: '任务建模',
                key: '0-1',
                slots: {
                  icon: 'category',
                  title: 'meca'
                },
                type: 'nonModel',
                children: [
                  { title: '任务分解描述', key: '0-0-0', slots: { icon: 'model' }, type: 'OrganizationModel' },
                  { title: '任务流程描述', key: '0-0-9', slots: { icon: 'model' }, type: 'SequenceModel' },
                  { title: '任务效能描述', key: '0-0-2', slots: { icon: 'model' }, type: 'TableModel' }
                  // { title: '节点模型', key: '0-0-3', slots: { icon: 'model' }, type: 'ActiveModel' },
                  // { title: '时序模型', key: '0-0-4', slots: { icon: 'model' }, type: 'SequenceModel' }
                ]
              },
              {
                title: '活动建模',
                key: '0-2',
                slots: {
                  icon: 'category',
                  title: 'meca'
                },
                type: 'nonModel',
                children: [
                  { title: '活动流程描述', key: '0-2-0', slots: { icon: 'model' }, type: 'ProcessModel' },
                  { title: '活动与资源关联', key: '0-2-1', slots: { icon: 'model' }, type: 'MatrixModel' },
                  { title: '活动属性描述', key: '0-2-2', slots: { icon: 'model' }, type: 'TableModel' }
                ]
              },
              {
                title: '服务建模',
                key: '0-3',
                slots: {
                  icon: 'category',
                  title: 'meca'
                },
                type: 'nonModel',
                children: [
                  { title: '服务列表', key: '0-3-0', slots: { icon: 'model' }, type: 'TableModel' },
                  { title: '服务质量属性描述', key: '0-3-1', slots: { icon: 'model' }, type: 'TableModel' },
                  { title: '服务接口描述', key: '0-3-2', slots: { icon: 'model' }, type: 'ActiveModel' },
                  { title: '服务与作战资源关联', key: '0-3-3', slots: { icon: 'model' }, type: 'MatrixModel' }
                ]
              },
              {
                title: '资源建模',
                key: '0-4',
                slots: {
                  icon: 'category',
                  title: 'meca'
                },
                type: 'nonModel',
                children: [
                  { title: '资源列表', key: '0-4-0', slots: { icon: 'model' }, type: 'TableModel' },
                  { title: '资源属性描述', key: '0-4-1', slots: { icon: 'model' }, type: 'TableModel' },
                  { title: '资源接口描述', key: '0-4-2', slots: { icon: 'model' }, type: 'ActiveModel' }
                ]
              }
            ]
          }
        ]
      }
      reslove(data)
    })
  }
}
