import { ArrowTypeValue } from './enum'
import type { Node, Link, Diagram } from 'gojs'

export type ArrowType = keyof typeof ArrowTypeValue

export interface Template<T> {
  name: string
  template: T
}

export interface BaseDiagramInstance {
  getDiagram: () => Diagram
  NodeMap: Template<Node>[]
  LinkMap: Template<Link>[]
}
