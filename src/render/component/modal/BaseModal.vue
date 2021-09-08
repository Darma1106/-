<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :confirm-loading="loding"
    :width="width"
    :destroy-on-close="true"
    style="top: 15%"
    ok-text="确定"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="handleClose"
  >
    <slot />
  </a-modal>
</template>

<script lang="ts" setup>
import { Modal as AModal } from 'ant-design-vue'
// import { defineComponent } from 'vue'
import { useFlag } from '@/composition'

interface Props {
  title?: string
  width?: string
  onOk?: () => void
  onClose?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'defaultTitle',
  width: '50%',
  onOk: () => {
    console.log('onOk')
  },
  onClose: () => {
    console.log('onClose')
  }
})

const [visible, visibleToggle] = useFlag(false)
const [loding, lodingToggle] = useFlag(false)

const showModal = () => {
  visibleToggle.set(true)
}

const handleOk = async () => {
  lodingToggle.set(true)
  await props.onOk()
  lodingToggle.set(false)
  visibleToggle.set(false)
}

const handleClose = async () => {
  await props.onClose()
}

defineExpose({ showModal })
</script>

<style lang="less" scoped></style>
