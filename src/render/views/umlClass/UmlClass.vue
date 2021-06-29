<template>
  <div ref="diagramRef" class="diagram"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { unrefElement } from '@vueuse/core'

import { eventController } from '@/composition/b-hooks/useEvent'

import { init } from './ts/umlClassDiagram'

import type { Ref } from 'vue'

export default defineComponent({
  setup() {
    const diagramRef: Ref<HTMLDivElement | null> = ref(null)
    const { onSave } = eventController
    onSave(() => {
      console.log('umlClass')
    }, 'Uml')

    onMounted(() => {
      const myDiagram = init(unrefElement(diagramRef))
      console.log(myDiagram)
    })

    return { diagramRef }
  }
})
</script>

<style lang="less" scoped>
.diagram {
  height: 100%;
  border: 2px solid red;
}
</style>
