<template>
  <a-dropdown class="head-menu-item" :trigger="['click']">
    <a class="ant-dropdown-link" @click.prevent> {{ itemList?.label }} </a>
    <template #overlay>
      <a-menu @click="onContextMenuClick">
        <!-- <a-menu-item v-for="item in itemList?.children" :key="item.name">{{ item.label }}</a-menu-item> -->
        <div v-for="(context, index) in itemList?.children" :key="index">
          <a-sub-menu v-if="context.children" :key="context.name" :title="context.label" :disabled="!!context.disable">
            <a-menu-item v-for="subItem in context.children" :key="subItem.name" :disabled="!!subItem.disable">{{
              subItem.label
            }}</a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="index" :disabled="!!context.disable">{{ context.label }}</a-menu-item>
        </div>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { MenuItem } from './type'

export default defineComponent({
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
    return { onContextMenuClick }
  }
})
</script>

<style lang="less" scoped>
.head-menu-item {
  color: @base-font-color;
  // border: 2px solid red;
  display: inline-block;
}
</style>
