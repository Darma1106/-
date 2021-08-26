<template>
  <div class="organization-model">
    <BaseDiagram ref="baseDiagramRef" :editor-template="templateData" :after-link="afterLink" :tree-layout="true" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import BaseDiagram from '@/component/baseDiagram/BaseDiagramSetup.vue'

import { useEventStore } from '@/store'

import type { BaseDiagramInstance, EditorTemplate } from '@/component/baseDiagram/type'

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
    const { onSave, onEvent } = useEventStore()
    if (props.tabId) {
      onSave(() => {
        if (props.tabId && baseDiagramRef.value) {
          localStorage.setItem(props.tabId, baseDiagramRef.value.getJson())
          message.success('保存成功')
        }
      }, props.tabId)
      onEvent(
        'projectManage',
        () => {
          console.log('测试并发')
        },
        props.tabId
      )
    }

    onMounted(() => {
      nextTick(() => {
        const diagramJson = localStorage.getItem(props.tabId ?? '')
        if (diagramJson && baseDiagramRef.value) {
          baseDiagramRef.value.renderJson(diagramJson)
        }
      })
    })

    const afterLink = ({ toNode, fromNode }: go.ObjectData, model: go.Model) => {
      model.setDataProperty(toNode.data, 'pid', fromNode.data.key)
      console.log('pid', fromNode.data.key)
    }

    const templateData: EditorTemplate[] = [
      {
        id: '1',
        name: '节点',
        category: 'tuxing',
        items: [
          {
            id: '456',
            type: 'tuxing',
            name: '组织节点',
            data: {
              key: 5,
              figure: 'RoundedRectangle',
              fill: '#FFFEDF',
              fontColor: 'black',
              name: 'text',
              category: 'defaultNode',
              size: '80 30',
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
            id: '543',
            type: 'line',
            name: '直线',
            data: { category: 'defaultLink' }
          }
        ]
      }
    ]

    return {
      baseDiagramRef,
      templateData,
      afterLink
    }
  }
})
</script>

<style lang="less" scoped>
.organization-model {
  height: 100%;
}
</style>
