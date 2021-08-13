import * as go from 'gojs'
import type { NodeOption } from '../../type'
import { basedNodeMaker, make } from './baseNodeMaker'

export function pictureNodeMaker(nodeOption?: NodeOption): go.Node {
  return basedNodeMaker(
    make(
      go.Panel,
      'Spot',
      make(
        go.Picture,
        {
          desiredSize: new go.Size(65, 65),
          source: nodeOption?.source,
          width: 65,
          height: 65,
          name: 'PICTURE',
          portId: '',
          cursor: 'pointer',
          fromLinkable: true,
          toLinkable: true,
          fromLinkableDuplicates: true,
          toLinkableDuplicates: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides
        },
        new go.Binding('source', 'source'),
        new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
      )
    )
  )
}
