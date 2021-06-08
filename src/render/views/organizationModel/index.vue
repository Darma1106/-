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
import { makePort, FigureButton, LightFillButtons } from '../baseDiagram/util/node'
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
            // locationSpot: go.Spot.Center,
            locationObjectName: 'SHAPE',
            desiredSize: new go.Size(120, 60),
            minSize: new go.Size(40, 40),
            // resizable: true,
            // resizeCellSize: new go.Size(20, 20),
            contextMenu: make(
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
              LightFillButtons()
            )
          },
          // these Bindings are TwoWay because the DraggingTool and ResizingTool modify the target properties
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
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
            new go.Binding('strokeWidth', 'thickness'),
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
      },
      {
        name: 'type1',
        template: make(
          go.Node,
          'Auto',
          make(go.Shape, 'Rectangle', {
            stroke: '#000',
            strokeWidth: 1,
            fill: '#FACCA7',
            minSize: new go.Size(100, 60),
            // width: 80,
            height: 30
          }),

          make(
            go.TextBlock,
            {
              editable: true,
              // width: 80,
              stroke: '#000',
              font: '14px Droid Serif, sans-serif',
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
