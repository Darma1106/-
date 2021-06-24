import * as go from 'gojs'

import { ColorButton } from './node'

//高亮
const make = go.GraphObject.make
export function linkSelectionHeighlight(color = 'deepskyblue'): go.Adornment {
  return make(go.Adornment, 'Link', make(go.Shape, { isPanelMain: true, fill: null, stroke: color, strokeWidth: 0 }))
}

export function DarkColorButtons(): go.Panel[] {
  // used by multiple context menus
  return [
    make(
      'ContextMenuButton',
      make(go.Panel, 'Horizontal', ColorButton('black'), ColorButton('green'), ColorButton('blue'), ColorButton('red'))
    ),
    make(
      'ContextMenuButton',
      make(
        go.Panel,
        'Horizontal',
        ColorButton('brown'),
        ColorButton('magenta'),
        ColorButton('purple'),
        ColorButton('orange')
      )
    )
  ]
}

export function StrokeOptionsButtons(): go.Panel[] {
  // used by multiple context menus
  return [
    make(
      'ContextMenuButton',
      make(go.Panel, 'Horizontal', ThicknessButton(1), ThicknessButton(2), ThicknessButton(3), ThicknessButton(4))
    ),
    make('ContextMenuButton', make(go.Panel, 'Horizontal', DashButton(null), DashButton([2, 4]), DashButton([4, 4])))
  ]
}

// Create a context menu button for setting a data property with a stroke width value.
function ThicknessButton(sw: number, propname = 'thickness') {
  return make(go.Shape, 'LineH', {
    width: 16,
    height: 16,
    strokeWidth: sw,
    margin: 1,
    background: 'transparent',
    mouseEnter: function (e: go.InputEvent, shape: go.GraphObject) {
      ;(shape as go.Shape).background = 'dodgerblue'
    },
    mouseLeave: function (e: go.InputEvent, shape: go.GraphObject) {
      ;(shape as go.Shape).background = 'transparent'
    },
    click: ClickFunction(propname, sw),
    contextClick: ClickFunction(propname, sw)
  })
}

// Create a context menu button for setting a data property with a stroke dash Array value.
function DashButton(dash: number[] | null, propname = 'dash') {
  return make(go.Shape, 'LineH', {
    width: 24,
    height: 16,
    strokeWidth: 2,
    strokeDashArray: dash,
    margin: 1,
    background: 'transparent',
    mouseEnter: function (e: go.InputEvent, shape: go.GraphObject) {
      ;(shape as go.Shape).background = 'dodgerblue'
    },
    mouseLeave: function (e: go.InputEvent, shape: go.GraphObject) {
      ;(shape as go.Shape).background = 'transparent'
    },
    click: ClickFunction(propname, dash),
    contextClick: ClickFunction(propname, dash)
  })
}

function ClickFunction(propname: string, value: string | string[] | number | number[] | null) {
  return function (e: go.InputEvent, obj: go.GraphObject) {
    e.handled = true // don't let the click bubble up
    e.diagram.model.commit(function (model) {
      model.set((obj.part as go.Adornment).adornedPart?.data, propname, value)
    })
  }
}

export function ArrowButton(num: number): go.Shape {
  let geo = 'M0 0 M16 16 M0 8 L16 8  M12 11 L16 8 L12 5'
  if (num === 0) {
    geo = 'M0 0 M16 16 M0 8 L16 8'
  } else if (num === 2) {
    geo = 'M0 0 M16 16 M0 8 L16 8  M12 11 L16 8 L12 5  M4 11 L0 8 L4 5'
  }
  return make(go.Shape, {
    geometryString: geo,
    margin: 2,
    background: 'transparent',
    mouseEnter: function (e: go.InputEvent, shape: go.GraphObject) {
      shape.background = 'dodgerblue'
    },
    mouseLeave: function (e: go.InputEvent, shape: go.GraphObject) {
      shape.background = 'transparent'
    },
    click: ClickFunction('dir', num.toString()),
    contextClick: ClickFunction('dir', num.toString())
  })
}

export function AllSidesButton(to: boolean): go.Shape {
  const setter = function (e: go.InputEvent, shape: go.GraphObject) {
    e.handled = true
    e.diagram.model.commit(function (m) {
      const link = (shape.part as go.Adornment).adornedPart as go.Link
      m.set(link.data, to ? 'toSpot' : 'fromSpot', go.Spot.stringify(go.Spot.AllSides))
      // re-spread the connections of other links connected with the node
      ;(to ? link.toNode : link.fromNode)?.invalidateConnectedLinks()
    })
  }
  return make(go.Shape, {
    width: 12,
    height: 12,
    fill: 'transparent',
    mouseEnter: function (e: go.InputEvent, shape: go.GraphObject) {
      shape.background = 'dodgerblue'
    },
    mouseLeave: function (e: go.InputEvent, shape: go.GraphObject) {
      shape.background = 'transparent'
    },
    click: setter,
    contextClick: setter
  })
}

export function SpotButton(spot: go.Spot, to: boolean): go.Shape {
  let ang = 0
  let side = go.Spot.RightSide
  if (spot.equals(go.Spot.Top)) {
    ang = 270
    side = go.Spot.TopSide
  } else if (spot.equals(go.Spot.Left)) {
    ang = 180
    side = go.Spot.LeftSide
  } else if (spot.equals(go.Spot.Bottom)) {
    ang = 90
    side = go.Spot.BottomSide
  }
  if (!to) ang -= 180
  const setter = function (e: go.InputEvent, shape: go.GraphObject) {
    e.handled = true
    e.diagram.model.commit(function (m) {
      const link = (shape.part as go.Adornment).adornedPart as go.Link
      m.set(link.data, to ? 'toSpot' : 'fromSpot', go.Spot.stringify(side))
      // re-spread the connections of other links connected with the node
      ;(to ? link.toNode : link.fromNode)?.invalidateConnectedLinks()
    })
  }
  return make(go.Shape, {
    alignment: spot,
    alignmentFocus: spot.opposite(),
    geometryString: 'M0 0 M12 12 M12 6 L1 6 L4 4 M1 6 L4 8',
    angle: ang,
    background: 'transparent',
    mouseEnter: function (e: go.InputEvent, shape: go.GraphObject) {
      shape.background = 'dodgerblue'
    },
    mouseLeave: function (e: go.InputEvent, shape: go.GraphObject) {
      shape.background = 'transparent'
    },
    click: setter,
    contextClick: setter
  })
}
