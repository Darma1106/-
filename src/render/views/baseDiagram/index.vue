<template>
  <div ref="baseDiagramRef" class="base-diagram"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import * as go from 'gojs'
import { ArrowTypeValue } from './type/enum'
import type { PropertyType, RelationshipType } from '../gojs/type'
import type { ArrowType } from './type'

export default defineComponent({
  name: '',
  components: {},
  props: {},
  setup() {
    const make = go.GraphObject.make

    // 属性标识
    function convertVisibility(v: PropertyType) {
      switch (v) {
        case 'public':
          return '+'
        case 'private':
          return '-'
        case 'protected':
          return '#'
        case 'package':
          return '~'
        default:
          return v
      }
    }

    // 是否树形分布
    function convertIsTreeLink(relationship: RelationshipType) {
      // return relationship !== 'Generalization'
      return false
    }

    // 是否使用虚线
    function convertIsDashed(relationship: RelationshipType) {
      switch (relationship) {
        case 'Realization':
          return [6, 3]
        case 'Dependency':
          return [6, 3]
        default:
          return []
      }
    }

    // 箭尾样式形状
    function getArrowType(type: ArrowType = 'Standard'): ArrowType {
      return ArrowTypeValue[type]
    }

    // 箭头样式颜色
    function getArrowColor(color = 'black'): string {
      return color
    }

    // 连线事件
    function LinkDrawn(event: go.DiagramEvent) {
      const {
        diagram: { model },
        subject: { data }
      } = event
      model.removeLinkData(data)
      data.relationship = 'generalization'
      model.addLinkData(data)
      console.log(data, 'data')
    }

    // 给节点添加接口
    function makePort(name: string, align: go.Spot, spot: go.Spot, output: boolean, input: boolean) {
      const horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom)
      return make(go.Shape, {
        fill: 'transparent',
        strokeWidth: 0,
        width: horizontal ? NaN : 8,
        height: !horizontal ? NaN : 8,
        alignment: align,
        stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
        portId: name,
        fromSpot: spot,
        fromLinkable: output,
        toSpot: spot,
        toLinkable: input,
        cursor: 'pointer',
        mouseEnter: function (e: go.InputEvent, port: go.GraphObject) {
          if (!e.diagram.isReadOnly && port instanceof go.Shape) port.fill = 'rgba(255,0,255,0.5)'
        },
        mouseLeave: function (e: go.InputEvent, port: go.GraphObject) {
          if (port instanceof go.Shape) port.fill = 'transparent'
        }
      })
    }

    function init(templeteRef: HTMLDivElement): go.Diagram {
      const myDiagram = make(go.Diagram, templeteRef, {
        'undoManager.isEnabled': true,
        ChangedSelection: (a) => {
          console.log(a.diagram.selection.first()?.location)
        },
        allowLink: true,
        LinkDrawn
      })

      const diagramLayout = make(go.TreeLayout, {
        angle: 90,
        isOngoing: false,
        path: go.TreeLayout.PathSource,
        setsPortSpot: false,
        setsChildPortSpot: false,
        arrangement: go.TreeLayout.ArrangementHorizontal
      })

      const propertyTemplate = make(
        go.Panel,
        'Horizontal',
        // 属性性质(public,private,protected,package) 对应(+,-,#,~)
        make(
          go.TextBlock,
          { isMultiline: false, editable: false, width: 12 },
          new go.Binding('text', 'visibility', convertVisibility)
        ),
        // 给静态属性加下划线
        make(
          go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding('text', 'name').makeTwoWay(),
          new go.Binding('isUnderline', 'scope', function (s) {
            return s === 'static'
          })
        ),
        // 属性类型
        make(
          go.TextBlock,
          '',
          new go.Binding('text', 'type', function (t) {
            return t ? ': ' : ''
          })
        ),
        make(go.TextBlock, { isMultiline: false, editable: true }, new go.Binding('text', 'type').makeTwoWay()),
        // 属性默认值
        make(
          go.TextBlock,
          { isMultiline: false, editable: false },
          new go.Binding('text', 'defaultValue', function (s) {
            return s ? ' = ' + s : ''
          })
        )
      )

      const methodTemplate = make(
        go.Panel,
        'Horizontal',
        // method visibility/access
        make(
          go.TextBlock,
          { isMultiline: false, editable: false, width: 12 },
          new go.Binding('text', 'visibility', convertVisibility)
        ),
        // method name, underlined if scope=="class" to indicate static method
        make(
          go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding('text', 'name').makeTwoWay(),
          new go.Binding('isUnderline', 'scope', function (s) {
            return s[0] === 'c'
          })
        ),
        // method parameters
        make(
          go.TextBlock,
          '()',
          // this does not permit adding/editing/removing of parameters via inplace edits
          new go.Binding('text', 'parameters', function (parr) {
            let s = '('
            for (let i = 0; i < parr.length; i++) {
              const param = parr[i]
              if (i > 0) s += ', '
              s += param.name + ': ' + param.type
            }
            return s + ')'
          })
        ),
        // method return type, if any
        make(
          go.TextBlock,
          '',
          new go.Binding('text', 'type', function (t?: string) {
            return t ? ': ' : ''
          })
        ),
        make(go.TextBlock, { isMultiline: false, editable: true }, new go.Binding('text', 'type').makeTwoWay())
      )

      myDiagram.layout = diagramLayout

      myDiagram.nodeTemplate = make(
        go.Node,
        'Auto',
        {
          // location: new go.Point(983.398234059116, 50.5)
          locationSpot: go.Spot.Center,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides
        },
        make(go.Shape, { fill: 'lightyellow' }),
        make(
          go.Panel,
          'Table',
          { defaultRowSeparatorStroke: 'black' },
          // header
          make(
            go.Panel,
            'Vertical',
            { row: 0, alignment: go.Spot.Center },
            make(
              go.TextBlock,
              {
                alignment: go.Spot.Center,
                font: 'bold 12pt sans-serif',
                isMultiline: false,
                editable: true,
                text: '123123',
                visible: false
              },
              new go.Binding('text', 'type', (type) => `<<${type}>>`),
              new go.Binding('visible', 'type')
            ),
            make(
              go.TextBlock,
              {
                row: 0,
                columnSpan: 2,
                margin: 3,
                alignment: go.Spot.Center,
                font: 'bold 12pt sans-serif',
                isMultiline: false,
                editable: true
              },
              new go.Binding('text', 'name').makeTwoWay()
            )
          ),

          // properties
          make(
            go.Panel,
            'Horizontal',
            { row: 1, alignment: go.Spot.Center, visible: false },
            new go.Binding('visible', 'properties', (properties) => properties.length > 0),
            make(
              go.TextBlock,
              'Properties',
              // { row: 1, font: 'italic 10pt sans-serif' },
              new go.Binding('visible', 'visible', function (v) {
                return !v
              }).ofObject('PROPERTIES')
            ),
            make(go.Panel, 'Vertical', { name: 'PROPERTIES' }, new go.Binding('itemArray', 'properties'), {
              // row: 1,
              margin: 3,
              stretch: go.GraphObject.Fill,
              defaultAlignment: go.Spot.Left,
              background: 'lightyellow',
              itemTemplate: propertyTemplate
            }),
            make(
              'PanelExpanderButton',
              'PROPERTIES',
              // { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
              new go.Binding('visible', 'properties', function (arr) {
                return arr.length > 0
              })
            )
          ),
          // properties

          // methods
          make(
            go.Panel,
            'Horizontal',
            { row: 2, alignment: go.Spot.Center, visible: false },
            new go.Binding('visible', 'methods', (methods) => methods.length > 0),
            make(
              go.TextBlock,
              'Methods',
              // { row: 2, font: 'italic 10pt sans-serif' },
              new go.Binding('visible', 'visible', function (v) {
                return !v
              }).ofObject('METHODS')
            ),
            make(go.Panel, 'Vertical', { name: 'METHODS' }, new go.Binding('itemArray', 'methods'), {
              // row: 2,
              margin: 3,
              stretch: go.GraphObject.Fill,
              defaultAlignment: go.Spot.Left,
              background: 'lightyellow',
              itemTemplate: methodTemplate
            }),
            make(
              'PanelExpanderButton',
              'METHODS',
              // { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
              new go.Binding('visible', 'methods', function (arr) {
                return arr.length > 0
              })
            )
          )
        ),
        // four named ports, one on each side:
        makePort('T', go.Spot.Top, go.Spot.TopSide, true, true),
        makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
        makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
        makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, true)
      )

      myDiagram.linkTemplate = make(
        go.Link,
        { routing: go.Link.Normal, isLayoutPositioned: false },
        new go.Binding('isLayoutPositioned', 'relationship', convertIsTreeLink),
        make(go.Shape, {}, new go.Binding('strokeDashArray', 'relationship', convertIsDashed)),
        make(
          go.Shape,
          { scale: 1.3, fill: 'white', fromArrow: '' },
          new go.Binding('fromArrow', 'relationship', getArrowType),
          new go.Binding('fill', 'relationship', getArrowColor)
        ),
        make(
          go.Shape,
          { scale: 1.3, fill: 'white', toArrow: '' },
          new go.Binding('toArrow', 'relationship', getArrowType),
          new go.Binding('fill', 'relationship', getArrowColor)
        )
      )

      return myDiagram
    }
  }
})
</script>

<style lang="less" scope></style>
