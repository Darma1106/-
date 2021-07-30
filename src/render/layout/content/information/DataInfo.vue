<template>
  <base-form ref="formRef" class="data-info" :form-data="staticForm" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseForm from '@/component/form/index.vue'
import { FormInputEnum } from '@/component/form/type/enum'
import type { IFormConfig } from '@/component/form/type'

export default defineComponent({
  name: '',
  components: { BaseForm },
  setup() {
    const staticForm: IFormConfig = {
      name: {
        type: FormInputEnum.Input,
        label: '名称'
      },
      creator: {
        type: FormInputEnum.Input,
        label: '创建人'
      },
      time: {
        type: FormInputEnum.Input,
        label: '事件'
      },
      describe: {
        type: FormInputEnum.Textarea,
        label: '说明'
      }
    }
    return {
      staticForm
    }
  }
})
</script>

<style lang="less" scoped>
.data-info {
  padding-right: 10px;
}
</style>
