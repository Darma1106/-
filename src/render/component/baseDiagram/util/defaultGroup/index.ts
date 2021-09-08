import type { Diagram, Group } from 'gojs'
import type { CommonGroupMap, Template, CommonNodeType } from '../../type'
import { poolGroupMaker } from './poolGroup'
import { laneGroupMaker } from './laneGroupMaker'

export const commonGroupMap: CommonGroupMap = {
  lane: laneGroupMaker(),
  pool: poolGroupMaker()
}

export const injectGroupMap = (diagram: Diagram, exType?: Template<Group>[]): void => {
  // 注入默认Node类型
  for (const key in commonGroupMap) {
    if (Object.prototype.hasOwnProperty.call(commonGroupMap, key)) {
      const element: go.Group = commonGroupMap[key as CommonNodeType]
      diagram.groupTemplateMap.add(key, element)
    }
  }

  // 分配节点模板
  if (exType) {
    exType.forEach(({ name, template }) => {
      diagram.groupTemplateMap.add(name, template)
    })
  }
}
