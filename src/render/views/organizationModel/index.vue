<template>
  <div class="organization-model">
    <BaseDiagram
      ref="baseDiagramRef"
      :node-map="nodeMap"
      :link-map="linkMap"
      default-link-type="normal"
      :layout-model="layoutModel"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as go from 'gojs'
import { makePort } from '../baseDiagram/util/node'
import BaseDiagram from '../baseDiagram/index.vue'
import type { Template, BaseDiagramInstance } from '../baseDiagram/type'

const make = go.GraphObject.make
export default defineComponent({
  name: '',
  components: { BaseDiagram },
  setup() {
    let baseDiagramRef = ref<BaseDiagramInstance | null>(null)

    const nodeMap: Template<go.Node>[] = [
      {
        name: 'normal',
        template: make(
          go.Node,
          'Auto',
          {
            contextMenu: make(
              'ContextMenu',
              make('ContextMenuButton', make(go.TextBlock, 'Vacate Position'), {
                click: function (e, obj) {
                  console.log(111)
                }
              }),
              make('ContextMenuButton', make(go.TextBlock, 'Remove Role'), {
                click: function (e, obj) {
                  console.log(111)
                }
              }),
              make('ContextMenuButton', make(go.TextBlock, 'Remove Department'), {
                click: function (e, obj) {
                  console.log(111)
                }
              }),
              { visible: false },
              new go.Binding('visible', 'showContext')
            )
          },
          make(go.Shape, 'RoundedRectangle', {
            stroke: '#217AB1',
            strokeWidth: 1,
            fill: '#102468',
            minSize: new go.Size(80, 30),
            // width: 80,
            height: 30
          }),

          make(
            go.TextBlock,
            {
              editable: true,
              // width: 80,
              stroke: '#b3edf8',
              font: '12px Droid Serif, sans-serif',
              textAlign: 'center',
              verticalAlignment: go.Spot.Center,
              overflow: go.TextBlock.OverflowEllipsis,
              wrap: go.TextBlock.WrapFit
            },
            new go.Binding('text', 'text').makeTwoWay()
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
        name: 'normal',
        template: make(
          go.Link,
          go.Link.Orthogonal,
          { corner: 5, relinkableFrom: true, relinkableTo: true },
          make(go.Shape, { strokeWidth: 1.5, stroke: 'blue' })
        )
      }
    ]

    const layoutModel: go.Layout = make(go.TreeLayout, {
      angle: 90,
      layerStyle: go.TreeLayout.LayerUniform
    })
    return {
      nodeMap,
      linkMap,
      layoutModel,
      baseDiagramRef
    }
  }
})
</script>

<style lang="less" scope>
.organization-model {
  height: 100%;
}
</style>
