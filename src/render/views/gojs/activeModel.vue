<template>
  <div style="position: relative; height: 100%">
    <div ref="activeModelRef" class="active-model">123</div>
    <div ref="editRef" class="editor"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue'
import { unrefElement } from '@vueuse/core'
import * as go from 'gojs'

const make = go.GraphObject.make

export default defineComponent({
  name: '',
  components: {},
  setup() {
    const activeModelRef: Ref<HTMLDivElement | null> = ref(null)
    const editRef: Ref<HTMLDivElement | null> = ref(null)

    // 给节点添加接口
    function makePort(name: string, align: go.Spot, spot: go.Spot, output: boolean, input: boolean, visible = true) {
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

    function nodeStyle() {
      return [
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          // the Node.location is at the center of each node
          locationSpot: go.Spot.Center
        }
      ]
    }

    function textStyle() {
      return {
        font: 'bold 11pt Helvetica, Arial, sans-serif',
        stroke: 'black'
      }
    }

    function init(templeteRef: HTMLDivElement): go.Diagram {
      const myDiagram = make(
        go.Diagram,
        templeteRef,
        {
          ChangedSelection: (a) => {
            console.log(a.diagram.selection.first()?.location)
          }
        }
        // {
        //   grid: make(
        //     go.Panel,
        //     'Grid',
        //     make(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
        //     make(go.Shape, 'LineH', { stroke: 'gray', strokeWidth: 0.5, interval: 10 }),
        //     make(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.5 }),
        //     make(go.Shape, 'LineV', { stroke: 'gray', strokeWidth: 0.5, interval: 10 })
        //   ),
        //   'draggingTool.dragsLink': true,
        //   'draggingTool.isGridSnapEnabled': true,
        //   'linkingTool.isUnconnectedLinkValid': true,
        //   'linkingTool.portGravity': 20,
        //   'relinkingTool.isUnconnectedLinkValid': true,
        //   'relinkingTool.portGravity': 20,
        //   'relinkingTool.fromHandleArchetype': make(go.Shape, 'Diamond', {
        //     segmentIndex: 0,
        //     cursor: 'pointer',
        //     desiredSize: new go.Size(8, 8),
        //     fill: 'tomato',
        //     stroke: 'darkred'
        //   }),
        //   'relinkingTool.toHandleArchetype': make(go.Shape, 'Diamond', {
        //     segmentIndex: -1,
        //     cursor: 'pointer',
        //     desiredSize: new go.Size(8, 8),
        //     fill: 'darkred',
        //     stroke: 'tomato'
        //   }),
        //   'linkReshapingTool.handleArchetype': make(go.Shape, 'Diamond', {
        //     desiredSize: new go.Size(7, 7),
        //     fill: 'lightblue',
        //     stroke: 'deepskyblue'
        //   })
        // }
      )
      // 活动节点

      myDiagram.nodeTemplateMap.add(
        'activeModel',
        make(
          go.Node,
          'Table',
          nodeStyle(),
          // { locationSpot: go.Spot.Center },
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          make(
            go.Panel,
            'Auto',
            make(go.Shape, 'RoundedRectangle', { fill: '#CADAA9', strokeWidth: 0, width: 80, height: 80 }),
            make(
              go.TextBlock,
              textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding('text').makeTwoWay()
            )
          ),
          // four named ports, one on each side:
          makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
          makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
          makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
          makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
        )
      )

      const linkSelectionAdornmentTemplate = make(
        go.Adornment,
        'Link',
        make(
          go.Shape,
          // isPanelMain declares that this Shape shares the Link.geometry
          { isPanelMain: true, fill: null, stroke: 'deepskyblue', strokeWidth: 0 }
        ) // use selection object's strokeWidth
      )

      myDiagram.linkTemplate = make(
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

      //渲染面板
      make(
        go.Palette,
        unrefElement(editRef), // must name or refer to the DIV HTML element
        {
          maxSelectionCount: 1,
          nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
          // simplify the link template, just in this Palette
          linkTemplate: make(
            go.Link,
            {
              // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
              // to line up the Link in the same manner we have to pretend the Link has the same location spot
              locationSpot: go.Spot.Center,
              selectionAdornmentTemplate: make(
                go.Adornment,
                'Link',
                { locationSpot: go.Spot.Center },
                make(go.Shape, { isPanelMain: true, fill: null, stroke: 'deepskyblue', strokeWidth: 0 }),
                make(
                  go.Shape, // the arrowhead
                  { toArrow: 'Standard', stroke: null }
                )
              )
            },
            {
              routing: go.Link.AvoidsNodes,
              curve: go.Link.JumpOver,
              corner: 5,
              toShortLength: 4
            },
            new go.Binding('points'),
            make(
              go.Shape, // the link path shape
              { isPanelMain: true, strokeWidth: 2 }
            ),
            make(
              go.Shape, // the arrowhead
              { toArrow: 'Standard', stroke: null }
            )
          ),
          model: new go.GraphLinksModel([{ text: 'text', category: 'activeModel' }])
        }
      )

      return myDiagram
    }

    onMounted(() => {
      // console.log(activeModelRef, 'activeModelRef.value ')

      const diagram = init(unrefElement(activeModelRef))
      diagram.model = make(go.GraphLinksModel, {
        nodeDataArray: [
          { category: 'activeModel', text: 'Alpha', loc: '-1150 0' },
          { category: 'activeModel', text: 'Alpha2', loc: '-500 500' },
          { category: 'activeModel', text: 'Alpha2', loc: '-500 -200' }
        ]
      })
    })
    return { activeModelRef, editRef }
  }
})
</script>

<style lang="less" scope>
.active-model {
  height: 100%;
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
