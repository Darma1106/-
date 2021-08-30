import { defineStore } from 'pinia'
import { useTabStore } from './tab'

type Callback = () => void

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
  test = 'test',

  //头部菜单
  projectManage = 'projectManage',
  addProject = 'addProject',
  editProject = 'editProject'
}

export type EventType = keyof typeof EventTypeValue

type EventMap = {
  [key in EventTypeValue]?: Callback
}

interface EventState {
  eventMap: CallbackMap
}

const TabStore = useTabStore()

export const useEventStore = defineStore({
  id: 'event',
  state(): EventState {
    return {
      eventMap: {}
    }
  },
  actions: {
    getEventMap() {
      return this.eventMap
    },

    onSave(saveFunc: Callback, componentId: string) {
      if (!this.eventMap[componentId]) {
        this.eventMap[componentId] = {}
      }
      this.eventMap[componentId].save = saveFunc
    },

    onEvent(eventName: EventType, evnetFunc: Callback, componentId: string) {
      if (!this.eventMap[componentId]) {
        this.eventMap[componentId] = {}
      }
      this.eventMap[componentId][eventName] = evnetFunc
    },

    // 事件触发器
    eventSwitch(event: EventType, componentId = TabStore.activeTab) {
      if (componentId) {
        const eventCallback = this.eventMap?.[componentId]
        console.log(event, componentId, eventCallback)

        if (eventCallback) eventCallback[event]?.()
      }
    }
  }
})
