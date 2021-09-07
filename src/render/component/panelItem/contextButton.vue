<template>
  <div class="context-button">
    <a-dropdown :trigger="['click']">
      <div class="button-container" @click.prevent>
        <div class="item-image">
          <BaseIcon :icon-type="itemInfo.icon" />
        </div>
        <div class="item-title">
          {{ itemInfo?.title }}
        </div>
      </div>
      <template #overlay>
        <a-menu>
          <div v-for="context in itemInfo?.contextMenu" :key="context.name">
            <a-sub-menu v-if="context.children" :key="context.name" :title="context.title" :disabled="context.disable">
              <a-menu-item v-for="subItem in context.children" :key="subItem.name" :disabled="subItem.disable">{{
                subItem.title
              }}</a-menu-item>
            </a-sub-menu>
            <a-menu-item v-else :disabled="context.disable">{{ context.title }}</a-menu-item>
          </div>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { toolConfig } from './type'
import BaseIcon from '@/component/baseIcon/BaseIcon.vue'

export default defineComponent({
  name: 'ContextButton',
  components: { BaseIcon },
  props: {
    itemInfo: {
      type: Object as PropType<toolConfig>,
      required: true
    }
  }
})
</script>

<style lang="less" scoped>
.context-button {
  cursor: pointer;
  height: 100%;
  // width: 70px;
  // max-width: 80px;
  .button-container {
    text-align: center;
    padding: 3px 8px 0 8px;
    height: calc(100% - 2px);
    border-radius: 4px;

    &:hover {
      // background: #0f4d80;
      // box-shadow: 0 0 15px 5px #3e72b9 inset;
      background: @base-hover-color;
      // .item-title {
      //   color: #fff;
      // }
    }

    &:active {
      background: @base-active-color;
    }

    .item-image {
      font-size: @tool-svg-size;
      line-height: @tool-svg-size;
    }
    .item-title {
      // line-height: 30px;
      // margin-left: 4px;
      white-space: nowrap;
    }
  }
}
</style>
