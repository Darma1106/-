import * as go from 'gojs'
const make = go.GraphObject.make
// 给节点添加接口
export function makePort(
  name: string,
  align: go.Spot,
  spot: go.Spot,
  output: boolean,
  input: boolean,
  visible = true
): go.Shape {
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
    visible: visible,
    mouseEnter: function (e: go.InputEvent, port: go.GraphObject) {
      if (!e.diagram.isReadOnly && port instanceof go.Shape) port.fill = 'rgba(255,0,255,0.5)'
    },
    mouseLeave: function (e: go.InputEvent, port: go.GraphObject) {
      if (port instanceof go.Shape) port.fill = 'transparent'
    }
  })
}
