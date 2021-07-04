<template>
  <div class="tool-bar">
    <ContextButton :item-info="itemInfo" />
    <button @click="save">save</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import ContextButton from '@/component/panelItem/contextButton.vue'
import { useEvent, useTabs } from '@/composition'

import type { toolConfig } from '@/component/panelItem/type'

export default defineComponent({
  name: 'ToolBar',
  components: { ContextButton },
  setup() {
    const { activeTab } = useTabs()

    const { eventSwitch } = useEvent()
    const save = () => {
      eventSwitch('save', activeTab.value)
    }

    const itemInfo: toolConfig = reactive({
      name: '123',
      title: '下拉按钮',
      disable: false,
      type: 'contextButton',
      contextMenu: [
        {
          title: '子菜单1',
          name: 'zicaidan1',
          disable: false,
          children: [
            {
              title: '子菜单1-1',
              name: 'ziczidan1-1',
              disable: true
            }
          ]
        },
        { title: '子菜单2', name: 'zicaidan2', disable: true }
      ]
    })
    return { itemInfo, save }
  }
})
</script>

<style lang="less" scoped>
.tool-bar {
  height: 95px;
  background: #fbe7e6;
}
</style>
