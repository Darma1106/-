<template>
  <MyIcon :type="iconType" />
</template>

<script lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
import { iconFont } from './type/enum'

import type { PropType } from 'vue'

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2431681_jyp8pbbxa9.js'
})

type IconType = iconFont

export default defineComponent({
  components: { MyIcon },
  props: {
    iconType: {
      type: String as PropType<IconType>,
      default: ''
    }
  }
})
</script>

<style lang="less" scoped></style>
