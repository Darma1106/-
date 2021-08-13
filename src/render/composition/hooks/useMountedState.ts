import { ref, onMounted, nextTick } from 'vue'
import type { Ref } from 'vue'
export default function useMountedState(): Ref<boolean> {
  const isMounted = ref(false)

  onMounted(async () => {
    await nextTick()
    isMounted.value = true
  })

  return isMounted
}
