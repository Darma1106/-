<template>
  <div style="height: 100%">
    <!-- <div :style="{ marginBottom: '16px' }"> -->
    <!-- <a-button @click="add">ADD</a-button> -->
    <!-- </div> -->
    <a-tabs v-model:activeKey="activeKey" hide-add type="editable-card" @edit="onEdit">
      <a-tab-pane
        v-for="pane in panes"
        v-show="pane.key == activeKey"
        :key="pane.key"
        :tab="pane.title"
        :closable="pane.closable"
      >
        <component :is="pane.component"></component>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import type { Pane } from './type'
import PartOne from '/@/views/part/partOne.vue'
import PartTwo from '/@/views/part/PartTwo.vue'

export default defineComponent({
  components: {
    PartOne,
    PartTwo
  },
  setup() {
    const panes: Ref<Pane[]> = ref([
      { title: 'Tab 1', content: 'Content of Tab 1', key: '1', closable: true, component: 'PartOne' },
      { title: 'Tab 2', content: 'Content of Tab 2', key: '2', closable: true, component: 'PartTwo' }
    ])
    const activeKey = ref(panes.value[0].key)
    const newTabIndex = ref(0)

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
