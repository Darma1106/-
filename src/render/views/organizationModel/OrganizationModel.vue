<template>
  <div class="organization-model">
    <!-- <button @click="saveDiagram">baocun</button> -->
    <BaseDiagram ref="baseDiagramRef" :after-link="afterLink" :tree-layout="true" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, provide } from 'vue'
import BaseDiagram from '@/component/baseDiagram/BaseDiagram.vue'

import type { BaseDiagramInstance } from '@/component/baseDiagram/type'
import type { ModelTool } from '@/services/module/modelService'

export default defineComponent({
  name: '',
  components: { BaseDiagram },
  props: {
    tabId: {
      type: String
    },
    typeId: {
      type: String
    }
  },
  setup(props) {
    const baseDiagramRef = ref<BaseDiagramInstance | null>(null)

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

    // 注入 provide
    provide<string | undefined>('tabId', props.tabId)
    provide<string | undefined>('typeId', props.typeId)

    return {
      baseDiagramRef,
      tempData,
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
