<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :confirm-loading="loding"
    :width="width"
    ok-text="确定"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="handleClose"
  >
    <slot />
  </a-modal>
</template>

<script lang="ts">
import { Modal as AModal } from 'ant-design-vue'
import { defineComponent } from 'vue'
import { useFlag } from '@/composition'

export default defineComponent({
  components: {
    AModal
  },
  props: {
    title: {
      type: String,
      default: 'defaultTitle'
    },
    width: {
      type: String,
      default: '50%'
    },
    onOk: {
      type: Function,
      default: () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve()
          }, 2000)
        })
      }
    },
    onClose: {
      type: Function,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      default: () => {}
    }
  },
  setup(props) {
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

    return {
      visible,
      loding,
      showModal,
      handleOk,
      handleClose
    }
  }
})
</script>

<style lang="less" scoped></style>
