<template>
  <a-layout class="layout" theme="dark">
    <a-layout-header>
      <layout-header />
    </a-layout-header>

    <a-layout>
      <LayoutContent />
    </a-layout>
    <a-layout-footer> <layout-footer /></a-layout-footer>
    <ProjectManage />
    <ProjectForm ref="projectForm" />
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ProjectManage from '../views/schemeManage/SchemeManage.vue'
import ProjectForm from '../views/schemeManage/SchemeForm.vue'
import LayoutHeader from './header/Header.vue'
import LayoutContent from './content/Content.vue'
import LayoutFooter from './footer/Footer.vue'
import { useEventStore, useSchemeStore } from '@/store'
import type { PopupCardInstance } from '@/component/popupCard/type'
import type { SchemeInfo } from '@/services/module/schemeService'
import SchemeService from '@/services/module/schemeService'

const projectForm = ref<null | PopupCardInstance<SchemeInfo>>(null)

const schemeStore = useSchemeStore()

const addScheme = () => {
  if (projectForm.value) {
    projectForm.value.show()
  }
}

const editScheme = async () => {
  const { data } = await SchemeService.findSchemeById(schemeStore.scheme?.id as string)
  if (projectForm.value) {
    projectForm.value.show(data)
  }
}

const eventStore = useEventStore()
eventStore.onEvent('editProject', editScheme, 'system')
eventStore.onEvent('addProject', addScheme, 'system')
</script>

<style lang="less" scoped>
.layout {
  box-sizing: content-box;
  height: 100vh;

  ::v-deep(.ant-layout-header) {
    background-color: @header-color;
    padding: 0;
    height: auto;
    line-height: normal;
    border-bottom: 2px solid @my-layout-border-color;
  }

  ::v-deep(.ant-layout-content) {
    background: #fff;
  }

  ::v-deep(.ant-layout-sider) {
    background: #fff;
    border-right: 2px solid @my-layout-border-color;
  }

  ::v-deep(.ant-layout-footer) {
    height: 40px;
    background: @base-background-color;
    border: 2px solid @my-layout-border-color;
    padding: 0;
  }
}
</style>
