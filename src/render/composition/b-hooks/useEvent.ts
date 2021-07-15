import { readonly } from 'vue'
import sotre from '@/store'
import useTabs from './useTabs'

console.log(sotre.state.tabs, 'store')

type Callback = () => void

const { activeTab } = useTabs()

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
  refresh = 'refresh'
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

  // 事件触发器
  eventSwitch = (event: EventType, componentId = activeTab.value) => {
    if (componentId) {
      const eventCallback = this.eventMap?.[componentId]

      if (eventCallback) eventCallback[event]?.()
    }
  }
}

const eventController = new EventController()

export default function useEvent(): EventController {
  return eventController
}
