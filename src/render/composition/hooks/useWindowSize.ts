import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref, ComputedRef } from 'vue'

interface WindowSize {
  width: Ref<number>
  height: Ref<number>
  widthPixel: ComputedRef<string>
  heightPixel: ComputedRef<string>
}

export default function useWindowSize(): WindowSize {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  const update = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  const widthPixel = computed(() => `${width.value}px`)
  const heightPixel = computed(() => `${height.value}px`)

  onMounted(() => {
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { width, height, widthPixel, heightPixel }
}
