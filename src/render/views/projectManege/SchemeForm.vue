<template>
  <PopupCard ref="cardRef" :form-data="staticForm" width="30%" :on-ok="handleComfirm" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { Ref } from 'vue'
import PopupCard from '@/component/popupCard/index.vue'
import { FormInputEnum } from '@/component/form/type/enum'

import type { IFormConfig } from '@/component/form/type'
import type { PopupCardInstance } from '@/component/popupCard/type'

interface SchemeData {
  key?: string
  name?: string
  describe?: string
  createDate?: string
}
export default defineComponent({
  name: '',
  components: { PopupCard },
  setup() {
    const staticForm: IFormConfig = {
      name: {
        type: FormInputEnum.Input,
        label: '方案名称',
        rules: [
          {
            required: true,
            message: '请输入方案名称'
          }
        ]
      },
      describe: {
        type: FormInputEnum.Textarea,
        label: '方案描述'
      }
    }

    const cardRef: Ref<PopupCardInstance<SchemeData> | null> = ref(null)

    const show = (schemeInfo?: SchemeData) => {
      if (cardRef.value) {
        cardRef.value.show(schemeInfo)
      }
    }
    const add = () => {
      if (cardRef.value) {
        cardRef.value.show()
      }
    }
    const handleComfirm = (formData: SchemeData) => {
      console.log(formData, 'handleComfirm')
    }
    return { staticForm, cardRef, add, show, handleComfirm }
  }
})
</script>

<style lang="less" scoped></style>
