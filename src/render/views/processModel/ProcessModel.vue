<template>
  <div class="organization-model">
    <BaseDiagram
      ref="baseDiagramRef"
      :node-map="nodeMap"
      :link-map="linkMap"
      :editor-template="editorData"
      default-link-type="default"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as go from 'gojs'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'

import { defaultNodeMaker } from '@/component/baseDiagram/util/defaultNode/basenodeMaker'
import { geonodeMaker } from '@/component/baseDiagram/util/defaultNode/geonodeMaker'
import { defaultLineMaker } from '@/component/baseDiagram/util/defaultLine/defaultLineMaker'

import { useEvent } from '@/composition'

import type { Template, BaseDiagramInstance, EditorData } from '@/component/baseDiagram/type'

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

    const nodeMap: Template<go.Node>[] = [
      {
        name: 'normal',
        template: defaultNodeMaker()
      },

      {
        name: 'geo',
        template: geonodeMaker()
      }
    ]

    const linkMap: Template<go.Link>[] = [
      {
        name: 'default',
        template: defaultLineMaker()
      }
    ]

    const editorData: EditorData[] = [
      { key: 1, geo: 'close', color: 'white', category: 'geo', showContext: false },
      {
        key: 2,
        figure: 'RoundedRectangle',
        fill: '#FFFEDF',
        text: '活动',
        category: 'normal',
        showContext: false
      },
      {
        key: 2,
        thickness: 3,
        figure: 'Circle',
        text: '',
        category: 'normal',
        showContext: false
      },
      {
        key: 5,
        figure: 'Circle',
        text: '',
        category: 'normal',
        showContext: false
      }
    ]

    return {
      nodeMap,
      linkMap,
      editorData,
      baseDiagramRef
    }
  }
})
</script>

<style lang="less" scoped>
.organization-model {
  height: 100%;
}
</style>
