import type { CommonLinkMap } from '../../type'
import { defaultLineMaker } from './defaultLineMaker'
import { avoidLineMaker } from './aviodLineMaker'

export { defaultLineMaker }

export const commonLinkMap: CommonLinkMap = {
  defaultLink: defaultLineMaker(),
  avoidLink: avoidLineMaker()
}
