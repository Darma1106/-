export interface MenuItem {
  name: string
  label: string
  children?: MenuItem[]
  disable?: boolean
  type?: string
  flag?: boolean
  click?: any
}
