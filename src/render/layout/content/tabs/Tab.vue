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
import { useTabs } from '@/composition'
export default defineComponent({
  components: {
    UmlClass: defineAsyncComponent(() => import('@/views/umlClass/UmlClass.vue')),
    ActiveModel: defineAsyncComponent(() => import('@/views/activeModel/ActiveModel.vue')),
    MatrixModel: defineAsyncComponent(() => import('@/views/matrixModel/MatrixModel.vue')),
    OrganizationModel: defineAsyncComponent(() => import('@/views/organizationModel/OrganizationModel.vue')),
    SequenceModel: defineAsyncComponent(() => import('@/views/sequenceModel/SequenceModel.vue')),
    ProcessModel: defineAsyncComponent(() => import('@/views/processModel/ProcessModel.vue'))
  },
  setup() {
    const { tabs, activeTab, add, change, remove } = useTabs()

    const onEdit = (targetKey: string) => {
      remove(targetKey)
    }

    // 默认选中第一个
    onMounted(() => {
      change(tabs.value[0].key)
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
.tabs {
  height: 100%;

  .tab-panel {
    height: 100%;
  }
  ::v-deep(.ant-tabs-bar) {
    margin: 0;
    // border-top: 1px solid #000;
    border-bottom: 1px solid #000;

    .ant-tabs-tab {
      background-color: #ddd;
    }
  }

  ::v-deep(.ant-tabs-top-content, .ant-tabs-bottom-content) {
    height: calc(100% - 40px);
    width: 100%;
  }

  ::v-deep(.ant-tabs-nav .ant-tabs-tab-active) {
    font-weight: normal;
    background-color: #fff;
    border: none;
    // border-left: 1px solid black;
    border-right: 1px solid black;
  }
}
</style>
