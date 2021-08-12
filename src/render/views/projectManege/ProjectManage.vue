<template>
  <BaseModal ref="modalRef" title="项目管理" size="small">
    <template #default>
      <a-table :data-source="data" :columns="columns" class="project-table">
        <template #operation>
          <div class="action-container">
            <a-button type="primary">打开</a-button>
            <a-button>编辑</a-button>
            <a-button type="primary" danger>删除</a-button>
          </div>
        </template>
      </a-table>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import BaseModal from '@/component/modal/BaseModal.vue'
import { defineComponent, reactive, ref } from 'vue'

import { useEventStore } from '@/store'
import type { Ref } from 'vue'
import type { BaseModalInstance } from '@/component/modal/type'
import type { ColumnProps } from 'ant-design-vue/lib/table/interface'

interface TableData {
  key: string
  name: string
  describe: string
  createDate: string
}
const data: TableData[] = [
  {
    key: '1',
    name: '项目1',
    describe: '项目描述',
    createDate: '2021-08-12 13:55:42'
  },
  {
    key: '2',
    name: '项目2',
    describe: '项目描述',
    createDate: '2021-08-12 13:55:42'
  },
  {
    key: '3',
    name: '项目3',
    describe: '项目描述',
    createDate: '2021-08-12 13:55:42'
  },
  {
    key: '4',
    name: '项目4',
    describe: '项目描述',
    createDate: '2021-08-12 13:55:42'
  }
]

export default defineComponent({
  name: '',
  components: { BaseModal },
  setup() {
    const modalRef: Ref<BaseModalInstance | null> = ref(null)
    const show = () => {
      if (modalRef.value) {
        modalRef.value.showModal()
      }
    }

    const eventStore = useEventStore()
    eventStore.onEvent('projectManage', show, 'system')

    const columns: ColumnProps[] = reactive([
      {
        title: '项目名称',
        dataIndex: 'name',
        align: 'center',
        key: 'name'
      },
      {
        title: '项目描述',
        dataIndex: 'describe',
        align: 'center',
        key: 'describe'
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        align: 'center',

        key: 'createDate'
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        key: 'action',
        slots: {
          customRender: 'operation'
        }
      }
    ])

    return {
      modalRef,
      data,
      columns,
      show
    }
  }
})
</script>

<style lang="less" scoped>
.project-table {
  height: 500px;
  .action-container {
    * {
      margin: 0 6px;
    }
  }
}
</style>
