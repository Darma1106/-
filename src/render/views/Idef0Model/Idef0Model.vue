<template>
  <div class="idef0-model">
    <BaseDiagram
      ref="baseDiagramRef"
      :editor-template="templateData"
      default-link-type="defaultLink"
      :diagram-option="diagramOption"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import * as go from 'gojs'
import { message } from 'ant-design-vue'
import type { Ref } from 'vue'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'
import { useEventStore } from '@/store'
import { renderDiagramFromLocal } from '@/component/baseDiagram/util/diagram'
import { dataMap } from '@/views/tableModel/database'
import type { BaseDiagramInstance, EditorTemplate } from '@/component/baseDiagram/type'

const make = go.GraphObject.make

const props = defineProps({
  tabId: {
    type: String
  }
})

const baseDiagramRef: Ref<BaseDiagramInstance | null> = ref(null)

const { onSave } = useEventStore()
if (props.tabId) {
  onSave(() => {
    if (props.tabId && baseDiagramRef.value) {
      localStorage.setItem(props.tabId, baseDiagramRef.value.getJson())
      message.success('保存成功')
    }
  }, props.tabId)
}
const defaultJson = dataMap.get('lct') as string
renderDiagramFromLocal(props.tabId, baseDiagramRef, defaultJson)

const templateData: EditorTemplate[] = [
  {
    id: '1',
    name: '图形',
    category: 'graph',
    items: [
      {
        id: '567',
        type: 'node',
        name: '任务',
        data: {
          key: 2,
          figure: 'RoundedRectangle',
          fill: '#FFFEDF',
          name: '任务',
          category: 'defaultNode',
          type: 'ServiceTask',
          showContext: false
        }
      },

      {
        id: '345',
        type: 'line',
        name: '折线',
        data: { category: 'avoidLink' }
      },
      {
        id: '222',
        type: 'singleLine',
        name: '单例线',
        data: {
          category: 'singleLink'
        }
      },
      {
        id: '543',
        type: 'line',
        name: '直线',
        data: { category: 'defaultLink' }
      }
    ]
  }
]

const diagramOption = {
  // grid: make(go.Panel, "Grid",
  //   make(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
  //   make(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
  //   make(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
  //   make(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
  // ),
  'draggingTool.dragsLink': true,
  'draggingTool.isGridSnapEnabled': true,
  'linkingTool.isUnconnectedLinkValid': true,
  'linkingTool.portGravity': 20,
  'relinkingTool.isUnconnectedLinkValid': true,
  'relinkingTool.portGravity': 20,
  'relinkingTool.fromHandleArchetype': make(go.Shape, 'Diamond', {
    segmentIndex: 0,
    cursor: 'pointer',
    desiredSize: new go.Size(8, 8),
    fill: 'tomato',
    stroke: 'darkred'
  }),
  'relinkingTool.toHandleArchetype': make(go.Shape, 'Diamond', {
    segmentIndex: -1,
    cursor: 'pointer',
    desiredSize: new go.Size(8, 8),
    fill: 'darkred',
    stroke: 'tomato'
  }),
  'linkReshapingTool.handleArchetype': make(go.Shape, 'Diamond', {
    desiredSize: new go.Size(7, 7),
    fill: 'lightblue',
    stroke: 'deepskyblue'
  }),
  'rotatingTool.handleAngle': 270,
  'rotatingTool.handleDistance': 30,
  'rotatingTool.snapAngleMultiple': 15,
  'rotatingTool.snapAngleEpsilon': 15,
  'undoManager.isEnabled': true
}
</script>

<style lang="less" scoped>
.idef0-model {
  height: 100%;
}
</style>
