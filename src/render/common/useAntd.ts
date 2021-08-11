import {
  Layout,
  Button,
  Tabs,
  Dropdown,
  Menu,
  Table,
  Form,
  Radio,
  Select,
  Input,
  Checkbox,
  Divider,
  Switch,
  Collapse,
  Popconfirm
} from 'ant-design-vue'

import type { App } from 'vue'

export function useAntd(app: App<Element>): void {
  const Antd = [
    Button,
    Layout,
    Tabs,
    Dropdown,
    Menu,
    Table,
    Form,
    Radio,
    Select,
    Input,
    Checkbox,
    Switch,
    Divider,
    Collapse,
    Popconfirm
  ]
  Antd.forEach((component) => {
    app.use(component)
  })
}
