<template>
  <div :class="{ 'switch-button': true, checked, uncheck: !checked }" @click="handleSwitch">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: '',
  props: {
    checked: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:checked'],
  setup(props, ctx) {
    const handleSwitch = () => {
      ctx.emit('update:checked', !props.checked)
    }
    return { handleSwitch }
  }
})
</script>

<style lang="less" scoped>
.switch-button {
  cursor: pointer;
  padding: 0 4px;
}
.checked {
  background-color: #ddd;
}
.uncheck {
  background-color: transparent;
}
</style>
