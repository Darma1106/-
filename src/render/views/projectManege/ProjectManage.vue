<template>
  <BaseModal ref="modalRef" title="项目管理"></BaseModal>
</template>

<script lang="ts">
import BaseModal from '@/component/modal/BaseModal.vue'
import { defineComponent, onMounted, ref } from 'vue'

import { useEventStore } from '@/store'
import type { Ref } from 'vue'
import type { BaseModalInstance } from '@/component/modal/type'

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

    // onMounted(() => {
    //   if (modalRef.value) {
    //     modalRef.value.showModal()
    //   }
    // })
    return {
      modalRef,
      show
    }
  }
})
</script>

<style lang="less" scoped></style>
