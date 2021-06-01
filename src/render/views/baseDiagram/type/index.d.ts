import { ArrowTypeValue } from './enum'
import type { Node, Diagram } from 'gojs'

export type ArrowType = keyof typeof ArrowTypeValue

export interface NodeTemplate {
  name: string
  template: Node
}

export interface BaseDiagramInstance {
  getDiagram: () => Diagram
  NodeMap: NodeTemplate[]
}
