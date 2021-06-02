<template>
  <div style="position: relative; height: 100%">
    <div ref="activeModelRef" class="active-model">123</div>
    <div ref="editRef" class="editor"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, Ref, ref } from 'vue'
import { unrefElement } from '@vueuse/core'
import * as go from 'gojs'
import type { Template } from './type'

const make = go.GraphObject.make

export default defineComponent({
  name: '',
  components: {},
  props: {
    nodeMap: {
      type: Array as PropType<Template<go.Node>[]>
    },
    linkMap: {
      type: Array as PropType<Template<go.Link>[]>
    }
  },
  setup(props) {
    const activeModelRef: Ref<HTMLDivElement | null> = ref(null)
    const editRef: Ref<HTMLDivElement | null> = ref(null)
    let diagram: go.Diagram | null = null

    function init(templeteRef: HTMLDivElement): go.Diagram {
      const myDiagram = make(go.Diagram, templeteRef, {
        ChangedSelection: ({ diagram, subject }) => {
          let select = diagram.selection.first()?.data
        }
      })
      // 分配节点模板
      props.nodeMap?.forEach(({ name, template }) => {
        myDiagram.nodeTemplateMap.add(name, template)
      })

      // 分配连线模板
      props.linkMap?.forEach(({ name, template }) => {
        myDiagram.linkTemplateMap.add(name, template)
      })

      // 渲染操作面板
      make(
        go.Palette,
        unrefElement(editRef), // must name or refer to the DIV HTML element
        {
          maxSelectionCount: 1,
          nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
          model: new go.GraphLinksModel(getTemplateModel())
        }
      )

      myDiagram.model = make(go.GraphLinksModel, {
        linkFromPortIdProperty: 'fromPort',
        linkToPortIdProperty: 'toPort',
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: [
          {
            key: 1,
            category: 'template2',
            text: 'Alpha',
            loc: '-900 0'
          },
          {
            key: 2,
            category: 'template2',
            text: 'Alpha2',
            loc: '-500 200'
          }
        ],
        linkDataArray: [
          { from: 1, to: 2, category: 'type1', toPort: 'B', fromPort: 'B' },
          { from: 1, to: 2, category: 'type2', toPort: 'T', fromPort: 'T' }
        ]
      })
      // myDiagram.setProperties()

      return myDiagram
    }

    // 获取节点模板,加入nodeMap
    function getTemplateModel() {
      const model: { text: string; category: string }[] = []
      props.nodeMap?.forEach(({ name }) => {
        model.push({ text: 'text', category: name })
      })
      return model
    }

    function getDiagram(): go.Diagram | null {
      return diagram
    }

    onMounted(() => {
      diagram = init(unrefElement(activeModelRef))
    })
    return { activeModelRef, editRef, getDiagram }
  }
})
</script>

<style lang="less" scope>
.active-model {
  height: 100%;
  border: 2px solid red;
}
.editor {
  width: 105px;
  height: 100%;
  margin-right: 2px;
  background-color: whitesmoke;
  border: solid 1px black;
  position: absolute;
  top: 0;
  z-index: 9999;
}
</style>
