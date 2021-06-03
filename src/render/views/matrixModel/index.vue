<template>
  <div class="matrix-model">
    <a-table :columns="columns" :data-source="data">
      <template #ability="scope">
        <a-dropdown :trigger="['click']">
          <span @click="dian(scope)">{{ scope.text == '0' ? '弱' : '强' }}</span>
          <template #overlay>
            <a-menu>
              <a-menu-item key="0">
                <a @click="setS"> 强关系 </a>
              </a-menu-item>
              <a-menu-item key="1">
                <a @click="setA"> 弱关系 </a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import type { ColumnProps } from 'ant-design-vue/lib/table/interface'
const columns: ColumnProps[] = [
  {
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '能力1',
    dataIndex: '111111',
    key: '111111',
    slots: { customRender: 'ability' }
  },
  {
    title: '能力2',
    dataIndex: '222222',
    key: '222222',
    slots: { customRender: 'ability' }
  },
  {
    title: '能力3',
    key: '333333',
    dataIndex: '333333',
    slots: { customRender: 'ability' }
  },
  {
    title: '能力4',
    key: '444444',
    dataIndex: '444444',
    slots: { customRender: 'ability' }
  }
]

const data: TableData[] = reactive([
  {
    key: '1',
    name: '指标1',
    '111111': 1,
    '222222': 0,
    '333333': 0,
    '444444': 1
  },
  {
    key: '2',
    name: '指标2',
    '111111': 1,
    '222222': 0,
    '333333': 0,
    '444444': 1
  },
  {
    key: '3',
    name: '指标3',
    '111111': 1,
    '222222': 0,
    '333333': 0,
    '444444': 1
  }
])

interface TableData {
  key: string
  name: string
  [key: string]: string | number
}

interface Scope {
  column: ColumnProps
  text: string | number
  index: number
  record: TableData
}

export default defineComponent({
  setup() {
    let selection: Scope | null = null
    function dian(scope: Scope) {
      selection = scope
      console.log(scope)
    }
    function setS() {
      if (selection) {
        data[selection.index][`${selection.column.dataIndex}`] = 1
      }
    }
    function setA() {
      if (selection) {
        data[selection.index][`${selection.column.dataIndex}`] = 0
      }
    }
    return {
      data,
      columns,
      dian,
      setS,
      setA
    }
  }
})
</script>

<style lang="less" scope></style>
