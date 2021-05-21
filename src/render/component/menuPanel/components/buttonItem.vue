<template>
  <div class="button-item" @click="buttonItemClick">
    <div class="item-image">
      <svg-icon :href="itemInfo.icon" :color="itemInfo.iconColor" />
    </div>
    <div class="item-title">
      {{ itemInfo.title }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ColButtonItem',
  props: {
    itemInfo: {
      type: Object
      // default: () => {}
    }
  },
  setup(props) {
    function buttonItemClick() {
      // if (props.itemInfo.click) {
      //   props.itemInfo.click()
      // } else {
      //   console.log(`${props.itemInfo.name}点击了`)
      //   // this.$store.dispatch('navBar/submenuItemClick', this.itemInfo.name)
      //   props.$store.dispatch('event/emit', { name: props.itemInfo.name, options: { type: props.itemInfo.type } })
      // }
    }
  }
})
// export default {
//   name: 'colButtonItem',
//   methods: {
//     buttonItemClick() {
//       if (this.itemInfo.click) {
//         this.itemInfo.click()
//       } else {
//         console.log(`${this.itemInfo.name}点击了`)
//         // this.$store.dispatch('navBar/submenuItemClick', this.itemInfo.name)
//         this.$store.dispatch('event/emit', { name: this.itemInfo.name, options: { type: this.itemInfo.type } })
//       }
//     }
//   },
// //   props: {
//     itemInfo: {
//       type: Object,
//       default: () => {}
//     }
//   }
// }
</script>

<style lang="less" scoped>
.button-item {
  min-width: 50px;
  text-align: center;
  // height: 100%;
  color: #fff;
  border-radius: 4px;
  // padding: 0 4px 4px 4px;
  padding: 0px 15px;
  cursor: pointer;
  display: flex;
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
    color: #fff;
    // padding-top: 2px;
    font-size: @default-font-size;
    line-height: 30px;
    margin-left: 4px;
    white-space: nowrap;
  }
}
</style>
