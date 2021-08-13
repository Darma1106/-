<template>
  <div ref="diagramRef" class="diagram"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { unrefElement } from '@vueuse/core'

import type { Ref } from 'vue'
import { init } from './ts/umlClassDiagram'

export default defineComponent({
  setup() {
    const diagramRef: Ref<HTMLDivElement | null> = ref(null)
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
  // border: 2px solid red;
}
</style>
