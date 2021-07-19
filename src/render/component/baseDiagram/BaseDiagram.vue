<template>
  <div class="base-diagram">
    <div ref="editRef" class="editor"></div>
    <div ref="mainRef" class="main"></div>
    <!-- <button @click="getJson">show Json</button> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, PropType, Ref, ref } from 'vue'
import { unrefElement } from '@vueuse/core'
import * as go from 'gojs'
import { commonNodeMap } from '@/component/baseDiagram/util/defaultNode'
import { commonLinkMap } from '@/component/baseDiagram/util/defaultLine'
import { v4 as uuidv4 } from 'uuid'
import { supportLineMaker } from './util/diagram'
import type { Template, EditorData, CommonNodeType, CommonLinkType } from './type'

const make = go.GraphObject.make
type AfterLink = (data: go.ObjectData) => void

export default defineComponent({
  name: '',
  components: {},
  props: {
    editor: {
      type: Boolean,
      default: true
    },
    nodeMap: {
      type: Array as PropType<Template<go.Node>[]>
    },
    linkMap: {
      type: Array as PropType<Template<go.Link>[]>
    },
    editorMap: {
      type: Array as PropType<Template<go.Node>[]>
    },
    editorTemplate: {
      type: Array as PropType<EditorData[]>
    },
    diagramEvents: {
      type: Object as PropType<go.DiagramEventsInterface>
    },
    afterLink: {
      type: Object as PropType<AfterLink>
    },
    // 布局模式
    treeLayout: {
      type: Boolean,
      default: false
    },
    defaultLinkType: {
      type: String,
      default: 'defaultLink'
    }
  },
  setup(props) {
    const mainRef: Ref<HTMLDivElement | null> = ref(null)
    const editRef: Ref<HTMLDivElement | null> = ref(null)
    let diagram: go.Diagram | null = null

    function init(templeteRef: HTMLDivElement): go.Diagram {
      const myDiagram = make(
        go.Diagram,
        templeteRef,
        // 获取辅助线
        Object.assign({
          'animationManager.isEnabled': false,
          LinkDrawn,
          externalobjectsdropped
        }),
        supportLineMaker()
      )

      // 注入默认Node类型
      for (const key in commonNodeMap) {
        if (Object.prototype.hasOwnProperty.call(commonNodeMap, key)) {
          const element: go.Node = commonNodeMap[key as CommonNodeType]
          myDiagram.nodeTemplateMap.add(key, element)
        }
      }

      // 分配节点模板
      props.nodeMap?.forEach(({ name, template }) => {
        myDiagram.nodeTemplateMap.add(name, template)
      })

      // 注入默认Link类型
      for (const key in commonLinkMap) {
        if (Object.prototype.hasOwnProperty.call(commonLinkMap, key)) {
          const element: go.Link = commonLinkMap[key as CommonLinkType]
          myDiagram.linkTemplateMap.add(key, element)
        }
      }

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

      if (props.treeLayout) {
        myDiagram.layout = make(go.TreeLayout, {
          angle: 90,
          layerStyle: go.TreeLayout.LayerUniform
        })
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
      diagram.model.setDataProperty(diagram.selection.first()?.data, 'key', uuidv4())
    }

    // 连线事件
    function LinkDrawn({ diagram: { model }, subject: { data } }: go.DiagramEvent) {
      if (props.defaultLinkType) {
        ;(model as go.GraphLinksModel).removeLinkData(data)
        data.category = props.defaultLinkType
        data.id = uuidv4()
        if (props.afterLink) {
          props?.afterLink(data)
        }
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
    const getJson = () => {
      if (diagram) {
        console.log(diagram.model.toJson())
      }
    }
    return { mainRef, editRef, getDiagram, addNode, getJson }
  }
})
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
