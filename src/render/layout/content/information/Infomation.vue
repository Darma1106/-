<template>
  <div class="information">
    <div class="tab-area">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="数据" />
        <a-tab-pane key="2" tab="关联" />
      </a-tabs>
    </div>
    <DataInfo />
  </div>
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

<style lang="less" scoped>
.information {
  height: 100%;
  border-left: 1px solid @layout-border-color;
}
.tab-area {
  text-align: center;
  border-bottom: 1px solid @layout-border-color;
  margin-bottom: 20px;
  ::v-deep(.ant-tabs-bar) {
    margin-bottom: 2px;
  }
}
</style>
