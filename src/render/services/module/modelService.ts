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

// export interface ModelInfo {}
//封装Framework类型的接口方法
export default class ModelService {
  static async getModelType(typeId: string): Promise<HttpResponse<ModelType>> {
    return service.get('/modelType/findGraphicCode', { params: { modelTypeId: typeId } })
  }
}
