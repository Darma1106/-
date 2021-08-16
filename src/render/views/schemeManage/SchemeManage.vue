<template>
  <BaseModal ref="modalRef" title="方案管理" size="small">
    <template #default>
      <a-config-provider :locale="zhCN">
        <a-table
          :data-source="schemeList"
          :columns="columns"
          :loading="loading"
          :scroll="{ y: 400 }"
          :pagination="false"
          class="project-table"
          row-key="id"
        >
          <template #operation="{ record }">
            <div class="action-container">
              <!-- <a-button type="primary">打开</a-button> -->
              <a-button size="small" @click="edit(record)">编辑</a-button>
              <a-button type="primary" danger size="small" @click="deleteFn(record.id)">删除</a-button>
            </div>
          </template>
        </a-table>
        <a-pagination
          v-model:current="pageNum"
          v-model:pageSize="pageSize"
          size="small"
          :show-total="totalCallback"
          :total="total"
          show-size-changer
          show-quick-jumper
        />
      </a-config-provider>
    </template>
  </BaseModal>
  <SchemeForm ref="schemeFormRef" @form-comfirm="addFn" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import type { ColumnProps } from 'ant-design-vue/lib/table/interface'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import SchemeForm from './SchemeForm.vue'
import BaseModal from '@/component/modal/BaseModal.vue'

import { useEventStore } from '@/store'
import type { BaseModalInstance } from '@/component/modal/type'
import type { PopupCardInstance } from '@/component/popupCard/type'
import { useScheme } from '@/composition'
import type { SchemeInfo } from '@/services/module/schemeService'

const modalRef: Ref<BaseModalInstance | null> = ref(null)
const [schemeList, { loading, selectFn, deleteFn, addFn, total, pageNum, pageSize }] = useScheme()

const show = () => {
  if (modalRef.value) {
    selectFn()
    modalRef.value.showModal()
  }
}

const eventStore = useEventStore()
eventStore.onEvent('projectManage', show, 'system')

const columns: ColumnProps[] = reactive([
  {
    title: '方案名称',
    dataIndex: 'name',
    align: 'center',
    key: 'name'
  },
  {
    title: '框架名称',
    dataIndex: 'frameName',
    align: 'center',
    key: 'frameName'
  },
  {
    title: '方案描述',
    dataIndex: 'describes',
    align: 'center',
    key: 'describes'
  },
  {
    title: '方案背景',
    dataIndex: 'background',
    align: 'center',
    key: 'background'
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
    width: '180px',
    slots: {
      customRender: 'operation'
    }
  }
])

const schemeFormRef: Ref<null | PopupCardInstance<SchemeInfo>> = ref(null)
const edit = (record: SchemeInfo) => {
  if (schemeFormRef.value) {
    schemeFormRef.value.show(record)
  }
}

const totalCallback = (total: number) => {
  return `共 ${total} 条`
}
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
