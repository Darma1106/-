import { iconFont } from '@/component/baseIcon/type/enum'
export interface contextMenu {
  name: string
  title: string
  disable: boolean
  children?: contextMenu[]
}

export interface BaseConfig {
  name: string
  title: string
  type: string
  disable: boolean
}

export interface BaseButtonConfig extends BaseConfig {
  onclick?: () => void
  icon: iconFont
  iconColor?: string
}

export interface ContextButtonConfig extends BaseConfig {
  onclick?: () => void
  icon: iconFont
  iconColor?: string
  contextMenu: contextMenu[]
}

export interface SwitchButtonConfig extends BaseConfig {
  onclick?: () => void
  icon: iconFont
  iconColor?: string
}

export interface toolConfig {
  name: string
  title: string
  icon?: iconFont
  iconColor?: string
  disable: boolean
  type: string
  contextMenu?: contextMenu[]
  onclick?: () => void
}
