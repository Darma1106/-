import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export default function useTimeout(delay = 0): Ref<boolean> {
  const ready = ref(false)
  let timerId: number

  onMounted(() => {
    timerId = window.setTimeout(() => {
      ready.value = true
    }, delay)
  })

  onUnmounted(() => {
    window.clearTimeout(timerId)
  })

  return ready
}
