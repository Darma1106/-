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
import FrameworkService from '@/services/module/fremeworkService'
import { useScheme } from '@/composition'

interface SchemeData {
  key?: string
  name?: string
  describe?: string
  createDate?: string
}
export default defineComponent({
  name: '',
  components: { PopupCard },
  emits: ['form-comfirm'],
  setup() {
    const staticForm: Ref<IFormConfig> = ref({
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
      frameWorkId: {
        type: FormInputEnum.Select,
        values: [],
        label: '框架名称'
      },
      background: {
        type: FormInputEnum.Textarea,
        label: '方案背景'
      },
      describes: {
        type: FormInputEnum.Textarea,
        label: '方案描述'
      }
    })
    const getFrameworkType = async () => {
      // 清空框架选项
      staticForm.value.frameWorkId.values?.clean()
      const { data } = await FrameworkService.getFrameworkType()
      data?.forEach(({ id, name }) => {
        staticForm.value.frameWorkId.values?.push({ key: id, value: name })
      })
    }

    const cardRef: Ref<PopupCardInstance<SchemeData> | null> = ref(null)

    const show = async (schemeInfo?: SchemeData) => {
      await getFrameworkType()

      if (cardRef.value) {
        cardRef.value.show(schemeInfo)
      }
    }
    const add = () => {
      if (cardRef.value) {
        cardRef.value.show()
      }
    }

    const [, { addFn }] = useScheme()

    const handleComfirm = (formData: SchemeData) => {
      // ctx.emit('form-comfirm', formData)
      addFn(formData)
    }
    return { staticForm, cardRef, add, show, handleComfirm }
  }
})
</script>

<style lang="less" scoped></style>
