<template>
  <div class="base">
    <BaseDiagram ref="baseDiagramRef" :node-map="nodeMap" :link-map="linkMap" default-link-type="type2" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as go from 'gojs'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'
import { linkSelectionHeighlight } from '@/component/baseDiagram/util/link'
import { makePort } from '@/component/baseDiagram/util/node'
import { useEvent } from '@/composition'

import type { Template, BaseDiagramInstance } from '@/component/baseDiagram/type'

export default defineComponent({
  name: '',
  components: { BaseDiagram },
  props: {
    tabId: {
      type: String
    }
  },
  setup(props) {
    const { onSave } = useEvent()
    if (props.tabId) {
      onSave(() => {
        console.log(`${props.tabId}活动模型`)
      }, props.tabId)
    }

    const make = go.GraphObject.make

    let baseDiagramRef = ref<BaseDiagramInstance | null>(null)

    function nodeStyle() {
      return [
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        {
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
            make(go.Shape, 'RoundedRectangle', { fill: '#CADAA9', strokeWidth: 0, width: 100, height: 100 }),
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
            {
              visible: true
            },
            // new go.Binding('visible', 'isSelected').ofObject() ||
            new go.Binding('visible', 'text', (text) => {
              return text.length != 0
            }),
            make(
              go.Shape,
              'RoundedRectangle', // 线中文字区
              { fill: '#f2f2f2', stroke: null }
            ),
            make(
              go.TextBlock,
              {
                textAlign: 'center',
                font: '12pt helvetica, arial, sans-serif',
                stroke: '#000',
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

    return {
      nodeMap,
      linkMap,
      baseDiagramRef
    }
  }
})
</script>

<style lang="less" scope>
.base {
  height: 100%;
}
</style>
