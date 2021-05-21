<template>
  <div class="checkbox-item">
    <el-checkbox @change="handleChange" v-model="checked" :disabled="itemInfo.disable ? itemInfo.disable : false">{{
      itemInfo.title
    }}</el-checkbox>
  </div>
</template>

<script>
import { toolBtnEvents } from '@/common/constant/constant.js'

export default {
  data() {
    return {
      checked: true
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    init() {
      if ('checked' in this.itemInfo) {
        this.checked = this.itemInfo.checked
      } else {
        this.checked = true
      }
      setTimeout(() => {
        this.handleChange()
      }, 100)
    },
    handleChange() {
      let ev = {
        name: this.itemInfo.name,
        options: {
          type: this.itemInfo.type,
          checked: this.checked
        }
      }
      this.$store.dispatch('event/emit', ev)
      //如有change方法
      if (this.itemInfo.onChange) {
        this.itemInfo.onChange(this.checked)
      }
    },
    setChckdedState(state) {
      this.checked = state
      this.handleChange()
    }
  },
  props: {
    itemInfo: {
      type: Object,
      default: () => {}
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
        //活跃状态
        if (!this._inactive && val) {
          switch (val.name) {
            case toolBtnEvents.SET_CHECKBOX_STATE:
              if (val.options.item == this.itemInfo.name) {
                this.setChckdedState(val.options.state)
              }
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
.checkbox-item {
  transform: scale(0.8);
}

// /deep/.el-checkbox {
// font-size: 12px !important;
// &__label {
//   font-size: 12px !important;
// }
// }
</style>
