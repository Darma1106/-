import * as go from 'gojs'
const make = go.GraphObject.make
// 给节点添加接口
export function makePort(
  name: string,
  align: go.Spot,
  spot: go.Spot,
  output: boolean,
  input: boolean,
  visible = true
): go.Shape {
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
    visible: visible,
    mouseEnter: function (e: go.InputEvent, port: go.GraphObject) {
      if (!e.diagram.isReadOnly && port instanceof go.Shape) port.fill = 'rgba(255,0,255,0.5)'
    },
    mouseLeave: function (e: go.InputEvent, port: go.GraphObject) {
      if (port instanceof go.Shape) port.fill = 'transparent'
    }
  })
}

export function FigureButton(fig: string, propname = 'figure'): go.Shape {
  return make(go.Shape, {
    width: 32,
    height: 32,
    scale: 0.5,
    fill: 'lightgray',
    figure: fig,
    margin: 1,
    background: 'transparent',
    mouseEnter: (e: go.InputEvent, shape: go.GraphObject): void => {
      ;(shape as go.Shape).fill = 'dodgerblue'
    },
    mouseLeave: (e: go.InputEvent, shape: go.GraphObject): void => {
      ;(shape as go.Shape).fill = 'lightgray'
    },
    click: ClickFunction(propname, fig),
    contextClick: ClickFunction(propname, fig)
  })
}

export function LightFillButtons(): go.Panel[] {
  // used by multiple context menus
  return [
    make(
      'ContextMenuButton',
      make(
        go.Panel,
        'Horizontal',
        ColorButton('white', 'fill'),
        ColorButton('beige', 'fill'),
        ColorButton('aliceblue', 'fill'),
        ColorButton('lightyellow', 'fill')
      )
    ),
    make(
      'ContextMenuButton',
      make(
        go.Panel,
        'Horizontal',
        ColorButton('lightgray', 'fill'),
        ColorButton('lightgreen', 'fill'),
        ColorButton('lightblue', 'fill'),
        ColorButton('pink', 'fill')
      )
    )
  ]
}

// Create a context menu button for setting a data property with a color value.
export function ColorButton(color: string, propname = 'color'): go.Shape {
  return make(go.Shape, {
    width: 16,
    height: 16,
    stroke: 'lightgray',
    fill: color,
    margin: 1,
    background: 'transparent',
    mouseEnter: function (e: go.InputEvent, shape: go.GraphObject) {
      ;(shape as go.Shape).stroke = 'dodgerblue'
    },
    mouseLeave: function (e: go.InputEvent, shape: go.GraphObject) {
      ;(shape as go.Shape).stroke = 'lightgray'
    },
    click: ClickFunction(propname, color),
    contextClick: ClickFunction(propname, color)
  })
}

function ClickFunction(propname: string, value: string) {
  return function (e: go.InputEvent, obj: go.GraphObject) {
    e.handled = true // don't let the click bubble up
    e.diagram.model.commit(function (model) {
      model.set((obj.part as go.Adornment).adornedPart?.data, propname, value)
    })
  }
}

export function makeBaseNode(): go.Node {
  return make(
    go.Node,
    'Auto',
    {
      // locationSpot: go.Spot.Center,
      locationObjectName: 'SHAPE',
      desiredSize: new go.Size(120, 60),
      minSize: new go.Size(40, 40),
      resizable: true,
      resizeCellSize: new go.Size(20, 20),
      contextMenu: make(
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
    },
    // these Bindings are TwoWay because the DraggingTool and ResizingTool modify the target properties
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
    make(
      go.Shape,
      {
        // the border
        name: 'SHAPE',
        fill: 'white',
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromLinkableDuplicates: true,
        toLinkableDuplicates: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides
      },
      new go.Binding('figure'),
      new go.Binding('fill'),
      new go.Binding('stroke', 'color'),
      new go.Binding('strokeWidth', 'thickness'),
      new go.Binding('strokeDashArray', 'dash')
    ),
    // this Shape prevents mouse events from reaching the middle of the port
    make(go.Shape, { width: 100, height: 40, strokeWidth: 0, fill: 'transparent' }),
    make(
      go.TextBlock,
      { margin: 1, textAlign: 'center', overflow: go.TextBlock.OverflowEllipsis, editable: true },
      // this Binding is TwoWay due to the user editing the text with the TextEditingTool
      new go.Binding('text').makeTwoWay(),
      new go.Binding('stroke', 'color')
    )
  )
}
