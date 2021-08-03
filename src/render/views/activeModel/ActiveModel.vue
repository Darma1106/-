<template>
  <div class="base">
    <BaseDiagram ref="baseDiagramRef" :editor-template="templateData" :after-link="afterLink" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'
import { useEvent } from '@/composition'

import type { EditorTemplate, BaseDiagramInstance } from '@/component/baseDiagram/type'

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
        if (props.tabId && baseDiagramRef.value) {
          localStorage.setItem(props.tabId, baseDiagramRef.value.getJson())
        }
      }, props.tabId)
    }

    onMounted(() => {
      nextTick(() => {
        if (props.tabId && baseDiagramRef.value) {
          baseDiagramRef.value.renderJson(localStorage.getItem(props.tabId) ?? '')
        }
      })
    })

    let baseDiagramRef = ref<BaseDiagramInstance | null>(null)

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
