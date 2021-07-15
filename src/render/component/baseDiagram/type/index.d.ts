import { icons } from '@/common/icons'
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

export type Icons = keyof typeof icons

export interface EditorData extends go.ObjectData {
  text?: string
  category: string
  geo?: Icons
  showContext: boolean
}

export interface NodeOption {
  figure?: string
  strokeWidth?: number
  fill?: string
  color?: string
  contextMenu?: boolean
}
