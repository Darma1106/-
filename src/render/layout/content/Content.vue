<template>
  <div class="layout-content"><tabs /></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tabs from './tabs/Tab.vue'
export default defineComponent({
  components: { Tabs }
})
</script>

<style lang="less" scoped>
.layout-content {
  height: 100%;
}
</style>
