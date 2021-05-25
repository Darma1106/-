<template>
  <div ref="diagramRef" class="diagram">123</div>
</template>

<script setup lang="ts">
import * as go from 'gojs'
import { onMounted, ref } from 'vue'
import { init } from './ts/umlDiagram'

import type { Ref } from 'vue'
import type { NodeData, LinkData } from './type'

// import type { PropertyType } from './type'

const diagramRef: Ref<HTMLDivElement | null> = ref(null)

onMounted(() => {
  const myDiagram = init(diagramRef.value as HTMLDivElement)
  setData(myDiagram)
})

const make = go.GraphObject.make

function setData(myDiagram: go.Diagram): void {
  const nodedata: NodeData[] = [
    {
      key: 1,
      name: 'BankAccount',
      properties: [
        { name: 'owner', type: 'String', visibility: 'public' },
        { name: 'balance', type: 'Currency', visibility: 'public', defaultValue: '0' }
      ],
      methods: [
        { name: 'deposit', parameters: [{ name: 'amount', type: 'Currency' }], visibility: 'public' },
        { name: 'withdraw', parameters: [{ name: 'amount', type: 'Currency' }], visibility: 'public' }
      ]
    },
    {
      key: 11,
      name: 'Person',
      properties: [
        { name: 'name', type: 'String', visibility: 'public' },
        { name: 'birth', type: 'Date', visibility: 'protected' }
      ],
      methods: [{ name: 'getCurrentAge', type: 'int', visibility: 'public' }]
    },
    {
      key: 12,
      name: 'Student',
      properties: [{ name: 'classes', type: 'List<Course>', visibility: 'public' }],
      methods: [
        { name: 'attend', parameters: [{ name: 'class', type: 'Course' }], visibility: 'private' },
        { name: 'sleep', visibility: 'private' }
      ]
    },
    {
      key: 13,
      name: 'Professor',
      properties: [{ name: 'classes', type: 'List<Course>', visibility: 'public' }],
      methods: [{ name: 'teach', parameters: [{ name: 'class', type: 'Course' }], visibility: 'private' }]
    },
    {
      key: 14,
      name: 'Course',
      properties: [
        { name: 'name', type: 'String', visibility: 'public' },
        { name: 'description', type: 'String', visibility: 'public' },
        { name: 'professor', type: 'Professor', visibility: 'public' },
        { name: 'location', type: 'String', visibility: 'public' },
        { name: 'times', type: 'List<Time>', visibility: 'public' },
        { name: 'prerequisites', type: 'List<Course>', visibility: 'public' },
        { name: 'students', type: 'List<Student>', visibility: 'public' }
      ],
      methods: [{ name: 'teach', parameters: [{ name: 'class', type: 'Course' }], visibility: 'private' }]
    }
  ]
  const linkdata: LinkData[] = [
    { from: 12, to: 11, relationship: 'generalization' },
    { from: 13, to: 11, relationship: 'generalization' },
    { from: 14, to: 13, relationship: 'aggregation' }
    // { from: 11, to: 1 }
  ]
  myDiagram.model = make(go.GraphLinksModel, {
    linkFromPortIdProperty: 'fromPort',
    linkToPortIdProperty: 'toPort',
    copiesArrays: true,
    copiesArrayObjects: true,
    nodeDataArray: nodedata,
    linkDataArray: linkdata
  })
}
</script>

<style lang="less" scoped>
.diagram {
  height: 100%;
  border: 2px solid red;
}
</style>
