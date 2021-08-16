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
  Popconfirm,
  Pagination,
  ConfigProvider
} from 'ant-design-vue'

import type { App } from 'vue'

export function useAntd(app: App<Element>): void {
  const Antd = [
    Button,
    ConfigProvider,
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
    Popconfirm,
    Pagination
  ]
  Antd.forEach((component) => {
    app.use(component)
  })
}
