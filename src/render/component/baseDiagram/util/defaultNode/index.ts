import type { Diagram, Node } from 'gojs'
import type { CommonNodeMap, Template, CommonNodeType } from '../../type'
import { basedNodeMaker } from './baseNodeMaker'
import { defaultNodeMaker } from './defaultNodeMaker'
import { geoNodeMaker } from './geoNodeMaker'
import { pictureNodeMaker } from './pictureNodeMaker'

export { basedNodeMaker, defaultNodeMaker, geoNodeMaker, pictureNodeMaker }

export const commonNodeMap: CommonNodeMap = {
  defaultNode: defaultNodeMaker(),
  geoNode: geoNodeMaker(),
  pictureNode: pictureNodeMaker()
}

export const injectNodeMap = (diagram: Diagram, exType?: Template<Node>[]): void => {
  // 注入默认Node类型
  for (const key in commonNodeMap) {
    if (Object.prototype.hasOwnProperty.call(commonNodeMap, key)) {
      const element: go.Node = commonNodeMap[key as CommonNodeType]
      diagram.nodeTemplateMap.add(key, element)
    }
  }

  // 分配节点模板
  if (exType) {
    exType.forEach(({ name, template }) => {
      diagram.nodeTemplateMap.add(name, template)
    })
  }
}
