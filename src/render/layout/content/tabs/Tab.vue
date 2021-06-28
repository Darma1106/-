<template>
  <a-tabs :active-key="activeTab?.key" class="tabs" hide-add type="editable-card" @edit="onEdit" @change="onTabChange"
    ><a-tab-pane
      v-for="pane in panes"
      v-show="pane.key == activeTab?.key"
      :key="pane.key"
      class="tab-panel"
      :tab="pane.title"
      :closable="pane.closable"
      ><component :is="pane.component" v-show="pane.key == activeTab?.key"></component></a-tab-pane
  ></a-tabs>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, computed, onMounted } from 'vue'
import { useStore } from '@/store'
export default defineComponent({
  components: {
    UmlClass: defineAsyncComponent(() => import('@/views/umlClass/UmlClass.vue')),
    ActiveModel: defineAsyncComponent(() => import('@/views/activeModel/ActiveModel.vue')),
    MatrixModel: defineAsyncComponent(() => import('@/views/matrixModel/MatrixModel.vue')),
    OrganizationModel: defineAsyncComponent(() => import('@/views/organizationModel/OrganizationModel.vue')),
    SequenceModel: defineAsyncComponent(() => import('@/views/sequenceModel/SequenceModel.vue'))
  },
  setup() {
    const store = useStore()
    const activeTab = computed(() => store.state.tabs.activeTab)
    const panes = computed(() => store.state.tabs.panes)

    const add = () => {
      store.dispatch('tabs/add', { title: 'sequence222', key: '12', closable: true, component: 'SequenceModel' })
    }

    // 删除tab页
    const remove = (targetKey: string) => {
      store.dispatch('tabs/remove', targetKey)
    }

    const onEdit = (targetKey: string) => {
      remove(targetKey)
    }

    const onTabChange = (targetKey: string) => {
      store.dispatch('tabs/change', targetKey)
    }

    // 默认选中第一个
    onMounted(() => {
      onTabChange(panes.value[0].key)
    })

    return {
      panes,
      activeTab,
      onEdit,
      onTabChange,
      add
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
  }

  ::v-deep(.ant-tabs-top-content, .ant-tabs-bottom-content) {
    height: calc(100% - 40px);
    width: 100%;
  }
}
</style>
