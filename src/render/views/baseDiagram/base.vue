<template>
  <div class="base"><button @click="add">add</button><BaseDiagram ref="baseDiagramRef" :node-map="nodeMap" /></div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as go from 'gojs'
import BaseDiagram from './index.vue'
import type { NodeTemplate, BaseDiagramInstance } from './type'

export default defineComponent({
  name: '',
  components: { BaseDiagram },
  setup() {
    const make = go.GraphObject.make
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

    let baseDiagramRef = ref<BaseDiagramInstance | null>(null)

    function add() {
      baseDiagramRef.value?.getDiagram().model.addNodeData({
        category: 'template2',
        text: 'Alpha',
        loc: '-900 0'
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

    const nodeMap: NodeTemplate[] = [
      {
        name: 'template2',
        template: make(
          go.Node,
          'Table',
          nodeStyle(),
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
      }
    ]

    return {
      nodeMap,
      baseDiagramRef,
      add
    }
  }
})
</script>

<style lang="less" scope>
.base {
  height: 100vh;
}
</style>
