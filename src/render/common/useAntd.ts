import { Layout, Button, Tabs, Dropdown, Menu, Table } from 'ant-design-vue'

import type { App } from 'vue'

export function useAntd(app: App<Element>): void {
  const Antd = [Button, Layout, Tabs, Dropdown, Menu, Table]
  Antd.forEach((component) => {
    app.use(component)
  })
}
