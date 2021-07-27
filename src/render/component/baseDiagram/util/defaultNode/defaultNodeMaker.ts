import * as go from 'gojs'
import { basedNodeMaker, make } from './baseNodeMaker'
import type { NodeOption } from '../../type'

export function defaultNodeMaker(nodeOption?: NodeOption): go.Node {
  const template = make(
    go.Shape,
    {
      name: 'SHAPE',
      fill: nodeOption?.figure ?? 'white',
      portId: '',
      cursor: 'pointer',
      fromLinkable: true,
      toLinkable: true,
      fromLinkableDuplicates: true,
      toLinkableDuplicates: true,
      fromSpot: go.Spot.AllSides,
      toSpot: go.Spot.AllSides,
      figure: nodeOption?.figure ?? 'Circle',
      strokeWidth: 1
    },
    new go.Binding('figure'),
    new go.Binding('fill'),
    new go.Binding('stroke', 'color'),
    new go.Binding('strokeWidth', 'thickness'),
    new go.Binding('strokeDashArray', 'dash')
  )

  return basedNodeMaker(template, true, true)
}
