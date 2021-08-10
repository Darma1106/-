import { defaultLineMaker } from './defaultLineMaker'
import { avoidLineMaker } from './aviodLineMaker'

import type { CommonLinkMap } from '../../type'

export { defaultLineMaker }

export const commonLinkMap: CommonLinkMap = {
  defaultLink: defaultLineMaker(),
  avoidLink: avoidLineMaker()
}
