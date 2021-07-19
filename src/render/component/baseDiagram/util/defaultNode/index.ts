import { basedNodeMaker } from './baseNodeMaker'
import { defaultNodeMaker } from './defaultNodeMaker'
import { geoNodeMaker } from './geoNodeMaker'

import type { CommonNodeMap } from '../../type'

export { basedNodeMaker, defaultNodeMaker, geoNodeMaker }

export const commonNodeMap: CommonNodeMap = {
  defaultNode: defaultNodeMaker(),
  geoNode: geoNodeMaker()
}
