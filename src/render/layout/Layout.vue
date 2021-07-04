<template>
  <a-layout class="layout" theme="dark">
    <a-layout-header>
      <layout-header />
    </a-layout-header>

    <a-layout>
      <a-layout-sider> <layout-sider /></a-layout-sider>
      <a-layout-content><layout-content /></a-layout-content>
    </a-layout>
    <a-layout-footer> <layout-footer /></a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import LayoutHeader from './header/Header.vue'
import LayoutSider from './sider/Side.vue'
import LayoutContent from './content/Content.vue'
import LayoutFooter from './footer/Footer.vue'

export default defineComponent({
  components: { LayoutHeader, LayoutSider, LayoutContent, LayoutFooter }
})
</script>

<style lang="less" scoped>
.layout {
  box-sizing: content-box;
  height: 100vh;

  ::v-deep(.ant-layout-header) {
    background-color: @header-color;
    padding: 0;
    height: auto;
    line-height: normal;
    border-bottom: 2px solid #ddd;
  }

  ::v-deep(.ant-layout-content) {
    background: #fff;
  }

  ::v-deep(.ant-layout-sider) {
    background: #fff;
    border-right: 2px solid #ddd;
  }

  ::v-deep(.ant-layout-footer) {
    height: 40px;
    background: #fbe7e6;
    border: 2px solid #ddd;
    padding: 0;
  }
}
</style>
