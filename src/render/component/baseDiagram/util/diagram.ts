import { GuidedDraggingTool } from '@/common/GuidedDraggingTool'

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
