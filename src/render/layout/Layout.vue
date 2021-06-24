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

<style lang="less" scope>
.layout {
  box-sizing: content-box;
  height: 100vh;
}
</style>
