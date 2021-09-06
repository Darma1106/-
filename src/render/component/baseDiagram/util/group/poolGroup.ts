import * as go from 'gojs'
import { PoolLayout } from '../diagramTool/PoolLayout'
const { make } = go.GraphObject

// swimlanes
export const MINLENGTH = 400 // this controls the minimum length of any swimlane
export const MINBREADTH = 20 // this controls the minimum breadth of any non-collapsed swimlane

function laneEventMenuMaker(diagram: go.Diagram) {
  return make<go.Adornment>( // context menu for each lane
    'ContextMenu',
    make(
      'ContextMenuButton',
      make(go.TextBlock, 'Add Lane'),
      // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
      {
        click: function (e: go.InputEvent, obj: go.GraphObject) {
          addLaneEvent((obj.part as go.Adornment).adornedObject as go.Node, diagram)
        }
      }
    )
  )
}

export function swimLanesGroupMaker(diagram: go.Diagram): go.Group {
  return make(
    go.Group,
    'Spot',
    groupStyle(),
    {
      name: 'Lane',
      contextMenu: laneEventMenuMaker(diagram),
      minLocation: new go.Point(NaN, -Infinity), // only allow vertical movement
      maxLocation: new go.Point(NaN, Infinity),
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
            relayoutDiagram(diagram)
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
        new go.Binding('text', 'text').makeTwoWay()
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
        new go.Binding('text', 'text').makeTwoWay()
      )
    )
  ) // end swimLanesGroupTemplate
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

function addLaneEvent(lane: go.Node, diagram: go.Diagram) {
  diagram.startTransaction('addLane')
  if (lane != null && lane.data.category === 'Lane') {
    // create a new lane data object
    const shape = lane.findObject('SHAPE')
    const size = new go.Size(shape ? shape.width : MINLENGTH, MINBREADTH)
    const newlanedata = {
      category: 'Lane',
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

export function poolGroupMaker(): go.Group {
  return make(
    go.Group,
    'Auto',
    groupStyle(),
    {
      computesBoundsIncludingLinks: false,
      // use a simple layout that ignores links to stack the "lane" Groups on top of each other
      layout: make(PoolLayout, { spacing: new go.Size(0, 0) }) // no space between lanes
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    make(go.Shape, { fill: 'white' }, new go.Binding('fill', 'color')),
    make(
      go.Panel,
      'Table',
      { defaultColumnSeparatorStroke: 'black' },
      make(
        go.Panel,
        'Horizontal',
        { column: 0, angle: 270 },
        make(
          go.TextBlock,
          { editable: true, margin: new go.Margin(5, 0, 5, 0) }, // margin matches private process (black box pool)
          new go.Binding('text').makeTwoWay()
        )
      ),
      make(go.Placeholder, { background: 'darkgray', column: 1 })
    )
  ) // end poolG
}
