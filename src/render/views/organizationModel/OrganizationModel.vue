<template>
  <div class="organization-model">
    <BaseDiagram ref="baseDiagramRef" :editor-template="templateData" :after-link="afterLink" :tree-layout="true" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'

import { useEvent } from '@/composition'

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
    const { onSave } = useEvent()
    if (props.tabId) {
      onSave(() => {
        if (props.tabId && baseDiagramRef.value) {
          localStorage.setItem(props.tabId, baseDiagramRef.value.getJson())
        }
      }, props.tabId)
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
        type: 'tuxing',
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
