<template>
  <div class="tool-bar">
    <ContextButton :item-info="itemInfo" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import ContextButton from '@/component/panelItem/contextButton.vue'
import type { toolConfig } from '@/component/panelItem/type'

export default defineComponent({
  name: 'ToolBar',
  components: { ContextButton },
  setup() {
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
    return { itemInfo }
  }
})
</script>

<style lang="less" scope>
.tool-bar {
  height: 95px;
  background: #fbe7e6;
}
</style>
