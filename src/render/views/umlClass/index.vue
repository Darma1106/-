<template>
  <div ref="diagramRef" class="diagram"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { unrefElement } from '@vueuse/core'
import { init } from './ts/umlClassDiagram'

import type { Ref } from 'vue'

const diagramRef: Ref<HTMLDivElement | null> = ref(null)

onMounted(() => {
  const myDiagram = init(unrefElement(diagramRef))
  console.log(myDiagram)
})
</script>

<style lang="less" scoped>
.diagram {
  height: 100%;
  border: 2px solid red;
}
</style>
