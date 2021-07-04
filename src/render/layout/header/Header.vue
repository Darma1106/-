<template>
  <div class="menu-bar">
    <HeadMenuItem v-for="item in 5" :key="item" class="menu-bar-item" :item-list="itemList" />
  </div>
  <ToolBar />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

import HeadMenuItem from '@/component/headMenuItem/HeadMenuItem.vue'

import ToolBar from './ToolBar.vue'

import type { MenuItem } from '@/component/headMenuItem/type'

export default defineComponent({
  components: { HeadMenuItem, ToolBar },
  setup() {
    const itemList: MenuItem[] = reactive([
      { name: 'caidan1', label: '菜单1' },
      { name: 'caidan2', label: '菜单二' }
    ])

    return { itemList }
  }
})
</script>

<style lang="less" scoped>
.menu-bar {
  height: 30px;
  line-height: 30px;
  ::v-deep(.menu-bar-item) {
    margin-left: 20px;
  }
}
</style>
