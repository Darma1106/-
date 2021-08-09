import { icons } from '@/common/icons'
import { ArrowTypeValue, CommonNodeTypeValue, CommonLinkTypeValue } from './enum'
import type { Node, Link, Diagram, ObjectData } from 'gojs'

export type ArrowType = keyof typeof ArrowTypeValue

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AfterLink = (subject: any, model: go.Model) => void

export type AfterInit = (diagram: go.Diagram) => void

export interface Template<T> {
  name: string
  template: T
}

export interface BaseDiagramInstance {
  NodeMap: Template<Node>[]
  LinkMap: Template<Link>[]
  getDiagram: () => Diagram
  getNodeArray: () => go.ObjectData[] | undefined
  getLinkArray: () => go.ObjectData[] | undefined
  addNode: (node: ObjectData) => void
  addChildNode: () => void
  getJson: () => string
  renderJson: (json: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProperty: (propName: string, val: any) => void
  setLinkedState: (state: boolean) => void
}

export interface DiagramData {
  nodeDataArray: ObjectData[]
  linkDataArray: ObjectData[]
}

export type Icons = keyof typeof icons

export interface EditorData extends go.ObjectData {
  key?: string | number
  text?: string
  category: string
  fontColor?: string
  geo?: Icons
  source?: string
  showContext?: boolean
  resizable?: boolean
}

export interface EditorType {
  id: string
  type: string
  name: string
  data: EditorData | LinkOption
}

// 手风琴设置
export interface EditorTemplate {
  id: string
  category: string
  name: string
  items: EditorType[]
}

export interface NodeOption {
  source?: string
  figure?: string
  strokeWidth?: number
  fill?: string
  color?: string
  contextMenu?: boolean
}

export interface LinkOption {
  key?: string | number
  color?: string
  weight?: number
  dash?: number[] | null
  dir?: 0 | 1 | 2
}

export type CommonNodeType = keyof typeof CommonNodeTypeValue

export type CommonNodeMap = {
  [key in CommonNodeType]: go.Node
}

export type CommonLinkType = keyof typeof CommonLinkTypeValue

export type CommonLinkMap = {
  [key in CommonLinkType]: go.Link
}
