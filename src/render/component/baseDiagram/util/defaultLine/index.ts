import { defaultLineMaker } from './defaultLineMaker'
import type { CommonLinkMap } from '../../type'

export { defaultLineMaker }

export const commonLinkMap: CommonLinkMap = {
  defaultLink: defaultLineMaker()
}
