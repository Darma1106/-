import type { Diagram } from 'gojs'
export interface BaseModalInstance {
  renderProperty: (diagram: Diagram) => void
}
