<template>
  ant-table
  <a-table
    :loading="projectHandler.loading.value"
    :dataSource="projectList"
    :columns="columns"
    rowKey="id"
  />
</template>

<script setup lang="ts">
import ATable from 'ant-design-vue/es/table'
import 'ant-design-vue/es/table/style'
import type { ColumnProps } from 'ant-design-vue/es/table/interface'
import useProject from '../../composition/useProject'

const [projectList, projectHandler] = useProject()

const columns: ColumnProps[] = [
  {
    title: '项目编号',
    dataIndex: 'id'
  },
  {
    title: '项目名称',
    dataIndex: 'name'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  {
    title: '项目背景',
    dataIndex: 'background'
  },
  {
    title: '采集编号',
    dataIndex: 'cjId'
  }
]
</script>

<style lang="less" scope></style>
