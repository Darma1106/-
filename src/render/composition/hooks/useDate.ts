import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import type { Ref } from 'vue'
import type { ConfigType, Dayjs } from 'dayjs'

export default function useDate(d: ConfigType = Date.now(), timeout = 0): Ref<Dayjs> {
  const date: Ref<Dayjs> = ref(dayjs(d))

  if (timeout) {
    let timerId: number

    onMounted(() => {
      timerId = window.setInterval(() => {
        date.value = date.value.add(timeout / 1000, 'second')
      }, timeout)
    })

    onUnmounted(() => {
      window.clearInterval(timerId)
    })
  }

  return date
}
