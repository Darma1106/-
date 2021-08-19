import * as go from 'gojs'

import { DarkColorButtons, StrokeOptionsButtons, ArrowButton, AllSidesButton, SpotButton } from '../link'

const make = go.GraphObject.make
export function defaultLineMaker(): go.Link {
  return make(
    go.Link,
    {
      layerName: 'Foreground',
      routing: go.Link.Normal,
      corner: 10,
      toShortLength: 4,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      resegmentable: true,
      contextMenu: make(
        'ContextMenu',
        DarkColorButtons(),
        StrokeOptionsButtons(),
        make('ContextMenuButton', make(go.Panel, 'Horizontal', ArrowButton(0), ArrowButton(1))),
        make(
          'ContextMenuButton',
          make(
            go.Panel,
            'Horizontal',
            make(
              go.Panel,
              'Spot',
              AllSidesButton(false),
              SpotButton(go.Spot.Top, false),
              SpotButton(go.Spot.Left, false),
              SpotButton(go.Spot.Right, false),
              SpotButton(go.Spot.Bottom, false)
            ),
            make(
              go.Panel,
              'Spot',
              { margin: new go.Margin(0, 0, 0, 2) },
              AllSidesButton(true),
              SpotButton(go.Spot.Top, true),
              SpotButton(go.Spot.Left, true),
              SpotButton(go.Spot.Right, true),
              SpotButton(go.Spot.Bottom, true)
            )
          )
        )
      )
    },
    // new go.Binding('fromSpot', 'fromSpot', (val) => {
    //   console.log(123123, '123', val)
    // }),
    new go.Binding('fromSpot').makeTwoWay(),
    // new go.Binding('toSpot', 'toSpot', go.Spot.parse),
    new go.Binding('toSpot').makeTwoWay(),
    new go.Binding('fromShortLength', 'dir', function (dir) {
      return dir === 2 ? 4 : 0
    }),
    new go.Binding('toShortLength', 'dir', function (dir) {
      return dir >= 1 ? 4 : 0
    }),
    // 线走向
    // new go.Binding('points').makeTwoWay(),
    make(
      go.Shape,
      { strokeWidth: 2 },
      new go.Binding('stroke', 'color'),
      new go.Binding('strokeWidth', 'thickness'),
      new go.Binding('strokeDashArray', 'dash')
    ),
    make(
      go.Shape,
      { fromArrow: 'Backward', strokeWidth: 0, scale: 4 / 3, visible: false },
      new go.Binding('visible', 'dir', function (dir) {
        return dir === 2
      }),
      new go.Binding('fill', 'color'),
      new go.Binding('scale', 'thickness', function (t) {
        return (2 + t) / 3
      })
    ),
    make(
      go.Shape,
      { toArrow: 'Standard', strokeWidth: 0, scale: 4 / 3 },
      new go.Binding('visible', 'dir', function (dir) {
        return dir >= 1
      }),
      new go.Binding('fill', 'color'),
      new go.Binding('scale', 'thickness', function (t) {
        return (2 + t) / 3
      })
    ),
    make(
      go.TextBlock,
      { alignmentFocus: new go.Spot(0, 1, -4, 0), editable: true },
      new go.Binding('text').makeTwoWay(), // TwoWay due to user editing with TextEditingTool
      new go.Binding('stroke', 'color')
    )
  )
}
