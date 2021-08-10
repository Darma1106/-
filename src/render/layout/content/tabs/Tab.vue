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
import { defineComponent, defineAsyncComponent, onMounted } from 'vue'
import { useTabStore } from '@/store'
export default defineComponent({
  components: {
    UmlClass: defineAsyncComponent(() => import('@/views/umlClass/UmlClass.vue')),
    ActiveModel: defineAsyncComponent(() => import('@/views/activeModel/ActiveModel.vue')),
    // ActiveModel: defineAsyncComponent(() => import('@/common/testModel.vue')),

    MatrixModel: defineAsyncComponent(() => import('@/views/matrixModel/MatrixModel.vue')),
    OrganizationModel: defineAsyncComponent(() => import('@/views/organizationModel/OrganizationModel.vue')),
    SequenceModel: defineAsyncComponent(() => import('@/views/sequenceModel/SequenceModel.vue')),
    ProcessModel: defineAsyncComponent(() => import('@/views/processModel/ProcessModel.vue')),
    TableModel: defineAsyncComponent(() => import('@/views/tableModel/TableModel.vue'))
  },
  setup() {
    const { tabs, activeTab, add, change, remove } = useTabStore()

    const onEdit = (targetKey: string) => {
      remove(targetKey)
    }

    // 默认选中第一个
    onMounted(() => {
      // change(tabs.value[0].key)
    })

    return {
      tabs,
      activeTab,
      add,
      change,
      remove,
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
  border-left: 1px solid #000;
  border-right: 1px solid #000;

  .tab-panel {
    height: 100%;
    box-sizing: border-box !important;

    // border-left: 1px solid #000;
    // border-right: 1px solid #000;
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
