import { ArrowTypeValue } from './enum'
import type { Node, Link, Diagram, ObjectData } from 'gojs'

export type ArrowType = keyof typeof ArrowTypeValue

export interface Template<T> {
  name: string
  template: T
}

export interface BaseDiagramInstance {
  getDiagram: () => Diagram
  addNode: (node: ObjectData) => void
  NodeMap: Template<Node>[]
  LinkMap: Template<Link>[]
}

export interface DiagramData {
  nodeDataArray: ObjectData[]
  linkDataArray: ObjectData[]
}
