<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="数据" />
    <a-tab-pane key="2" tab="关联" />
  </a-tabs>
  <DataInfo />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import DataInfo from './DataInfo.vue'

export default defineComponent({
  components: {
    DataInfo
  },
  setup() {
    return {
      activeKey: ref('1')
    }
  }
})
</script>

<style lang="less" scoped></style>
