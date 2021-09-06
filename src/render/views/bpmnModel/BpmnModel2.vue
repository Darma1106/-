<template>
  <div id="myDiagramDiv"></div>
</template>

<script setup lang="ts">
import * as go from 'gojs'
import { nextTick, onMounted } from 'vue'
import { BPMNLinkingTool, BPMNRelinkingTool } from './BPMNClasses'
import { LaneResizingTool, PoolLayout, MINLENGTH, MINBREADTH } from './PoolLayout'
import { DrawCommandHandler } from '@/component/baseDiagram/util/diagramTool/DrawCommandHandler'
import { defaultNodeMaker } from '@/component/baseDiagram/util/defaultNode'
const make = go.GraphObject.make
let myDiagram: null | go.Diagram = null

function getDiagram(): null | go.Diagram {
  return myDiagram
}

function relayoutDiagram() {
  const diagram = getDiagram() as go.Diagram
  diagram.layout.invalidateLayout()
  diagram.findTopLevelGroups().each(function (g) {
    if (g.category === 'Pool' && g.layout !== null) g.layout.invalidateLayout()
  })
  diagram.layoutDiagram()
}

function assignGroupLayer(grp: go.Part): void {
  if (!(grp instanceof go.Group)) return
  var lay = grp.isSelected ? 'Foreground' : ''
  grp.layerName = lay
  grp.findSubGraphParts().each(function (m: go.Part) {
    m.layerName = lay
  })
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

const poolGroupTemplate = make(
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
) // end poolGroupTemplate

// hide links between lanes when either lane is collapsed
function updateCrossLaneLinks(group: go.Group) {
  group.findExternalLinksConnected().each((l) => {
    l.visible = l.fromNode !== null && l.fromNode.isVisible() && l.toNode !== null && l.toNode.isVisible()
  })
}

const laneEventMenu = make<go.Adornment>( // context menu for each lane
  'ContextMenu',
  make(
    'ContextMenuButton',
    make(go.TextBlock, 'Add Lane'),
    // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
    {
      click: function (e: go.InputEvent, obj: go.GraphObject) {
        addLaneEvent((obj.part as go.Adornment).adornedObject as go.Node)
      }
    }
  )
)

function addLaneEvent(lane: go.Node) {
  const diagram = getDiagram() as go.Diagram
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

const swimLanesGroupTemplate = make(
  go.Group,
  'Spot',
  groupStyle(),
  {
    name: 'Lane',
    contextMenu: laneEventMenu,
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
          relayoutDiagram()
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

const groupTemplateMap = new go.Map<string, go.Group>()
// groupTemplateMap.add('subprocess', subProcessGroupTemplate)
groupTemplateMap.add('Lane', swimLanesGroupTemplate)
groupTemplateMap.add('Pool', poolGroupTemplate)

function init() {
  myDiagram = make(go.Diagram, 'myDiagramDiv', {
    nodeTemplate: defaultNodeMaker(),
    // linkTemplateMap: linkTemplateMap,
    groupTemplateMap: groupTemplateMap,

    commandHandler: new DrawCommandHandler(), // defined in DrawCommandHandler.js
    // default to having arrow keys move selected nodes
    'commandHandler.arrowKeyBehavior': 'move',

    mouseDrop: function () {
      const diagram = getDiagram() as go.Diagram
      // when the selection is dropped in the diagram's background,
      // make sure the selected Parts no longer belong to any Group
      const ok = diagram.commandHandler.addTopLevelParts(diagram.selection, true)
      if (!ok) diagram.currentTool.doCancel()
    },
    // resizingTool: new LaneResizingTool(myDiagram),
    linkingTool: new BPMNLinkingTool(), // defined in BPMNClasses.js
    relinkingTool: new BPMNRelinkingTool(), // defined in BPMNClasses.js
    SelectionMoved: relayoutDiagram, // defined below
    SelectionCopied: relayoutDiagram,
    LinkDrawn: function (e) {
      assignGroupLayer(e.subject.containingGroup)
    },
    LinkRelinked: function (e) {
      assignGroupLayer(e.subject.containingGroup)
    }
  })
  ;(myDiagram.toolManager.resizingTool = new LaneResizingTool(myDiagram)),
    myDiagram.addDiagramListener('LinkDrawn', function (e) {
      if (e.subject.fromNode.category === 'annotation') {
        e.subject.category = 'annotation' // annotation association
      } else if (e.subject.fromNode.category === 'dataobject' || e.subject.toNode.category === 'dataobject') {
        e.subject.category = 'data' // data association
      } else if (e.subject.fromNode.category === 'datastore' || e.subject.toNode.category === 'datastore') {
        e.subject.category = 'data' // data association
      }
    })

  //  uncomment this if you want a subprocess to expand on drop.  We decided we didn't like this behavior
  //  myDiagram.addDiagramListener("ExternalObjectsDropped", function(e) {
  //    // e.subject is the collection that was just dropped
  //    e.subject.each(function(part) {
  //        if (part instanceof go.Node && part.data.item === "end") {
  //          part.move(new go.Point(part.location.x  + 350, part.location.y))
  //        }
  //      });
  //    myDiagram.commandHandler.expandSubGraph();
  //  });

  // change the title to indicate that the diagram has been modified
  // myDiagram.addDiagramListener('Modified', function (e) {
  //   const diagram = getDiagram() as go.Diagram
  //   const currentFile = document.getElementById('currentFile') as HTMLDivElement
  //   const idx = currentFile.textContent!.indexOf('*')
  //   if (diagram.isModified) {
  //     if (idx < 0) currentFile.textContent = currentFile.textContent + '*'
  //   } else {
  //     if (idx >= 0) currentFile.textContent = currentFile.textContent!.substr(0, idx)
  //   }
  // })
}

onMounted(() => {
  init()

  nextTick(() => {
    const diagram = getDiagram() as go.Diagram
    const data = {
      class: 'go.GraphLinksModel',
      copiesArrays: true,
      copiesArrayObjects: true,
      linkFromPortIdProperty: 'fromPort',
      linkToPortIdProperty: 'toPort',
      modelData: {
        position: '186.6328613281251 -77.5'
      },
      nodeDataArray: [
        {
          category: 'event',
          item: 'start',
          key: 101,
          loc: '270 270',
          name: 'Goodsto Ship',
          eventType: 1,
          eventDimension: 1,
          group: -12
        },
        {
          category: 'event',
          item: 'End',
          key: 104,
          loc: '1420 470',
          name: 'End',
          eventType: 1,
          eventDimension: 8,
          group: -13
        },
        {
          category: 'activity',
          item: 'generic task',
          key: 5,
          loc: '1290 470',
          name: 'Add paperwork\nand move\npackage to\npick area',
          taskType: 0,
          boundaryEventArray: [],
          group: -13
        },
        {
          category: 'activity',
          item: 'generic task',
          key: -4,
          loc: '720 140',
          name: 'Check if extra insurance is necessary',
          taskType: 0,
          boundaryEventArray: [],
          group: -12
        },
        {
          category: 'activity',
          item: 'generic task',
          key: -5,
          loc: '490 270',
          name: 'Decide if \nnormal post or\nspecial\nshipment',
          taskType: 0,
          boundaryEventArray: [],
          group: -12
        },
        {
          category: 'activity',
          item: 'generic task',
          key: -6,
          loc: '540 470',
          name: 'Package Goods',
          taskType: 0,
          boundaryEventArray: [],
          group: -13
        },
        {
          category: 'annotation',
          key: 701,
          loc: '556.9999999999995 -37.00000000000042',
          name: 'OMG BPMN 2.0 by Example. \nFigure 5.1 Shipment Process of a Hardware Retailer',
          group: -11
        },
        {
          key: '501',
          name: 'Hardware Retailer',
          isGroup: 'true',
          category: 'Pool',
          loc: '217.2106933593751 -72'
        },
        {
          category: 'Lane',
          text: 'Logistics Manager',
          color: '#ddd',
          isGroup: true,
          loc: '217.2106933593751 -72',
          group: '501',
          key: -11,
          size: '1299.992431640625 129'
        },
        {
          category: 'Lane',
          text: 'Clerk',
          color: 'white',
          isGroup: true,
          loc: '217.2106933593751 58',
          group: '501',
          key: -12,
          size: '1299.992431640625 334'
        },
        {
          category: 'Lane',
          text: 'WarehouseWorker',
          color: 'white',
          isGroup: true,
          loc: '217.2106933593751 393',
          group: '501',
          key: -13,
          size: '1299.992431640625 153.57783203124995'
        },
        {
          key: 201,
          category: 'gateway',
          text: '',
          gatewayType: 1,
          group: -12,
          loc: '360 270'
        },
        {
          key: 204,
          category: 'gateway',
          text: 'Mode of\nDelivery',
          gatewayType: 4,
          group: -12,
          loc: '630 270'
        },
        {
          key: 131,
          category: 'activity',
          text: 'Request Quotes from carriers',
          item: 'generic task',
          taskType: 0,
          group: -12,
          loc: '830 270'
        },
        {
          key: 301,
          category: 'gateway',
          gatewayType: 2,
          text: '',
          group: -12,
          loc: '850 140'
        },
        {
          key: -16,
          category: 'activity',
          text: 'Take out extra\ninsurance',
          item: 'generic task',
          taskType: 0,
          group: -11,
          loc: '1000 -20'
        },
        {
          key: -17,
          category: 'activity',
          text: 'Fill in \nPost Label',
          item: 'generic task',
          taskType: 0,
          group: -12,
          loc: '1010 140'
        },
        {
          key: -19,
          category: 'gateway',
          gatewayType: 2,
          text: '',
          group: -12,
          loc: '1150 140'
        },
        {
          key: -20,
          category: 'activity',
          text: 'Assign a \ncarrier & prepare papperwork',
          item: 'generic task',
          taskType: 0,
          group: -12,
          loc: '1010 270'
        },
        {
          key: -21,
          category: 'gateway',
          text: '',
          gatewayType: 4,
          group: -12,
          loc: '1160 270'
        },
        {
          key: -22,
          category: 'annotation',
          text: 'insurance included',
          loc: '956.2031249999999 356.0389160156248',
          group: -12
        },
        {
          key: -23,
          category: 'gateway',
          text: '',
          gatewayType: 1,
          group: -13,
          loc: '1160 470'
        }
      ],
      linkDataArray: [
        {
          from: 5,
          to: 104,
          fromPort: '',
          toPort: '',
          points: [
            1349.9999999999998, 470.0000000000001, 1359.9999999999998, 470.0000000000001, 1368.5, 470.0000000000001,
            1368.5, 469.99999999999994, 1377, 469.99999999999994, 1397, 469.99999999999994
          ]
        },
        {
          from: 101,
          to: 201,
          fromPort: '',
          toPort: '',
          points: [291.5, 270, 301.5, 270, 301.5, 270, 299.5, 270, 299.5, 270, 319.5, 270]
        },
        {
          from: 201,
          to: -6,
          fromPort: '',
          toPort: '',
          visible: true,
          points: [
            360, 310.5, 360, 320.5, 360, 332, 360, 332, 360, 470, 460.0000000000002, 470, 480.0000000000002, 470
          ],
          text: ''
        },
        {
          from: 201,
          to: -5,
          fromPort: '',
          toPort: '',
          visible: true,
          points: [
            400.5, 270, 410.5, 270, 410.5, 270, 409.99999999999983, 270, 409.99999999999983, 270, 429.99999999999983,
            270
          ],
          text: ''
        },
        {
          from: -5,
          to: 204,
          fromPort: '',
          toPort: '',
          points: [
            549.9999999999998, 270, 559.9999999999998, 270, 564.7499999999998, 270, 564.7499999999998, 270,
            569.4999999999998, 270, 589.4999999999998, 270
          ]
        },
        {
          from: 204,
          to: -4,
          fromPort: '',
          toPort: '',
          visible: true,
          points: [
            629.9999999999998, 229.5, 629.9999999999998, 219.5, 629.9999999999998, 140.00000000000006, 635,
            140.00000000000006, 640.0000000000001, 140.00000000000006, 660.0000000000001, 140.00000000000006
          ],
          text: 'Normal\nPost'
        },
        {
          from: 204,
          to: 131,
          fromPort: '',
          toPort: '',
          visible: true,
          points: [
            670.4999999999998, 270, 680.4999999999998, 270, 715.25, 270, 715.25, 270.00000000000006, 750.0000000000001,
            270.00000000000006, 770.0000000000001, 270.00000000000006
          ],
          text: 'Special\nCarrier'
        },
        {
          from: -4,
          to: 301,
          fromPort: '',
          toPort: '',
          points: [
            780.0000000000001, 140.00000000000006, 790.0000000000001, 140.00000000000006, 790.0000000000001, 140, 789.5,
            140, 789.5, 139.99999999999997, 809.5, 139.99999999999997
          ]
        },
        {
          from: 301,
          to: -16,
          fromPort: '',
          toPort: '',
          visible: true,
          points: [
            850, 99.49999999999997, 850, 89.49999999999997, 850, -20, 885, -20, 919.9999999999999, -20,
            939.9999999999999, -20
          ],
          text: 'extra insurance\nrequired'
        },
        {
          from: 301,
          to: -17,
          fromPort: '',
          toPort: '',
          visible: true,
          points: [
            890.5, 139.99999999999997, 900.5, 139.99999999999997, 915.2499999999998, 139.99999999999997,
            915.2499999999998, 140.00000000000006, 929.9999999999995, 140.00000000000006, 949.9999999999995,
            140.00000000000006
          ],
          text: 'Always'
        },
        {
          from: -17,
          to: -19,
          fromPort: '',
          toPort: '',
          points: [
            1069.9999999999995, 140.00000000000006, 1079.9999999999995, 140.00000000000006, 1084.7499999999995,
            140.00000000000006, 1084.7499999999995, 139.99999999999997, 1089.4999999999998, 139.99999999999997,
            1109.4999999999998, 139.99999999999997
          ]
        },
        {
          from: -16,
          to: -19,
          fromPort: '',
          toPort: '',
          points: [
            1060, -20, 1070, -20, 1149.9999999999998, -20, 1149.9999999999998, 29.749999999999986, 1149.9999999999998,
            79.49999999999997, 1149.9999999999998, 99.49999999999997
          ]
        },
        {
          from: 131,
          to: -20,
          fromPort: '',
          toPort: '',
          points: [
            890.0000000000001, 270.00000000000006, 900.0000000000001, 270.00000000000006, 914.9999999999999,
            270.00000000000006, 914.9999999999999, 270, 929.9999999999997, 270, 949.9999999999997, 270
          ]
        },
        {
          from: -20,
          to: -21,
          fromPort: '',
          toPort: '',
          points: [
            1069.9999999999995, 270, 1079.9999999999995, 270, 1089.7499999999998, 270, 1089.7499999999998, 270, 1099.5,
            270, 1119.5, 270
          ]
        },
        {
          from: -19,
          to: -21,
          fromPort: '',
          toPort: '',
          visible: true,
          points: [
            1149.9999999999998, 180.49999999999997, 1149.9999999999998, 190.49999999999997, 1149.9999999999998, 200,
            1160, 200, 1160, 209.5, 1160, 229.5
          ],
          text: ''
        },
        {
          from: -22,
          to: 131,
          fromPort: '',
          toPort: '',
          category: 'annotation',
          points: [
            896.0004882812499, 356.0389160156248, 856.0004882812499, 356.0389160156248, 830.0000000000001,
            330.00000000000006, 830.0000000000001, 310.00000000000006
          ]
        },
        {
          from: -23,
          to: 5,
          fromPort: '',
          toPort: '',
          visible: true,
          points: [
            1200.4999999999998, 469.99999999999994, 1210.4999999999998, 469.99999999999994, 1210.4999999999998, 470,
            1209.9999999999998, 470, 1209.9999999999998, 470.0000000000001, 1229.9999999999998, 470.0000000000001
          ],
          text: ''
        },
        {
          from: -6,
          to: -23,
          fromPort: '',
          toPort: '',
          points: [
            600.0000000000002, 470, 610.0000000000002, 470, 854.75, 470, 854.75, 469.99999999999994, 1099.4999999999998,
            469.99999999999994, 1119.4999999999998, 469.99999999999994
          ]
        },
        {
          from: -21,
          to: -23,
          fromPort: '',
          toPort: '',
          visible: true,
          points: [
            1160, 310.5, 1160, 320.5, 1160, 332, 1160, 332, 1160, 348, 1159.9999999999998, 348, 1159.9999999999998,
            409.49999999999994, 1159.9999999999998, 429.49999999999994
          ],
          text: ''
        }
      ]
    }
    diagram.model = go.Model.fromJson(data)
  })
})
</script>

<style lang="less" scoped>
#myDiagramDiv {
  border: solid 1px gray;
  border-left: none;
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>
