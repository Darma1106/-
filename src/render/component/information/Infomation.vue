<template>
  <div class="information">
    <div class="tab-area">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="数据" />
        <a-tab-pane key="2" tab="关联" />
      </a-tabs>
    </div>
    <div ref="propertyRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Diagram } from 'gojs'
import { Inspector } from '../baseDiagram/util/diagramTool/DataInspector'

const activeKey = ref('1')

const propertyRef: Ref<HTMLDivElement | null> = ref(null)

const renderProperty = (diagram: Diagram) => {
  new Inspector(propertyRef.value, diagram, {
    // 允许同时检查多个节点
    multipleSelection: false,
    // 当“多个选择”为真时，将显示节点属性的最大数目
    showLimit: 4,
    // when multipleSelection is true, when showUnionProperties is true it takes the union of properties
    // otherwise it takes the intersection of properties
    showUnionProperties: true,

    // 取消对此行的注释，以仅检查下面的命名属性，而不是每个对象上的所有属性
    // includesOwnProperties: false,
    properties: {
      key: { name: '标签', readOnly: true, show: Inspector.showIfPresent },
      id: { readOnly: true, show: Inspector.showIfPresent },
      from: { readOnly: true, show: Inspector.showIfPresent },
      to: { readOnly: true, show: Inspector.showIfPresent },
      color: { show: true, type: 'color' },
      toolDataAttrVOs: { show: false }
    }
  })
}

defineExpose({ renderProperty })
</script>

<style lang="less" scoped>
.information {
  height: 100%;
  border-left: 1px solid @my-layout-border-color;
  ::v-deep(table, tbody) {
    width: 100%;
  }
}
.tab-area {
  text-align: center;
  border-bottom: 1px solid @my-layout-border-color;
  margin-bottom: 20px;

  ::v-deep(.ant-tabs-bar) {
    margin-bottom: 2px;
  }
}
</style>
