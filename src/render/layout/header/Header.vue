<template>
  <div class="menu-bar">
    <HeadMenuItem v-for="item in itemList" :key="item.name" class="menu-bar-item" :item-list="item" />
  </div>
  <ToolBar />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

import HeadMenuItem from '@/component/headMenuItem/HeadMenuItem.vue'

import { useEventStore } from '@/store'
import ToolBar from './ToolBar.vue'

import type { MenuItem } from '@/component/headMenuItem/type'

export default defineComponent({
  components: { HeadMenuItem, ToolBar },
  setup() {
    const { eventSwitch } = useEventStore()
    const handleProjectManage = () => {
      eventSwitch('projectManage', 'system')
    }
    const itemList: MenuItem[] = reactive([
      {
        name: 'gongcheng',
        label: '项目管理(P)',
        children: [
          { name: 'projectManage', label: '项目管理', click: handleProjectManage },
          { name: 'caidan2', label: '菜单二' }
        ]
      },
      {
        name: 'gongcheng',
        label: '计算模型配置(C)',
        children: [
          { name: 'caidan1', label: '菜单1' },
          { name: 'caidan2', label: '菜单二' }
        ]
      },
      {
        name: 'gongcheng',
        label: '方案动态生成(G)',
        children: [
          { name: 'caidan1', label: '菜单1' },
          { name: 'caidan2', label: '菜单二' }
        ]
      },
      {
        name: 'gongcheng',
        label: '方案分析(A)',
        children: [
          { name: 'caidan1', label: '菜单1' },
          { name: 'caidan2', label: '菜单二' }
        ]
      },
      {
        name: 'gongcheng',
        label: '编辑(E)',
        children: [
          { name: 'caidan1', label: '菜单1' },
          { name: 'caidan2', label: '菜单二' }
        ]
      },
      {
        name: 'gongcheng',
        label: '视图(V)',
        children: [
          { name: 'caidan1', label: '菜单1' },
          { name: 'caidan2', label: '菜单二' }
        ]
      },
      {
        name: 'gongcheng',
        label: '系统(S)',
        children: [
          { name: 'caidan1', label: '菜单1' },
          { name: 'caidan2', label: '菜单二' }
        ]
      }
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
