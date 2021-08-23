<template>
  <a-button class="editable-add-btn" style="margin-bottom: 8px; margin-left: 80%" @click="handleAdd">添加</a-button>
  <a-table bordered :data-source="dataSource" :columns="columns" class="table-model" :pagination="false">
    <template v-for="col in ['name', 'age', 'address']" #[col]="{ text, record }" :key="col">
      <div>
        <a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][col]" style="margin: -5px 0" />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>

    <template #operation="{ record }">
      <div class="editable-row-operations">
        <span v-if="editableData[record.key]">
          <a @click="save(record.key)">保存</a>
          <a-popconfirm title="确定要取消吗?" cancel-text="取消" ok-text="确定" @confirm="cancel(record.key)">
            <a>取消</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a @click="edit(record.key)">编辑</a>
          <a-popconfirm
            v-if="dataSource.length"
            title="确定要删除吗?"
            cancel-text="取消"
            ok-text="确定"
            @confirm="onDelete(record.key)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </div>
    </template>
    <!-- <template #operation="{ record }">
      <a-popconfirm v-if="dataSource.length" title="确定要删除吗?" @confirm="onDelete(record.key)">
        <a>删除</a>
      </a-popconfirm>
    </template> -->
  </a-table>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import type { UnwrapRef, Ref, PropType } from 'vue'
import { cloneDeep } from 'lodash'

import { dataMap } from './database'
import type { MTable } from './database'

interface DataItem {
  key: string
  name?: string
  age?: number | string
  address?: string
}

export default defineComponent({
  props: {
    tableColumns: {
      type: Array as PropType<number[]>
    },
    tableData: {
      type: Array
    },
    tabId: {
      type: String,
      required: true
    }
  },
  setup() {
    const Mdata = dataMap.get('0-3-1') as MTable
    let columns: any[] = []
    const dataSource: Ref<DataItem[]> = ref([
      {
        key: '0',
        name: 'Edward King 0',
        age: 32,
        address: 'London, Park Lane no. 0'
      },
      {
        key: '1',
        name: 'Edward King 1',
        age: 32,
        address: 'London, Park Lane no. 1'
      }
    ])
    if (Mdata) {
      columns = Mdata.colums
      dataSource.value = Mdata.data
    }

    const count = computed(() => dataSource.value.length + 1)
    const editableData: UnwrapRef<Record<string, DataItem>> = reactive({})
    const editColumn = ref<string>()

    const edit = (key: string) => {
      editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0])
    }
    const save = (key: string) => {
      Object.assign(dataSource.value.filter((item) => key === item.key)[0], editableData[key])
      delete editableData[key]
    }
    const cancel = (key: string) => {
      delete editableData[key]
    }

    const onDelete = (key: string) => {
      dataSource.value = dataSource.value.filter((item) => item.key !== key)
    }
    const handleAdd = () => {
      const newData = {
        key: `${count.value}`
      }
      dataSource.value.push(newData)
    }

    return {
      columns,
      cancel,
      handleAdd,
      dataSource,
      editableData,
      editColumn,
      count,
      edit,
      onDelete,
      save
    }
  }
})
</script>
<style lang="less" scoped>
.editable-row-operations a {
  margin-right: 20px;
}
</style>
