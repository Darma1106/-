<template>
  <splitpanes class="layout-content default-theme" horizontal :push-other-panes="false" style="height: 100%">
    <pane>
      <splitpanes class="layout-content default-theme">
        <pane>
          <div class="base-diagram">
            <Editor v-if="editorState" :editor-data="editorData" @active-item-change="editorItemChange" />
            <div ref="mainRef" class="main"></div>
            <!-- <button @click="getJson">show Json</button> -->
          </div>
        </pane>
        <pane v-if="porpertyState" min-size="8" max-size="25" size="15">
          <Information ref="infoRef" :diagram-instance="diagram" />
        </pane>
      </splitpanes>
    </pane>
  </splitpanes>
</template>

<script lang="ts" setup>
import { inject, nextTick, onMounted, ref, toRefs, watch } from 'vue'
import type { Ref } from 'vue'
import { unrefElement } from '@vueuse/core'
import * as go from 'gojs'
import { v4 as uuidv4 } from 'uuid'
import Splitpanes from 'splitpanes/src/components/splitpanes/splitpanes.vue'
import Pane from 'splitpanes/src/components/splitpanes/pane.vue'
import Information from '../information/Infomation.vue'
import type { BaseModalInstance } from '../information/type'
import { addChild, makeAddButton } from './util/node'
import Editor from './editor.vue'
import type { Template, AfterInit, AfterLink } from './type'
import { guidedDraggingToolOption } from '@/component/baseDiagram/util/diagramTool/GuidedDraggingTool'
import { LinkShiftingTool } from '@/component/baseDiagram/util/diagramTool/LinkShiftingTool'
import { injectLinkMap } from '@/component/baseDiagram/util/defaultLine'
import { injectNodeMap } from '@/component/baseDiagram/util/defaultNode'
import { useEventStore, useLayoutStore } from '@/store'
import type { ModelTool, ModelInstanceEditDTO, DataInstanceAttrDTO, ToolMeta } from '@/services/module/modelService'
import { proptyDatatoAttrDTOs, toDataInstanceDTOs, proptyDataExplain } from '@/common/dataTransfer'
import ModelService from '@/services/module/modelService'

interface Props {
  editor?: boolean
  editorTemplate?: ModelTool[]
  nodeMap?: Template<go.Node>[]
  linkMap?: Template<go.Link>[]
  diagramEvents?: go.DiagramEventsInterface
  treeLayout?: boolean
  defaultLinkType?: string
  diagramOption?: AnyObject
  afterLink?: AfterLink
  afterInit?: AfterInit
}

const make = go.GraphObject.make

const props = withDefaults(defineProps<Props>(), {
  editor: true,
  treeLayout: false,
  defaultLinkType: 'defaultLink'
  // diagramOption:''
})

const mainRef: Ref<HTMLDivElement | null> = ref(null)
const infoRef: Ref<BaseModalInstance | null> = ref(null)

let diagram: go.Diagram | null = null

// 活跃的编辑栏选项
let activeEditorType: ToolMeta | null = null

function init(templeteRef: HTMLDivElement): go.Diagram {
  const myDiagram = make(
    go.Diagram,
    templeteRef,
    // 获取辅助线
    Object.assign(
      guidedDraggingToolOption,
      {
        'animationManager.isEnabled': false,
        click: diagramClick,
        allowLink: false,
        allowRelink: true,
        LinkDrawn
      },
      props.diagramOption
    )
    //
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
    subject.data.id = uuidv4().replaceAll('-', '')
    // afterLink回调
    if (props.afterLink) {
      props?.afterLink(subject, model)
    }
    // 合并选中连线的data

    if (activeEditorType && activeEditorType.style.length != 0) {
      const style = JSON.parse(activeEditorType.style)
      subject.data.toolMetasId = activeEditorType.id
      subject.data.dataInstanceTypeCode = activeEditorType.dataInstanceTypeCode
      Object.assign(subject.data, style)
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
    infoRef.value?.renderProperty(diagram)
    // LinkShiftingTool 实例
    const linkShift = make(LinkShiftingTool)
    diagram.toolManager.mouseDownTools.add(linkShift)
    diagram.nodeSelectionAdornmentTemplate = makeAddButton(addChildNode)
  })
})

// 点击画布
const diagramClick = (e: go.InputEvent) => {
  const { documentPoint } = e
  if (activeEditorType && activeEditorType.typeForCanvas == 'FLEXIBLE_LINK') {
    const link = JSON.parse(activeEditorType.style)
    link.points = new go.List(/*go.Point*/).addAll([
      new go.Point(documentPoint.x, documentPoint.y - 40),
      new go.Point(documentPoint.x, documentPoint.y)
    ])
    link.toolMetasId = activeEditorType.id
    link.dataInstanceTypeCode = activeEditorType.dataInstanceTypeCode
    const linkModel = getDiagram()?.model as go.GraphLinksModel
    linkModel.addLinkData(link)
  } else if (activeEditorType && activeEditorType.typeForCanvas != 'LINK') {
    // 给节点带上提交接口时所需要的信息
    const node = JSON.parse(activeEditorType.style)
    node.toolDataAttrVOs = activeEditorType.toolDataAttrVOs
    Object.assign(node, proptyDataExplain(activeEditorType.toolDataAttrVOs))
    node.key = uuidv4().replaceAll('-', '')
    node.toolMetasId = activeEditorType.id
    node.dataInstanceTypeCode = activeEditorType.dataInstanceTypeCode
    node.loc = `${documentPoint.x} ${documentPoint.y}`
    console.log(activeEditorType)

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
    // diagram.allowRelink = state
  }
}

// 编辑栏选中变化
const editorItemChange = (item: ToolMeta) => {
  console.log('editorItemChange', item)
  setLinkedState(item && item.typeForCanvas == 'LINK')
  activeEditorType = item
}

// 属性栏联动
// const selectionNode: Ref<go.ObjectData> = ref({})

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

// property显示/隐藏
const { editorState, porpertyState } = toRefs(useLayoutStore())
watch(porpertyState, (val) => {
  if (val == true) {
    const diagram = getDiagram() as go.Diagram
    nextTick(() => {
      infoRef.value?.renderProperty(diagram)
    })
  }
})

const typeId = inject('typeId') as string
const editorData: Ref<ModelTool[]> = ref([])

const getToolData = async () => {
  const { data } = await ModelService.getModelTool(typeId)
  editorData.value = data
}
onMounted(() => {
  if (props.editorTemplate) {
    editorData.value = props.editorTemplate
  } else {
    getToolData()
  }
})

// 画布存储
const tabId = inject('tabId') as string
const saveDiagram = () => {
  const diagram = getDiagram() as go.Diagram
  const nodeData = diagram.model.nodeDataArray
  const linkData = (diagram.model as go.GraphLinksModel).linkDataArray

  const dataInstanceAttrDTOs: DataInstanceAttrDTO[] = []
  const dataInstanceDTOs = toDataInstanceDTOs(nodeData, linkData)
  nodeData.forEach((node) => {
    dataInstanceAttrDTOs.push(...proptyDatatoAttrDTOs(node))
  })
  const editInterface: ModelInstanceEditDTO = {
    dataInstanceAttrDTOs,
    dataInstanceDTOs,
    id: tabId ?? '',
    jsonContent: diagram.model.toJson()
  }
  ModelService.editModelInstance(editInterface)
}

// 保存注册
const eventStore = useEventStore()
eventStore.onSave(saveDiagram, tabId)
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
