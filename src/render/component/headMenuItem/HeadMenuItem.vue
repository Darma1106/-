<template>
  <a-dropdown class="head-menu-item" :trigger="['click']">
    <a class="ant-dropdown-link" @click.prevent> {{ itemList?.label }} </a>
    <template #overlay>
      <a-menu class="head-item-menu" @click="onContextMenuClick">
        <!-- <a-menu-item v-for="item in itemList?.children" :key="item.name">{{ item.label }}</a-menu-item> -->
        <div v-for="(context, index) in itemList?.children" :key="index">
          <a-menu-divider v-if="context.name == 'divider'" />
          <template v-else>
            <a-sub-menu
              v-if="context.children"
              :key="context.name"
              :title="context.label"
              :disabled="!!context.disable"
            >
              <a-menu-item v-for="subItem in context.children" :key="subItem.name" :disabled="!!subItem.disable">
                <span class="item-label">{{ subItem.label }}</span>
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item v-else :key="index" :disabled="!!context.disable"
              ><span class="item-label">{{ context.label }}</span
              ><span v-if="context.shortcutKey" class="item-right">{{ context.shortcutKey }}</span
              ><span v-else-if="context.flag" class="item-right"><BaseIcon :icon-type="checkIconType" /></span
            ></a-menu-item>
          </template>
        </div>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { MenuItem } from './type'
import BaseIcon from '@/component/baseIcon/BaseIcon.vue'
import { iconFont } from '@/component/baseIcon/type/enum'

export default defineComponent({
  components: { BaseIcon },
  props: {
    itemList: {
      type: Object as PropType<MenuItem>
    }
  },
  setup(props) {
    const onContextMenuClick = ({ key }: { key: number }) => {
      const clickFn = props.itemList?.children?.[key].click
      if (clickFn) {
        clickFn()
      }
    }

    const checkIconType = iconFont.对勾
    return { onContextMenuClick, checkIconType }
  }
})
</script>

<style lang="less" scoped>
.head-menu-item {
  color: @base-font-color;
  // border: 2px solid red;
  display: inline-block;
}

.item-right {
  color: @menu-shortcut-key-color;
  position: absolute;
  right: 18px;
}
.item-label {
  min-width: 80px;
  display: inline-block;
}

.head-item-menu {
  padding: 4px 2px;
}

::v-deep(.ant-dropdown-menu-item-divider) {
  background-color: @menu-shortcut-key-color;
  margin: 4px 8px;
}

::v-deep(.ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title) {
  padding: 2px 18px;
  min-width: 150px;
}

::v-deep(.ant-dropdown-menu-item:hover) {
  background-color: @base-hover-color;
}

::v-deep(.ant-dropdown-menu-item:active) {
  background-color: @base-active-color;
}

::v-deep(.ant-dropdown-menu-submenu-title) {
  padding: 2px 18px;
  min-width: 160px;
}

::v-deep(.ant-dropdown-menu-submenu-title:hover) {
  background-color: @base-hover-color;
}
</style>
