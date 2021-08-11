<template>
  <div class="sequence-model">
    <!-- <div ref="editRef" class="editor"></div> -->
    <Editor :editor-data="editorTemplate" @active-item-change="editorItemChange" />
    <div ref="activeModelRef" class="active-model">123</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, Ref, ref } from 'vue'
import { unrefElement } from '@vueuse/core'
import * as go from 'gojs'

import Editor from '@/component/baseDiagram/editor.vue'

import type { EditorTemplate, EditorType } from '@/component/baseDiagram/type'
const make = go.GraphObject.make

export default defineComponent({
  name: '',
  components: { Editor },
  setup() {
    const activeModelRef: Ref<HTMLDivElement | null> = ref(null)
    const editRef: Ref<HTMLDivElement | null> = ref(null)
    let diagram: go.Diagram | null = null
    function init(templeteRef: HTMLDivElement): go.Diagram {
      // some parameters
      const LinePrefix = 20 // 文档中所有消息和激活的垂直起点
      const LineSuffix = 30 // 超过上次消息时间的垂直长度
      const MessageSpacing = 20 // 不同台阶处消息之间的垂直距离
      const ActivityWidth = 10 // 每个垂直活动条的宽度
      const ActivityStart = 5 // 开始消息时间前的高度
      const ActivityEnd = 5 // 超出结束消息时间的高度
      function computeLifelineHeight(duration: number) {
        return LinePrefix + duration * MessageSpacing + LineSuffix
      }
      function computeActivityLocation(act: go.ObjectData) {
        let groupdata = myDiagram.model.findNodeDataForKey(act.group)
        if (groupdata === null) return new go.Point()
        // get location of Lifeline's starting point
        let grouploc = go.Point.parse(groupdata.loc)
        return new go.Point(grouploc.x, convertTimeToY(act.start) - ActivityStart)
      }
      function backComputeActivityLocation(loc: go.ObjectData, act: go.Point) {
        myDiagram.model.setDataProperty(act, 'start', convertYToTime(loc.y + ActivityStart))
      }
      function computeActivityHeight(duration: number) {
        return ActivityStart + duration * MessageSpacing + ActivityEnd
      }
      function backComputeActivityHeight(height: number) {
        return (height - ActivityStart - ActivityEnd) / MessageSpacing
      }
      // time is just an abstract small non-negative integer
      // here we map between an abstract time and a vertical position
      function convertTimeToY(t: number) {
        return t * MessageSpacing + LinePrefix
      }
      function convertYToTime(y: number) {
        return (y - LinePrefix) / MessageSpacing
      }
      // a custom routed Link
      function MessageLink(this: go.ObjectData) {
        go.Link.call(this)
        this.time = 0 // use this "time" value when this is the temporaryLink
      }
      go.Diagram.inherit(MessageLink, go.Link)
      MessageLink.prototype.getLinkPoint = function (
        node: go.Node,
        port: go.GraphObject,
        spot: go.Spot,
        from: boolean,
        ortho: boolean,
        othernode: go.Node,
        otherport: go.GraphObject
      ) {
        let p = port.getDocumentPoint(go.Spot.Center)
        let r = port.getDocumentBounds()
        let op = otherport.getDocumentPoint(go.Spot.Center)
        let data = this.data
        let time = data !== null ? data.time : this.time // 如果未绑定，则假定它有自己的“时间”属性
        let aw = this.findActivityWidth(node, time)
        let x = op.x > p.x ? p.x + aw / 2 : p.x - aw / 2
        let y = convertTimeToY(time)

        return new go.Point(x, y)
      }
      MessageLink.prototype.findActivityWidth = function (node: go.Node, time: number): number {
        let aw = ActivityWidth
        if (node instanceof go.Group) {
          // 查看此时是否有活动节点——如果没有，请将链接直接连接到组的生命线
          if (
            !node.memberParts.any(function (mem) {
              let act = mem.data
              return act !== null && act.start <= time && time <= act.start + act.duration
            })
          ) {
            aw = 0
          }
        }
        return aw
      }
      MessageLink.prototype.getLinkDirection = function (
        node: go.Node,
        port: go.GraphObject,
        spot: go.Spot,
        from: boolean,
        ortho: boolean,
        othernode: go.Node,
        otherport: go.GraphObject
      ): number {
        let p = port.getDocumentPoint(go.Spot.Center)
        let op = otherport.getDocumentPoint(go.Spot.Center)
        let right = op.x > p.x
        return right ? 0 : 180
      }
      MessageLink.prototype.computePoints = function (): boolean {
        if (this.fromNode === this.toNode) {
          // 也可以将自反链接处理为简单的正交循环
          let data = this.data
          let time = data !== null ? data.time : this.time // 如果未绑定，则假定它有自己的“时间”属性
          let p = this.fromNode.port.getDocumentPoint(go.Spot.Center)
          let aw = this.findActivityWidth(this.fromNode, time)
          let x = p.x + aw / 2
          let y = convertTimeToY(time)
          this.clearPoints()
          this.addPoint(new go.Point(x, y))
          this.addPoint(new go.Point(x + 50, y))
          this.addPoint(new go.Point(x + 50, y + 5))
          this.addPoint(new go.Point(x, y + 5))
          return true
        } else {
          return go.Link.prototype.computePoints.call(this)
        }
      }
      // end MessageLink
      // A custom LinkingTool that fixes the "time" (i.e. the Y coordinate)
      // for both the temporaryLink and the actual newly created Link
      function MessagingTool(this: go.LinkingTool) {
        go.LinkingTool.call(this)
        this.temporaryLink = make(
          MessageLink as any,
          make(go.Shape, 'Rectangle', { stroke: 'magenta', strokeWidth: 2 }),
          make(go.Shape, { toArrow: 'OpenTriangle', stroke: 'magenta' })
        )
      }
      go.Diagram.inherit(MessagingTool, go.LinkingTool)
      MessagingTool.prototype.doActivate = function () {
        go.LinkingTool.prototype.doActivate.call(this)
        let time = convertYToTime(this.diagram.firstInput.documentPoint.y)
        this.temporaryLink.time = Math.ceil(time) // round up to an integer value
      }
      MessagingTool.prototype.insertLink = function (
        fromnode: go.Node,
        fromport: go.GraphObject,
        tonode: go.Node,
        toport: go.GraphObject
      ) {
        const newlink = go.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport)
        console.log({ fromnode, fromport, tonode, toport })

        if (newlink !== null) {
          const model = this.diagram.model
          // specify the time of the message
          const start = this.temporaryLink.time
          const duration = 1
          newlink.data.time = start
          model.setDataProperty(newlink.data, 'text', 'text')
          // and create a new Activity node data in the "to" group data
          const newact = {
            group: newlink.data.from,
            start: start - duration,
            duration: duration
          }
          model.addNodeData(newact)
          // now make sure all Lifelines are long enough
          ensureLifelineHeights(this)
        }
        return newlink
      }
      // end MessagingTool
      // A custom DraggingTool that supports dragging any number of MessageLinks up and down --
      // changing their data.time value.
      function MessageDraggingTool(this: go.DraggingTool) {
        go.DraggingTool.call(this)
      }
      go.Diagram.inherit(MessageDraggingTool, go.DraggingTool)
      // override the standard behavior to include all selected Links,
      // even if not connected with any selected Nodes
      MessageDraggingTool.prototype.computeEffectiveCollection = function (
        parts: go.Iterator<go.Part>,
        options: go.DraggingOptions
      ) {
        let result = go.DraggingTool.prototype.computeEffectiveCollection.call(this, parts, options)
        // add a dummy Node so that the user can select only Links and move them all
        result.add(new go.Node(), new go.DraggingInfo(new go.Point()))
        // normally this method removes any links not connected to selected nodes;
        // we have to add them back so that they are included in the "parts" argument to moveParts
        parts.each(function (part) {
          if (part instanceof go.Link) {
            result.add(part, new go.DraggingInfo(part.getPoint(0).copy()))
          }
        })
        return result
      }

      // override to allow dragging when the selection only includes Links
      MessageDraggingTool.prototype.mayMove = function () {
        return !this.diagram.isReadOnly && this.diagram.allowMove
      }
      // override to move Links (which are all assumed to be MessageLinks) by
      // updating their Link.data.time property so that their link routes will
      // have the correct vertical position
      MessageDraggingTool.prototype.moveParts = function (
        parts: go.Map<go.Part, go.DraggingInfo>,
        offset: go.Point,
        check: boolean
      ) {
        go.DraggingTool.prototype.moveParts.call(this, parts, offset, check)
        let it = parts.iterator
        while (it.next()) {
          if (it.key instanceof go.Link) {
            let link = it.key
            let startY = it.value.point.y // DraggingInfo.point.y
            let y = startY + offset.y // determine new Y coordinate value for this link
            let cellY = this.gridSnapCellSize.height
            y = Math.round(y / cellY) * cellY // snap to multiple of gridSnapCellSize.height
            let t = Math.max(0, convertYToTime(y))
            link.diagram?.model.set(link.data, 'time', t)
            link.invalidateRoute()
          }
        }
      }

      const myDiagram = make(
        go.Diagram,
        templeteRef, // must be the ID or reference to an HTML DIV
        {
          // 'animationManager.initialAnimationStyle': go.AnimationManager.None,
          'animationManager.isEnabled': false,
          allowCopy: false,
          linkingTool: make(MessagingTool as any), // defined below
          'resizingTool.isGridSnapEnabled': true,
          draggingTool: make(MessageDraggingTool as any), // defined below
          'draggingTool.gridSnapCellSize': new go.Size(1, MessageSpacing / 4),
          'draggingTool.isGridSnapEnabled': true,
          // // automatically extend Lifelines as Activities are moved or resized
          SelectionMoved: ensureLifelineHeights,
          PartResized: ensureLifelineHeights,
          click: diagramClick,
          'undoManager.isEnabled': true
        }
      )
      // define the Lifeline Node template.
      myDiagram.groupTemplate = make(
        go.Group,
        'Vertical',
        {
          locationSpot: go.Spot.Bottom,
          locationObjectName: 'HEADER',
          minLocation: new go.Point(0, 0),
          maxLocation: new go.Point(9999, 0),
          selectionObjectName: 'HEADER'
        },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        make(
          go.Panel,
          'Auto',
          { name: 'HEADER' },
          make(go.Shape, 'Rectangle', {
            fill: make(go.Brush, 'Linear', { 0: '#bbdefb', 1: go.Brush.darkenBy('#bbdefb', 0.1) }),
            stroke: null
          }),
          make(
            go.TextBlock,
            {
              margin: 15,
              font: '400 12pt Source Sans Pro, sans-serif',
              editable: true
            },
            new go.Binding('text', 'text')
          )
        ),
        make(
          go.Shape,
          {
            figure: 'LineV',
            fill: null,
            stroke: 'gray',
            strokeDashArray: [3, 3],
            width: 1,
            alignment: go.Spot.Center,
            portId: '',
            fromLinkable: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableDuplicates: true,
            cursor: 'pointer'
          },
          new go.Binding('height', 'duration', computeLifelineHeight)
        )
      )
      // define the Activity Node template
      myDiagram.nodeTemplate = make(
        go.Node,
        {
          locationSpot: go.Spot.Top,
          locationObjectName: 'SHAPE',
          minLocation: new go.Point(NaN, LinePrefix - ActivityStart),
          maxLocation: new go.Point(NaN, 19999),
          selectionObjectName: 'SHAPE',
          resizable: true,
          resizeObjectName: 'SHAPE',
          resizeAdornmentTemplate: make(
            go.Adornment,
            'Spot',
            make(go.Placeholder),
            make(
              go.Shape, // only a bottom resize handle
              {
                alignment: go.Spot.Bottom,
                cursor: 'col-resize',
                desiredSize: new go.Size(6, 6),
                fill: 'yellow'
              }
            )
          )
        },
        new go.Binding('location', '', computeActivityLocation).makeTwoWay(backComputeActivityLocation),
        make(
          go.Shape,
          'Rectangle',
          {
            name: 'SHAPE',
            fill: 'white',
            stroke: 'black',
            width: ActivityWidth,
            // allow Activities to be resized down to 1/4 of a time unit
            minSize: new go.Size(ActivityWidth, computeActivityHeight(0.25))
          },
          new go.Binding('height', 'duration', computeActivityHeight).makeTwoWay(backComputeActivityHeight)
        )
      )
      // define the Message Link template.
      myDiagram.linkTemplate = make(
        MessageLink as any, // defined below
        { selectionAdorned: true, curviness: 0 },
        make(go.Shape, 'Rectangle', { stroke: 'black' }),
        make(go.Shape, { toArrow: 'OpenTriangle', stroke: 'red' }),
        make(
          go.TextBlock,
          {
            font: '400 12pt Source Sans Pro, sans-serif',
            segmentIndex: 0,
            segmentOffset: new go.Point(NaN, NaN),
            isMultiline: false,
            editable: true
          },
          new go.Binding('text', 'text').makeTwoWay()
        )
      )
      function ensureLifelineHeights(e: go.DiagramEvent) {
        // iterate over all Activities (ignore Groups)
        console.log(123)

        let arr = e.diagram.model.nodeDataArray
        let max = -1
        for (let i = 0; i < arr.length; i++) {
          let act = arr[i]
          if (act.isGroup) continue
          max = Math.max(max, act.start + act.duration)
        }
        if (max > 0) {
          // now iterate over only Groups
          for (let i = 0; i < arr.length; i++) {
            let gr = arr[i]
            if (!gr.isGroup) continue
            if (max > gr.duration) {
              // this only extends, never shrinks
              e.diagram.model.setDataProperty(gr, 'duration', max)
            }
          }
        }
      }
      console.log(myDiagram.nodeTemplateMap, 'map')

      return myDiagram
    }

    onMounted(() => {
      nextTick(() => {
        diagram = init(unrefElement(activeModelRef))
        const data = {
          class: 'go.GraphLinksModel',
          nodeDataArray: [
            // { key: 'Fred', text: 'Fred: Patron', isGroup: true, loc: '0 0', duration: 9 },
            // { key: 'Bob', text: 'Bob: Waiter', isGroup: true, loc: '100 0', duration: 9 },
            // { key: 'Hank', text: 'Hank: Cook', isGroup: true, loc: '200 0', duration: 9 },
            // { key: 'Renee', text: 'Renee: Cashier', isGroup: true, loc: '300 0', duration: 9 },
            { key: '1', text: '作战时序图节点1', isGroup: true, loc: '300 0', duration: 9 },
            { key: '2', text: '作战时序图节点2', isGroup: true, loc: '550 0', duration: 9 },
            { key: '3', text: '作战时序图节点3', isGroup: true, loc: '800 0', duration: 9 },
            { group: '2', start: 1, duration: 2 },
            { group: '3', start: 3, duration: 3 }

            // { group: 'Bob', start: 1, duration: 2 },
            // { group: 'Hank', start: 2, duration: 3 },
            // { group: 'Fred', start: 3, duration: 1 },
            // { group: 'Bob', start: 5, duration: 1 },
            // { group: 'Fred', start: 6, duration: 2 },
            // { group: 'Renee', start: 8, duration: 1 }
          ],
          linkDataArray: [
            { from: '1', to: '2', text: '作战时序图节点1_作战时序图节点2', time: 1 },
            { from: '2', to: '3', text: '作战时序图节点2_作战时序图节点3', time: 3 },
            { from: '3', to: '2', text: '作战时序图节点3_作战时序图节点2', time: 6 }

            //  { from: 'Fred', to: 'Bob', text: 'order', time: 1 },
            // { from: 'Bob', to: 'Hank', text: 'order food', time: 2 },
            // { from: 'Bob', to: 'Fred', text: 'serve drinks', time: 3 },
            // { from: 'Hank', to: 'Bob', text: 'finish cooking', time: 5 },
            // { from: 'Bob', to: 'Fred', text: 'serve food', time: 6 },
            // { from: 'Fred', to: 'Renee', text: 'pay', time: 8 }
          ]
        }
        diagram.model = go.Model.fromJson(data)
      })
    })

    let activeEditorType: EditorType | null = null
    const editorTemplate: EditorTemplate[] = [
      {
        id: '1',
        name: '节点',
        category: 'tuxing',
        items: [
          {
            id: '456',
            type: 'tuxing',
            name: '活动节点',
            data: { key: '3', text: '作战时序图节点3', isGroup: true, loc: '800 0', duration: 9 }
          },
          {
            id: '345',
            type: 'line',
            name: '连线',
            data: {}
          }
        ]
      }
    ]

    function getDiagram(): go.Diagram | null {
      return diagram
    }

    const diagramClick = (e: go.InputEvent) => {
      const { documentPoint } = e
      if (activeEditorType && activeEditorType.type != 'line') {
        const node = JSON.parse(JSON.stringify(activeEditorType.data))
        // node.key = uuidv4()
        node.loc = `${documentPoint.x} 0`
        addNode(node)
      }
    }

    const addNode = (node: go.ObjectData) => {
      if (diagram) {
        diagram.model.addNodeData(node)
      }
    }

    const setLinkedState = (state: boolean) => {
      const diagram = getDiagram()
      if (diagram) {
        diagram.allowLink = state
        diagram.allowRelink = state
      }
    }

    // 编辑栏选中变化
    const editorItemChange = (item: EditorType) => {
      setLinkedState(item && item.type == 'line')
      activeEditorType = item
    }

    return {
      activeModelRef,
      editRef,
      editorTemplate,
      editorItemChange
    }
  }
})
</script>

<style lang="less" scoped>
.sequence-model {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: row;
  .active-model {
    flex: 1;
  }
}
</style>
