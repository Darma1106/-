<template>
  <a-layout-content class="layout-content"><tabs /></a-layout-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tabs from './tabs/Tab.vue'
export default defineComponent({
  components: { Tabs }
})
</script>

<style lang="less" scope>
.layout-content {
  background: #fff;
  // border: 2px solid blue;
}
</style>
