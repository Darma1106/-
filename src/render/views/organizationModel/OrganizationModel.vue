<template>
  <div class="organization-model">
    <BaseDiagram
      ref="baseDiagramRef"
      :node-map="nodeMap"
      :link-map="linkMap"
      default-link-type="cost"
      :layout-model="layoutModel"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as go from 'gojs'
import { makePort, FigureButton, LightFillButtons } from '@/component/baseDiagram/util/node'
import {
  DarkColorButtons,
  StrokeOptionsButtons,
  ArrowButton,
  AllSidesButton,
  SpotButton
} from '@/component/baseDiagram/util/link'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'

import { useEvent } from '@/composition'

import type { Template, BaseDiagramInstance } from '@/component/baseDiagram/type'

const make = go.GraphObject.make
export default defineComponent({
  name: '',
  components: { BaseDiagram },
  props: {
    tabId: {
      type: String
    }
  },
  setup(props) {
    const baseDiagramRef = ref<BaseDiagramInstance | null>(null)

    const { onSave } = useEvent()
    if (props.tabId) {
      onSave(() => {
        console.log(`${props.tabId}组织模型`)
      }, props.tabId)
    }
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
            resizable: true,
            resizeCellSize: new go.Size(20, 20),
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
      }
      // {
      //   name: 'type1',
      //   template: make(
      //     go.Node,
      //     'Auto',
      //     make(go.Shape, 'Rectangle', {
      //       stroke: '#000',
      //       strokeWidth: 1,
      //       fill: '#FACCA7',
      //       minSize: new go.Size(100, 60),
      //       // width: 80,
      //       height: 30
      //     }),

      //     make(
      //       go.TextBlock,
      //       {
      //         editable: true,
      //         // width: 80,
      //         stroke: '#000',
      //         font: '14px Droid Serif, sans-serif',
      //         textAlign: 'center',
      //         verticalAlignment: go.Spot.Center,
      //         overflow: go.TextBlock.OverflowEllipsis,
      //         wrap: go.TextBlock.WrapFit
      //       },
      //       new go.Binding('text', 'text').makeTwoWay()
      //     ),
      //     // 加四个接入/出端口:
      //     makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
      //     makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
      //     makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
      //     makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
      //   )
      // }
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
      },
      {
        name: 'cost',
        template: make(
          go.Link,
          {
            layerName: 'Foreground',
            routing: go.Link.AvoidsNodes,
            corner: 10,
            toShortLength: 4, // assume arrowhead at "to" end, need to avoid bad appearance when path is thick
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            contextMenu: make(
              'ContextMenu',
              DarkColorButtons(),
              StrokeOptionsButtons(),
              make('ContextMenuButton', make(go.Panel, 'Horizontal', ArrowButton(0), ArrowButton(1))),
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
            new go.Binding('strokeWidth', 'thickness'),
            new go.Binding('strokeDashArray', 'dash')
          ),
          make(
            go.Shape,
            { fromArrow: 'Backward', strokeWidth: 0, scale: 4 / 3, visible: false },
            new go.Binding('visible', 'dir', function (dir) {
              return dir === 2
            }),
            new go.Binding('fill', 'color'),
            new go.Binding('scale', 'thickness', function (t) {
              return (2 + t) / 3
            })
          ),
          make(
            go.Shape,
            { toArrow: 'Standard', strokeWidth: 0, scale: 4 / 3 },
            new go.Binding('visible', 'dir', function (dir) {
              return dir >= 1
            }),
            new go.Binding('fill', 'color'),
            new go.Binding('scale', 'thickness', function (t) {
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

<style lang="less" scoped>
.organization-model {
  height: 100%;
}
</style>
