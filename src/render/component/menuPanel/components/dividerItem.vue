<template>
  <div
    class="divider-item"
    :style="{
      'border-right': `${itemInfo.width}px solid ${itemInfo.color}`,
      'margin-left': `${itemInfo.left}px`,
      'margin-right': `${itemInfo.right}px`
    }"
  ></div>
</template>

<script>
export default {
  name: 'DividerItem',
  props: {
    itemInfo: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style>
.divider-item {
  height: calc(100% - 10px);
  width: 0;
  border-right: 1px solid #007788 !important;
  margin-left: 5px !important;
  margin-top: 3px;
  /* margin-right: 10px !important; */
  margin-right: 5px !important;
}
</style>
