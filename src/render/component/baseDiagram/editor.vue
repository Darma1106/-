<template>
  <ActiveBox class="editor" drag-handle=".editor-head" :min-width="100" :max-width="300">
    <div class="editor-head">工具栏</div>
    <div class="editor-body">
      <a-collapse v-model:activeKey="activeKey">
        <a-collapse-panel v-for="category in editorData" :key="category.id" :header="category.name">
          <div
            v-for="item in category.toolMetasVOs"
            :key="item.id"
            :class="{ 'editor-item': true, 'active-editor-item': item.id == activeItem?.id }"
            @click="handleClick(item)"
          >
            <div class="icon"><BaseIcon :icon-type="iconFont.流程图" /></div>
            <div class="label">{{ item.name }}</div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </ActiveBox>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import { ActiveBox } from '../active-box'
import type { ModelTool, ToolMeta } from '@/services/module/modelService'
import { iconFont } from '@/component/baseIcon/type/enum'
import BaseIcon from '@/component/baseIcon/BaseIcon.vue'

export default defineComponent({
  components: { ActiveBox, BaseIcon },
  props: {
    editorData: { type: Array as PropType<ModelTool[]> }
  },
  emits: ['activeItemChange'],
  setup(props, ctx) {
    const activeKey = ref(['1'])

    const activeItem = ref<ToolMeta | null>(null)
    // 编辑栏点击
    const handleClick = (item: ToolMeta) => {
      if (activeItem.value && activeItem.value.id == item.id) {
        activeItem.value = null
      } else {
        activeItem.value = item
      }
      // console.log('activeItemChange', activeItem.value)

      ctx.emit('activeItemChange', activeItem.value)
    }

    const getActiveItem = () => {
      return activeItem.value
    }

    return {
      activeKey,
      activeItem,
      iconFont,
      handleClick,
      getActiveItem
    }
  }
})
</script>

<style lang="less" scoped>
.editor {
  // border: 2px solid red;
  z-index: 20;
  height: 400px;
  width: 120px;
  position: absolute;
  top: 5%;
  left: 5%;
  border: solid 1px @my-layout-border-color;

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
