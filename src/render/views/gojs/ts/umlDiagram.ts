import * as go from 'gojs'

import type { PropertyType } from '../type'

const make = go.GraphObject.make

// 属性标识
function convertVisibility(v: PropertyType) {
  switch (v) {
    case 'public':
      return '+'
    case 'private':
      return '-'
    case 'protected':
      return '#'
    case 'package':
      return '~'
    default:
      return v
  }
}

// 是否树形分布
function convertIsTreeLink(r: string) {
  return r === 'generalization'
}

// 箭尾样式
function convertFromArrow(r: string) {
  switch (r) {
    case 'generalization':
      return ''
    default:
      return ''
  }
}

// 箭头样式
function convertToArrow(r: string): string {
  switch (r) {
    case 'generalization':
      return 'Triangle'
    case 'aggregation':
      return 'StretchedDiamond'
    default:
      return ''
  }
}

// 连线事件
function LinkDrawn(event: go.DiagramEvent) {
  const {
    diagram: { model },
    subject: { data }
  } = event
  model.removeLinkData(data)
  data.relationship = 'generalization'
  model.addLinkData(data)
  console.log(data, 'data')
}

// 给节点添加接口
function makePort(name: string, align: go.Spot, spot: go.Spot, output: boolean, input: boolean) {
  const horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom)
  return make(go.Shape, {
    fill: 'transparent',
    strokeWidth: 0,
    width: horizontal ? NaN : 8,
    height: !horizontal ? NaN : 8,
    alignment: align,
    stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
    portId: name,
    fromSpot: spot,
    fromLinkable: output,
    toSpot: spot,
    toLinkable: input,
    cursor: 'pointer',
    mouseEnter: function (e: go.InputEvent, port: go.GraphObject) {
      if (!e.diagram.isReadOnly && port instanceof go.Shape) port.fill = 'rgba(255,0,255,0.5)'
    },
    mouseLeave: function (e: go.InputEvent, port: go.GraphObject) {
      if (port instanceof go.Shape) port.fill = 'transparent'
    }
  })
}

export function init(templeteRef: HTMLDivElement): go.Diagram {
  const myDiagram = make(go.Diagram, templeteRef, {
    'undoManager.isEnabled': true,
    allowLink: true,
    LinkDrawn
  })

  const diagramLayout = make(go.TreeLayout, {
    angle: 90,
    path: go.TreeLayout.PathSource,
    setsPortSpot: false,
    setsChildPortSpot: false,
    arrangement: go.TreeLayout.ArrangementHorizontal
  })

  const propertyTemplate = make(
    go.Panel,
    'Horizontal',
    // property visibility/access
    make(
      go.TextBlock,
      { isMultiline: false, editable: false, width: 12 },
      new go.Binding('text', 'visibility', convertVisibility)
    ),
    // property name, underlined if scope=="class" to indicate static property
    make(
      go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding('text', 'name').makeTwoWay(),
      new go.Binding('isUnderline', 'scope', function (s) {
        return s[0] === 'c'
      })
    ),
    // property type, if known
    make(
      go.TextBlock,
      '',
      new go.Binding('text', 'type', function (t) {
        return t ? ': ' : ''
      })
    ),
    make(go.TextBlock, { isMultiline: false, editable: true }, new go.Binding('text', 'type').makeTwoWay()),
    make(
      go.TextBlock,
      { isMultiline: false, editable: false },
      new go.Binding('text', 'defaultValue', function (s) {
        return s ? ' = ' + s : ''
      })
    )
  )

  const methodTemplate = make(
    go.Panel,
    'Horizontal',
    // method visibility/access
    make(
      go.TextBlock,
      { isMultiline: false, editable: false, width: 12 },
      new go.Binding('text', 'visibility', convertVisibility)
    ),
    // method name, underlined if scope=="class" to indicate static method
    make(
      go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding('text', 'name').makeTwoWay(),
      new go.Binding('isUnderline', 'scope', function (s) {
        return s[0] === 'c'
      })
    ),
    // method parameters
    make(
      go.TextBlock,
      '()',
      // this does not permit adding/editing/removing of parameters via inplace edits
      new go.Binding('text', 'parameters', function (parr) {
        let s = '('
        for (let i = 0; i < parr.length; i++) {
          const param = parr[i]
          if (i > 0) s += ', '
          s += param.name + ': ' + param.type
        }
        return s + ')'
      })
    ),
    // method return type, if any
    make(
      go.TextBlock,
      '',
      new go.Binding('text', 'type', function (t?: string) {
        return t ? ': ' : ''
      })
    ),
    make(go.TextBlock, { isMultiline: false, editable: true }, new go.Binding('text', 'type').makeTwoWay())
  )

  myDiagram.layout = diagramLayout

  myDiagram.nodeTemplate = make(
    go.Node,
    'Auto',
    {
      locationSpot: go.Spot.Center,
      fromSpot: go.Spot.AllSides,
      toSpot: go.Spot.AllSides
    },
    make(go.Shape, { fill: 'lightyellow' }),
    make(
      go.Panel,
      'Table',
      { defaultRowSeparatorStroke: 'black' },
      // header
      make(
        go.TextBlock,
        {
          row: 0,
          columnSpan: 2,
          margin: 3,
          alignment: go.Spot.Center,
          font: 'bold 12pt sans-serif',
          isMultiline: false,
          editable: true
        },
        new go.Binding('text', 'name').makeTwoWay()
      ),
      // properties
      make(
        go.TextBlock,
        'Properties',
        { row: 1, font: 'italic 10pt sans-serif' },
        new go.Binding('visible', 'visible', function (v) {
          return !v
        }).ofObject('PROPERTIES')
      ),
      make(go.Panel, 'Vertical', { name: 'PROPERTIES' }, new go.Binding('itemArray', 'properties'), {
        row: 1,
        margin: 3,
        stretch: go.GraphObject.Fill,
        defaultAlignment: go.Spot.Left,
        background: 'lightyellow',
        itemTemplate: propertyTemplate
      }),
      make(
        'PanelExpanderButton',
        'PROPERTIES',
        { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
        new go.Binding('visible', 'properties', function (arr) {
          return arr.length > 0
        })
      ),
      // methods
      make(
        go.TextBlock,
        'Methods',
        { row: 2, font: 'italic 10pt sans-serif' },
        new go.Binding('visible', 'visible', function (v) {
          return !v
        }).ofObject('METHODS')
      ),
      make(go.Panel, 'Vertical', { name: 'METHODS' }, new go.Binding('itemArray', 'methods'), {
        row: 2,
        margin: 3,
        stretch: go.GraphObject.Fill,
        defaultAlignment: go.Spot.Left,
        background: 'lightyellow',
        itemTemplate: methodTemplate
      }),
      make(
        'PanelExpanderButton',
        'METHODS',
        { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
        new go.Binding('visible', 'methods', function (arr) {
          return arr.length > 0
        })
      )
    ),
    // four named ports, one on each side:
    makePort('T', go.Spot.Top, go.Spot.TopSide, true, true),
    makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
    makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
    makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, true)
  )

  myDiagram.linkTemplate = make(
    go.Link,
    { routing: go.Link.Orthogonal, isLayoutPositioned: false },
    new go.Binding('isLayoutPositioned', 'relationship', convertIsTreeLink),
    make(go.Shape),
    make(
      go.Shape,
      { scale: 1.3, fill: 'white', fromArrow: '' },
      new go.Binding('fromArrow', 'relationship', convertFromArrow)
    ),
    make(
      go.Shape,
      { scale: 1.3, fill: 'white', toArrow: '' },
      new go.Binding('toArrow', 'relationship', convertToArrow)
    )
  )

  return myDiagram
}
