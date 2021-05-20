import { ref, onMounted, nextTick } from 'vue'

export default function useMountedState() {
  const isMounted = ref(false)

  onMounted(async () => {
    await nextTick()
    isMounted.value = true
  })

  return isMounted
}
