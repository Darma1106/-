<template>
  <div id="diagramInstanceDiv" style="border: solid 1px black; width: 100%; height: 700px"></div>
  <button @click="addLane">123</button>
</template>

<script setup>
import * as go from 'gojs'
import { onMounted } from 'vue'
import { PoolLayout, LaneResizingTool } from './PoolLayout'

let diagramInstance = null

// some shared functions

// 强制lanes重新布局
function relayoutLanes() {
  diagramInstance.nodes.each(function (lane) {
    if (!(lane instanceof go.Group)) return
    if (lane.category === 'Pool') return
    lane.layout.isValidLayout = false // force it to be invalid
  })
  diagramInstance.layoutDiagram()
}

// 节点移动或者lanes resize后重新布局
function relayoutDiagram() {
  diagramInstance.layout.invalidateLayout()
  diagramInstance.findTopLevelGroups().each(function (g) {
    if (g.category === 'Pool') g.layout.invalidateLayout()
  })
  diagramInstance.layoutDiagram()
}

function init() {
  let $ = go.GraphObject.make

  diagramInstance = $(go.Diagram, 'diagramInstanceDiv', {
    // use a custom ResizingTool (along with a custom ResizeAdornment on each Group)
    resizingTool: new LaneResizingTool(),
    // use a simple layout that ignores links to stack the top-level Pool Groups next to each other
    layout: $(PoolLayout),
    // don't allow dropping onto the diagram's background unless they are all Groups (lanes or pools)
    mouseDragOver: function (e) {
      if (
        !e.diagram.selection.all(function (n) {
          return n instanceof go.Group
        })
      ) {
        e.diagram.currentCursor = 'not-allowed'
      }
    },
    mouseDrop: function (e) {
      if (
        !e.diagram.selection.all(function (n) {
          return n instanceof go.Group
        })
      ) {
        e.diagram.currentTool.doCancel()
      }
    },
    // 剪贴板复制的节点将粘贴到原始节点的组中 (i.e. lane).
    'commandHandler.copiesGroupKey': true,
    // 拖动选定内容后自动重新布局泳道
    SelectionMoved: relayoutDiagram, // this DiagramEvent listener is
    SelectionCopied: relayoutDiagram, // defined above
    'animationManager.isEnabled': false,
    // enable undo & redo
    'undoManager.isEnabled': true
  })

  go.Diagram.inherit(new LaneResizingTool(), go.ResizingTool)

  // define a custom grid layout that makes sure the length of each lane is the same
  // and that each lane is broad enough to hold its subgraph

  go.Diagram.inherit(new PoolLayout(diagramInstance), go.GridLayout)

  // this is a Part.dragComputation function for limiting where a Node may be dragged
  // use GRIDPT instead of PT if DraggingTool.isGridSnapEnabled and movement should snap to grid
  function stayInGroup(part, pt, gridpt) {
    // don't constrain top-level nodes
    let grp = part.containingGroup
    if (grp === null) return pt
    // try to stay within the background Shape of the Group
    let back = grp.resizeObject
    if (back === null) return pt
    // 如果按住Shift键，则允许从组中拖动节点
    if (part.diagram.lastInput.shift) return pt
    let p1 = back.getDocumentPoint(go.Spot.TopLeft)
    let p2 = back.getDocumentPoint(go.Spot.BottomRight)
    let b = part.actualBounds
    let loc = part.location
    // find the padding inside the group's placeholder that is around the member parts
    let m = grp.placeholder.padding
    // now limit the location appropriately
    let x = Math.max(p1.x + m.left, Math.min(pt.x, p2.x - m.right - b.width - 1)) + (loc.x - b.x)
    let y = Math.max(p1.y + m.top, Math.min(pt.y, p2.y - m.bottom - b.height - 1)) + (loc.y - b.y)
    return new go.Point(x, y)
  }

  diagramInstance.nodeTemplate = $(
    go.Node,
    'Auto',
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Shape, 'Rectangle', { fill: 'white', portId: '', cursor: 'pointer', fromLinkable: true, toLinkable: true }),
    $(go.TextBlock, { margin: 5 }, new go.Binding('text', 'key')),
    { dragComputation: stayInGroup } // limit dragging of Nodes to stay within the containing Group, defined above
  )

  function groupStyle() {
    // common settings for both Lane and Pool Groups
    return [
      {
        layerName: 'Background', // all pools and lanes are always behind all nodes and links
        background: 'transparent', // can grab anywhere in bounds
        movable: true, // allows users to re-order by dragging
        copyable: false, // can't copy lanes or pools
        avoidable: false, // don't impede AvoidsNodes routed Links
        minLocation: new go.Point(NaN, -Infinity), // only allow vertical movement
        maxLocation: new go.Point(NaN, Infinity)
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify)
    ]
  }

  // hide links between lanes when either lane is collapsed
  function updateCrossLaneLinks(group) {
    group.findExternalLinksConnected().each(function (l) {
      l.visible = l.fromNode.isVisible() && l.toNode.isVisible()
    })
  }

  // each Group is a "swimlane" with a header on the left and a resizable lane on the right
  diagramInstance.groupTemplate = $(
    go.Group,
    'Horizontal',
    groupStyle(),
    {
      selectionObjectName: 'SHAPE', // selecting a lane causes the body of the lane to be highlit, not the label
      resizable: true,
      resizeObjectName: 'SHAPE', // the custom resizeAdornmentTemplate only permits two kinds of resizing
      layout: $(
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
      mouseDrop: function (e, grp) {
        // dropping a copy of some Nodes and Links onto this Group adds them to this Group
        if (!e.shift) return // cannot change groups with an unmodified drag-and-drop
        // don't allow drag-and-dropping a mix of regular Nodes and Groups
        if (
          !e.diagram.selection.any(function (n) {
            return n instanceof go.Group
          })
        ) {
          let ok = grp.addMembers(grp.diagram.selection, true)
          if (ok) {
            updateCrossLaneLinks(grp)
          } else {
            grp.diagram.currentTool.doCancel()
          }
        } else {
          e.diagram.currentTool.doCancel()
        }
      },
      subGraphExpandedChanged: function (grp) {
        let shp = grp.resizeObject
        if (grp.diagram.undoManager.isUndoingRedoing) return
        if (grp.isSubGraphExpanded) {
          shp.height = grp.data.savedBreadth
        } else {
          if (!isNaN(shp.height)) grp.diagram.model.set(grp.data, 'savedBreadth', shp.height)
          shp.height = NaN
        }
        updateCrossLaneLinks(grp)
      }
    },
    new go.Binding('isSubGraphExpanded', 'expanded').makeTwoWay(),
    // the lane header consisting of a Shape and a TextBlock
    $(
      go.Panel,
      'Horizontal',
      {
        name: 'HEADER',
        angle: 270, // maybe rotate the header to read sideways going up
        alignment: go.Spot.Center
      },
      $(
        go.Panel,
        'Horizontal', // this is hidden when the swimlane is collapsed
        new go.Binding('visible', 'isSubGraphExpanded').ofObject(),
        $(go.Shape, 'Diamond', { width: 8, height: 8, fill: 'white' }, new go.Binding('fill', 'color')),
        $(
          go.TextBlock, // the lane label
          { font: 'bold 13pt sans-serif', editable: true, margin: new go.Margin(2, 0, 0, 0) },
          new go.Binding('text', 'text').makeTwoWay()
        )
      ),
      $('SubGraphExpanderButton', { margin: 5 }) // but this remains always visible!
    ), // end Horizontal Panel
    $(
      go.Panel,
      'Auto', // the lane consisting of a background Shape and a Placeholder representing the subgraph
      $(
        go.Shape,
        'Rectangle', // this is the resized object
        { name: 'SHAPE', fill: 'white' },
        new go.Binding('fill', 'color'),
        new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
      ),
      $(go.Placeholder, { padding: 12, alignment: go.Spot.TopLeft }),
      $(
        go.TextBlock, // this TextBlock is only seen when the swimlane is collapsed
        {
          name: 'LABEL',
          font: 'bold 13pt sans-serif',
          editable: true,
          angle: 0,
          alignment: go.Spot.TopLeft,
          margin: new go.Margin(2, 0, 0, 4)
        },
        new go.Binding('visible', 'isSubGraphExpanded', function (e) {
          return !e
        }).ofObject(),
        new go.Binding('text', 'text').makeTwoWay()
      )
    ) // end Auto Panel
  ) // end Group

  // define a custom resize adornment that has two resize handles if the group is expanded
  diagramInstance.groupTemplate.resizeAdornmentTemplate = $(
    go.Adornment,
    'Spot',
    $(go.Placeholder),
    $(
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
    $(
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

  diagramInstance.groupTemplateMap.add(
    'Pool',
    $(
      go.Group,
      'Auto',
      groupStyle(),
      {
        // use a simple layout that ignores links to stack the "lane" Groups on top of each other
        layout: $(PoolLayout, { spacing: new go.Size(0, 0) }) // no space between lanes
      },
      $(go.Shape, { fill: 'white' }, new go.Binding('fill', 'color')),
      $(
        go.Panel,
        'Table',
        { defaultColumnSeparatorStroke: 'black' },
        $(
          go.Panel,
          'Horizontal',
          { column: 0, angle: 270 },
          $(
            go.TextBlock,
            { font: 'bold 16pt sans-serif', editable: true, margin: new go.Margin(2, 0, 0, 0) },
            new go.Binding('text').makeTwoWay()
          )
        ),
        $(go.Placeholder, { column: 1 })
      )
    )
  )
  diagramInstance.linkTemplate = $(
    go.Link,
    { routing: go.Link.AvoidsNodes, corner: 5 },
    { relinkableFrom: true, relinkableTo: true },
    $(go.Shape),
    $(go.Shape, { toArrow: 'Standard' })
  )

  // define some sample graphs in some of the lanes
  diagramInstance.model = new go.GraphLinksModel(
    [
      // node data
      { key: 'Pool1', text: 'Pool', isGroup: true, category: 'Pool' },
      { key: 'Pool2', text: 'Pool2', isGroup: true, category: 'Pool' },
      { key: 'Pool3', text: 'Pool3', isGroup: true, category: 'Pool' },
      { key: 'Lane1', text: 'Lane1', isGroup: true, group: 'Pool1', color: 'lightblue' },
      { key: 'Lane2', text: 'Lane2', isGroup: true, group: 'Pool1', color: 'lightgreen' },
      { key: 'Lane3', text: 'Lane3', isGroup: true, group: 'Pool1', color: 'lightyellow' },
      { key: 'Lane4', text: 'Lane4', isGroup: true, group: 'Pool1', color: 'orange' },
      { key: 'oneA', group: 'Lane1' },
      { key: 'oneB', group: 'Lane1' },
      { key: 'oneC', group: 'Lane1' },
      { key: 'oneD', group: 'Lane1' },
      { key: 'twoA', group: 'Lane2' },
      { key: 'twoB', group: 'Lane2' },
      { key: 'twoC', group: 'Lane2' },
      { key: 'twoD', group: 'Lane2' },
      { key: 'twoE', group: 'Lane2' },
      { key: 'twoF', group: 'Lane2' },
      { key: 'twoG', group: 'Lane2' },
      { key: 'fourA', group: 'Lane4' },
      { key: 'fourB', group: 'Lane4' },
      { key: 'fourC', group: 'Lane4' },
      { key: 'fourD', group: 'Lane4' },
      { key: 'Lane5', text: 'Lane5', isGroup: true, group: 'Pool2', color: 'lightyellow' },
      { key: 'Lane6', text: 'Lane6', isGroup: true, group: 'Pool2', color: 'lightgreen' },
      { key: 'fiveA', group: 'Lane5' },
      { key: 'sixA', group: 'Lane6' }
    ],
    [
      // link data
      { from: 'oneA', to: 'oneB' },
      { from: 'oneA', to: 'oneC' },
      { from: 'oneB', to: 'oneD' },
      { from: 'oneC', to: 'oneD' },
      { from: 'twoA', to: 'twoB' },
      { from: 'twoA', to: 'twoC' },
      { from: 'twoA', to: 'twoF' },
      { from: 'twoB', to: 'twoD' },
      { from: 'twoC', to: 'twoD' },
      { from: 'twoD', to: 'twoG' },
      { from: 'twoE', to: 'twoG' },
      { from: 'twoF', to: 'twoG' },
      { from: 'fourA', to: 'fourB' },
      { from: 'fourB', to: 'fourC' },
      { from: 'fourC', to: 'fourD' }
    ]
  )
  // force all lanes' layouts to be performed
  relayoutLanes()
} // end init

onMounted(() => {
  init()
})

function diagramClick() {
  // 如果为选中editor节点 return
  // 如果点击了某个lane
  // 在lane重添加节点
  // 直接在画布中添加节点
}

function addLane() {
  diagramInstance.model.addNodeData({ key: 'Lanex', text: 'Lanex', isGroup: true, group: 'Pool3', color: 'orange' })
}
</script>

<style lang="less" scoped></style>
