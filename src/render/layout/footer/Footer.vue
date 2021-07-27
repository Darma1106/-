<template>
  <div class="layout-footer">{{ footText }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'

export default defineComponent({
  setup() {
    const footText = ref('admin(管理员)')
    return { footText }
  }
})
</script>

<style lang="less" scoped>
.layout-footer {
  height: 100%;
}
</style>
