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
  text?: string
  category: string
  fontColor?: string
  geo?: Icons
  source?: string
  showContext: boolean
}

export interface NodeOption {
  source?: string
  figure?: string
  strokeWidth?: number
  fill?: string
  color?: string
  contextMenu?: boolean
}

export type CommonNodeType = keyof typeof CommonNodeTypeValue

export type CommonNodeMap = {
  [key in CommonNodeType]: go.Node
}

export type CommonLinkType = keyof typeof CommonLinkTypeValue

export type CommonLinkMap = {
  [key in CommonLinkType]: go.Link
}
