import { PropertyTypeValue, RelationshipTypeValue, NodePortTypeValue } from './enum'

export type RelationshipType = keyof typeof RelationshipTypeValue
type PropertyType = keyof typeof PropertyTypeValue
type MethodType = PropertyType
type NodePortType = keyof typeof NodePortTypeValue
type NodeKey = string | number

export interface NodeData {
  key: NodeKey
  name: string
  type?: string
  location?: { x: number; y: number }
  loc?: string
  properties?: NodeProperty[]
  methods?: NodeMethod[]
}

/**
 *  @name 节点名
 *  @type 节点类型
 *  @visibility 渲染类型
 *  @defaultValue 默认值
 *
 */

export interface NodeProperty {
  name: string
  type: string
  visibility: PropertyType
  scope?: string
  defaultValue?: number | string | boolean
}

/**
 * @name 属性名
 * @type 属性类型
 */
export interface MethodParameter {
  name: string
  type?: string
}

export interface NodeMethod {
  name: string
  parameters?: MethodParameter[]
  visibility: MethodType
  type?: string
}

export interface LinkData {
  from: NodeKey
  to: NodeKey
  relationship?: RelationshipType
  fromPort?: NodePortType
  toPort?: NodePortType
}
