<template>
  <div class="menu-bar">
    <HeadMenuItem v-for="item in itemList" :key="item.name" class="menu-bar-item" :item-list="item" />
  </div>
  <ToolBar v-if="toolBarState" />
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import type { Ref } from 'vue'

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
    const recentlyScheme: Ref<MenuItem[]> = ref([])
    onMounted(() => {
      recentlyScheme.value.push({ name: '1', label: '最近方案1' })
    })

    const itemList: MenuItem[] = reactive([
      {
        name: 'gongcheng',
        label: '项目(P)',
        children: [
          {
            name: 'projectManage',
            label: '新建',
            click: () => {
              eventSwitch('addProject', 'system')
            }
          },
          { name: 'projectManage', label: '打开', click: handleProjectManage },
          {
            name: 'projectManage',
            label: '最近打开',
            click: handleProjectManage,
            children: recentlyScheme
          },
          {
            name: 'projectManage',
            label: '编辑',
            click: () => {
              eventSwitch('editProject', 'system')
            }
          },
          { name: 'projectManage', label: '关闭', click: handleProjectManage },
          { name: 'projectManage', label: '项目管理', click: handleProjectManage }
        ]
      },
      {
        name: 'gongcheng',
        label: '编辑(E)',
        children: [
          { name: 'caidan1', label: '撤销' },
          { name: 'caidan2', label: '重做' },
          { name: 'caidan1', label: '复制' },
          { name: 'caidan2', label: '粘贴' },
          { name: 'caidan1', label: '删除' },
          { name: 'caidan2', label: '对齐' },
          { name: 'caidan1', label: '自动布局' }
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
        label: '格式(G)',
        children: [
          { name: 'caidan1', label: '菜单1' },
          { name: 'caidan2', label: '菜单二' }
        ]
      },
      {
        name: 'gongcheng',
        label: '画图(A)',
        children: [
          { name: 'caidan1', label: '菜单1' },
          { name: 'caidan2', label: '菜单二' }
        ]
      },
      {
        name: 'gongcheng',
        label: '计算模型配置(A)',
        children: [
          { name: 'caidan1', label: '计算模型加载' },
          { name: 'caidan2', label: '语义匹配模型构建' },
          { name: 'caidan1', label: '指标匹配模型构建' },
          { name: 'caidan2', label: '流程编配模型构建' },
          { name: 'caidan1', label: '服务组合模型构建' }
        ]
      },
      {
        name: 'gongcheng',
        label: '方案动态生成(A)',
        children: [
          { name: 'caidan1', label: '计算模型选择' },
          { name: 'caidan2', label: '能力包生成' },
          { name: 'caidan2', label: '跨域体系生成' }
        ]
      },
      {
        name: 'gongcheng',
        label: '方案分析(A)',
        children: [
          { name: 'caidan1', label: '基于韧性的方案分析' },
          { name: 'caidan2', label: '基于能力效果的方案分析' },
          { name: 'caidan2', label: '跨域体系方案综合分析' }
        ]
      },
      {
        name: 'gongcheng',
        label: '窗体(A)',
        children: [
          { name: 'caidan1', label: '菜单1' },
          { name: 'caidan2', label: '菜单二' }
        ]
      },
      {
        name: 'gongcheng',
        label: '报告生成(A)',
        children: [
          { name: 'caidan1', label: '菜单1' },
          { name: 'caidan2', label: '菜单二' }
        ]
      },

      {
        name: 'gongcheng',
        label: '系统(S)',
        children: [
          { name: 'caidan1', label: '角色管理' },
          { name: 'caidan2', label: '用户管理' },
          { name: 'caidan1', label: '元模型数据定义' },
          { name: 'caidan2', label: '数据更新' }
        ]
      }
    ])

    return { itemList, toolBarState }
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
