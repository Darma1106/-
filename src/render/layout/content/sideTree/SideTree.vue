<template>
  <div class="side-tree">
    <a-tree
      v-if="treeData.length"
      :tree-data="treeData"
      show-icon
      default-expand-all
      :selected-keys="selectedKeys"
      @select="(keys) => onSelect(keys)"
    >
      <template #title="{ dataRef, title }"
        ><span @dblclick="nodeDblclick(dataRef)">{{ title }}</span>
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

      <template #switcherIcon>
        <down-outlined />
      </template>
      <template #model>
        <BaseIcon :icon-type="iconFont.模型" />
      </template>
      <template #category>
        <BaseIcon :icon-type="iconFont.文件夹" />
      </template>
      <template #meh>
        <smile-outlined />
      </template>
      <template #custom="{ selected }">
        <frown-filled v-if="selected" />
        <frown-outlined v-else />
      </template>
    </a-tree>
  </div>
</template>

<script lang="ts">
import { Tree } from 'ant-design-vue'
import { DownOutlined, SmileOutlined, FrownOutlined, FrownFilled } from '@ant-design/icons-vue'
import { defineComponent, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import BaseIcon from '@/component/baseIcon/BaseIcon.vue'

import FrameworkService from '@/services/module/fremeworkService'
import { useTabStore } from '@/store'
import { iconFont } from '@/component/baseIcon/type/enum'

import type { TreeData } from '@/services/module/fremeworkService'
import type { Pane } from '@/store/modules/useTabStore'

export default defineComponent({
  components: {
    DownOutlined,
    SmileOutlined,
    FrownOutlined,
    FrownFilled,
    ATree: Tree,
    BaseIcon
  },
  setup() {
    const treeData: Ref<TreeData[]> = ref([])
    onMounted(async () => {
      const { data } = await FrameworkService.getFrameworkList()
      if (data) {
        treeData.value = data
      }
    })

    const onContextMenuClick = (treeKey: string, menuKey: string) => {
      console.log(treeKey, menuKey)
    }

    // 双击切换
    const tabsInstance = useTabStore()
    const nodeDblclick = (data: TreeData) => {
      const targetTab = tabsInstance.search(`${data.key}`)
      if (targetTab) {
        tabsInstance.change(`${data.key}`)
      } else if (data.type !== 'nonModel') {
        const tab: Pane = {
          key: `${data.key}`,
          title: data.title ?? '',
          component: data.type,
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

    return {
      selectedKeys,
      onContextMenuClick,
      nodeDblclick,
      onSelect,
      treeData,
      iconFont
    }
  }
})
</script>

<style lang="less" scoped>
.side-tree {
  border-right: 2px solid @my-layout-border-color;
  height: 100%;
  ::v-deep(.base-icon) {
    height: 14px;
    width: 14px;
  }
}
</style>
