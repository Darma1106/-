type RelationshipType = 'generalization' | 'aggregation'
type PropertyType = 'public' | 'private' | 'protected' | 'package'
type NodeKey = string | number

export interface NodeData {
  key: NodeKey
  name: string
  properties: NodeProperty[]
  methods: NodeMethod[]
}
export interface NodeProperty {
  name: string
  type: string
  visibility: string
  default?: number | string
}
export interface MethodParameter {
  name: string
  type: string
}
export interface NodeMethod {
  name: string
  parameters: MethodParameter[]
  visibility: string
}
export interface LinkData {
  from: NodeKey
  to: NodeKey
  relationship: RelationshipType
}
