//高亮
import * as go from 'gojs'
const make = go.GraphObject.make
export function linkSelectionHeighlight(color = 'deepskyblue'): go.Adornment {
  return make(go.Adornment, 'Link', make(go.Shape, { isPanelMain: true, fill: null, stroke: color, strokeWidth: 0 }))
}
