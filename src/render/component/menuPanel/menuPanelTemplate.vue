<template>
  <div class="menu-panel-template">
    <panel-item v-for="(member, index) in panelConfig" :key="index">
      <div
        v-for="item in member"
        :key="item.name"
        :class="{ 'disabled-item': item.disable && item.type != 'checkbox' }"
        :ref="item.name"
      >
        <checkbox-item :name="item.name" v-if="item.type == 'checkbox'" :itemInfo="item" />
        <button-item v-if="item.type == 'buttonItem'" :itemInfo="item" />
        <row-button-item v-if="item.type == 'rowButtonItem'" :itemInfo="item" />
        <select-button-item v-if="item.type == 'selectButton'" :itemInfo="item" />
        <divider-item v-if="item.type == 'divider'" :itemInfo="item" />
        <select-item v-if="item.type == 'select'" :itemInfo="item" />
      </div>
    </panel-item>
    <slot />
  </div>
</template>

<script>
import panelItem from './components/panelItem'
import checkboxItem from './components/checkboxItem'
import buttonItem from './components/buttonItem'
import RowButtonItem from './components/rowButton'
import selectButtonItem from './components/selectButtonItem'
import dividerItem from './components/dividerItem'
import selectItem from './components/selectItem'

import { toolBtnEvents } from '@/common/constant/constant.js'

export default {
  name: 'menuPanelTemplate',
  components: {
    panelItem,
    checkboxItem,
    buttonItem,
    selectButtonItem,
    dividerItem,
    selectItem,
    RowButtonItem
  },
  data() {
    return {}
  },
  props: {
    panelConfig: Array,
    default: () => []
  },
  methods: {
    setPanelItemState(items, state) {
      if (items == 'full') {
        this.panelConfig.forEach((div) => {
          div.forEach((item) => {
            item.disable = state
          })
        })
      } else {
        this.panelConfig.forEach((div) => {
          items.forEach((item) => {
            let target = div.find((element) => element.name == item)
            if (target) {
              target.disable = state
            }
          })
        })
      }
    }
  },
  computed: {
    aimEvent() {
      return this.$store.getters['event/ev']
    }
  },
  watch: {
    aimEvent: {
      deep: true,
      handler(val) {
        if (!this._inactive && val) {
          switch (val.name) {
            case toolBtnEvents.SET_ITEM_MODE:
              new Promise((resolve) => {
                this.setPanelItemState('full', !val.options.state)
                resolve()
              }).then(() => {
                this.setPanelItemState(val.options.items, val.options.state)
              })
              break

            case toolBtnEvents.SET_ITEM_STATE:
              this.setPanelItemState(val.options.items, val.options.state)
              break

            default:
              break
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.menu-panel-template {
  background-color: @base-focus-background;
  clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
  padding: 4px 0 2px 12px;
  height: 40px;
  display: flex;
  flex-direction: row;
  // justify-content: center;
}
</style>
