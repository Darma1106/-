<template>
  <div class="matrix-model">
    <a-table :columns="columns" :data-source="data" :pagination="false">
      <template #ability="scope">
        <a-dropdown :trigger="['click']">
          <div style="height: 26px; cursor: pointer">
            {{ getRelation(scope.text) }}
          </div>
          <template #overlay>
            <a-menu style="width: 100px">
              <a-menu-item key="0">
                <a @click="setRelation(1, scope)"> 强关系 </a>
              </a-menu-item>
              <a-menu-item key="1">
                <a @click="setRelation(0, scope)"> 弱关系 </a>
              </a-menu-item>
              <a-menu-item key="2">
                <a @click="setRelation('', scope)"> 无关系 </a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-table>
    <!-- <a-button type="primary" @click="addRow">增加指标</a-button>
    <a-button type="primary" @click="addColumn">增加能力</a-button> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { Ref } from 'vue'
import type { ColumnProps } from 'ant-design-vue/lib/table/interface'
const columns: Ref<ColumnProps[]> = ref([
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

const data: Ref<TableData[]> = ref([
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
    function setRelation(relation: number | string, scope: Scope) {
      if (scope) {
        data.value[scope.index][`${scope.column.dataIndex}`] = relation
      }
    }
    function addColumn() {
      let column: ColumnProps = {
        title: `能力${columns.value.length}`,
        key: `${columns.value.length}`.repeat(6),
        dataIndex: `${columns.value.length}`.repeat(6),
        slots: { customRender: 'ability' }
      }
      columns.value.push(column)
      data.value.forEach((item) => {
        item[`${columns.value.length}`.repeat(6)] = ''
      })
    }
    function addRow() {
      let indicator: TableData = { key: `${data.value.length + 1}`, name: `指标${data.value.length + 1}` }
      data.value.push(indicator)
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
      setRelation,
      addColumn,
      getRelation,
      addRow
    }
  }
})
</script>

<style lang="less" scoped>
.matrix-model {
  // border-left: 1px solid black;
  // border-right: 1px solid black;
  width: calc(100% - 2px);

  height: 100%;
}
</style>
