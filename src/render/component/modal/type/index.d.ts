import type { Ref } from 'vue'
export interface BaseModalInstance {
  showModal: () => void
}

export interface BaseCardInstance<T> {
  show: (data?: T | Ref<T>) => void
}
