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

    const afterLink = ({ toNode, fromNode }: go.ObjectData, model: go.Model) => {
      model.setDataProperty(toNode.data, 'pid', fromNode.data.key)
    }

    const editorData: EditorData[] = [
      {
        key: 2,
        figure: 'RoundedRectangle',
        fill: '#FFFEDF',
        text: 'text',
        category: 'defaultNode',
        showContext: false
      }
    ]

    return {
      baseDiagramRef,
      editorData,
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
