import * as go from 'gojs'

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
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      corner: 5,
      toShortLength: 4
    },
    new go.Binding('points').makeTwoWay(),
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
