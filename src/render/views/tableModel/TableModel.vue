<template>
  <a-button class="editable-add-btn" style="margin-bottom: 8px; margin-left: 80%" @click="handleAdd">添加</a-button>
  <a-table bordered :data-source="dataSource" :columns="columns">
    <template #name="{ text, record }">
      <div class="editable-cell">
        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
          <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" />
          <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ text || ' ' }}
          <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
        </div>
      </div>
    </template>
    <template #operation="{ record }">
      <a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="onDelete(record.key)">
        <a>Delete</a>
      </a-popconfirm>
    </template>
  </a-table>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, UnwrapRef } from 'vue'
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash'

import { dataMap } from './database'
import type { MTable } from './database'

import type { Ref, PropType } from 'vue'

interface DataItem {
  key: string
  name?: string
  age?: number | string
  address?: string
}

export default defineComponent({
  components: {
    CheckOutlined,
    EditOutlined
  },
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
  setup(props) {
    const Mdata = dataMap.get(props.tabId) as MTable
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

    const edit = (key: string) => {
      editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0])
    }
    const save = (key: string) => {
      Object.assign(dataSource.value.filter((item) => key === item.key)[0], editableData[key])
      delete editableData[key]
    }

    const onDelete = (key: string) => {
      dataSource.value = dataSource.value.filter((item) => item.key !== key)
    }
    const handleAdd = () => {
      const newData = {
        key: `${count.value}`,
        name: ``,
        age: '',
        address: ``
      }
      dataSource.value.push(newData)
    }

    return {
      columns,
      onDelete,
      handleAdd,
      dataSource,
      editableData,
      count,
      edit,
      save
    }
  }
})
</script>
<style lang="less">
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
