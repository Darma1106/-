<template>
  <div class="select-button-item" v-contextmenu:contextmenu>
    <div class="item-image">
      <svg-icon :href="itemInfo.icon" :color="itemInfo.iconColor" />
    </div>
    <div class="item-title">
      <span>{{ itemInfo.title }}</span>
      <span class="drop-btn"></span>
    </div>
    <!-- <v-contextmenu ref="contextmenu" event-type="click">
      <v-contextmenu-item
        v-for="item in ItemContextMenu"
        :key="item.name"
        :disabled="item.disableMItem"
        @click="handleContextClick(item)"
        >{{ item.title }}</v-contextmenu-item
      >
    </v-contextmenu> -->

    <v-contextmenu
      ref="contextmenu"
      event-type="click"
      class="sidetree-rmenu"
      style="min-width: 100px;
    border-radius: 2px;"
    >
      <div v-for="(item, index1) of ItemContextMenu" :key="index1">
        <!-- 子菜单 -->
        <v-contextmenu-submenu
          :title="item.title"
          v-if="item.type && item.type == 'subMenu'"
          :disabled="item.disableMItem"
        >
          <v-contextmenu-item
            v-for="(subItem, index2) in item.children"
            :key="index2"
            @click="handleContextClick(subItem)"
            :disabled="subItem.disableMItem"
            >{{ subItem.title }}</v-contextmenu-item
          >
        </v-contextmenu-submenu>
        <!-- 普通按钮 -->
        <v-contextmenu-item :disabled="item.disableMItem" @click="handleContextClick(item)" v-else>
          {{ item.title }}
        </v-contextmenu-item>
      </div>
    </v-contextmenu>
  </div>
</template>

<script>
import _ from 'lodash'
import { toolBtnEvents } from '@/common/constant/constant.js'

export default {
  name: 'sclectButtonItem',
  data() {
    return {
      ItemContextMenu: []
    }
  },
  mounted() {
    this.contextStateInit()
  },
  props: {
    itemInfo: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleContextClick(item) {
      this.$store.dispatch('event/emit', {
        name: item.name,
        options: {
          type: item.type,
          buttonInfo: item
        }
      })
    },
    contextStateInit() {
      this.ItemContextMenu = _.cloneDeep(this.itemInfo.contextmenu)
    },
    setContextItemState(itemName, state) {
      if (itemName == 'full') {
        this.ItemContextMenu.forEach((item) => {
          item.disableMItem = state
          if (item.type == 'subMenu') {
            item.children.forEach((child) => {
              child.disableMItem = state
            })
          }
        })
      } else {
        this.ItemContextMenu.forEach((item) => {
          itemName.forEach((name) => {
            if (item.name == name) {
              item.disableMItem = state
            }
            if (item.type == 'subMenu') {
              let target = item.children.find((child) => child.name == name)
              if (target) {
                target.disableMItem = state
              }
            }
          })
        })
      }
    }
  },
  watch: {
    '$store.state.event.ev': {
      handler(val) {
        //活跃状态
        if (!this._inactive && val) {
          switch (val.name) {
            case toolBtnEvents.FORBID_SELECTBUTTON:
              // this.contextStateInit()
              this.setContextItemState(val.options.items, true)
              break
            default:
              break
          }
        }
      }
    },
    itemInfo: {
      deep: true,
      handler() {
        this.contextStateInit()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.select-button-item {
  min-width: 70px;
  // margin: 0 8px;
  text-align: center;
  // height: 100%;
  cursor: pointer;
  display: flex;
  padding: 0px 15px;
  margin-top: 5px;
  &:active {
    opacity: 0.6;
  }
  .item-image {
    font-size: @svg-size;
    line-height: 30px;
  }
  &:hover {
    // background-color: @nav-bar-sub-item-hover-background-color;
    // color: @nav-bar-sub-item-hover-color;
    background: #0f4d80;
    box-shadow: 0 0 15px 5px #3e72b9 inset;
    border-radius: 4px;
  }
  .item-title {
    color: #ccc;
    // padding-top: 2px;
    font-size: @default-font-size;
    line-height: 30px;
    margin-left: 4px;
    display: flex;
    white-space: nowrap;

    .drop-btn {
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid #ccc;
      // position: absolute;
      margin-top: 13px;
      margin-left: 3px;
    }
  }
}
</style>
