export interface MenuItem {
  name: string
  label: string
  children?: MenuItem[]
  type?: string
  click?: () => void
}
