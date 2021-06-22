import { ref, Ref, watch } from 'vue'

interface Events {
  onSave: (saveFunc: () => any) => void
  eventCon: (event: string) => void
}

type CallBack = () => any

export function useEvent(): Events {
  const eventName: Ref<string> = ref('')
  const save: Ref<CallBack | null> = ref(null)
  const onSave = (saveFunc: CallBack) => {
    save.value = saveFunc
  }
  const eventCon = (event: string) => {
    switch (event) {
      case 'save':
        if (save.value) save.value()

        break
    }
  }

  // watch(eventName, (val) => {
  //   switch (val) {
  //     case 'save':
  //       if (save.value) save.value()

  //       break
  //   }
  // })
  return { onSave, eventCon }
}
