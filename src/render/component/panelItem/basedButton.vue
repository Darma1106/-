<template>
  <div class="based-button" @click="handleClick">
    <div class="button-container">
      <div class="item-image">
        <BaseIcon :icon-type="itemInfo.icon" />
      </div>
      <div class="item-title">
        {{ itemInfo?.title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { toolConfig } from './type'
import BaseIcon from '@/component/baseIcon/BaseIcon.vue'

export default defineComponent({
  name: 'BasedButton',
  components: {
    BaseIcon
  },
  props: {
    itemInfo: {
      type: Object as PropType<toolConfig>,
      required: true
    }
  },
  setup(props) {
    const handleClick = () => {
      if (props.itemInfo?.onclick) props.itemInfo.onclick()
    }
    return {
      handleClick
    }
  }
})
</script>

<style lang="less" scoped>
.based-button {
  cursor: pointer;
  height: 100%;
  // width: 70px;
  // max-width: 80px;
  .button-container {
    text-align: center;
    padding-top: 3px;
    height: 100%;
    &:hover {
      background: #0f4d80;
      box-shadow: 0 0 15px 5px #3e72b9 inset;
      border-radius: 4px;
      .item-title {
        color: #fff;
      }
    }
    .item-image {
      font-size: @tool-svg-size;
      line-height: @tool-svg-size;
    }
    .item-title {
      line-height: 30px;
      // margin-left: 4px;
      white-space: nowrap;
    }
  }
}
</style>
