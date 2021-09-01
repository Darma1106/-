import service from '../http'
import { HttpResponse } from '@/services/type'

enum ModelTypeValue {
  TIMELINE_GRAPHIC = 'TIMELINE_GRAPHIC',
  TABLE_GRAPHIC = 'TABLE_GRAPHIC',
  ACTIVITY_GRAPHIC = 'ACTIVITY_GRAPHIC',
  NETWORK_GRAPHIC = 'NETWORK_GRAPHIC',
  MATRIX_GRAPHIC = 'MATRIX_GRAPHIC',
  TREE_GRAPHIC = 'TREE_GRAPHIC',
  FLOW_GRAPHIC = 'FLOW_GRAPHIC'
}

type ModelType = keyof typeof ModelTypeValue

export interface ToolProperty {
  attrTypeCode: string
  attrTypeInputType: string
  attrTypeName: string
  attrTypeUnit: string
  dataInstanceTypeCode: string
  defaultValue: string
  selist: string
  sortno: number
}

export interface ToolMeta {
  dataInstanceTypeCode: string
  dataInstanceTypeName: string
  icon: string
  id: string
  name: string
  sortno: number
  toolDataAttrVOs: ToolProperty[]
  typeId: string
  style: string
}
export interface ModelTool {
  id: string
  name: string
  sortno: number
  modelTypeId: string
  toolMetasVOs: ToolMeta[]
}

export default class ModelService {
  static async getModelType(typeId: string): Promise<HttpResponse<ModelType>> {
    return service.get('/modelType/findGraphicCode', { params: { modelTypeId: typeId } })
  }

  static async getModelTool(typeId: string): Promise<void> {
    const { data } = await service.get('/modelTypeTool/list', { params: { modelTypeId: typeId } })
    console.log(data, 'data')
  }
}
