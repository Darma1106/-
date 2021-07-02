<template>
  <div style="position: relative; height: 90%">
    <div ref="activeModelRef" class="active-model"></div>
    <div ref="editRef" class="editor"></div>
  </div>
  <button style="border: 2px solid blue" @click="show">show Json</button>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, Ref, ref } from 'vue'
import { unrefElement } from '@vueuse/core'
import * as go from 'gojs'

import type { Template } from './type'

const make = go.GraphObject.make

export default defineComponent({
  name: '',
  components: {},
  props: {
    nodeMap: {
      type: Array as PropType<Template<go.Node>[]>
    }
  },
  setup(props) {
    const activeModelRef: Ref<HTMLDivElement | null> = ref(null)
    const editRef: Ref<HTMLDivElement | null> = ref(null)
    let diagram: go.Diagram | null = null

    function init(templeteRef: HTMLDivElement): go.Diagram {
      const myDiagram = make(go.Diagram, templeteRef, {
        padding: 20, // extra space when scrolled all the way
        grid: make(
          go.Panel,
          'Grid', // a simple 10x10 grid
          make(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
          make(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.5 })
        ),
        'draggingTool.isGridSnapEnabled': true,
        handlesDragDropForTopLevelParts: true,
        mouseDrop: function (e: go.InputEvent) {
          // when the selection is dropped in the diagram's background,
          // make sure the selected Parts no longer belong to any Group
          const ok = e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true)
          if (!ok) e.diagram.currentTool.doCancel()
        },
        // commandHandler: make(DrawCommandHandler), // support offset copy-and-paste
        'clickCreatingTool.archetypeNodeData': { text: 'NEW NODE' }, // create a new node by double-clicking in background
        PartCreated: function (e: go.DiagramEvent) {
          const node = e.subject // the newly inserted Node -- now need to snap its location to the grid
          node.location = node.location.copy().snapToGridPoint(e.diagram.grid.gridOrigin, e.diagram.grid.gridCellSize)
          setTimeout(function () {
            // and have the user start editing its text
            e.diagram.commandHandler.editTextBlock()
          }, 20)
        },
        'commandHandler.archetypeGroupData': { isGroup: true, text: 'NEW GROUP' },
        SelectionGrouped: function (e: go.DiagramEvent) {
          const group = e.subject
          setTimeout(function () {
            // and have the user start editing its text
            e.diagram.commandHandler.editTextBlock()
          })
        },
        LinkRelinked: function (e) {
          // re-spread the connections of other links connected with both old and new nodes
          const oldnode = e.parameter.part
          oldnode.invalidateConnectedLinks()
          const link = e.subject
          if (e.diagram.toolManager.linkingTool.isForwards) {
            link.toNode.invalidateConnectedLinks()
          } else {
            link.fromNode.invalidateConnectedLinks()
          }
        },
        'undoManager.isEnabled': true
      })

      myDiagram.nodeTemplate = make(
        go.Node,
        'Auto',
        {
          locationSpot: go.Spot.Center,
          locationObjectName: 'SHAPE',
          desiredSize: new go.Size(120, 60),
          minSize: new go.Size(40, 40),
          resizable: true,
          resizeCellSize: new go.Size(20, 20)
        },
        // these Bindings are TwoWay because the DraggingTool and ResizingTool modify the target properties
        new go.Binding('location', 'locate', go.Point.parse).makeTwoWay(go.Point.stringify),
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
          new go.Binding('strokeWidth', 'weight'),
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

      myDiagram.nodeTemplate.toolTip = make(
        'ToolTip', // show some detailed information
        make(
          go.Panel,
          'Vertical',
          { maxSize: new go.Size(200, NaN) }, // limit width but not height
          make(go.TextBlock, { font: 'bold 10pt sans-serif', textAlign: 'center' }, new go.Binding('text')),
          make(go.TextBlock, { font: '10pt sans-serif', textAlign: 'center' }, new go.Binding('text', 'details'))
        )
      )

      myDiagram.nodeTemplate.contextMenu = make(
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
        // make(
        //   'ContextMenuButton',
        //   make(
        //     go.Panel,
        //     'Horizontal',
        //     FigureButton('Parallelogram2'),
        //     FigureButton('ManualOperation'),
        //     FigureButton('Procedure'),
        //     FigureButton('Cylinder1')
        //   )
        // ),
        // make(
        //   'ContextMenuButton',
        //   make(
        //     go.Panel,
        //     'Horizontal',
        //     FigureButton('Terminator'),
        //     FigureButton('CreateRequest'),
        //     FigureButton('Document'),
        //     FigureButton('TriangleDown')
        //   )
        // ),
        LightFillButtons(),
        DarkColorButtons(),
        StrokeOptionsButtons()
      )

      myDiagram.nodeTemplate.selectionAdornmentTemplate = make(
        go.Adornment,
        'Spot',
        make(go.Placeholder, { padding: 10 }),
        makeArrowButton(go.Spot.Top, 'TriangleUp'),
        makeArrowButton(go.Spot.Left, 'TriangleLeft'),
        makeArrowButton(go.Spot.Right, 'TriangleRight'),
        makeArrowButton(go.Spot.Bottom, 'TriangleDown'),
        CMButton({ alignment: new go.Spot(0.75, 0) })
      )

      // Group模板

      myDiagram.groupTemplate = make(
        go.Group,
        'Spot',
        {
          layerName: 'Background',
          ungroupable: true,
          locationSpot: go.Spot.Center,
          selectionObjectName: 'BODY',
          computesBoundsAfterDrag: true, // allow dragging out of a Group that uses a Placeholder
          handlesDragDropForMembers: true, // don't need to define handlers on Nodes and Links
          mouseDrop: function (__e: go.InputEvent, grp: go.GraphObject) {
            // 动态增加、减少group的元素
            if (grp.diagram) {
              const ok = (grp as go.Group).addMembers(grp.diagram.selection, true)
              if (!ok) grp.diagram.currentTool.doCancel()
            }
          },
          avoidable: false
        },
        new go.Binding('location', 'locate', go.Point.parse).makeTwoWay(go.Point.stringify),
        make(
          go.Panel,
          'Auto',
          { name: 'BODY' },
          make(
            go.Shape,
            {
              parameter1: 10,
              fill: 'white',
              strokeWidth: 2,
              portId: '',
              cursor: 'pointer',
              fromLinkable: true,
              toLinkable: true,
              fromLinkableDuplicates: true,
              toLinkableDuplicates: true,
              fromSpot: go.Spot.AllSides,
              toSpot: go.Spot.AllSides
            },
            new go.Binding('fill'),
            new go.Binding('stroke', 'color'),
            new go.Binding('strokeWidth', 'weight'),
            new go.Binding('strokeDashArray', 'dash')
          ),
          make(go.Placeholder, { background: 'transparent', margin: 10 })
        ),
        make(
          go.TextBlock,
          {
            alignment: go.Spot.Top,
            alignmentFocus: go.Spot.Bottom,
            font: 'bold 12pt sans-serif',
            editable: true
          },
          new go.Binding('text'),
          new go.Binding('stroke', 'color')
        )
      )

      myDiagram.groupTemplate.selectionAdornmentTemplate = make(
        go.Adornment,
        'Spot',
        make(
          go.Panel,
          'Auto',
          make(go.Shape, { fill: null, stroke: 'dodgerblue', strokeWidth: 3 }),
          make(go.Placeholder, { margin: 1.5 })
        ),
        CMButton({ alignment: go.Spot.TopRight, alignmentFocus: go.Spot.BottomRight })
      )

      myDiagram.groupTemplate.contextMenu = make(
        'ContextMenu',
        LightFillButtons(),
        DarkColorButtons(),
        StrokeOptionsButtons()
      )
      // Link模板

      myDiagram.linkTemplate = make(
        go.Link,
        {
          layerName: 'Foreground',
          routing: go.Link.AvoidsNodes,
          corner: 10,
          toShortLength: 4, // assume arrowhead at "to" end, need to avoid bad appearance when path is thick
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true
        },
        new go.Binding('fromSpot', 'fromSpot', go.Spot.parse),
        new go.Binding('toSpot', 'toSpot', go.Spot.parse),
        new go.Binding('fromShortLength', 'dir', function (dir) {
          return dir === 2 ? 4 : 0
        }),
        new go.Binding('toShortLength', 'dir', function (dir) {
          return dir >= 1 ? 4 : 0
        }),
        new go.Binding('points').makeTwoWay(), // TwoWay due to user reshaping with LinkReshapingTool
        make(
          go.Shape,
          { strokeWidth: 2 },
          new go.Binding('stroke', 'color'),
          new go.Binding('strokeWidth', 'weight'),
          new go.Binding('strokeDashArray', 'dash')
        ),
        make(
          go.Shape,
          { fromArrow: 'OpposingDirectionDoubleArrow', strokeWidth: 0, scale: 4 / 3, visible: false },
          new go.Binding('visible', 'dir', function (dir) {
            return dir === 2
          }),
          new go.Binding('fill', 'color'),
          new go.Binding('fromArrow'),
          new go.Binding('scale', 'weight', function (t) {
            return (2 + t) / 3
          })
        ),
        make(
          go.Shape,
          { toArrow: 'Diamond', strokeWidth: 0, scale: 4 / 3 },
          new go.Binding('visible', 'dir', function (dir) {
            return dir >= 1
          }),
          new go.Binding('fill', 'color'),
          new go.Binding('toArrow'),
          new go.Binding('scale', 'weight', function (t) {
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

      myDiagram.linkTemplate.selectionAdornmentTemplate = make(
        go.Adornment, // use a special selection Adornment that does not obscure the link path itself
        make(
          go.Shape,
          {
            // this uses a pathPattern with a gap in it, in order to avoid drawing on top of the link path Shape
            isPanelMain: true,
            stroke: 'transparent',
            strokeWidth: 6,
            pathPattern: makeAdornmentPathPattern(2) // == weight or strokeWidth
          },
          new go.Binding('pathPattern', 'weight', makeAdornmentPathPattern)
        ),
        CMButton({ alignmentFocus: new go.Spot(0, 0, -6, -4) })
      )

      myDiagram.linkTemplate.contextMenu = make(
        'ContextMenu',
        DarkColorButtons(),
        StrokeOptionsButtons(),
        make('ContextMenuButton', make(go.Panel, 'Horizontal', ArrowButton(0), ArrowButton(1), ArrowButton(2))),
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

      const data = {
        class: 'GraphLinksModel',
        nodeDataArray: [
          { key: 1, locate: '0 0', text: 'Alpha', details: 'some information about Alpha and its importance' },
          { key: 2, locate: '170 0', text: 'Beta', color: 'blue', weight: 2, figure: 'Procedure' },
          { key: 3, locate: '0 100', text: 'Gamma', color: 'green', figure: 'Cylinder1' },
          { key: 4, locate: '80 180', text: 'Delta', color: 'red', figure: 'Terminator', size: '80 40' },
          { key: 5, locate: '350 -50', text: 'Zeta', group: 7, color: 'blue', figure: 'CreateRequest' },
          { key: 6, locate: '350 50', text: 'Eta', group: 7, figure: 'Document', fill: 'lightyellow' },
          { key: 7, isGroup: true, text: 'Theta', color: 'green', fill: 'lightgreen' },
          { key: 8, locate: '520 50', text: 'Iota', fill: 'pink' }
        ],
        linkDataArray: [
          { from: 1, to: 2, dash: [3, 6], weight: 4 },
          { from: 1, to: 3, dash: [2, 4], color: 'green', text: 'label' },
          {
            from: 3,
            to: 4,
            color: 'red',
            text: 'a red label',
            fromSpot: 'RightSide',
            toArrow: 'OpposingDirectionDoubleArrow'
          },
          { from: 2, to: 1 },
          { from: 5, to: 6, text: 'in a group' },
          { from: 2, to: 7 },
          { from: 6, to: 8, dir: 0 },
          { from: 6, to: 8, dir: 1 },
          { from: 6, to: 8, dir: 2 }
        ]
      }

      myDiagram.model = go.Model.fromJson(data)

      return myDiagram
    }

    // 箭头数量设置
    function ArrowButton(num: number) {
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
        mouseEnter: function (__e: go.InputEvent, shape: go.GraphObject) {
          shape.background = 'dodgerblue'
        },
        mouseLeave: function (__e: go.InputEvent, shape: go.GraphObject) {
          shape.background = 'transparent'
        },
        click: ClickFunction('dir', num),
        contextClick: ClickFunction('dir', num)
      })
    }

    // 全方向按钮(中心)
    function AllSidesButton(to: boolean) {
      const setter = function (e: go.InputEvent, shape: go.GraphObject) {
        e.handled = true
        e.diagram.model.commit(function (m) {
          const link: go.Link | null = (shape.part as go.Adornment).adornedPart as go.Link
          if (link && link.toNode && link.fromNode) {
            m.set(link.data, to ? 'toSpot' : 'fromSpot', go.Spot.stringify(go.Spot.AllSides))
            // re-spread the connections of other links connected with the node
            ;(to ? link.toNode : link.fromNode).invalidateConnectedLinks()
          }
        })
      }
      return make(go.Shape, {
        width: 12,
        height: 12,
        fill: 'transparent',
        mouseEnter: function (__e: go.InputEvent, shape: go.GraphObject) {
          shape.background = 'dodgerblue'
        },
        mouseLeave: function (__e: go.InputEvent, shape: go.GraphObject) {
          shape.background = 'transparent'
        },
        click: setter,
        contextClick: setter
      })
    }

    function SpotButton(spot: go.Spot, to: boolean) {
      // 图标角度
      let angle = 0
      let side = go.Spot.RightSide
      if (spot.equals(go.Spot.Top)) {
        angle = 270
        side = go.Spot.TopSide
      } else if (spot.equals(go.Spot.Left)) {
        angle = 180
        side = go.Spot.LeftSide
      } else if (spot.equals(go.Spot.Bottom)) {
        angle = 90
        side = go.Spot.BottomSide
      }
      if (!to) angle -= 180
      const setter = function (e: go.InputEvent, shape: go.GraphObject) {
        e.handled = true
        e.diagram.model.commit(function (m) {
          const link: go.Link | null = (shape.part as go.Adornment).adornedPart as go.Link
          if (link && link.toNode && link.fromNode) {
            m.set(link.data, to ? 'toSpot' : 'fromSpot', go.Spot.stringify(side))
            // re-spread the connections of other links connected with the node
            ;(to ? link.toNode : link.fromNode).invalidateConnectedLinks()
          }
        })
      }
      return make(go.Shape, {
        alignment: spot,
        alignmentFocus: spot.opposite(),
        geometryString: 'M0 0 M12 12 M12 6 L1 6 L4 4 M1 6 L4 8',
        angle: angle,
        background: 'transparent',
        mouseEnter: function (__e: go.InputEvent, shape: go.GraphObject) {
          shape.background = 'dodgerblue'
        },
        mouseLeave: function (__e: go.InputEvent, shape: go.GraphObject) {
          shape.background = 'transparent'
        },
        click: setter,
        contextClick: setter
      })
    }

    // 路径辅助
    function makeAdornmentPathPattern(width: number) {
      return make(go.Shape, {
        stroke: 'dodgerblue',
        strokeWidth: 2,
        strokeCap: 'square',
        geometryString: 'M0 0 M4 2 H3 M4 ' + (width + 4).toString() + ' H3'
      })
    }

    function DarkColorButtons() {
      // used by multiple context menus
      return [
        make(
          'ContextMenuButton',
          make(
            go.Panel,
            'Horizontal',
            ColorButton('black'),
            ColorButton('green'),
            ColorButton('blue'),
            ColorButton('red')
          )
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

    // Create a context menu button for setting a data property with a stroke width value.
    function ThicknessButton(sw: number, propname = 'weight') {
      return make(go.Shape, 'LineH', {
        width: 16,
        height: 16,
        strokeWidth: sw,
        margin: 1,
        background: 'transparent',
        mouseEnter: function (__e: go.InputEvent, shape: go.GraphObject) {
          ;(shape as go.Shape).background = 'dodgerblue'
        },
        mouseLeave: function (__e: go.InputEvent, shape: go.GraphObject) {
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
        mouseEnter: function (__e: go.InputEvent, shape: go.GraphObject) {
          ;(shape as go.Shape).background = 'dodgerblue'
        },
        mouseLeave: function (__e: go.InputEvent, shape: go.GraphObject) {
          ;(shape as go.Shape).background = 'transparent'
        },
        click: ClickFunction(propname, dash),
        contextClick: ClickFunction(propname, dash)
      })
    }

    function StrokeOptionsButtons() {
      // used by multiple context menus
      return [
        make(
          'ContextMenuButton',
          make(go.Panel, 'Horizontal', ThicknessButton(1), ThicknessButton(2), ThicknessButton(3), ThicknessButton(4))
        ),
        make(
          'ContextMenuButton',
          make(go.Panel, 'Horizontal', DashButton(null), DashButton([2, 4]), DashButton([4, 4]))
        )
      ]
    }

    function FigureButton(fig: string, propname = 'figure') {
      return make(go.Shape, {
        width: 32,
        height: 32,
        scale: 0.5,
        fill: 'lightgray',
        figure: fig,
        margin: 1,
        background: 'transparent',
        mouseEnter: (__e: go.InputEvent, shape: go.GraphObject): void => {
          ;(shape as go.Shape).fill = 'dodgerblue'
        },
        mouseLeave: (__e: go.InputEvent, shape: go.GraphObject): void => {
          ;(shape as go.Shape).fill = 'lightgray'
        },
        click: ClickFunction(propname, fig),
        contextClick: ClickFunction(propname, fig)
      })
    }

    // 颜色填充菜单
    function LightFillButtons() {
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
    function ColorButton(color: string, propname = 'color') {
      return make(go.Shape, {
        width: 16,
        height: 16,
        stroke: 'lightgray',
        fill: color,
        margin: 1,
        background: 'transparent',
        mouseEnter: function (__e: go.InputEvent, shape: go.GraphObject) {
          ;(shape as go.Shape).stroke = 'dodgerblue'
        },
        mouseLeave: function (__e: go.InputEvent, shape: go.GraphObject) {
          ;(shape as go.Shape).stroke = 'lightgray'
        },
        click: ClickFunction(propname, color),
        contextClick: ClickFunction(propname, color)
      })
    }

    function ClickFunction(propname: string, value: string | number | number[] | null) {
      return function (e: go.InputEvent, obj: go.GraphObject) {
        e.handled = true // don't let the click bubble up
        e.diagram.model.commit(function (model) {
          model.set((obj.part as go.Adornment).adornedPart?.data, propname, value)
        })
      }
    }

    // 四周拓展 fig是拓展按钮形状
    function makeArrowButton(spot: go.Spot, fig: string) {
      const maker = function (e: go.InputEvent, shape: go.GraphObject) {
        e.handled = true
        e.diagram.model.commit(function (model: go.Model) {
          // 此m其实为GraphLinksModel类型
          const graphLinksModel: go.GraphLinksModel = model as go.GraphLinksModel
          const selectNode: go.Part | null = (shape.part as go.Adornment).adornedPart
          // 排除selnode为null的情况
          if (selectNode) {
            // 在Node的Spot方向上创建一个新节点
            const point = new go.Point().setRectSpot(selectNode.actualBounds, spot)
            point.subtract(selectNode.location)
            point.scale(2, 2)
            point.x += Math.sign(point.x) * 60
            point.y += Math.sign(point.y) * 60
            point.add(selectNode.location)
            point.snapToGridPoint(e.diagram.grid.gridOrigin, e.diagram.grid.gridCellSize)
            // 将Node的信息复制到新的Node
            const nodeData = graphLinksModel.copyNodeData(selectNode.data)
            // 排除nodeData为null的情况
            if (nodeData) {
              // 将新Node加入至原Node的Group里面
              graphLinksModel.setGroupKeyForNodeData(nodeData, graphLinksModel.getGroupKeyForNodeData(selectNode.data))
              graphLinksModel.addNodeData(nodeData) // 将Node数据加入到Model
              // 创建一条连接两个Node的Link
              const linkdata = { from: selectNode.key, to: graphLinksModel.getKeyForNodeData(nodeData) }
              graphLinksModel.addLinkData(linkdata) // 将Link数据加入到Model
              // 将新Node移动到目标位置并进入编辑模式
              const newNode = e.diagram.findNodeForData(nodeData)
              // 排除newNode为null的情况
              if (newNode) {
                newNode.location = point
                e.diagram.select(newNode)
                setTimeout(function () {
                  e.diagram.commandHandler.editTextBlock()
                }, 20)
              }
            }
          }
        })
      }
      return make(go.Shape, {
        figure: fig,
        alignment: spot,
        alignmentFocus: spot.opposite(),
        width: spot.equals(go.Spot.Top) || spot.equals(go.Spot.Bottom) ? 36 : 18,
        height: spot.equals(go.Spot.Top) || spot.equals(go.Spot.Bottom) ? 18 : 36,
        fill: 'orange',
        strokeWidth: 0,
        isActionable: true, // needed because it's in an Adornment
        click: maker,
        contextClick: maker
      })
    }

    // create a button that brings up the context menu
    function CMButton(options: any) {
      return make(
        go.Shape,
        {
          fill: 'orange',
          stroke: 'gray',
          background: 'transparent',
          geometryString: 'F1 M0 0 M0 4h4v4h-4z M6 4h4v4h-4z M12 4h4v4h-4z M0 12',
          isActionable: true,
          cursor: 'context-menu',
          click: function (e: go.InputEvent, shape: go.GraphObject) {
            const adornedPart = (shape.part as go.Adornment).adornedPart
            if (adornedPart) {
              e.diagram.commandHandler.showContextMenu(adornedPart)
            }
          }
        },
        options || {}
      )
    }

    // 获取节点模板,加入nodeMap
    function getTemplateModel() {
      const model: { text: string; category: string }[] = []
      props.nodeMap?.forEach(({ name }) => {
        model.push({ text: 'text', category: name })
      })
      return model
    }

    function getDiagram(): go.Diagram {
      return diagram as go.Diagram
    }

    const show = () => {
      if (diagram) {
        console.log(diagram.model.toJson())
      }
    }

    onMounted(() => {
      diagram = init(unrefElement(activeModelRef))
    })
    return { activeModelRef, editRef, getDiagram, show }
  }
})
</script>

<style lang="less" scope>
.active-model {
  height: 100vh;
  border: 2px solid red;
}
.editor {
  width: 105px;
  height: 100%;
  margin-right: 2px;
  background-color: whitesmoke;
  border: solid 1px black;
  position: absolute;
  top: 0;
  z-index: 9999;
}
</style>
