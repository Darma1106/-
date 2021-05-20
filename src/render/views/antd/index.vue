<template>
  <div class="antd-view">
    <component :is="componentName"></component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const AntdTable = defineAsyncComponent(() => import('./table.vue'))
const AntdModal = defineAsyncComponent(() => import('./modal.vue'))
const AntdTest = defineAsyncComponent(() => import('./test.vue'))
const AntdTree = defineAsyncComponent(() => import('./tree.vue'))

export default defineComponent({
  name: '',
  components: { AntdTable, AntdModal, AntdTest, AntdTree },
  setup() {
    const componentName = computed(() => {
      const route = useRoute()
      return `antd-${route.params.componentName}`
    })
    return { componentName }
  }
})
</script>

<style lang="less" scope>
.antd-view {
  padding-top: 80px;
}
</style>
