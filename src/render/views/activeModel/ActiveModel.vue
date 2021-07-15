<template>
  <div class="base">
    <BaseDiagram ref="baseDiagramRef" :editor-template="editorData" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'
import { useEvent } from '@/composition'

import type { EditorData, BaseDiagramInstance } from '@/component/baseDiagram/type'

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
        console.log(`${props.tabId}活动模型`)
      }, props.tabId)
    }

    let baseDiagramRef = ref<BaseDiagramInstance | null>(null)

    const editorData: EditorData[] = [
      {
        key: 2,
        figure: 'RoundedRectangle',
        fill: 'green',
        fontColor: 'white',
        text: 'text',
        category: 'normal',
        showContext: false
      }
    ]

    return {
      baseDiagramRef,
      editorData
    }
  }
})
</script>

<style lang="less" scoped>
.base {
  height: 100%;
}
</style>
