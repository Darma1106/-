<template>
  <div class="organization-model">
    <BaseDiagram ref="baseDiagramRef" :editor-template="editorData" :after-link="afterLink" :tree-layout="true" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue'
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
    let flag = true
    const { onSave } = useEvent()
    if (props.tabId) {
      onSave(() => {
        if (props.tabId && baseDiagramRef.value) {
          // localStorage.setItem(props.tabId, baseDiagramRef.value.getJson())
          flag = !flag
          baseDiagramRef.value.setLinkedState(flag)
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

    const editorData: EditorData[] = [
      {
        key: 2,
        figure: 'RoundedRectangle',
        fill: 'red',
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
