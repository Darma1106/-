<template>
  <a-tabs :active-key="activeTab" class="tabs" hide-add type="editable-card" @edit="onEdit" @change="change"
    ><a-tab-pane
      v-for="pane in tabs"
      v-show="pane.key == activeTab"
      :key="pane.key"
      class="tab-panel"
      :tab="pane.title"
      :closable="pane.closable"
      ><component :is="pane.component" v-show="pane.key == activeTab" :tab-id="pane.key"></component></a-tab-pane
  ></a-tabs>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, toRefs } from 'vue'
import { useTabStore } from '@/store/modules/tab'
export default defineComponent({
  components: {
    UmlClass: defineAsyncComponent(() => import('@/views/umlClass/UmlClass.vue')),
    ACTIVITY_GRAPHIC: defineAsyncComponent(() => import('@/views/activeModel/ActiveModel.vue')),
    NETWORK_GRAPHIC: defineAsyncComponent(() => import('@/views/activeModel/ActiveModel.vue')),
    MATRIX_GRAPHIC: defineAsyncComponent(() => import('@/views/matrixModel/MatrixModel.vue')),
    TREE_GRAPHIC: defineAsyncComponent(() => import('@/views/organizationModel/OrganizationModel.vue')),
    TIMELINE_GRAPHIC: defineAsyncComponent(() => import('@/views/sequenceModel/SequenceModel.vue')),
    FLOW_GRAPHIC: defineAsyncComponent(() => import('@/views/processModel/ProcessModel.vue')),
    TABLE_GRAPHIC: defineAsyncComponent(() => import('@/views/tableModel/TableModel.vue'))
  },
  setup() {
    const { tabs, activeTab, change, remove } = toRefs(useTabStore())

    const onEdit = (targetKey: string) => {
      remove.value(targetKey)
    }

    return {
      tabs,
      activeTab,
      change,
      onEdit
    }
  }
})
</script>

<style lang="less" scoped>
// .tabs {
//   height: 100%;
//   padding-top: 6px;

//   .tab-panel {
//     height: 100%;
//   }
//   ::v-deep(.ant-tabs-bar) {
//     margin: 0;
//     // padding-left: 10px;

//     .ant-tabs-tab {
//       background-color: #fff;
//     }
//   }

//   ::v-deep(.ant-tabs-top-content, .ant-tabs-bottom-content) {
//     height: calc(100% - 40px);
//     width: 100%;
//   }

//   ::v-deep(.ant-tabs-nav .ant-tabs-tab-active) {
//     font-weight: normal;
//     background-color: #f2f2f2;
//     // border-top: 1px solid black;
//     // border-left: 1px solid black;
//     // border-right: 1px solid black;
//   }
// }

.tabs {
  height: 100%;
  width: calc(100% - 2px);
  border-left: @1px-border;
  border-right: @1px-border;

  .tab-panel {
    height: 100%;
    box-sizing: border-box !important;
  }
  ::v-deep(.ant-tabs-bar) {
    margin: 0;
    width: calc(100% - 2px);
    background-color: #ddd;
  }

  ::v-deep(.ant-tabs-top-content, .ant-tabs-bottom-content) {
    height: calc(100% - 40px);
    width: 100%;
  }
  ::v-deep(.ant-tabs-nav .ant-tabs-tab) {
    background-color: #ddd;
    border-bottom: #ddd;
    border: none;
  }

  ::v-deep(.ant-tabs-nav .ant-tabs-tab-active) {
    font-weight: normal;
    background-color: #f2f2f2;
    border-bottom: 1px solid #f2f2f2;
  }
}
</style>
