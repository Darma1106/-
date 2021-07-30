<template>
  <div class="layout-content">
    <tabs class="center" />
    <div class="right">
      <Information />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tabs from './tabs/Tab.vue'
import Information from './information/Infomation.vue'
export default defineComponent({
  components: { Tabs, Information }
})
</script>

<style lang="less" scoped>
.layout-content {
  height: 100%;
  display: flex;
  flex-direction: row;
  .center {
    flex: 1;
  }
  .right {
    width: 260px;
    border-left: 1px solid #000;
  }
}
</style>
