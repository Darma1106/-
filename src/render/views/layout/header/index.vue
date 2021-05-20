<template>
  <a-layout-header class="layout-header">
    <div class="menu-bar">
      <HeadMenuItem v-for="item in 5" :key="item" :item-list="itemList" />
    </div>
    <ToolBar />
  </a-layout-header>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import HeadMenuItem from '/@/component/headMenuItem/index.vue'
import ToolBar from './toolBar.vue'
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

<style lang="less" scope>
.layout-header {
  background-color: @header-color;
  padding: 0;
  height: auto;
  border-bottom: 2px solid #ddd;

  .menu-bar {
    height: 30px;
    line-height: 30px;
    > * {
      margin-left: 20px;
    }
  }
}
</style>
