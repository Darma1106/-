import * as go from 'gojs'
import { FigureButton, LightFillButtons } from '@/component/baseDiagram/util/node'

export const make = go.GraphObject.make

export function basedNodeMaker(nodeTemplate: go.GraphObject, contextMenu = false, centerText = false): go.Node {
  return make(
    go.Node,
    'Auto',
    {
      // locationSpot: go.Spot.Center,
      locationObjectName: 'SHAPE',
      desiredSize: new go.Size(65, 65),
      minSize: new go.Size(40, 40),
      resizable: true,
      resizeCellSize: new go.Size(20, 20),
      contextMenu: contextMenu
        ? make(
            'ContextMenu',
            make(
              'ContextMenuButton',
              make(
                go.Panel,
                'Horizontal',
                FigureButton('Rectangle'),
                FigureButton('RoundedRectangle'),
                FigureButton('Ellipse'),
                FigureButton('Diamond')
              )
            ),
            LightFillButtons()
          )
        : undefined
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
    nodeTemplate,
    make(
      go.Shape,
      { width: 100, height: 40, strokeWidth: 0, fill: 'transparent' },
      new go.Binding('desiredSize', 'size', (size: string) => {
        // 给节点留出20px的连线触发区域
        const realSize = size
          .split('')
          .map((value) => Number(value) - 20)
          .join(' ')
        return go.Size.parse(realSize)
      }).makeTwoWay(go.Size.stringify)
    ),
    centerText
      ? make(
          go.TextBlock,
          { margin: 1, textAlign: 'center', overflow: go.TextBlock.OverflowEllipsis, editable: true },
          new go.Binding('text').makeTwoWay(),
          new go.Binding('stroke', 'fontColor')
        )
      : ''
    // 提示
    // {
    //   toolTip: make(
    //     'ToolTip',
    //     { 'Border.stroke': 'gray', 'Border.strokeWidth': 2 },
    //     make(go.TextBlock, { margin: 8, stroke: 'gray', font: 'bold 16px sans-serif', text: '123123tip' })
    //   )
    // }
  )
}
