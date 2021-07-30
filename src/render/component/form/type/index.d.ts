import { FormInputEnum, FormLayoutValue } from './enum'
import { Common } from './common'

/**
 * 表单组件向外暴露的数据格式
 * @param resetFields 重置字段
 * @param validate 验证表单，并返回表单数据
 * @param modelRef 表单数据
 * @param setFieldsValue 设置全部表单字段
 * @param setFieldValue 设置单个表单字段
 */
export interface IFormRef {
  /**
   * 重置表单状态及数据
   */
  resetFields(): void

  /**
   * 验证表单，并返回表单数据
   * @return 表单校验失败，返回错误信息，表单校验成功，返回表单对象
   */
  validate<T>(): Promise<T>

  /**
   * 表单数据
   */
  modelRef: Common.RecordObject

  /**
   * 设置整个表单的数据
   * @param formValue 表单数据
   */
  setFieldsValue(formValue: Common.RecordObject): void

  /**
   * 设置单个表单字段的方法
   * @param fieldName 字段名
   * @param value 字段的值
   */
  setFieldValue(fieldName: string, value: unknown): void

  [key: string]: unknown
}

export interface IFormConfig {
  [key: string]: IFormItemConfig
}

// 表单字段可遍历值类型，例如select和radio等
export interface IFormIterableValue extends Common.IKeyValue {
  disabled?: boolean
  checked?: boolean
}

export interface IFormRule {
  required?: boolean
  message: string
  [key: string]: unknown
}

// 字段配置项
export interface IFormItemConfig {
  type: keyof typeof FormInputEnum
  label: string
  placeholder?: string
  props?: Common.RecordObject
  values?: IFormIterableValue[]
  defaultValue?: unknown
  rules?: IFormRule[]
  hidden?: boolean | ((data?: unknown) => boolean)
  disabled?: boolean | ((data?: unknown) => boolean)
  onChange?: (e: undefined | string | number | InputEvent, ...params: unknown[]) => void
  order?: number
  customRender?: string
  customLabelRender?: string
  [key: string]: unknown
}

type FormLayout = typeof FormLayoutValue[number]
