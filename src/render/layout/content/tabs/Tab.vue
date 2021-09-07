<template>
  <a-tabs :active-key="activeTab" class="tabs" hide-add type="editable-card" @edit="onEdit" @change="change"
    ><a-tab-pane v-for="pane in tabs" :key="pane.key" :tab="pane.title" :closable="pane.closable"></a-tab-pane
  ></a-tabs>
  <div v-for="pane in tabs" v-show="pane.key == activeTab" :key="pane.key" class="tab-view">
    <component :is="pane.component" :tab-id="pane.key" :type-id="pane.typeId"></component>
  </div>
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
    // FLOW_GRAPHIC: defineAsyncComponent(() => import('@/views/processModel/ProcessModel.vue')),
    FLOW_GRAPHIC: defineAsyncComponent(() => import('@/views/Idef0Model/Idef0Model.vue')),
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
.tabs {
  // height: 100%;
  border-right: 2px solid @my-layout-border-color;

  ::v-deep(.ant-tabs-nav-container) {
    height: 28px !important;
    margin-bottom: 0px;
  }

  ::v-deep(.ant-tabs-bar) {
    margin: 0;
    // width: calc(100% - 1px);
    height: 28px;
    background-color: @content-header-background-color;
    border-bottom: 1px solid @content-border-color;
  }

  // ::v-deep(.ant-tabs-top-content, .ant-tabs-bottom-content) {
  //   height: calc(100% - 40px);
  //   width: 100%;
  // }
  ::v-deep(.ant-tabs-nav .ant-tabs-tab) {
    background-color: @base-active-color;
    border: 1px solid @content-border-color;
    line-height: 28px;
    border-radius: 4px 4px 0 0;
    height: 28px;
  }

  ::v-deep(.ant-tabs-nav .ant-tabs-tab-active) {
    color: rgba(0, 0, 0, 0.85);
    font-weight: normal;
    height: 28px;
    background-color: @base-background-color;
    border-bottom: 1px solid @base-background-color;
  }

  ::v-deep(.ant-tabs-nav .ant-tabs-tab:hover) {
    color: rgba(0, 0, 0, 0.85);
  }
}

.tab-view {
  height: calc(100% - 28px);
  border-right: 2px solid @my-layout-border-color;
}
</style>
