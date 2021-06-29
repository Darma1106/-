// import { ref, Ref } from 'vue'
type Callback = () => void

interface EventController {
  eventMap: EventMap
  onSave: (saveFunc: Callback, componentId: string) => void
  eventSwitch: (event: EventType, componentId: string) => void
}

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
  eventMap: EventMap = {}

  onSave = (saveFunc: Callback, componentId: string) => {
    if (!this.eventMap.save) {
      this.eventMap.save = {}
    }
    this.eventMap.save[componentId] = saveFunc
  }

  eventSwitch = (event: EventType, componentId: string) => {
    switch (event) {
      case 'save':
        if (this.eventMap.save) this.eventMap.save[componentId]()

        break
    }
  }
}

const eventController = new EventController()

export default function useEvent(): EventController {
  return eventController
}
