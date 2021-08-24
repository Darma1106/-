<template>
  <div class="information">
    <div class="tab-area">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="数据" />
        <a-tab-pane key="2" tab="关联" />
      </a-tabs>
    </div>
    <DataInfo :info="props.info" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { ObjectData } from 'gojs'
import DataInfo from './DataInfo.vue'

interface Props {
  info: ObjectData
}

const activeKey = ref('1')

const props = defineProps<Props>()
</script>

<style lang="less" scoped>
.information {
  height: 100%;
  border-left: 1px solid @my-layout-border-color;
}
.tab-area {
  text-align: center;
  border-bottom: 1px solid @my-layout-border-color;
  margin-bottom: 20px;
  ::v-deep(.ant-tabs-bar) {
    margin-bottom: 2px;
  }
}
</style>
