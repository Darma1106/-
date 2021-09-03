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
  typeForCanvas: 'NODE' | 'LINK' | 'FLEXIBLE_LINK'
}
export interface ModelTool {
  id: string
  name: string
  sortno: number
  modelTypeId: string
  toolMetasVOs: ToolMeta[]
}

export interface DataInstanceAttrDTO {
  attrCode: string
  attrValue: string
  dataInstanceId: string
  id: string
  sortno: number
}

export interface DataInstanceDTO {
  dataInstanceTypeCode: string
  fromId: string
  id: string
  toId: string
  name: string
  toolMetasId: string
}

export interface ModelInstanceEditDTO {
  dataInstanceAttrDTOs: DataInstanceAttrDTO[]
  dataInstanceDTOs: DataInstanceDTO[]
  id: string
  jsonContent: string
}

export default class ModelService {
  static async getModelType(typeId: string): Promise<HttpResponse<ModelType>> {
    return service.get('/modelType/findGraphicCode', { params: { modelTypeId: typeId } })
  }

  static async getModelTool(typeId: string): Promise<HttpResponse<ModelTool[]>> {
    return service.get('/modelTypeTool/list', { params: { modelTypeId: typeId } })
  }

  static async editModelInstance(editDTO: ModelInstanceEditDTO): Promise<HttpResponse<string>> {
    return service.post('/modelInstance/edit', editDTO)
  }

  static async getModelDiagram(modelId: string): Promise<HttpResponse<ModelInstanceEditDTO>> {
    return service.post('/modelInstance/queryVOById', {}, { params: { modelInstanceId: modelId } })
  }
}
