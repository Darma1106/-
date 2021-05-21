<template>
  <div class="panel-item" :style="'width:' + minWidth">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'panelItem',
  props: {
    minWidth: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.panel-item {
  // margin: 0 8px;
  display: flex;
  // min-width: 52px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > * {
    flex: 1;
  }
}
</style>
