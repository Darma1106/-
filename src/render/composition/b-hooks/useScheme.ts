import { reactive, ref, watch } from 'vue'
import type { Ref } from 'vue'
import useFlag from '../hooks/useFlag'
import SchemeService, { SchemeInfo, SearchParams } from '@/services/module/schemeService'

export interface SchemeController {
  loading: Ref<boolean>
  total: Ref<number>
  pageSize: Ref<number>
  pageNum: Ref<number>
  addFn: (scheme: SchemeInfo) => Promise<void>
  deleteFn: (schemeId: string) => Promise<boolean>
  selectFn: (filter?: SearchParams) => Promise<void>
  setPageSize: (size: number) => void
  setPageNum: (size: number) => void
}

export default function useScheme(): [SchemeInfo[], SchemeController] {
  const schemeList: SchemeInfo[] = reactive([])
  const [loading, loadingController] = useFlag(false)
  const pageSize = ref(10)
  watch(pageSize, () => {
    selectFn()
  })

  const pageNum = ref(1)
  watch(pageNum, () => {
    selectFn()
  })
  const total = ref(0)

  const setPageSize = (size: number) => {
    pageSize.value = size
    selectFn()
  }

  const setPageNum = (page: number) => {
    pageNum.value = page
    selectFn()
  }

  const selectFn = async (filter?: SearchParams) => {
    loadingController.set(true)

    const { data } = await SchemeService.getSchemeList(pageNum.value, pageSize.value, filter)
    if (data) {
      schemeList.clean()
      data.list.forEach((project) => {
        schemeList.push(project)
      })
      total.value = data.totalRecords
    }

    loadingController.toggle()
  }

  const addFn = async (scheme: SchemeInfo) => {
    if (scheme.id) {
      const { code } = await SchemeService.editScheme(scheme)
      if (code == 1) {
        selectFn()
      }
    } else {
      const { code } = await SchemeService.addScheme(scheme)
      if (code == 1) {
        selectFn()
      }
    }
  }

  const deleteFn = async (schemeId: string) => {
    const { code } = await SchemeService.deleteScheme(schemeId)
    if (code == 1) {
      schemeList.delete(
        schemeList.findIndex((scheme) => {
          return scheme.id == schemeId
        })
      )
    }

    return code == 1
  }

  return [schemeList, { selectFn, deleteFn, addFn, setPageSize, setPageNum, loading, total, pageNum, pageSize }]
}
