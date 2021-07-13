<template>
  <div class="base-diagram">
    <div ref="editRef" class="editor"></div>
    <div ref="mainRef" class="main"></div>
    <button @click="getJson">show Json</button>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { unrefElement } from '@vueuse/core'
import * as go from 'gojs'
import type { Ref } from 'vue'
import type { Template, EditorData } from './type'

const make = go.GraphObject.make

interface BaseDiagramProps {
  editor?: boolean
  nodeMap: Template<go.Node>[]
  linkMap: Template<go.Link>[]
  editorMap?: Template<go.Node>[]
  editorTemplate?: EditorData[]
  diagramEvents?: go.DiagramEventsInterface
  layoutModel?: go.Layout
  defaultLinkType: string
}

const props = withDefaults(defineProps<BaseDiagramProps>(), {
  editor: true
})

const mainRef: Ref<HTMLDivElement | null> = ref(null)
const editRef: Ref<HTMLDivElement | null> = ref(null)
// 画布实例
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
  if (props.editor) {
    const editorDiagram = make(go.Palette, unrefElement(editRef), {
      maxSelectionCount: 1,
      'animationManager.isEnabled': false,
      model: new go.GraphLinksModel(getTemplateModel())
    })

    // 操作面板模板类型
    if (props.editorMap) {
      props.editorMap.forEach(({ name, template }) => {
        editorDiagram.nodeTemplateMap.add(name, template)
      })
    } else {
      editorDiagram.nodeTemplateMap = myDiagram.nodeTemplateMap
    }

    // 操作面板模板数据
    if (props.editorTemplate) {
      editorDiagram.model = new go.GraphLinksModel(props.editorTemplate)
    } else {
      editorDiagram.model = new go.GraphLinksModel(getTemplateModel())
    }
  }

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
  const model: EditorData[] = []
  if (props.editorMap) {
    props.editorMap.forEach(({ name }) => {
      model.push({ text: 'text', category: name, showContext: false })
    })
  } else {
    props.nodeMap?.forEach(({ name }) => {
      model.push({ text: 'text', category: name, showContext: false })
    })
  }

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
    diagram = init(unrefElement(mainRef))
  })
})

// 显示json
const getJson = (): string => {
  let jsonData = ''
  if (diagram) {
    jsonData = diagram.model.toJson()
    console.log(jsonData)
  }
  return jsonData
}

defineExpose({ getJson, getDiagram, addNode })
</script>

<style lang="less" scoped>
.base-diagram {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: row;
  .main {
    flex: 1;
  }
  .editor {
    width: 150px;
    height: 100%;
    margin-right: 2px;
    background-color: whitesmoke;
    border: solid 1px black;
  }
}
</style>
