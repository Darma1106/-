import * as go from 'gojs'

// swimlanes
export const MINLENGTH = 400 // this controls the minimum length of any swimlane
export const MINBREADTH = 20 // this controls the minimum breadth of any non-collapsed swimlane

export class PoolLayout extends go.GridLayout {
  public cellSize = new go.Size(1, 1)
  public wrappingColumn = 1
  public wrappingWidth = Infinity
  public isRealtime = false // don't continuously layout while dragging
  public alignment = go.GridLayout.Position
  // This sorts based on the location of each Group.
  // This is useful when Groups can be moved up and down in order to change their order.
  public comparer = function (a: go.Part, b: go.Part): number {
    const ay = a.location.y
    const by = b.location.y
    if (isNaN(ay) || isNaN(by)) return 0
    if (ay < by) return -1
    if (ay > by) return 1
    return 0
  }
  public doLayout(coll: go.Diagram | go.Group | go.Iterable<go.Part>): void {
    const diagram = this.diagram
    if (diagram === null) return
    diagram.startTransaction('PoolLayout')
    const pool = this.group
    if (pool !== null && pool.category === 'Pool') {
      // make sure all of the Group Shapes are big enough
      const minsize = computeMinPoolSize(pool)
      pool.memberParts.each(function (lane) {
        if (!(lane instanceof go.Group)) return
        if (lane.category !== 'Pool') {
          const shape = lane.resizeObject
          if (shape !== null) {
            // change the desiredSize to be big enough in both directions
            const sz = computeLaneSize(lane)
            shape.width = isNaN(shape.width) ? minsize.width : Math.max(shape.width, minsize.width)
            shape.height = !isNaN(shape.height) ? Math.max(shape.height, sz.height) : sz.height
            const cell = lane.resizeCellSize
            if (!isNaN(shape.width) && !isNaN(cell.width) && cell.width > 0)
              shape.width = Math.ceil(shape.width / cell.width) * cell.width
            if (!isNaN(shape.height) && !isNaN(cell.height) && cell.height > 0)
              shape.height = Math.ceil(shape.height / cell.height) * cell.height
          }
        }
      })
    }
    // now do all of the usual stuff, according to whatever properties have been set on this GridLayout
    super.doLayout.call(this, coll)
    diagram.commitTransaction('PoolLayout')
  }
}

// compute the minimum size of a Pool Group needed to hold all of the Lane Groups
function computeMinPoolSize(pool: go.Group) {
  // assert(pool instanceof go.Group && pool.category === "Pool");
  let len = MINLENGTH
  pool.memberParts.each(function (lane) {
    // pools ought to only contain lanes, not plain Nodes
    if (!(lane instanceof go.Group)) return
    const holder = lane.placeholder
    if (holder !== null) {
      const sz = holder.actualBounds
      len = Math.max(len, sz.width)
    }
  })
  return new go.Size(len, NaN)
}

// define a custom ResizingTool to limit how far one can shrink a lane Group
export class LaneResizingTool extends go.ResizingTool {
  public myDiagram?: go.Diagram
  constructor(diagram: go.Diagram) {
    super()

    this.myDiagram = diagram
  }
  public isLengthening(): boolean {
    return this.handle !== null && this.handle.alignment === go.Spot.Right
  }

  public computeMinSize(): go.Size {
    if (this.adornedObject === null) return new go.Size(MINLENGTH, MINBREADTH)
    const lane = this.adornedObject.part
    if (!(lane instanceof go.Group)) return go.ResizingTool.prototype.computeMinSize.call(this)
    // assert(lane instanceof go.Group && lane.category !== "Pool");
    const msz = computeMinLaneSize(lane) // get the absolute minimum size
    if (lane.containingGroup !== null && this.isLengthening()) {
      // compute the minimum length of all lanes
      const sz = computeMinPoolSize(lane.containingGroup)
      msz.width = Math.max(msz.width, sz.width)
    } else {
      // find the minimum size of this single lane
      const sz = computeLaneSize(lane)
      msz.width = Math.max(msz.width, sz.width)
      msz.height = Math.max(msz.height, sz.height)
    }
    return msz
  }

  public resize(newr: go.Rect): void {
    if (this.adornedObject === null) return
    const lane = this.adornedObject.part
    if (!(lane instanceof go.Group)) return go.ResizingTool.prototype.resize.call(this, newr)
    if (lane instanceof go.Group && lane.containingGroup !== null && this.isLengthening()) {
      // changing the length of all of the lanes
      lane.containingGroup.memberParts.each((l) => {
        if (!(l instanceof go.Group)) return
        const shape = l.resizeObject
        if (shape !== null) {
          // set its desiredSize length, but leave each breadth alone
          shape.width = newr.width
        }
      })
    } else {
      // changing the breadth of a single lane
      super.resize.call(this, newr)
    }
    this.relayoutDiagram() // now that the lane has changed size, layout the pool again
  }

  public relayoutDiagram(): void {
    this.myDiagram?.layout.invalidateLayout()
    this.myDiagram?.findTopLevelGroups().each(function (g) {
      if (g.category === 'Pool' && g.layout !== null) g.layout.invalidateLayout()
    })
    this.myDiagram?.layoutDiagram()
  }
}
// end LaneResizingTool class

// compute the minimum size for a particular Lane Group
function computeLaneSize(lane: go.Group) {
  // assert(lane instanceof go.Group && lane.category !== "Pool");
  const sz = computeMinLaneSize(lane)
  if (lane.isSubGraphExpanded) {
    const holder = lane.placeholder
    if (holder !== null) {
      const hsz = holder.actualBounds
      sz.height = Math.max(sz.height, hsz.height)
    }
  }
  // minimum breadth needs to be big enough to hold the header
  const hdr = lane.findObject('HEADER')
  if (hdr !== null) sz.height = Math.max(sz.height, hdr.actualBounds.height)
  return sz
}

// determine the minimum size of a Lane Group, even if collapsed
function computeMinLaneSize(lane: go.Group) {
  if (!lane.isSubGraphExpanded) return new go.Size(MINLENGTH, 1)
  return new go.Size(MINLENGTH, MINBREADTH)
}
