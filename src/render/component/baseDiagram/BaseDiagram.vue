<template>
  <div class="base-diagram">
    <div ref="activeModelRef" class="main">123</div>
    <div ref="editRef" class="editor"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, PropType, Ref, ref } from 'vue'
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
    },
    diagramEvents: {
      type: Object as PropType<go.DiagramEventsInterface>
    },
    // 布局模式
    layoutModel: {
      type: Object as PropType<go.Layout>
    },
    defaultLinkType: {
      type: String
    }
  },
  setup(props) {
    const activeModelRef: Ref<HTMLDivElement | null> = ref(null)
    const editRef: Ref<HTMLDivElement | null> = ref(null)
    let diagram: go.Diagram | null = null

    function init(templeteRef: HTMLDivElement): go.Diagram {
      const myDiagram = make(go.Diagram, templeteRef, {
        'animationManager.isEnabled': false,
        LinkDrawn,
        externalobjectsdropped
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
      make(go.Palette, unrefElement(editRef), {
        maxSelectionCount: 1,
        'animationManager.isEnabled': false,
        nodeTemplateMap: myDiagram.nodeTemplateMap,
        model: new go.GraphLinksModel(getTemplateModel())
      })

      if (props.layoutModel) {
        myDiagram.layout = props.layoutModel
      }

      myDiagram.model = make(go.GraphLinksModel, {
        linkFromPortIdProperty: 'fromPort',
        linkToPortIdProperty: 'toPort',
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: [],
        linkDataArray: []
      })

      return myDiagram
    }

    // 从面板拖拽后给予右键菜单
    function externalobjectsdropped({ diagram }: go.DiagramEvent) {
      diagram.model.setDataProperty(diagram.selection.first()?.data, 'showContext', true)
    }

    // 连线事件
    function LinkDrawn({ diagram: { model }, subject: { data } }: go.DiagramEvent) {
      if (props.defaultLinkType) {
        ;(model as go.GraphLinksModel).removeLinkData(data)
        data.category = props.defaultLinkType
        ;(model as go.GraphLinksModel).addLinkData(data)
      }
    }

    // 获取节点模板,加入nodeMap
    function getTemplateModel() {
      const model: { text: string; category: string; showContext: boolean }[] = []
      props.nodeMap?.forEach(({ name }) => {
        model.push({ text: 'text', category: name, showContext: false })
      })
      return model
    }

    function getDiagram(): go.Diagram | null {
      return diagram
    }

    function addNode(node: go.ObjectData): void {
      if (diagram) {
        diagram.model.addNodeData(node)
      }
    }

    onMounted(() => {
      nextTick(() => {
        diagram = init(unrefElement(activeModelRef))
      })
    })
    return { activeModelRef, editRef, getDiagram, addNode }
  }
})
</script>

<style lang="less" scope>
.base-diagram {
  position: relative;
  height: 100%;
  .main {
    height: 100%;
    border: 2px solid red;
  }
  .editor {
    width: 150px;
    height: 100%;
    margin-right: 2px;
    background-color: whitesmoke;
    border: solid 1px black;
    position: absolute;
    top: 0;
    z-index: 9999;
  }
}
</style>
