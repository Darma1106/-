<template>
  <div class="process-model">
    <BaseDiagram ref="baseDiagramRef" :editor-template="templateData" :after-link="afterLink" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'
import { useEventStore } from '@/store'
import { renderDiagramFromLocal } from '@/component/baseDiagram/util/diagram'
import { message } from 'ant-design-vue'

import type { Ref } from 'vue'
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

    renderDiagramFromLocal(props.tabId, baseDiagramRef)

    const templateData: EditorTemplate[] = [
      {
        id: '1',
        name: '图形',
        category: 'graph',
        items: [
          {
            id: '456',
            type: 'node',
            name: '排他',
            data: {
              key: 1,
              geo: 'close',
              color: 'white',
              category: 'geoNode',
              showContext: false,
              type: 'ExclusiveGateway'
            }
          },
          {
            id: '567',
            type: 'node',
            name: '活动',
            data: {
              key: 2,
              figure: 'RoundedRectangle',
              fill: '#FFFEDF',
              text: '活动',
              category: 'defaultNode',
              type: 'ServiceTask',
              showContext: false
            }
          },
          {
            id: '678',
            type: 'node',
            name: '结束',
            data: {
              key: 3,
              thickness: 3,
              figure: 'Circle',
              text: '',
              category: 'defaultNode',
              size: '15 15',
              resizable: false,
              type: 'EndEvent',
              showContext: false
            }
          },
          {
            id: '789',
            type: 'node',
            name: '开始',
            data: {
              key: 5,
              figure: 'Circle',
              text: '',
              category: 'defaultNode',
              size: '15 15',
              resizable: false,
              type: 'StartEvent',
              showContext: false
            }
          },
          {
            id: '345',
            type: 'line',
            name: '连线',
            data: {
              key: 4,
              figure: 'RoundedRectangle',
              fill: 'green',
              fontColor: 'white',
              text: 'text',
              category: 'defaultNode',
              showContext: false
            }
          }
        ]
      }
    ]

    const afterLink = ({ data }: go.ObjectData) => {
      data.text = '流程条件'
    }

    return {
      templateData,
      baseDiagramRef,
      afterLink
    }
  }
})
</script>

<style lang="less" scoped>
.process-model {
  height: 100%;
}
</style>
