import { basedNodeMaker } from './baseNodeMaker'
import { defaultNodeMaker } from './defaultNodeMaker'
import { geoNodeMaker } from './geoNodeMaker'
import { pictureNodeMaker } from './pictureNodeMaker'

import type { CommonNodeMap } from '../../type'

export { basedNodeMaker, defaultNodeMaker, geoNodeMaker, pictureNodeMaker }

export const commonNodeMap: CommonNodeMap = {
  defaultNode: defaultNodeMaker(),
  geoNode: geoNodeMaker(),
  pictureNode: pictureNodeMaker()
}
