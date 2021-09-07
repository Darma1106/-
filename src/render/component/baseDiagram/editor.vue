<template>
  <ActiveBox class="editor" drag-handle=".editor-head" :min-width="100" :max-width="300">
    <div class="editor-head">建模工具栏</div>
    <div class="editor-body">
      <a-collapse v-model:activeKey="activeKey">
        <a-collapse-panel v-for="category in editorData" :key="category.id" :header="category.name">
          <div
            v-for="item in category.toolMetasVOs"
            :key="item.id"
            :class="{ 'editor-item': true, 'active-editor-item': item.id == activeItem?.id }"
            @click="handleClick(item)"
          >
            <div class="icon">
              <img :src="baseURL + item.icon" />
            </div>
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
import { axiosConfig } from '@/services/http/config'

export default defineComponent({
  components: { ActiveBox },
  props: {
    editorData: { type: Array as PropType<ModelTool[]> }
  },
  emits: ['activeItemChange'],
  setup(props, ctx) {
    const activeKey = ref(['1'])

    const baseURL = axiosConfig.baseURL

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
      baseURL,
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
  width: 130px;
  position: absolute;
  top: 5%;
  left: 5%;
  border: solid 1px @my-layout-border-color;
  border-radius: 4px;
  box-shadow: 5px 5px 5px -2px #bbbaba;

  .editor-head {
    text-align: center;
    background-color: #ddd;
    border-radius: 4px 4px 0px 0px;
    height: 30px;
    line-height: 30px;
  }
  .editor-body {
    width: 100%;
    height: calc(100% - 30px);
    background-color: @base-background-color;
    overflow-y: auto;

    .editor-item {
      height: 100%;
      display: flex;
      flex-direction: row;
      cursor: pointer;
      padding: 2px 5px;

      .icon {
        height: 22px;
        line-height: 18px;

        > img {
          width: 18px;
        }
      }
      .label {
        margin-left: 10px;
      }

      &:hover {
        background-color: @base-hover-color;
      }
    }

    .active-editor-item {
      background-color: @base-active-color !important;
    }

    .editor-diagram {
      height: 550px;
    }

    ::v-deep(.ant-collapse-content) {
      padding: 5px 0px;
    }

    ::v-deep(.ant-collapse-content-box) {
      padding: 0;
    }

    ::v-deep(.ant-collapse > .ant-collapse-item) {
      border-bottom: unset;
    }

    ::v-deep(.ant-collapse > .ant-collapse-item > .ant-collapse-header) {
      padding: 2px 0px;
      padding-left: 22px;
      border-top: 1px solid @content-border-color;
      border-radius: unset;
    }

    ::v-deep(.ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow) {
      left: 5px;
    }
  }
}
</style>
