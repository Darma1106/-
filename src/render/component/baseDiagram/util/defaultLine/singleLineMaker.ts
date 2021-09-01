import * as go from 'gojs'

import { DarkColorButtons, StrokeOptionsButtons, ArrowButton, AllSidesButton, SpotButton } from '../link'

const make = go.GraphObject.make

const linkSelectionAdornmentTemplate = make(
  go.Adornment,
  'Link',
  make(
    go.Shape,
    // isPanelMain declares that this Shape shares the Link.geometry
    { isPanelMain: true, fill: null, stroke: 'deepskyblue', strokeWidth: 0 }
  ) // use selection object's strokeWidth
)

export function singleLineMaker(): go.Link {
  return make(
    go.Link, // the whole link panel
    { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
    { relinkableFrom: true, relinkableTo: true, reshapable: true },
    {
      routing: go.Link.Normal,
      curve: go.Link.JumpOver,
      corner: 5,
      toShortLength: 4,
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
    new go.Binding('points').makeTwoWay(),
    new go.Binding('fromSpot').makeTwoWay(),
    // new go.Binding('toSpot', 'toSpot', go.Spot.parse),
    new go.Binding('toSpot').makeTwoWay(),
    make(
      go.Shape, // the link path shape
      { isPanelMain: true, strokeWidth: 2 }
    ),
    make(
      go.Shape, // the arrowhead
      { toArrow: 'Standard', stroke: null }
    ),
    make(
      go.Panel,
      'Auto',
      new go.Binding('visible', '', (val) => {
        return !val.isSelected && val.text
      }),

      make(
        go.TextBlock,
        {
          stroke: 'black',
          background: 'white',
          maxSize: new go.Size(80, NaN)
        },
        new go.Binding('text').makeTwoWay()
      )
    ),
    make(
      go.Panel,
      'Auto',
      new go.Binding('visible', 'isSelected').ofObject(),
      make(
        go.Shape,
        'RoundedRectangle', // the link shape
        { fill: '#F8F8F8', stroke: null }
      ),

      make(
        go.TextBlock,
        {
          textAlign: 'center',
          font: '10pt helvetica, arial, sans-serif',
          stroke: '#919191',
          margin: 2,
          minSize: new go.Size(10, NaN),
          editable: true
        },
        new go.Binding('text').makeTwoWay()
      )
    )
  )
}
