<template>
  <svg class="base-icon" aria-hidden="true">
    <use :xlink:href="props.iconType"></use>
  </svg>
</template>

<script lang="ts" setup>
import '@/assets/iconfont/iconfont'
import { iconFont } from './type/enum'

type IconType = iconFont

interface BaseIconProps {
  iconType?: IconType
}

const props = withDefaults(defineProps<BaseIconProps>(), {
  iconType: iconFont.文件夹
})
</script>

<style lang="less" scoped>
.base-icon {
  height: 20px;
  width: 20px;
}
</style>
