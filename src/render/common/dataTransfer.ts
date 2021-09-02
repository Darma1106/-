import { cloneDeep } from 'lodash'

import type { ObjectData } from 'gojs'
import type { ToolProperty, DataInstanceAttrDTO, DataInstanceDTO } from '@/services/module/modelService'

export function proptyDataExplain(proptyData: ToolProperty[]): any {
  const a: any = {}
  proptyData.forEach((attr) => {
    a[attr.attrTypeCode] = ''
  })
  return a
}

export function proptyDatatoAttrDTOs(dataObject: ObjectData): DataInstanceAttrDTO[] {
  const a: DataInstanceAttrDTO[] = []
  dataObject.toolDataAttrVOs.forEach((attr: ToolProperty) => {
    const dto: DataInstanceAttrDTO = {
      attrCode: attr.attrTypeCode,
      id: '',
      sortno: attr.sortno,
      dataInstanceId: dataObject.key,
      attrValue: dataObject[attr.attrTypeCode]
    }
    a.push(dto)
  })

  return a
}

// interface LinkData extends ObjectData {
//   from?: string
//   to?: string
//   id: string
//   toolMetasId: string
//   [key: string]: any
// }

// interface NodeData extends ObjectData {
//   key: string
//   toolMetasId: string
//   [key: string]: any
// }

export function toDataInstanceDTOs(nodeData: ObjectData[], linkData: ObjectData[]): DataInstanceDTO[] {
  const a: DataInstanceDTO[] = []
  const tempNodes = cloneDeep(nodeData)
  linkData.forEach((link) => {
    const fromNode = tempNodes.find((item) => {
      return item.key == link.from
    })
    if (fromNode) {
      fromNode.toId = link.id
    }
    const toNode = tempNodes.find((item) => {
      return item.key == link.to
    })
    if (toNode) {
      toNode.fromId = link.id
    }
    const dataInstanceDto: DataInstanceDTO = {
      fromId: link.from ?? '',
      toolMetasId: link.toolMetasId,
      name: link.name ?? '',
      id: link.id,
      toId: link.to ?? '',
      dataInstanceTypeCode: link.dataInstanceTypeCode
    }
    a.push(dataInstanceDto)
  })

  tempNodes.forEach((node) => {
    const dataInstanceDto: DataInstanceDTO = {
      fromId: node.fromId ?? '',
      toolMetasId: node.toolMetasId,
      name: node.name,
      id: node.key,
      toId: node.toId ?? '',
      dataInstanceTypeCode: node.dataInstanceTypeCode
    }
    a.push(dataInstanceDto)
  })

  return a
}
