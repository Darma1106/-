import { onMounted, nextTick } from 'vue'

import type { Ref } from 'vue'
import type { BaseDiagramInstance } from '../type'
import { GuidedDraggingTool } from './diagramTool/GuidedDraggingTool'

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
  baseDiagramRef: Ref<BaseDiagramInstance | null>,
  defaultJson = ''
): void {
  onMounted(() => {
    nextTick(() => {
      if (tabId && baseDiagramRef.value) {
        const localJson = localStorage.getItem(tabId)
        if (localJson) {
          baseDiagramRef.value.renderJson(localJson)
          console.log('local')
        } else {
          console.log('def')
          baseDiagramRef.value.renderJson(defaultJson)
        }
      }
    })
  })
}
