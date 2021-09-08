import * as go from 'gojs'

export function assignGroupLayer(grp: go.Part): void {
  if (!(grp instanceof go.Group)) return
  const lay = grp.isSelected ? 'Foreground' : ''
  grp.layerName = lay
  grp.findSubGraphParts().each(function (m: go.Part) {
    m.layerName = lay
  })
}
