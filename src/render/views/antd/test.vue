<template>
  <div ref="root">
    <a-button @click="showModal">打开窗口</a-button>
    <antd-modal ref="antdModalRef">
      <template #body> 插槽body </template>
    </antd-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AntdModal from './modal2.vue'

const antdModalRef = ref(null)

const showModal = () => {
  console.log(antdModalRef.value)

  ;(antdModalRef as any).value.showModal()
}
</script>

<style lang="less" scope></style>
