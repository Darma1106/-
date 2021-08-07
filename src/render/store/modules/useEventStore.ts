import { readonly } from 'vue'
import useTabStore from './useTabStore'

type Callback = () => void

const { activeTab } = useTabStore()

// 以便于卸载事件

interface CallbackMap {
  [key: string]: EventMap
}

/**
 *  @template {
 * tabId:{
 * event
 * }
 *
 * }
 */

enum EventTypeValue {
  save = 'save',
  refresh = 'refresh',
  test = 'test'
}

export type EventType = keyof typeof EventTypeValue

type EventMap = {
  [key in EventTypeValue]?: Callback
}

class EventController {
  private eventMap: CallbackMap = {}

  getEventMap = () => {
    return readonly(this.eventMap)
  }

  onSave = (saveFunc: Callback, componentId: string) => {
    if (!this.eventMap[componentId]) {
      this.eventMap[componentId] = {}
    }
    this.eventMap[componentId].save = saveFunc
  }

  onEvent = (eventName: EventType, evnetFunc: Callback, componentId: string) => {
    if (!this.eventMap[componentId]) {
      this.eventMap[componentId] = {}
    }
    this.eventMap[componentId][eventName] = evnetFunc
  }

  // 事件触发器
  eventSwitch = (event: EventType, componentId = activeTab.value) => {
    console.log(componentId, 123)

    if (componentId) {
      const eventCallback = this.eventMap?.[componentId]
      console.log(event, componentId, eventCallback)

      if (eventCallback) eventCallback[event]?.()
    }
  }
}

const eventController = new EventController()

export default function useEvent(): EventController {
  return eventController
}
