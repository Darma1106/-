<template>
  <a-dropdown class="head-menu-item" :trigger="['click']">
    <a class="ant-dropdown-link" @click.prevent> 工程(P) </a>
    <template #overlay>
      <a-menu>
        <a-menu-item v-for="item in itemList" :key="item.name">{{ item.label }}</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { MenuItem } from './type'

export default defineComponent({
  props: {
    itemList: {
      type: Array as PropType<MenuItem[]>
    }
  }
  // setup() {}
})
</script>

<style lang="less" scope>
.head-menu-item {
  color: @base-font-color;
  // border: 2px solid red;
  display: inline-block;
}
</style>
