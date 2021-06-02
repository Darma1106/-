<template>
  <a-tabs v-model:activeKey="activeKey" class="tabs" hide-add type="editable-card" @edit="onEdit">
    <a-tab-pane
      v-for="pane in panes"
      v-show="pane.key == activeKey"
      :key="pane.key"
      class="tab-panel"
      :tab="pane.title"
      :closable="pane.closable"
    >
      <!-- <router-view /> -->
      <component :is="pane.component" v-if="pane.key == activeKey"></component>
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from 'vue'
import type { Pane } from './type'
import UmlClass from '/@/views/gojs/umlClass.vue'
import ActiveModel from '/@/views/gojs/activeModel.vue'

export default defineComponent({
  components: {
    UmlClass,
    ActiveModel
  },
  setup() {
    const panes: Ref<Pane[]> = ref([
      { title: 'Tab 1', content: 'Content of Tab 1', key: '1', closable: true, component: 'ActiveModel' },
      { title: 'Tab 2', content: 'Content of Tab 2', key: '2', closable: true, component: 'UmlClass' }
    ])
    const activeKey = ref(panes.value[0].key)
    const newTabIndex = ref(0)

    watch(activeKey, (val) => {
      console.log(val)
    })
    const add = () => {
      activeKey.value = `newTab${newTabIndex.value++}`
      panes.value.push({
        title: `New Tab ${activeKey.value}`,
        content: `Content of new Tab ${activeKey.value}`,
        key: activeKey.value,
        closable: true,
        component: 'PartTwo'
      })
    }

    const remove = (targetKey: string) => {
      let lastIndex = 0
      panes.value.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1
        }
      })
      panes.value = panes.value.filter((pane) => pane.key !== targetKey)
      if (panes.value.length && activeKey.value === targetKey) {
        if (lastIndex >= 0) {
          activeKey.value = panes.value[lastIndex].key
        } else {
          activeKey.value = panes.value[0].key
        }
      }
    }

    const onEdit = (targetKey: string) => {
      remove(targetKey)
    }

    return {
      panes,
      activeKey,
      onEdit,
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
