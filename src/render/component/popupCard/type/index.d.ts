import type { Ref } from 'vue'
export interface PopupCardInstance<T> {
  show: (data?: T | Ref<T>) => void
}
