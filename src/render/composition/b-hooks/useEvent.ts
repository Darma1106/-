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
// onSave(callback,id)

//
// function eventFilter() {}

// export default function useEvent(): Events {
//   // const save: Ref<CallbackMap> = ref({})
//   const eventMap: Ref<EventMap> = ref({})
//   const onSave = (saveFunc: Callback, componentId: string) => {
//     if (!eventMap.value.save) {
//       eventMap.value.save = {}
//     }
//     eventMap.value.save[componentId] = saveFunc
//   }
//   const eventCon = (event: EventType, componentId: string) => {
//     switch (event) {
//       case 'save':
//         if (eventMap.value.save) eventMap.value.save[componentId]()

//         break
//     }
//   }

//   return { onSave, eventCon }
// }

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

export const eventController = new EventController()
