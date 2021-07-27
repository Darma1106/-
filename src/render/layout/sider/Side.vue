<template>
  <div class="layout-sider"><SideTree /></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SideTree from './SideTree.vue'
export default defineComponent({
  components: { SideTree }
})
</script>

<style lang="less" scoped>
.layout-sider {
  height: 100%;
}
</style>
