<template>
  <base-modal ref="modalRef" title="方案编辑" :on-ok="handleComfirm" :width="width" :destroy-on-close="false">
    <base-form ref="formRef" :form-data="formData" />
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from 'vue'
import type { Ref, PropType } from 'vue'
import { cloneDeep } from 'lodash'
import BaseForm from '../form/index.vue'
import BaseModal from '../modal/BaseModal.vue'
import { Common } from '../form/type/common'
import type { IFormConfig, IFormRef } from '../form/type'
import type { BaseModalInstance } from '../modal/type'

export default defineComponent({
  name: 'PopupCard',
  components: { BaseForm, BaseModal },
  props: {
    formData: {
      type: Object as PropType<IFormConfig>,
      required: true
    },
    onOk: {
      type: Function as PropType<(formRef: Common.RecordObject) => void>
    },
    width: {
      type: String
    }
  },
  setup(props) {
    const formRef: Ref<IFormRef | null> = ref(null)
    const modalRef: Ref<BaseModalInstance | null> = ref(null)
    const originData: Ref<any> = ref()
    const show = (formData: Common.RecordObject = {}) => {
      if (modalRef.value) {
        modalRef.value.showModal()
        nextTick(() => {
          if (formRef.value) {
            formRef.value.setFieldsValue(formData)
            originData.value = formRef.value.modelRef
          }
        })
      }
    }
    const handleComfirm = () => {
      if (formRef.value && props.onOk) {
        props.onOk(Object.assign(cloneDeep(originData.value), formRef.value.modelRef))
      }
    }
    return {
      formRef,
      modalRef,
      show,
      handleComfirm
    }
  }
})
</script>

<style lang="less" scoped></style>
