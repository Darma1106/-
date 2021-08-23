import { cloneDeep } from 'lodash'
import type { SchemeTree } from '@/services/module/schemeService'

interface SlotTree extends SchemeTree {
  slots?: any
}

export function addSlots(data?: SchemeTree[]): SlotTree[] {
  if (data) {
    const tree: SlotTree[] = cloneDeep(data)
    deeper(tree)
    return tree
  }
  return []
}

function deeper(data: SlotTree[]): void {
  data.forEach((item) => {
    if (item.children) {
      item.slots = { icon: item.type }
      deeper(item.children)
    }
  })
}
