import type { Diagram, Link } from 'gojs'
import type { CommonLinkMap, CommonLinkType, Template } from '../../type'
import { defaultLineMaker } from './defaultLineMaker'
import { avoidLineMaker } from './aviodLineMaker'

export { defaultLineMaker }

export const commonLinkMap: CommonLinkMap = {
  defaultLink: defaultLineMaker(),
  avoidLink: avoidLineMaker()
}

export const injectLinkMap = (diagram: Diagram, exType?: Template<Link>[]): void => {
  for (const key in commonLinkMap) {
    if (Object.prototype.hasOwnProperty.call(commonLinkMap, key)) {
      const element: go.Link = commonLinkMap[key as CommonLinkType]
      diagram.linkTemplateMap.add(key, element)
    }
  }
  if (exType) {
    exType.forEach(({ name, template }) => {
      diagram.linkTemplateMap.add(name, template)
    })
  }
}
