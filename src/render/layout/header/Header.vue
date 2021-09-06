<template>
  <div class="tool-title">跨域作战体系建模工具</div>
  <div class="menu-bar">
    <div class="tool-icon">
      <BaseIcon :icon-type="toolIconType" />
    </div>
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
import { iconFont } from '@/component/baseIcon/type/enum'
import BaseIcon from '@/component/baseIcon/BaseIcon.vue'
import type { MenuItem } from '@/component/headMenuItem/type'

export default defineComponent({
  components: { HeadMenuItem, ToolBar, BaseIcon },
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

    const alignItems: MenuItem[] = reactive([
      { name: 'editAlignTop', label: '顶部对齐' },
      { name: 'editAlignHorizontalCenter', label: '水平居中' },
      { name: 'editAlignBottom', label: '底部对齐' },
      { name: 'split', label: '分隔线' },
      { name: 'editAlignLeft', label: '左对齐' },
      { name: 'editAlignVerticalCenter', label: '垂直居中' },
      { name: 'editAlignRight', label: '左对齐' }
    ])

    const toolIconType = iconFont.工具图标

    const itemList: MenuItem[] = reactive([
      {
        name: 'project',
        label: '项目',
        children: [
          {
            name: 'projectNew',
            label: '新建',
            click: () => {
              eventSwitch('addProject', 'system')
            },
            shortcutKey: 'Ctrl+N'
          },
          { name: 'projectOpen', label: '打开', click: handleProjectManage, shortcutKey: 'Ctrl+O' },
          {
            name: 'projectRecentOpen',
            label: '最近打开',
            click: handleProjectManage,
            children: recentlyScheme
          },
          {
            name: 'projectEdit',
            label: '编辑',
            click: () => {
              eventSwitch('editProject', 'system')
            }
          },
          { name: 'projectClose', label: '关闭', click: handleProjectManage },
          { name: 'split', label: '分隔线' },
          { name: 'projectManage', label: '项目管理', click: handleProjectManage }
        ]
      },
      {
        name: 'edit',
        label: '编辑',
        children: [
          { name: 'editCancel', label: '撤销', shortcutKey: 'Ctrl+Z' },
          { name: 'editRedo', label: '重做' },
          { name: 'editCopy', label: '复制', shortcutKey: 'Ctrl+C' },
          { name: 'editPaste', label: '粘贴', shortcutKey: 'Ctrl+V' },
          { name: 'editDelete', label: '删除', shortcutKey: 'Delete' },
          { name: 'split', label: '分隔线' },
          { name: 'editAlign', label: '对齐', children: alignItems },
          { name: 'editAutoLayout', label: '自动布局' }
        ]
      },
      {
        name: 'view',
        label: '视图',
        children: [
          {
            name: 'viewToolbar',
            label: '工具栏',
            flag: toolBarState,
            click: () => {
              layoutStore.stateToggle('toolBarState')
            }
          },
          {
            name: 'viewNavbar',
            flag: sideBarState,
            label: '导航栏',
            click: () => {
              layoutStore.stateToggle('sideBarState')
            }
          },
          {
            name: 'viewModelingToolbar',
            label: '建模工具栏',
            flag: editorState,
            click: () => {
              layoutStore.stateToggle('editorState')
            }
          },
          {
            name: 'viewAttrEditbar',
            label: '属性编辑栏',
            flag: porpertyState,
            click: () => {
              layoutStore.stateToggle('porpertyState')
            }
          },
          { name: 'split', label: '分隔线' },
          {
            name: 'viewReset',
            label: '视图复位'
          }
        ]
      },
      {
        name: 'format',
        label: '格式'
        // children: [
        //   { name: 'caidan1', label: '菜单1' },
        //   { name: 'caidan2', label: '菜单二' }
        // ]
      },
      {
        name: 'draw',
        label: '画图'
        // children: [
        //   { name: 'caidan1', label: '菜单1' },
        //   { name: 'caidan2', label: '菜单二' }
        // ]
      },
      {
        name: 'gongcheng',
        label: '计算模型配置',
        children: [
          { name: 'caidan1', label: '计算模型加载' },
          { name: 'split', label: '分隔线' },
          { name: 'caidan2', label: '语义匹配模型构建' },
          { name: 'caidan1', label: '指标匹配模型构建' },
          { name: 'caidan2', label: '流程编配模型构建' },
          { name: 'caidan1', label: '服务组合模型构建' }
        ]
      },
      {
        name: 'gongcheng',
        label: '方案动态生成',
        children: [
          { name: 'caidan1', label: '计算模型选择' },
          { name: 'split', label: '分隔线' },
          { name: 'caidan2', label: '能力包生成' },
          { name: 'caidan2', label: '跨域体系生成' }
        ]
      },
      {
        name: 'gongcheng',
        label: '方案分析',
        children: [
          { name: 'caidan1', label: '基于韧性的方案分析' },
          { name: 'caidan2', label: '基于能力效果的方案分析' },
          { name: 'split', label: '分隔线' },
          { name: 'caidan2', label: '跨域体系方案综合分析' }
        ]
      },
      {
        name: 'gongcheng',
        label: '窗体'
        // children: [
        //   { name: 'caidan1', label: '菜单1' },
        //   { name: 'caidan2', label: '菜单二' }
        // ]
      },
      {
        name: 'gongcheng',
        label: '报告生成'
        // children: [
        //   { name: 'caidan1', label: '菜单1' },
        //   { name: 'caidan2', label: '菜单二' }
        // ]
      },

      {
        name: 'gongcheng',
        label: '系统',
        children: [
          { name: 'caidan1', label: '角色管理' },
          { name: 'caidan2', label: '用户管理' },
          { name: 'split', label: '分隔线' },
          { name: 'caidan1', label: '元模型数据定义' },
          { name: 'caidan2', label: '数据更新' }
        ]
      }
    ])

    return { itemList, toolBarState, toolIconType }
  }
})
</script>

<style lang="less" scoped>
.menu-bar {
  height: 30px;
  line-height: 30px;
  ::v-deep(.menu-bar-item) {
    font-size: @menu-font-size;
    min-width: 70px;
    padding: 0 15px 0 15px;
    text-align: center;
  }

  ::v-deep(.menu-bar-item:hover) {
    background-color: @menu-hover-color;
    border-radius: 4px 4px 0 0;
  }

  ::v-deep(.ant-dropdown-open) {
    background-color: @menu-active-color !important;
    border-radius: 4px 4px 0 0;
  }
}

.tool-title {
  color: @base-font-color;
  text-align: center;
  font-size: @title-font-size;
  height: 28px;
  line-height: 28px;
}

.tool-icon {
  display: inline-block;
  vertical-align: -webkit-baseline-middle;
  padding: 0px 10px 0 5px;
}
</style>
