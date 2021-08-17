<template>
  <div class="base">
    <BaseDiagram ref="baseDiagramRef" :editor-template="templateData" :after-link="afterLink" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { message } from 'ant-design-vue'
import type { Ref } from 'vue'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'
import { useEventStore } from '@/store'
import { renderDiagramFromLocal } from '@/component/baseDiagram/util/diagram'
import { dataMap } from '@/views/tableModel/database'

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
            message.success('保存成功')
          }
        },
        props.tabId
      )
    }

    const baseDiagramRef: Ref<BaseDiagramInstance | null> = ref(null)

    const defaultJson = dataMap.get('hdt') as string

    // 本地读取json
    renderDiagramFromLocal(props.tabId, baseDiagramRef, defaultJson)

    const templateData: EditorTemplate[] = [
      {
        id: '1',
        name: '节点',
        category: 'tuxing',
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
