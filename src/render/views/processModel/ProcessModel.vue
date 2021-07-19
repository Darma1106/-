<template>
  <div class="organization-model">
    <BaseDiagram ref="baseDiagramRef" :editor-template="editorData" :after-link="afterLink" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'
import { useEvent } from '@/composition'

import type { BaseDiagramInstance, EditorData } from '@/component/baseDiagram/type'

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

    const editorData: EditorData[] = [
      { key: 1, geo: 'close', color: 'white', category: 'geoNode', showContext: false },
      {
        key: 2,
        figure: 'RoundedRectangle',
        fill: '#FFFEDF',
        text: '活动',
        category: 'defaultNode',
        showContext: false
      },
      {
        key: 2,
        thickness: 3,
        figure: 'Circle',
        text: '',
        category: 'defaultNode',
        showContext: false
      },
      {
        key: 5,
        figure: 'Circle',
        text: '',
        category: 'defaultNode',
        showContext: false
      }
    ]

    const afterLink = (data: go.ObjectData) => {
      data.text = '流程条件'
    }

    return {
      editorData,
      baseDiagramRef,
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
