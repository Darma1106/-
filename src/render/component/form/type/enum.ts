// 表单字段类型枚举
export enum FormInputEnum {
  Input = 'Input',
  InputNumber = 'InputNumber',
  Textarea = 'Textarea',
  Select = 'Select',
  RadioGroup = 'RadioGroup',
  CheckboxGroup = 'CheckboxGroup',
  Switch = 'Switch',
  DatePicker = 'DatePicker',
  TimePicker = 'TimePicker',
  RangePicker = 'RangePicker',
  Upload = 'Upload',
  Custom = 'Custom'
}

export const FormLayoutValue = ['inline', 'vertical', 'horizontal'] as const
