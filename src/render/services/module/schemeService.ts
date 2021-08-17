import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree'
import service from '../http'
import { HttpResponse } from '@/types/global'
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

export interface SchemeInfo {
  id?: string
  name?: string
  frameWorkId?: string
  frameName?: string
  createDate?: string
  createSubFile?: number
}

interface ResponseData {
  list: SchemeInfo[]
  totalRecords: number
  pageSize: number
  pageNumber: number
  totalPages: number
}

export interface SearchParams {
  frameWorkId?: string
  name?: string
}

//封装Framework类型的接口方法
export default class SchemeService {
  static async getSchemeList(
    pageNumber: number,
    pageSize: number,
    searchParams?: SearchParams
  ): Promise<HttpResponse<ResponseData>> {
    return service.get('/scheme/findPage', { params: { ...searchParams, pageNumber, pageSize } })
  }

  static async addScheme(schemeInfo: SchemeInfo): Promise<HttpResponse<void>> {
    return service.post('/scheme/add', schemeInfo)
  }

  static async editScheme(schemeInfo: SchemeInfo): Promise<HttpResponse<void>> {
    return service.post('/scheme/edit', schemeInfo)
  }

  static async deleteScheme(schemeId: string): Promise<HttpResponse<string>> {
    return service.delete('/scheme/delete', { params: { ids: schemeId } })
  }
}
