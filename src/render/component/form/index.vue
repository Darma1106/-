<template>
  <a-form ref="formRef" :model="modelRef" :layout="$props.layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item
      v-for="key of Object.keys(formData).sort((a, b) => {
        return (formData[a].order || 0) - (formData[b].order || 0)
      })"
      :key="key"
      :name="key"
      :rules="formData[key].rules"
      v-bind="{
        label: !formData[key].customLabelRender ? formData[key].label : undefined
      }"
    >
      <component
        :is="`a-${formData[key].type}`"
        v-if="formData[key].type !== FormInputTypes.Custom"
        v-model:value="modelRef[key]"
        :placeholder="formData[key].placeholder || ''"
        allow-clear
        v-bind="{
          ...formData[key],
          options:
            formData[key].values && formData[key].type === FormInputTypes.CheckboxGroup
              ? formData[key].values?.map((val) => {
                  return {
                    ...val,
                    label: val.value,
                    value: val.key
                  }
                })
              : undefined
        }"
      >
        <template v-if="formData[key].values && formData[key].type === FormInputTypes.Select">
          <a-select-option v-for="option of formData[key].values" :key="option.key" :value="option.key">
            {{ option.value }}
          </a-select-option>
        </template>
        <template v-if="formData[key].values && formData[key].type === FormInputTypes.RadioGroup">
          <a-radio v-for="option of formData[key].values" :key="option.key" :value="option.key">
            {{ option.value }}
          </a-radio>
        </template>
      </component>
      <slot v-else :name="formData[key].customRender" :data="modelRef" :value="modelRef[key]"></slot>
      <template #label>
        <slot :name="formData[key].customLabelRender"></slot>
      </template>
    </a-form-item>
    <a-form-item v-if="$slots.footer" :wrapper-col="footerWrapper">
      <slot name="footer"></slot>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watchEffect, nextTick, watch } from 'vue'
import { merge } from 'lodash'
import {
  Input,
  InputNumber,
  Select,
  Radio,
  Checkbox,
  Switch,
  DatePicker,
  TimePicker,
  Upload,
  Form
} from 'ant-design-vue'
import { FormInputEnum } from './type/enum'
import { Common } from './type/common'
import type { IFormConfig, FormLayout } from './type'

// import { useDynamicValue } from '@/hooks/useDynamic'

export default defineComponent({
  name: 'SForm',
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ATextArea: Input.TextArea,
    AInputNumber: InputNumber,
    ASelect: Select,
    ASelectOption: Select.Option,
    ARadio: Radio,
    ARadioButton: Radio.Button,
    ARadioGroup: Radio.Group,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    ASwitch: Switch,
    ADatePicker: DatePicker,
    ATimePicker: TimePicker,
    AUpload: Upload
  },
  props: {
    layout: {
      type: String as PropType<FormLayout>
    },
    formData: {
      type: Object as PropType<IFormConfig>,
      required: true
    },
    formLayout: {
      type: Object as PropType<Common.IFormLayout>,
      default: () => {
        return {
          labelCol: { lg: { span: 8 }, sm: { span: 8 } },
          wrapperCol: { lg: { span: 16 }, sm: { span: 16 } }
        }
      }
    }
  },
  setup(props) {
    // 枚举传递
    const FormInputTypes = FormInputEnum
    // 表单 ref
    const formRef = ref()

    // 表单布局配置项解包
    const labelCol = ref(props.formLayout.labelCol)
    const wrapperCol = ref(props.formLayout.wrapperCol)

    // 生成底部footer wrapper
    const footerWrapper = ref<Common.ILayoutConfig>({})
    watchEffect(() => {
      const offsetRule: Common.ILayoutConfig = {}
      if (labelCol?.value) {
        const labelColValue = labelCol?.value
        Object.keys(labelColValue).forEach((key) => {
          if (key === 'span') {
            offsetRule.offset = labelColValue.span
          } else if (key !== 'offset') {
            offsetRule[key] = {
              offset: labelColValue[key].span
            }
          }
        })
      }
      merge(footerWrapper.value, offsetRule, wrapperCol?.value)
    })

    // 生成表单数据
    const convertModelFromFormData = (data: IFormConfig, fillData?: Common.RecordObject) => {
      try {
        return Object.keys(data).reduce((newData: Common.RecordObject, key) => {
          if (data[key].defaultValue !== undefined) {
            newData[key] = data[key].defaultValue
          } else if (data[key].type === FormInputEnum.InputNumber) {
            newData[key] = 0
          } else if (
            data[key].type === FormInputEnum.RangePicker ||
            data[key].type === FormInputEnum.CheckboxGroup ||
            (data[key].type === FormInputEnum.Select && data[key].mode === 'multiple')
          ) {
            newData[key] = []
          } else {
            newData[key] = undefined
          }
          if (fillData && fillData[key]) {
            newData[key] = fillData[key]
          }
          return newData
        }, {})
      } catch (err) {
        console.log(err)
      }
      return {}
    }
    const modelRef = ref<Common.RecordObject>({})

    watchEffect(() => {
      const data = convertModelFromFormData(props.formData, modelRef.value)
      modelRef.value = data
      console.log(data)
    })

    // 操作form的方法，tips：目前 antdv的useForm 中对于表单的操作方法存在问题，需要等待后续版本的升级
    const validate = () => formRef.value.validate()
    const resetFields = () => formRef.value.resetFields()
    const clearValidate = () => formRef.value.clearValidate()
    const setFieldsValue = (params: Common.RecordObject) => {
      modelRef.value = params
    }
    const setFieldValue = (fieldName: string, value: unknown) => {
      modelRef.value = { ...modelRef.value, [fieldName]: value }
    }

    watch(
      () => props.formData,
      () => {
        nextTick(() => clearValidate())
      }
    )

    const handleCheckHidden = (hidden?: boolean | ((data?: unknown) => boolean)) => {
      // if (typeof hidden === 'boolean') {
      //   return useDynamicValue<boolean>(hidden)
      // } else {
      //   return useDynamicValue<boolean>(false, hidden, modelRef)
      // }
    }

    const handleCheckDisabled = (disabled?: boolean | ((data?: unknown) => boolean)) => {
      // if (typeof disabled === 'boolean') {
      //   return useDynamicValue<boolean>(disabled)
      // } else {
      //   return useDynamicValue<boolean>(false, disabled, modelRef)
      // }
    }

    return {
      formRef,
      labelCol,
      wrapperCol,
      footerWrapper,
      modelRef,
      FormInputTypes,
      resetFields,
      validate,
      setFieldsValue,
      setFieldValue,
      clearValidate,
      handleCheckHidden,
      handleCheckDisabled
    }
  }
})
</script>
