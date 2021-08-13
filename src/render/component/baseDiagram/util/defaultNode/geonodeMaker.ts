import * as go from 'gojs'
import type { NodeOption, Icons } from '../../type'
import { basedNodeMaker, make } from './baseNodeMaker'
import { icons } from '@/common/icons'

export function geoNodeMaker(nodeOption?: NodeOption): go.Node {
  return basedNodeMaker(
    make(
      go.Panel,
      'Spot',
      make(
        go.Shape,
        'Diamond',
        {
          fill: nodeOption?.color ?? 'gray',
          strokeWidth: 1,
          width: 65,
          height: 65,
          name: 'SHAPE',
          portId: '',
          cursor: 'pointer',
          fromLinkable: true,
          toLinkable: true,
          fromLinkableDuplicates: true,
          toLinkableDuplicates: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          figure: nodeOption?.figure ?? 'Diamond'
        },
        new go.Binding('fill', 'color'),
        new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
      ),
      make(
        go.Shape,
        { margin: 3, fill: '#000', strokeWidth: 0, width: 30, height: 30, scale: 0.65 },
        new go.Binding('geometry', 'geo', geoFunc)
      )
      // {
      //   toolTip: make(
      //     'ToolTip',
      //     { 'Border.stroke': 'gray', 'Border.strokeWidth': 2 },
      //     make(go.TextBlock, { margin: 8, stroke: 'gray', font: 'bold 16px sans-serif' }, new go.Binding('text', 'geo'))
      //   )
      // }
    )
  )
}

function geoFunc(geoname: Icons) {
  let geo: string | go.Geometry = icons[geoname]
  if (geo === undefined) geo = icons['heart']
  if (typeof geo === 'string') {
    geo = go.Geometry.parse(geo, true)
  }
  return geo
}
