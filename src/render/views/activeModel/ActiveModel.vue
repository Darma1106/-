<template>
  <div class="base">
    <BaseDiagram ref="baseDiagramRef" :editor-template="templateData" :after-link="afterLink" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'
import { useEventStore } from '@/store'
import { renderDiagramFromLocal } from '@/component/baseDiagram/util/diagram'

import type { Ref } from 'vue'
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
    const { onEvent } = useEventStore()
    if (props.tabId) {
      onEvent(
        'save',
        () => {
          if (props.tabId && baseDiagramRef.value) {
            localStorage.setItem(props.tabId, baseDiagramRef.value.getJson())
          }
        },
        props.tabId
      )
      onEvent(
        'test',
        () => {
          console.log('testtttttt')
        },
        props.tabId
      )
    }

    const baseDiagramRef: Ref<BaseDiagramInstance | null> = ref(null)

    // 本地读取json
    renderDiagramFromLocal(props.tabId, baseDiagramRef)

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
