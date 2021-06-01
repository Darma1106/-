<template>
  <div style="position: relative; height: 100%">
    <div ref="activeModelRef" class="active-model">123</div>
    <div ref="editRef" class="editor"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, Ref, ref } from 'vue'
import { unrefElement } from '@vueuse/core'
import * as go from 'gojs'
import type { NodeTemplate } from './type'

const make = go.GraphObject.make

export default defineComponent({
  name: '',
  components: {},
  props: {
    nodeMap: {
      type: Array as PropType<NodeTemplate[]>
    }
  },
  setup(props) {
    const activeModelRef: Ref<HTMLDivElement | null> = ref(null)
    const editRef: Ref<HTMLDivElement | null> = ref(null)
    let diagram: go.Diagram | null = null

    function init(templeteRef: HTMLDivElement): go.Diagram {
      const myDiagram = make(go.Diagram, templeteRef, {
        ChangedSelection: (a) => {
          console.log(a.diagram.selection.first()?.location)
        }
      })
      // 分配模板
      props.nodeMap?.forEach(({ name, template }) => {
        console.log({ name, template })

        myDiagram.nodeTemplateMap.add(name, template)
      })

      const linkSelectionAdornmentTemplate = make(
        go.Adornment,
        'Link',
        make(go.Shape, { isPanelMain: true, fill: null, stroke: 'deepskyblue', strokeWidth: 0 })
      )

      myDiagram.linkTemplate = make(
        go.Link, // the whole link panel
        { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
        { relinkableFrom: true, relinkableTo: true, reshapable: true },
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4
        },
        new go.Binding('points').makeTwoWay(),
        make(
          go.Shape, // the link path shape
          { isPanelMain: true, strokeWidth: 2 }
        ),
        make(
          go.Shape, // the arrowhead
          { toArrow: 'Standard', stroke: null }
        ),
        make(
          go.Panel,
          'Auto',
          new go.Binding('visible', 'isSelected').ofObject(),
          make(
            go.Shape,
            'RoundedRectangle', // the link shape
            { fill: '#F8F8F8', stroke: null }
          ),
          make(
            go.TextBlock,
            {
              textAlign: 'center',
              font: '10pt helvetica, arial, sans-serif',
              stroke: '#919191',
              margin: 2,
              minSize: new go.Size(10, NaN),
              editable: true
            },
            new go.Binding('text').makeTwoWay()
          )
        )
      )

      // 渲染操作面板
      make(
        go.Palette,
        unrefElement(editRef), // must name or refer to the DIV HTML element
        {
          maxSelectionCount: 1,
          nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
          // simplify the link template, just in this Palette
          linkTemplate: make(
            go.Link,
            {
              // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
              // to line up the Link in the same manner we have to pretend the Link has the same location spot
              locationSpot: go.Spot.Center,
              selectionAdornmentTemplate: make(
                go.Adornment,
                'Link',
                { locationSpot: go.Spot.Center },
                make(go.Shape, { isPanelMain: true, fill: null, stroke: 'deepskyblue', strokeWidth: 0 }),
                make(
                  go.Shape, // the arrowhead
                  { toArrow: 'Standard', stroke: null }
                )
              )
            },
            {
              routing: go.Link.AvoidsNodes,
              curve: go.Link.JumpOver,
              corner: 5,
              toShortLength: 4
            },
            new go.Binding('points'),
            make(
              go.Shape, // the link path shape
              { isPanelMain: true, strokeWidth: 2 }
            ),
            make(
              go.Shape, // the arrowhead
              { toArrow: 'Standard', stroke: null }
            )
          ),
          model: new go.GraphLinksModel(getTemplateModel())
        }
      )

      myDiagram.model = make(go.GraphLinksModel, {
        linkFromPortIdProperty: 'fromPort',
        linkToPortIdProperty: 'toPort',
        copiesArrays: true,
        copiesArrayObjects: true
      })

      return myDiagram
    }

    // 获取节点模板,加入nodeMap
    function getTemplateModel() {
      const model: { text: string; category: string }[] = []
      props.nodeMap?.forEach(({ name }) => {
        model.push({ text: 'text', category: name })
      })
      return model
    }

    function getDiagram(): go.Diagram {
      return diagram as go.Diagram
    }

    onMounted(() => {
      diagram = init(unrefElement(activeModelRef))
    })
    return { activeModelRef, editRef, getDiagram }
  }
})
</script>

<style lang="less" scope>
.active-model {
  height: 100%;
  border: 2px solid red;
}
.editor {
  width: 105px;
  height: 100%;
  margin-right: 2px;
  background-color: whitesmoke;
  border: solid 1px black;
  position: absolute;
  top: 0;
  z-index: 9999;
}
</style>
