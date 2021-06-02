<template>
  <div ref="diagramRef" class="diagram"></div>
</template>

<script setup lang="ts">
// import * as go from 'gojs'
import { onMounted, ref } from 'vue'
import { unrefElement } from '@vueuse/core'
import { init } from './ts/umlClassDiagram'
// import { nodeData, linkData } from './testData'

import type { Ref } from 'vue'

const diagramRef: Ref<HTMLDivElement | null> = ref(null)

// let cc = go.Shape.getArrowheadGeometries().toKeySet().toArray()
// console.log(cc, 'cc')

onMounted(() => {
  const myDiagram = init(unrefElement(diagramRef))
  console.log(myDiagram)

  // setData(myDiagram)
})

// const make = go.GraphObject.make

// function setData(myDiagram: go.Diagram): void {
//   myDiagram.model = make(go.GraphLinksModel, {
//     linkFromPortIdProperty: 'fromPort',
//     linkToPortIdProperty: 'toPort',
//     copiesArrays: true,
//     copiesArrayObjects: true,
//     nodeDataArray: nodeData,
//     linkDataArray: linkData
//   })
//   setTimeout(() => {
//     myDiagram.nodes.all((item) => {
//       if (item.data.location) {
//         item.setProperties({
//           location: new go.Point(item.data.location.x, item.data.location.y)
//         })
//       }

//       return true
//     })
//   }, 0)
// }
</script>

<style lang="less" scoped>
.diagram {
  height: 100%;
  border: 2px solid red;
}
</style>
