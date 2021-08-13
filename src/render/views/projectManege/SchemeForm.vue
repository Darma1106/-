<template>
  <PopupCard ref="cardRef" :form-data="staticForm" />
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
      groupKey: {
        type: FormInputEnum.Input,
        label: '页面标识',
        rules: [
          {
            required: true,
            message: '请输入配置项所在页面的页面标识(Page Code)'
          }
        ]
      },
      name: {
        type: FormInputEnum.Input,
        label: '配置项名称',
        rules: [
          {
            required: true,
            message: '请输入配置项名称'
          }
        ]
      },
      code: {
        type: FormInputEnum.Select,
        values: [
          { key: 111, value: 111 },
          { key: 222, value: 222 }
        ],
        label: '配置项标识'
      },
      comment: {
        type: FormInputEnum.Textarea,
        label: '配置备注',
        rules: [
          {
            max: 100,
            message: '配置备注请尽量简略，描述应少于100个字'
          }
        ]
      },
      configValue: {
        type: FormInputEnum.Custom,
        label: '配置数据',
        customRender: 'configPanel',
        customLabelRender: 'configLabel'
      }
      // todo 先不做支持数组格式，后面有时间再优化
      // type: {
      //   type: FormInputEnum.Select,
      //   label: '配置项类型',
      //   defaultValue: 'object',
      //   rules: [
      //     {
      //       required: true,
      //       message: '请输入选择配置类型',
      //     },
      //   ],
      //   values: [
      //     {
      //       key: 'object',
      //       value: '对象',
      //     },
      //     {
      //       key: 'array',
      //       value: '数组',
      //     },
      //   ],
      //   onChange: () => handleToggle('type'),
      // },
    }

    const cardRef: Ref<PopupCardInstance<SchemeData> | null> = ref(null)

    const show = () => {
      if (cardRef.value) {
        cardRef.value.show({ name: '编辑' })
      }
    }
    const add = () => {
      if (cardRef.value) {
        cardRef.value.show()
      }
    }
    return { staticForm, cardRef, add, show }
  }
})
</script>

<style lang="less" scoped></style>
