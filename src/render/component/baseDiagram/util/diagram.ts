import { onMounted, nextTick } from 'vue'
import { GuidedDraggingTool } from './diagramTool/GuidedDraggingTool'

import type { Ref } from 'vue'
import type { BaseDiagramInstance } from '../type'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function supportLineMaker() {
  return {
    draggingTool: new GuidedDraggingTool(),
    'draggingTool.horizontalGuidelineColor': 'blue',
    'draggingTool.verticalGuidelineColor': 'blue',
    'draggingTool.centerGuidelineColor': 'green',
    'draggingTool.guidelineWidth': 1,
    'undoManager.isEnabled': true
  }
}

export function renderDiagramFromLocal(
  tabId: string | undefined,
  baseDiagramRef: Ref<BaseDiagramInstance | null>
): void {
  onMounted(() => {
    nextTick(() => {
      if (tabId && baseDiagramRef.value) {
        const localJson = localStorage.getItem(tabId)
        if (localJson) {
          baseDiagramRef.value.renderJson(localJson)
        }
      }
    })
  })
}
