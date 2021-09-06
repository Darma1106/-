<template>
  <div class="tool-bar">
    <div class="top-bar">
      <div v-for="item in items" :key="item.name" class="item-container">
        <ContextButton v-if="item.type === 'contextButton'" class="item" :item-info="item" />
        <BasedButton v-if="item.type === 'basedButton'" class="item" :item-info="item" />
        <a-divider
          v-if="item.type === 'divider'"
          type="vertical"
          style="height: 40px; padding-top: 10px; background-color: #000"
        />
        <!-- <ADivider type="vertical" /> -->
      </div>
    </div>
    <div class="bottom-bar">
      <DetailBar />
    </div>
  </div>
  <!-- <button @click="save">save</button> -->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Divider } from 'ant-design-vue'
import type { Ref } from 'vue'
import DetailBar from './DetailBar.vue'
import ContextButton from '@/component/panelItem/contextButton.vue'
import BasedButton from '@/component/panelItem/basedButton.vue'
import { useEventStore, useTabStore } from '@/store'
import { iconFont } from '@/component/baseIcon/type/enum'

import type { toolConfig } from '@/component/panelItem/type'

export default defineComponent({
  name: 'ToolBar',
  components: { ContextButton, BasedButton, DetailBar, ADivider: Divider },
  setup() {
    const { activeTab } = useTabStore()

    const { eventSwitch } = useEventStore()
    const save = () => {
      eventSwitch('save', activeTab)
    }

    const items: Ref<toolConfig[]> = ref([
      {
        name: 'xinmoxing',
        title: '新模型',
        disable: false,
        type: 'basedButton',
        onclick: () => {
          console.log('123123123')
        },
        icon: iconFont.新模型
      },
      {
        name: 'dakai',
        title: '打开',
        disable: false,
        type: 'basedButton',
        icon: iconFont.打开
      },
      {
        name: 'baocun',
        title: '保存',
        disable: false,
        type: 'basedButton',
        onclick: save,
        icon: iconFont.保存
      },
      {
        name: 'jianqie',
        title: '剪切',
        disable: false,
        type: 'basedButton',
        onclick: () => {
          console.log('123123123')
        },
        icon: iconFont.剪切
      },
      {
        name: 'zhantie',
        title: '粘贴',
        disable: false,
        type: 'basedButton',
        onclick: () => {
          console.log('123123123')
        },
        icon: iconFont.粘贴
      },
      {
        name: 'shanchu',
        title: '删除',
        disable: false,
        type: 'basedButton',
        onclick: () => {
          console.log('123123123')
        },
        icon: iconFont.关闭
      },
      {
        name: 'chexiao',
        title: '撤销',
        disable: false,
        type: 'basedButton',
        onclick: () => {
          console.log('123123123')
        },
        icon: iconFont.撤销
      },
      {
        name: 'divider',
        title: 'divider',
        disable: false,
        type: 'divider'
      },
      {
        name: '123',
        title: '层级',
        disable: false,
        type: 'contextButton',
        contextMenu: [
          {
            title: '子菜单1',
            name: 'zicaidan1',
            disable: false,
            children: [
              {
                title: '子菜单1-1',
                name: 'ziczidan1-1',
                disable: true
              }
            ]
          },
          { title: '子菜单2', name: 'zicaidan2', disable: true }
        ],
        icon: iconFont.层级
      },

      {
        name: '123',
        title: '对齐',
        disable: false,
        type: 'contextButton',
        contextMenu: [
          {
            title: '子菜单1',
            name: 'zicaidan1',
            disable: false,
            children: [
              {
                title: '子菜单1-1',
                name: 'ziczidan1-1',
                disable: true
              }
            ]
          },
          { title: '子菜单2', name: 'zicaidan2', disable: true }
        ],
        icon: iconFont.居左对齐
      },

      {
        name: '123',
        title: '自动布局',
        disable: false,
        type: 'contextButton',
        contextMenu: [
          {
            title: '子菜单1',
            name: 'zicaidan1',
            disable: false,
            children: [
              {
                title: '子菜单1-1',
                name: 'ziczidan1-1',
                disable: true
              }
            ]
          },
          { title: '子菜单2', name: 'zicaidan2', disable: true }
        ],
        icon: iconFont.布局
      },
      {
        name: '123',
        title: '查找',
        disable: false,
        type: 'contextButton',
        contextMenu: [
          {
            title: '子菜单1',
            name: 'zicaidan1',
            disable: false,
            children: [
              {
                title: '子菜单1-1',
                name: 'ziczidan1-1',
                disable: true
              }
            ]
          },
          { title: '子菜单2', name: 'zicaidan2', disable: true }
        ],
        icon: iconFont.保存
      },
      {
        name: 'divider',
        title: 'divider',
        disable: false,
        type: 'divider'
      },
      {
        name: 'tianchong',
        title: '填充',
        disable: false,
        type: 'basedButton',
        onclick: () => {
          console.log('123123123')
        },
        icon: iconFont.填充
      },
      {
        name: 'yinying',
        title: '阴影',
        disable: false,
        type: 'basedButton',
        onclick: () => {
          console.log('123123123')
        },
        icon: iconFont.阴影分析
      },
      {
        name: 'divider',
        title: 'divider',
        disable: false,
        type: 'divider'
      },
      {
        name: 'jiaoyan',
        title: '校验',
        disable: false,
        type: 'basedButton',
        onclick: () => {
          console.log('123123123')
        },
        icon: iconFont.校验
      },
      {
        name: 'zhixing',
        title: '执行',
        disable: false,
        type: 'basedButton',
        onclick: () => {
          console.log('123123123')
        },
        icon: iconFont.运行
      }
    ])

    return { items }
  }
})
</script>

<style lang="less" scoped>
.tool-bar {
  height: 85px;
  background: @base-background-color;
  border-left: 2px solid @my-layout-border-color;
  border-right: 2px solid @my-layout-border-color;
  .top-bar {
    display: flex;
    height: 50px;
    flex-direction: row;
    border-bottom: @1px-border;
    padding-top: 2px;
    padding-left: 10px;
    .item-container {
      display: flex;
      align-items: center;
    }
    .item {
      // border: 2px solid red;
      margin-left: 2px;
      min-width: 50px;
    }
  }

  .bottom-bar {
    padding-left: 20px;
  }
}
</style>
