export declare namespace Common {
  // import { ViewportSize } from '@/config/pageConfig'
  enum ViewportSize {
    'xs' = '480px',
    'sm' = '576px',
    'md' = '768px',
    'lg' = '992px',
    'xl' = '1200px',
    'xxl' = '1600px'
  }
  // 查询字段
  interface ISearchField {
    key: string
    name: string
    type: string
    placeholder: string
    values: IKeyValue[]
    hide: boolean
    defaultValue?: unknown
  }

  // 表头字段
  interface ITableField {
    dataIndex?: string
    title: string
    isExpand?: boolean
    hide?: boolean
    type?: string
    width?: number
    fixed?: string
    slots?: unknown
  }

  // 查询页面相关配置
  interface IQueryPageConfig {
    searchFields: ISearchField[]
    tableHeaders: ITableField[]
  }

  // 表单布局配置项
  type LayoutConfig = {
    [key in keyof typeof ViewportSize]?: ILayoutConfig
  }
  interface ILayoutConfig extends LayoutConfig {
    span?: number
    offset?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
  interface IFormLayout {
    labelCol: ILayoutConfig
    wrapperCol: ILayoutConfig
  }

  /**
   * 分页数据
   */
  interface IPagedData<T> {
    total: number
    rows: T[]
  }

  /**
   * key-value 对象结构
   */
  interface IKeyValue {
    key: string | number
    value: unknown
  }

  /**
   * 通用的对象类型
   */
  type RecordObject = Record<string | number | symbol, unknown>

  /**
   * 通用请求返回数据对象基类
   */
  interface IBaseResponseObj {
    isDeleted?: number
    createdUser?: string
    createdTime?: string
    updateUser?: string
    updateTime?: string
  }

  // 自定义配置对象
  interface IConfig extends IBaseResponseObj {
    /**
     * 配置ID
     */
    id?: number
    /**
     * 配置对应的页面code
     */
    groupKey: string
    /**
     * 配置code
     */
    code: string
    /**
     * 配置名
     */
    name: string
    /**
     * 配置值，为json，需要自己解出来
     */
    value: string
    /**
     * 字典备注
     */
    comment: string

    // -------- 以下为自定义字段 --------
    /**
     * 对象化后的配置值
     */
    configValue?: RecordObject | Array<RecordObject>
    /**
     * 配置的类型
     */
    type?: 'array' | 'object'
  }
}
