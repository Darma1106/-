import * as go from 'gojs'
const { make } = go.GraphObject

const MINLENGTH = 400,
  MINBREADTH = 20

const laneEventMenu = make<go.Adornment>( // context menu for each lane
  'ContextMenu',
  make(
    'ContextMenuButton',
    make(go.TextBlock, 'Add Lane'),
    // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
    {
      click: function (e: go.InputEvent, obj: go.GraphObject) {
        console.log(123, obj.part)

        addLaneEvent((obj.part as go.Adornment).adornedObject as go.Node, e.diagram)
      }
    }
  )
)

export function laneGroupMaker(): go.Group {
  const swimLanesGroupTemplate = make(
    go.Group,
    'Spot',
    groupStyle(),
    {
      name: 'lane',
      contextMenu: laneEventMenu,
      // minLocation: new go.Point(NaN, -Infinity), // only allow vertical movement
      // maxLocation: new go.Point(NaN, Infinity),
      selectionObjectName: 'SHAPE', // selecting a lane causes the body of the lane to be highlit, not the label
      resizable: true,
      resizeObjectName: 'SHAPE', // the custom resizeAdornmentTemplate only permits two kinds of resizing
      layout: make(
        go.LayeredDigraphLayout, // automatically lay out the lane's subgraph
        {
          isInitial: false, // don't even do initial layout
          isOngoing: false, // don't invalidate layout when nodes or links are added or removed
          direction: 0,
          columnSpacing: 10,
          layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource
        }
      ),
      resizeAdornmentTemplate: laneResizeA,
      computesBoundsAfterDrag: true, // needed to prevent recomputing Group.placeholder bounds too soon
      computesBoundsIncludingLinks: false, // to reduce occurrences of links going briefly outside the lane
      computesBoundsIncludingLocation: true, // to support empty space at top-left corner of lane
      handlesDragDropForMembers: true, // don't need to define handlers on member Nodes and Links
      mouseDrop: function (e: go.InputEvent, grp: go.GraphObject) {
        // dropping a copy of some Nodes and Links onto this Group adds them to this Group
        // don't allow drag-and-dropping a mix of regular Nodes and Groups
        if (
          !e.diagram.selection.any(
            (n) => (n instanceof go.Group && n.category !== 'subprocess') || n.category === 'privateProcess'
          )
        ) {
          if (!(grp instanceof go.Group) || grp.diagram === null) return
          const ok = grp.addMembers(grp.diagram.selection, true)
          if (ok) {
            updateCrossLaneLinks(grp)
            relayoutDiagram(e.diagram)
          } else {
            grp.diagram.currentTool.doCancel()
          }
        }
      },
      subGraphExpandedChanged: function (grp: go.Group) {
        if (grp.diagram === null) return
        if (grp.diagram.undoManager.isUndoingRedoing) return
        const shp = grp.resizeObject
        if (grp.isSubGraphExpanded) {
          shp.height = (grp as any)['_savedBreadth']
        } else {
          ;(grp as any)['_savedBreadth'] = shp.height
          shp.height = NaN
        }
        updateCrossLaneLinks(grp)
      }
    },
    // new go.Binding("isSubGraphExpanded", "expanded").makeTwoWay(),

    make(
      go.Shape,
      'Rectangle', // this is the resized object
      { name: 'SHAPE', fill: 'white', stroke: null }, // need stroke null here or you gray out some of pool border.
      new go.Binding('fill', 'color'),
      new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
    ),

    // the lane header consisting of a Shape and a TextBlock
    make(
      go.Panel,
      'Horizontal',
      {
        name: 'HEADER',
        angle: 270, // maybe rotate the header to read sideways going up
        alignment: go.Spot.LeftCenter,
        alignmentFocus: go.Spot.LeftCenter
      },
      make(
        go.TextBlock, // the lane label
        { editable: true, margin: new go.Margin(2, 0, 0, 8) },
        new go.Binding('visible', 'isSubGraphExpanded').ofObject(),
        new go.Binding('text', 'name').makeTwoWay()
      ),
      make('SubGraphExpanderButton', { margin: 4, angle: -270 }) // but this remains always visible!
    ), // end Horizontal Panel
    make(go.Placeholder, { padding: 12, alignment: go.Spot.TopLeft, alignmentFocus: go.Spot.TopLeft }),
    make(
      go.Panel,
      'Horizontal',
      { alignment: go.Spot.TopLeft, alignmentFocus: go.Spot.TopLeft },
      make(
        go.TextBlock, // this TextBlock is only seen when the swimlane is collapsed
        {
          name: 'LABEL',
          editable: true,
          visible: false,
          angle: 0,
          margin: new go.Margin(6, 0, 0, 20)
        },
        new go.Binding('visible', 'isSubGraphExpanded', function (e) {
          return !e
        }).ofObject(),
        new go.Binding('text', 'name').makeTwoWay()
      )
    )
  ) // end swimLanesGroupTemplate
  return swimLanesGroupTemplate
}

function groupStyle() {
  // common settings for both Lane and Pool Groups
  return [
    {
      layerName: 'Background', // all pools and lanes are always behind all nodes and links
      background: 'transparent', // can grab anywhere in bounds
      movable: true, // allows users to re-order by dragging
      copyable: false, // can't copy lanes or pools
      avoidable: false // don't impede AvoidsNodes routed Links
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify)
  ]
}

const laneResizeA = make(
  go.Adornment,
  'Spot',
  make(go.Placeholder),
  make(
    go.Shape, // for changing the length of a lane
    {
      alignment: go.Spot.Right,
      desiredSize: new go.Size(7, 50),
      fill: 'lightblue',
      stroke: 'dodgerblue',
      cursor: 'col-resize',
      visible: true
    },
    new go.Binding('visible', '', function (ad) {
      if (ad.adornedPart === null) return false
      return ad.adornedPart.isSubGraphExpanded
    }).ofObject()
  ),
  make(
    go.Shape, // for changing the breadth of a lane
    {
      alignment: go.Spot.Bottom,
      desiredSize: new go.Size(50, 7),
      fill: 'lightblue',
      stroke: 'dodgerblue',
      cursor: 'row-resize'
    },
    new go.Binding('visible', '', function (ad) {
      if (ad.adornedPart === null) return false
      return ad.adornedPart.isSubGraphExpanded
    }).ofObject()
  )
)

function addLaneEvent(lane: go.Node, diagram: go.Diagram) {
  diagram.startTransaction('addLane')
  if (lane != null && lane.data.category === 'lane') {
    // create a new lane data object
    const shape = lane.findObject('SHAPE')
    console.log(shape, 'Shape')
    const size = new go.Size(shape ? shape.width : MINLENGTH, shape ? shape.height : MINBREADTH)
    const newlanedata = {
      category: 'lane',
      text: 'New Lane',
      color: 'white',
      isGroup: true,
      loc: go.Point.stringify(new go.Point(lane.location.x, lane.location.y + 1)), // place below selection
      size: go.Size.stringify(size),
      group: lane.data.group
    }
    // and add it to the model
    diagram.model.addNodeData(newlanedata)
  }
  diagram.commitTransaction('addLane')
}

// hide links between lanes when either lane is collapsed
function updateCrossLaneLinks(group: go.Group) {
  group.findExternalLinksConnected().each((l) => {
    l.visible = l.fromNode !== null && l.fromNode.isVisible() && l.toNode !== null && l.toNode.isVisible()
  })
}

function relayoutDiagram(diagram: go.Diagram) {
  diagram.layout.invalidateLayout()
  diagram.findTopLevelGroups().each(function (g) {
    if (g.category === 'Pool' && g.layout !== null) g.layout.invalidateLayout()
  })
  diagram.layoutDiagram()
}
