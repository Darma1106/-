<template>
  <!-- <div> -->
  <!-- <a-button type="primary" @click="showModal">Open Modal</a-button> -->
  <a-modal
    ref="modalRef"
    keyboard
    :visible="visible"
    :title="title"
    @cancel="showConfirm"
  >
    <template #footer>
      <a-button key="back" @click="closeModal">取消</a-button>
      <a-button key="submit" type="primary" @click="handleOk">确定</a-button>
    </template>

    <slot name="body"></slot>
  </a-modal>
  <!-- </div> -->
</template>

<script lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { defineComponent, createVNode, ref } from 'vue'
import { Modal } from 'ant-design-vue'
export default defineComponent({
  name: '',
  props: {
    title: { type: String, default: '默认title' },
    isShow: { type: Boolean, default: false },
    fnOk: {
      type: Function,
      default: (show: () => void) => {
        show()
      }
    }
  },
  setup(props) {
    let visible = ref(false)

    const showModal = () => {
      visible.value = true
    }

    const closeModal = () => {
      visible.value = false
    }

    const handleOk = async (e: MouseEvent) => {
      props.fnOk(closeModal)
      console.log(e)
    }

    const showConfirm = () => {
      Modal.confirm({
        title: '提醒',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定关闭当前窗口?',
        okText: '确认',
        onOk: closeModal,
        cancelText: '取消'
      })
    }
    return { showModal, handleOk, closeModal, showConfirm, visible }
  }
})
</script>

<style lang="less" scope></style>
