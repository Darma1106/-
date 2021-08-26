<template>
  <splitpanes class="layout-content default-theme" horizontal :push-other-panes="false" style="height: 100%">
    <pane>
      <splitpanes class="layout-content default-theme">
        <pane>
          <div class="base-diagram">
            <Editor :editor-data="editorTemplate" @active-item-change="editorItemChange" />
            <div ref="mainRef" class="main"></div>
            <!-- <button @click="getJson">show Json</button> -->
          </div>
        </pane>
        <pane min-size="8" max-size="25" size="15">
          <Information :info="selectionNode" />
        </pane>
      </splitpanes>
    </pane>
  </splitpanes>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { cloneDeep } from 'lodash'
import { unrefElement } from '@vueuse/core'
import * as go from 'gojs'
import { v4 as uuidv4 } from 'uuid'
import Splitpanes from 'splitpanes/src/components/splitpanes/splitpanes.vue'
import Pane from 'splitpanes/src/components/splitpanes/pane.vue'
import Information from '../information/Infomation.vue'
import { addChild, makeAddButton } from './util/node'
import Editor from './editor.vue'
import type { Template, AfterInit, AfterLink, EditorType, EditorTemplate } from './type'
import { guidedDraggingToolOption } from '@/component/baseDiagram/util/diagramTool/GuidedDraggingTool'
import { LinkShiftingTool } from '@/component/baseDiagram/util/diagramTool/LinkShiftingTool'
import { injectLinkMap } from '@/component/baseDiagram/util/defaultLine'
import { injectNodeMap } from '@/component/baseDiagram/util/defaultNode'

interface Props {
  editor?: boolean
  editorTemplate: EditorTemplate[]
  nodeMap?: Template<go.Node>[]
  linkMap?: Template<go.Link>[]
  editorMap?: Template<go.Node>[]
  diagramEvents?: go.DiagramEventsInterface
  treeLayout?: boolean
  defaultLinkType?: string
  afterLink?: AfterLink
  afterInit?: AfterInit
}

const make = go.GraphObject.make

const props = withDefaults(defineProps<Props>(), {
  editor: true,
  treeLayout: false,
  defaultLinkType: 'defaultLink'
})

const mainRef: Ref<HTMLDivElement | null> = ref(null)
let diagram: go.Diagram | null = null

// 活跃的编辑栏选项
let activeEditorType: EditorType | null = null

function init(templeteRef: HTMLDivElement): go.Diagram {
  const myDiagram = make(
    go.Diagram,
    templeteRef,
    // 获取辅助线
    Object.assign({
      'animationManager.isEnabled': false,
      click: diagramClick,
      allowLink: false,
      allowRelink: false,

      // grid: make(
      //   go.Panel,
      //   'Grid',
      //   make(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
      //   make(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.5 })
      // ),
      LinkDrawn
    }),
    guidedDraggingToolOption
  )
  injectNodeMap(myDiagram)
  injectLinkMap(myDiagram)

  if (props.treeLayout) {
    myDiagram.layout = make(go.TreeLayout, { angle: 90, arrangement: go.TreeLayout.ArrangementFixedRoots })
  }

  myDiagram.model = make(go.GraphLinksModel, {
    copiesArrays: true,
    copiesArrayObjects: true,
    nodeDataArray: [],
    linkDataArray: []
  })

  return myDiagram
}

// 连线事件
function LinkDrawn({ diagram: { model }, subject }: go.DiagramEvent) {
  // link的model是GraphLinksModel类型
  const linkModel = model as go.GraphLinksModel
  if (props.defaultLinkType) {
    linkModel.removeLinkData(subject.data)
    subject.data.category = props.defaultLinkType
    subject.data.id = uuidv4()
    // afterLink回调
    if (props.afterLink) {
      props?.afterLink(subject, model)
    }
    // 合并选中连线的data

    if (activeEditorType && Object.keys(activeEditorType.data).length != 0) {
      Object.assign(subject.data, activeEditorType.data)
      console.log(subject.data)
    }
    linkModel.addLinkData(subject.data)
  }
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
    if (props.afterInit) {
      props.afterInit(diagram)
    }
    setChangeSelection()
    setTextEdited()
    // LinkShiftingTool 实例
    const linkShift = make(LinkShiftingTool)
    diagram.toolManager.mouseDownTools.add(linkShift)
    diagram.nodeSelectionAdornmentTemplate = makeAddButton(addChildNode)
  })
})

// 点击画布
const diagramClick = (e: go.InputEvent) => {
  const { documentPoint } = e
  if (activeEditorType && activeEditorType.type != 'line') {
    const node = JSON.parse(JSON.stringify(activeEditorType.data))
    node.key = uuidv4()
    node.loc = `${documentPoint.x} ${documentPoint.y}`
    addNode(node)
  }
}

// 获取节点数组
const getNodeArray = () => {
  if (diagram) {
    return diagram.model.nodeDataArray
  }
}

// 获取连线数组
const getLinkArray = () => {
  if (diagram) {
    return (diagram.model as go.GraphLinksModel).linkDataArray
  }
}

// 获取画布json
const getJson = () => {
  if (diagram) {
    console.log(diagram.model.toJson())
    //  diagram.model.updateTargetBindings(selectionNode.value)
    return diagram.model.toJson()
  }
}

// 渲染json至画布
const renderJson = (json: string) => {
  if (diagram) {
    diagram.model = go.Model.fromJson(json)
  }
}

// 修改选中属性
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateProperty = (propName: string, val: any) => {
  const selection = getDiagram()?.selection.first()
  if (selection) {
    getDiagram()?.model.setDataProperty(selection.data, propName, val)
  }
}

// 添加关联节点
const addChildNode = () => {
  const diagram = getDiagram()
  if (diagram) {
    const selection = diagram.selection.first()
    if (selection) {
      // 复制一份，使用默认连接类型连接
      addChild(diagram, selection, props.defaultLinkType)
    }
  }
}

// 连线开关
const setLinkedState = (state: boolean) => {
  const diagram = getDiagram()
  if (diagram) {
    diagram.allowLink = state
    diagram.allowRelink = state
  }
}

// 编辑栏选中变化
const editorItemChange = (item: EditorType) => {
  console.log('editorItemChange', item)
  setLinkedState(item && item.type == 'line')
  activeEditorType = item
}

// 属性栏联动
const selectionNode: Ref<go.ObjectData> = ref({})
const changeSelection = (e: go.DiagramEvent) => {
  selectionNode.value = cloneDeep(e.diagram.selection.first()?.data ?? {})
}

const setChangeSelection = () => {
  const diagram = getDiagram()
  if (diagram) {
    diagram.addDiagramListener('ChangedSelection', changeSelection)
  }
}

// 自己手动刷新图像和表单的关联，gojs的双向绑定有小bug
const textEdit = (e: go.DiagramEvent) => {
  selectionNode.value.name = e.subject.text
  selectionNode.value = cloneDeep(selectionNode.value)
}

// 检测到表单更新即更改渲染属性
watch(
  () => selectionNode.value,
  (val) => {
    if (JSON.stringify(val) != '{}') {
      updateProperty('name', val.name)
    }
  },
  { deep: true }
)

const setTextEdited = () => {
  const diagram = getDiagram()
  if (diagram) {
    diagram.addDiagramListener('TextEdited', textEdit)
  }
}

// 暴露组件接口
defineExpose({
  getDiagram,
  getNodeArray,
  getLinkArray,
  addNode,
  addChildNode,
  getJson,
  renderJson,
  updateProperty,
  setLinkedState
})
</script>

<style lang="less" scoped>
.base-diagram {
  box-sizing: content-box;
  position: relative;
  height: 100%;
  // width: calc(100% - 2px);
  display: flex;
  flex-direction: row;
  .main {
    flex: 1;
  }
}
</style>
