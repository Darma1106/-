import { readonly } from 'vue'
import useTabs from './useTabs'

type Callback = () => void

const { activeTab } = useTabs()

interface CallbackMap {
  [key: string]: Callback
}

enum EventTypeValue {
  save = 'save',
  refresh = 'refresh'
}

export type EventType = keyof typeof EventTypeValue

type EventMap = {
  [key in EventTypeValue]?: CallbackMap
}

class EventController {
  private eventMap: EventMap = {}

  getEventMap = () => {
    return readonly(this.eventMap)
  }

  onSave = (saveFunc: Callback, componentId: string) => {
    if (!this.eventMap.save) {
      this.eventMap.save = {}
    }
    this.eventMap.save[componentId] = saveFunc
  }

  // 事件触发器
  eventSwitch = (event: EventType, componentId = activeTab.value) => {
    if (componentId) {
      const eventCallback = this.eventMap[event]?.[componentId]
      if (eventCallback) eventCallback()
    }
  }
}

const eventController = new EventController()

export default function useEvent(): EventController {
  return eventController
}
