<template>
  <base-form ref="formRef" class="data-info" :form-data="staticForm" :use-origin="true" />
  <!-- <span>{{ formRef?.modelRef?.text }}</span> -->
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { ObjectData } from 'gojs'
import BaseForm from '@/component/form/index.vue'
import { FormInputEnum } from '@/component/form/type/enum'
import type { IFormConfig, IFormRef } from '@/component/form/type'

const staticForm: IFormConfig = {
  text: {
    type: FormInputEnum.Input,
    label: '名称'
  },
  key: {
    type: FormInputEnum.Input,
    label: '创建人'
  }
  // time: {
  //   type: FormInputEnum.Input,
  //   label: '事件'
  // },
  // describe: {
  //   type: FormInputEnum.Textarea,
  //   label: '说明'
  // }
}

const formRef = ref<IFormRef | null>(null)
interface Props {
  info: ObjectData
}

const props = defineProps<Props>()

watch(
  () => props.info,
  () => {
    if (formRef.value) {
      formRef.value.setFieldsValue(props.info)
    }
  }
)
</script>

<style lang="less" scoped>
.data-info {
  padding-left: 10px;
}
</style>
