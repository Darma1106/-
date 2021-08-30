<template>
  <div class="menu-bar">
    <HeadMenuItem v-for="item in itemList" :key="item.name" class="menu-bar-item" :item-list="item" />
  </div>
  <ToolBar />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

import ToolBar from './ToolBar.vue'
import HeadMenuItem from '@/component/headMenuItem/HeadMenuItem.vue'

import { useEventStore, useLayoutStore } from '@/store'

import type { MenuItem } from '@/component/headMenuItem/type'

export default defineComponent({
  components: { HeadMenuItem, ToolBar },
  setup() {
    const { eventSwitch } = useEventStore()
    const handleProjectManage = () => {
      eventSwitch('projectManage', 'system')
    }

    const layoutStore = useLayoutStore()
    const { toolBarState, sideBarState, editorState, porpertyState } = toRefs(useLayoutStore())

    const itemList: MenuItem[] = reactive([
      {
        name: 'gongcheng',
        label: '项目管理(P)',
        children: [
          { name: 'projectManage', label: '方案管理', click: handleProjectManage },
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
        name: 'shitu',
        label: '视图(V)',
        children: [
          {
            name: 'caidan1',
            label: '工具栏',
            flag: toolBarState,
            click: () => {
              layoutStore.stateToggle('toolBarState')
            }
          },
          {
            name: 'caidan2',
            flag: sideBarState,
            label: '导航栏',
            click: () => {
              layoutStore.stateToggle('sideBarState')
            }
          },
          {
            name: 'caidan3',
            label: '建模工具栏',
            flag: editorState,
            click: () => {
              layoutStore.stateToggle('editorState')
            }
          },
          {
            name: 'caidan4',
            label: '属性编辑栏',
            flag: porpertyState,
            click: () => {
              layoutStore.stateToggle('porpertyState')
            }
          }
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

    return { itemList, layoutStore }
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
