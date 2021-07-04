<template>
  <div class="base">
    <button @click="xians">显示</button><BaseDiagram ref="baseDiagramRef" :node-map="nodeMap" :link-map="linkMap" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as go from 'gojs'
import BaseDiagram from './BaseDiagram.vue'
import { linkSelectionHeighlight } from './util/link'
import { makePort } from './util/node'
import type { Template, BaseDiagramInstance } from './type'

export default defineComponent({
  name: '',
  components: { BaseDiagram },
  setup() {
    const make = go.GraphObject.make

    let baseDiagramRef = ref<BaseDiagramInstance | null>(null)

    function nodeStyle() {
      return [
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          locationSpot: go.Spot.Center,
          resizable: true
        }
      ]
    }

    function textStyle() {
      return {
        font: 'bold 11pt Helvetica, Arial, sans-serif',
        stroke: 'black'
      }
    }

    const nodeMap: Template<go.Node>[] = [
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
          // 加四个接入/出端口:
          makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
          makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
          makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
          makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
        )
      }
    ]

    const linkMap: Template<go.Link>[] = [
      {
        name: 'type1',
        template: make(
          go.Link,
          { selectable: true, selectionAdornmentTemplate: linkSelectionHeighlight('red') },
          { relinkableFrom: true, relinkableTo: true, reshapable: true },
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4
          },
          new go.Binding('points').makeTwoWay(),
          make(
            go.Shape, // 线
            { isPanelMain: true, strokeWidth: 2 }
          ),
          make(
            go.Shape, // 箭头
            { toArrow: 'Diamond', stroke: null }
          ),
          make(
            go.Panel, // 线中文字区
            'Auto',
            new go.Binding('visible', 'isSelected').ofObject(),
            make(go.Shape, 'RoundedRectangle', { fill: '#F8F8F8', stroke: null }),
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
      },
      {
        name: 'type2',
        template: make(
          go.Link, // the whole link panel
          { selectable: true, selectionAdornmentTemplate: linkSelectionHeighlight() },
          { relinkableFrom: true, relinkableTo: true, reshapable: true },
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4
          },
          new go.Binding('points').makeTwoWay(),
          make(
            go.Shape, // 线
            { isPanelMain: true, strokeWidth: 2 }
          ),
          make(
            go.Shape, // 箭头
            { toArrow: 'Standard', stroke: null }
          ),
          make(
            go.Panel,
            'Auto',
            new go.Binding('visible', 'isSelected').ofObject(),
            make(
              go.Shape,
              'RoundedRectangle', // 线中文字区
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
      }
    ]

    function xians() {
      console.log(baseDiagramRef.value?.getDiagram())
    }

    return {
      nodeMap,
      linkMap,
      xians,
      baseDiagramRef
    }
  }
})
</script>

<style lang="less" scoped>
.base {
  height: 100vh;
}
</style>
