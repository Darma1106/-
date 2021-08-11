<template>
  <ActiveBox class="editor" drag-handle=".editor-head" :min-width="100" :max-width="300">
    <div class="editor-head">工具栏</div>
    <div class="editor-body">
      <a-collapse v-model:activeKey="activeKey">
        <a-collapse-panel v-for="category in editorData" :key="category.id" :header="category.name">
          <div
            v-for="item in category.items"
            :key="item.id"
            :class="{ 'editor-item': true, 'active-editor-item': item.id == activeItem?.id }"
            @click="handleClick(item)"
          >
            <div class="icon"><BaseIcon type="iconliuchengtu" /></div>
            <div class="label">{{ item.name }}</div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </ActiveBox>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseIcon from '@/component/baseIcon/BaseIcon.vue'
import { ActiveBox } from '../active-box'

import type { PropType } from 'vue'
import type { EditorType, EditorTemplate } from './type'

export default defineComponent({
  components: { ActiveBox, BaseIcon },
  props: { editorData: { type: Array as PropType<EditorTemplate[]> } },
  emits: ['activeItemChange'],
  setup(props, ctx) {
    const activeKey = ref(['1'])

    const activeItem = ref<EditorType | null>(null)
    // 编辑栏点击
    const handleClick = (item: EditorType) => {
      if (activeItem.value && activeItem.value.id == item.id) {
        activeItem.value = null
      } else {
        activeItem.value = item
      }
      ctx.emit('activeItemChange', activeItem.value)
    }

    return {
      activeKey,
      activeItem,
      handleClick
    }
  }
})
</script>

<style lang="less" scoped>
.editor {
  // border: 2px solid red;
  z-index: 99999999;
  height: 400px;
  width: 120px;
  position: absolute;
  top: 5%;
  left: 5%;
  border: solid 1px @layout-border-color;

  .editor-head {
    text-align: center;
    background-color: #ddd;
  }
  .editor-body {
    width: 100%;
    height: calc(100% - 22px);
    background-color: @base-background-color;
    overflow-y: auto;

    .editor-item {
      // border: 2px solid red;
      height: 100%;
      display: flex;
      flex-direction: row;
      font-size: 16px;
      cursor: pointer;
      padding-left: 5px;
      .label {
        margin-left: 15px;
      }
    }

    .active-editor-item {
      background-color: #ddd;
    }

    .editor-diagram {
      height: 550px;
    }

    ::v-deep(.ant-collapse-content-box) {
      padding: 0;
    }
  }
}
</style>
