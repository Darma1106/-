export interface contextMenu {
  name: string
  title: string
  disable: boolean
  children?: contextMenu[]
}

export interface toolConfig {
  name: string
  title: string
  icon?: string
  iconColor?: string
  disable: boolean
  type: string
  contextMenu?: contextMenu[]
  onclick?: () => void
}
