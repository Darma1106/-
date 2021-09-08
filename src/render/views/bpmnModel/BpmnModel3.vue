<template>
  <BaseDiagram
    ref="baseDiagram"
    class="bpmn-model"
    :editor-template="tempData"
    default-link-type="defaultLink"
    :diagram-setting="diagtamSetting"
  />
</template>

<script setup lang="ts">
import { provide } from 'vue'
import * as go from 'gojs'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'

import type { ModelTool } from '@/services/module/modelService'
import { DrawCommandHandler } from '@/component/baseDiagram/util/diagramTool/DrawCommandHandler'

import { BPMNLinkingTool, BPMNRelinkingTool } from '@/component/baseDiagram/util/diagramTool/BPMNClasses'
import { LaneResizingTool } from '@/component/baseDiagram/util/diagramTool/PoolLayout'
import { assignGroupLayer } from '@/component/baseDiagram/util/group'

interface Props {
  tabId: string
  typeId: string
}

const tempData: ModelTool[] = [
  {
    id: '44784904d9ed16ff5c5be1f1c60dfa22',
    name: '建模元素',
    sortno: 1,
    modelTypeId: '',
    toolMetasVOs: [
      {
        id: '3ef1f4cfb549516ddaac0c4d85a3c46b',
        icon: 'icon/modelToolIcon/rectangle.svg',
        style: '{"figure":"RoundedRectangle","category":"defaultNode","showContext":false}',
        name: '任务123',
        sortno: 1,
        dataInstanceTypeCode: 'TASK',
        typeId: '44784904d9ed16ff5c5be1f1c60dfa22',
        typeForCanvas: 'NODE',
        dataInstanceTypeName: '任务',
        toolDataAttrVOs: [
          {
            dataInstanceTypeCode: 'TASK',
            sortno: 1,
            defaultValue: '',
            selist: '',
            attrTypeName: '名称',
            attrTypeCode: 'NAME',
            attrTypeUnit: '',
            attrTypeInputType: 'INPUT'
          },
          {
            dataInstanceTypeCode: 'TASK',
            sortno: 2,
            defaultValue: '',
            selist: '',
            attrTypeName: '描述',
            attrTypeCode: 'DESCRIBE',
            attrTypeUnit: '',
            attrTypeInputType: 'INPUT'
          },
          {
            dataInstanceTypeCode: 'TASK',
            sortno: 3,
            defaultValue: '',
            selist: '',
            attrTypeName: '时间指标',
            attrTypeCode: 'TIME_INDEX',
            attrTypeUnit: '',
            attrTypeInputType: 'INPUT'
          },
          {
            dataInstanceTypeCode: 'TASK',
            sortno: 4,
            defaultValue: '',
            selist: '',
            attrTypeName: '速度指标',
            attrTypeCode: 'SPEED_INDEX',
            attrTypeUnit: '',
            attrTypeInputType: 'INPUT'
          }
        ]
      },
      {
        id: 'b659b75baa2321ea7af0be5ad1dc5aee',
        icon: 'icon/modelToolIcon/line.svg',
        style: '{"category":"defaultLink","dir":0}\r\n',
        name: '任务分解线',
        sortno: 2,
        dataInstanceTypeCode: 'TASK_DECOMPOSITION_LINE',
        typeId: '44784904d9ed16ff5c5be1f1c60dfa22',
        typeForCanvas: 'LINK',
        dataInstanceTypeName: '任务分解线',
        toolDataAttrVOs: []
      }
    ]
  },
  {
    id: '1064f3c3a4933e08b058398748ea0844',
    name: '绘图元素',
    sortno: 2,
    modelTypeId: '',
    toolMetasVOs: [
      {
        id: '968cd4d9fe5c7773bf12a7ed1a9606a7',
        icon: 'icon/modelToolIcon/annotation.svg',
        style: '',
        name: '注释',
        sortno: 1,
        dataInstanceTypeCode: 'NaN',
        typeId: '1064f3c3a4933e08b058398748ea0844',
        typeForCanvas: 'NODE',
        dataInstanceTypeName: 'NaN',
        toolDataAttrVOs: []
      },
      {
        id: 'fc7837ac162afd12411f113b3dedd20c',
        icon: 'icon/modelToolIcon/text.svg',
        style: '',
        name: '文本',
        sortno: 2,
        dataInstanceTypeCode: 'NaN',
        typeId: '1064f3c3a4933e08b058398748ea0844',
        typeForCanvas: 'NODE',
        dataInstanceTypeName: 'NaN',
        toolDataAttrVOs: []
      }
    ]
  }
]

const diagtamSetting = (diagramInstance: go.Diagram): Partial<go.Diagram> => {
  const option = {
    commandHandler: new DrawCommandHandler(), // defined in DrawCommandHandler.js
    // default to having arrow keys move selected nodes
    'commandHandler.arrowKeyBehavior': 'move',

    mouseDrop: function (e: go.InputEvent) {
      const diagram = e.diagram
      const ok = diagram.commandHandler.addTopLevelParts(diagram.selection, true)
      if (!ok) diagram.currentTool.doCancel()
    },
    resizingTool: new LaneResizingTool(diagramInstance),
    linkingTool: new BPMNLinkingTool(),
    relinkingTool: new BPMNRelinkingTool(),
    allowRelink: true,
    SelectionMoved: relayoutDiagram,
    SelectionCopied: relayoutDiagram,
    LinkRelinked: function (e: go.DiagramEvent) {
      assignGroupLayer(e.subject.containingGroup)
    }
  }
  return option
}

function relayoutDiagram(e: go.DiagramEvent): void {
  const diagram = e.diagram
  diagram.layout.invalidateLayout()
  diagram.findTopLevelGroups().each(function (g) {
    if (g.category === 'pool' && g.layout !== null) g.layout.invalidateLayout()
  })
  diagram.layoutDiagram()
}

const props = defineProps<Props>()

// 注入 provide
provide<string | undefined>('tabId', props.tabId)
provide<string | undefined>('typeId', props.typeId)
</script>

<style lang="less" scoped>
.bpmn-model {
  height: 100%;
}
</style>
