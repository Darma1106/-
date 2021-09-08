<template>
  <div class="navbar">
    <div class="navbar-title">导航</div>
    <div class="side-tree">
      <a-tree
        v-if="treeData.length != 0"
        v-model:expanded-keys="defaultExpand"
        :replace-fields="{ children: 'children', key: 'nodeId', title: 'name' }"
        :tree-data="treeData"
        show-icon
        :selected-keys="selectedKeys"
        @select="(keys) => onSelect(keys)"
      >
        <template #icon> <BaseIcon :icon-type="iconFont.模型" /> </template>

        <template #title="{ dataRef, name }"
          ><span @dblclick="nodeDblclick(dataRef)"> {{ name }}</span>
        </template>

        <template #meca="{ key: treeKey, title }">
          <a-dropdown :trigger="['contextmenu']">
            <span>{{ title }}</span>
            <template #overlay>
              <!-- 暂未找到解决template类型推断不正确的方法 -->
              <a-menu @click="({ key: menukey }) => onContextMenuClick(treeKey, menukey)">
                <a-menu-item key="1">1st menu item</a-menu-item>
                <a-menu-item key="2">2nd menu item</a-menu-item>
                <a-menu-item key="3">3rd menu item</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>

        <template #SCHEME>
          <BaseIcon :icon-type="iconFont.项目" />
        </template>
        <template #MODEL_INSTANCE>
          <BaseIcon :icon-type="iconFont.模型" />
        </template>
        <template #VIEW_FOLDER>
          <BaseIcon :icon-type="iconFont.文件夹" />
        </template>
      </a-tree>
    </div>
  </div>
</template>

<script lang="ts">
import { Tree } from 'ant-design-vue'
import { computed, defineComponent, onMounted, ref, toRefs } from 'vue'
import type { Ref } from 'vue'
import { addSlots } from './toTreeData'
import BaseIcon from '@/component/baseIcon/BaseIcon.vue'

import { useSchemeStore, useTabStore } from '@/store'
import { iconFont } from '@/component/baseIcon/type/enum'

import type { SchemeTree } from '@/services/module/schemeService'
import type { Pane } from '@/store/modules/tab'
import ModelService from '@/services/module/modelService'

export default defineComponent({
  components: {
    ATree: Tree,
    BaseIcon
  },
  setup() {
    // const treeData: Ref<TreeData[]> = ref([])
    // onMounted(async () => {
    //   const { data } = await FrameworkService.getFrameworkList()
    //   if (data) {
    //     treeData.value = data
    //   }
    // })

    const onContextMenuClick = (treeKey: string, menuKey: string) => {
      console.log(treeKey, menuKey)
    }

    // 双击切换
    const tabsInstance = useTabStore()
    const nodeDblclick = async (nodeData: SchemeTree) => {
      const targetTab = tabsInstance.search(`${nodeData.instanceId}`)
      if (targetTab) {
        tabsInstance.change(`${nodeData.instanceId}`)
      } else if (nodeData.type == 'MODEL_INSTANCE') {
        const { data } = await ModelService.getModelType(nodeData.typeId)
        console.log(data, 123)

        const tab: Pane = {
          key: `${nodeData.instanceId}`,
          title: nodeData.name ?? '',
          typeId: nodeData.typeId,
          component: data,
          closable: true
        }
        tabsInstance.add(tab)
      }
    }

    const selectedKeys: Ref<string[]> = ref([])
    const onSelect = (keys: string[]) => {
      if (keys.length != 0) {
        selectedKeys.value = keys
      }
    }

    // 默认打开方案层级
    const { schemeMenu, defaultExpand, open } = toRefs(useSchemeStore())
    onMounted(() => {
      open.value()
    })

    const treeData = computed(() => {
      return addSlots(schemeMenu?.value)
    })

    return {
      selectedKeys,
      onContextMenuClick,
      nodeDblclick,
      onSelect,
      defaultExpand,
      treeData,
      iconFont,
      schemeMenu
    }
  }
})
</script>

<style lang="less" scoped>
.navbar {
  border-left: 2px solid @my-layout-border-color;
  height: 100%;

  &-title {
    background-color: @content-header-background-color;
    padding: 2px 8px;
    border-bottom: 1px solid @content-border-color;
    height: 28px;
    line-height: 24px;
  }
}
.side-tree {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 8px;
  ::v-deep(.base-icon) {
    height: 24px;
    width: 14px;
  }
  ::v-deep(.ant-tree-switcher) {
    width: 12px;
  }

  ::v-deep(.ant-tree li .ant-tree-node-content-wrapper) {
    padding-right: 5px;
    padding-left: 0px;
    min-width: 120px;
    border-radius: unset;
  }

  ::v-deep(.ant-tree li .ant-tree-node-content-wrapper:hover) {
    background-color: @base-hover-color;
  }

  ::v-deep(.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected) {
    background-color: @base-active-color;
  }

  ::v-deep(.ant-tree li) {
    padding: unset;
  }
}
</style>
