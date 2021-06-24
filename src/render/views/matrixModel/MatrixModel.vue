<template>
  <div class="matrix-model">
    <a-table :columns="columns" :data-source="data" :pagination="false">
      <template #ability="scope">
        <a-dropdown :trigger="['click']">
          <div style="height: 26px; cursor: pointer" @click="dian(scope)">
            {{ getRelation(scope.text) }}
          </div>
          <template #overlay>
            <a-menu style="width: 100px">
              <a-menu-item key="0">
                <a @click="setRelation(1)"> 强关系 </a>
              </a-menu-item>
              <a-menu-item key="1">
                <a @click="setRelation(0)"> 弱关系 </a>
              </a-menu-item>
              <a-menu-item key="2">
                <a @click="setRelation('')"> 无关系 </a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-table>
    <a-button type="primary" @click="addRow">增加指标</a-button>
    <a-button type="primary" @click="addColumn">增加能力</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import type { ColumnProps } from 'ant-design-vue/lib/table/interface'
const columns: ColumnProps[] = reactive([
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
])

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
    function setRelation(relation: number | string) {
      if (selection) {
        data[selection.index][`${selection.column.dataIndex}`] = relation
      }
    }
    function addColumn() {
      let column: ColumnProps = {
        title: `能力${columns.length}`,
        key: `${columns.length}`.repeat(6),
        dataIndex: `${columns.length}`.repeat(6),
        slots: { customRender: 'ability' }
      }
      columns.push(column)
      data.forEach((item) => {
        item[`${columns.length}`.repeat(6)] = ''
      })
    }
    function addRow() {
      let indicator: TableData = { key: `${data.length + 1}`, name: `指标${data.length + 1}` }
      data.push(indicator)
    }
    function getRelation(level: number) {
      let result = ''
      switch (level) {
        case 0:
          result = '弱'
          break
        case 1:
          result = '强'

          break

        default:
          break
      }
      return result
    }
    return {
      data,
      columns,
      dian,
      setRelation,
      addColumn,
      getRelation,
      addRow
    }
  }
})
</script>

<style lang="less" scope></style>
