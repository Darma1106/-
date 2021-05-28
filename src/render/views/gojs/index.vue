<template>
  <div ref="diagramRef" class="diagram"></div>
</template>

<script setup lang="ts">
import * as go from 'gojs'
import { onMounted, ref } from 'vue'
import { init } from './ts/umlDiagram'
import { nodeData, linkData } from './testData'

import type { Ref } from 'vue'

const diagramRef: Ref<HTMLDivElement | null> = ref(null)

// console.log(go.Shape.getArrowheadGeometries().toKeySet().toArray())

onMounted(() => {
  const myDiagram = init(diagramRef.value as HTMLDivElement)
  setData(myDiagram)
})

const make = go.GraphObject.make

function setData(myDiagram: go.Diagram): void {
  myDiagram.model = make(go.GraphLinksModel, {
    linkFromPortIdProperty: 'fromPort',
    linkToPortIdProperty: 'toPort',
    copiesArrays: true,
    copiesArrayObjects: true,
    nodeDataArray: nodeData,
    linkDataArray: linkData
  })

  setTimeout(() => {
    myDiagram.nodes.all((item) => {
      if (item.data.location) {
        item.setProperties({
          location: new go.Point(item.data.location.x, item.data.location.y)
        })
      }

      return true
    })
  }, 1500)
}
</script>

<style lang="less" scoped>
.diagram {
  height: 100%;
  border: 2px solid red;
}
</style>
