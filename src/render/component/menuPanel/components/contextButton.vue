<template>
  <div class="context-button">
    <a-dropdown :trigger="['click']">
      <div class="button-container" @click.prevent>
        <div class="item-image">
          <ApartmentOutlined />
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
import { defineComponent, PropType } from 'vue'
import { ApartmentOutlined } from '@ant-design/icons-vue'
import type { toolConfig } from '../type'

export default defineComponent({
  name: 'ContextButton',
  components: {
    ApartmentOutlined
  },
  props: {
    itemInfo: {
      type: Object as PropType<toolConfig>
    }
  }
})
</script>

<style lang="less" scope>
.context-button {
  cursor: pointer;
  height: 100%;
  width: 60px;
  max-width: 80px;
  .button-container {
    text-align: center;
    padding-top: 10px;
    height: 100%;
    .item-image {
      font-size: @tool-svg-size;
      line-height: @tool-svg-size;
    }
    .item-title {
      line-height: 30px;
      margin-left: 4px;
      white-space: nowrap;
    }
  }
}
</style>
