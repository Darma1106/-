<template>
  <div class="base">
    <BaseDiagram ref="baseDiagramRef" :editor-template="templateData" :after-link="afterLink" :link-map="linkMap" />
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'
import { renderDiagramFromLocal } from '@/component/baseDiagram/util/diagram'
import * as go from 'gojs'
import { LinkShiftingTool } from './LinkShiftingTool'

import type { Ref } from 'vue'
import type { EditorTemplate, BaseDiagramInstance, Template } from '@/component/baseDiagram/type'

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
    const baseDiagramRef: Ref<BaseDiagramInstance | null> = ref(null)

    // 本地读取json
    renderDiagramFromLocal(props.tabId, baseDiagramRef)

    const linkMap: Template<go.Link>[] = [
      {
        name: 'move-port',
        template: make(
          go.Link,
          {
            reshapable: true,
            resegmentable: true,
            relinkableFrom: true,
            relinkableTo: true,
            adjusting: go.Link.Stretch
          },
          // remember the (potentially) user-modified route
          new go.Binding('points').makeTwoWay(),
          // remember any spots modified by LinkShiftingTool
          new go.Binding('fromSpot', 'fromSpot', go.Spot.parse).makeTwoWay(go.Spot.stringify),
          new go.Binding('toSpot', 'toSpot', go.Spot.parse).makeTwoWay(go.Spot.stringify),
          make(go.Shape),
          make(go.Shape, { toArrow: 'Diamond' })
        )
      }
    ]

    onMounted(() => {
      nextTick(() => {
        if (baseDiagramRef.value) {
          const myDiagram = baseDiagramRef.value.getDiagram()

          myDiagram.toolManager.mouseDownTools.add(make(LinkShiftingTool))
        }
      })
    })

    const templateData: EditorTemplate[] = [
      {
        id: '1',
        name: '节点',
        type: 'tuxing',
        items: [
          {
            id: '456',
            type: 'tuxing',
            name: '活动节点',
            data: {
              key: 2,
              figure: 'RoundedRectangle',
              fill: 'green',
              fontColor: 'white',
              text: 'text',
              category: 'defaultNode',
              showContext: false
            }
          },
          {
            id: '345',
            type: 'line',
            name: '连线',
            data: {}
          }
        ]
      }
    ]

    const afterLink = ({ data }: go.ObjectData) => {
      data.text = '活动'
    }
    return {
      baseDiagramRef,
      templateData,
      linkMap,
      afterLink
    }
  }
})
</script>

<style lang="less" scoped>
.base {
  height: 100%;
}
</style>
