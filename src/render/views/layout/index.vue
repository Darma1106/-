<template>
  <a-layout class="layout" theme="dark">
    <layout-header />
    <a-layout>
      <layout-sider />
      <layout-content />
    </a-layout>
    <layout-footer />
  </a-layout>
</template>

<script setup lang="ts">
import LayoutHeader from './header/index.vue'
import LayoutSider from './sider/index.vue'
import LayoutContent from './content/index.vue'
import LayoutFooter from './footer/index.vue'
</script>

<style lang="less" scope>
.layout {
  box-sizing: content-box;
  height: 100vh;
}
</style>
