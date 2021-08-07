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

import type { Ref } from 'vue'
import type { BaseDiagramInstance, EditorData, EditorTemplate } from '@/component/baseDiagram/type'

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
        }
      }, props.tabId)
    }

    renderDiagramFromLocal(props.tabId, baseDiagramRef)
    const templateData: EditorTemplate[] = [
      {
        id: '1',
        name: '图形',
        type: 'tuxing',
        items: [
          {
            id: '456',
            type: 'tuxing',
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
            type: 'tuxing',
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
            type: 'tuxing',
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
            type: 'tuxing',
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
    const editorData: EditorData[] = [
      { key: 1, geo: 'close', color: 'white', category: 'geoNode', showContext: false, type: 'ExclusiveGateway' },
      {
        key: 2,
        figure: 'RoundedRectangle',
        fill: '#FFFEDF',
        text: '活动',
        category: 'defaultNode',
        type: 'ServiceTask',
        showContext: false
      },
      {
        key: 2,
        thickness: 3,
        figure: 'Circle',
        text: '',
        category: 'defaultNode',
        type: 'EndEvent',
        showContext: false
      },
      {
        key: 5,
        figure: 'Circle',
        text: '',
        category: 'defaultNode',
        type: 'StartEvent',
        showContext: false
      }
      // {
      //   key: 7,
      //   source: 'https://pica.zhimg.com/v2-6d510e2f1c06efa66322e3ecf1a1cc9b_1440w.jpg?source=172ae18b',
      //   showContext: false,
      //   category: 'pictureNode'
      // }
    ]

    const afterLink = ({ data }: go.ObjectData) => {
      data.text = '流程条件'
    }

    return {
      editorData,
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
