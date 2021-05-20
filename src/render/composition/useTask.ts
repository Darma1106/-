import { onMounted, reactive } from 'vue'
import TaskService, { TaskInfo } from '../services/module/taskService'

interface taskController {
  addFn: (task: TaskInfo) => Promise<void>
  // editFn: (task: TaskInfo) => string
  deleteFn: (taskId: string) => Promise<boolean>
  searchFn: (filter?: TaskInfo) => Promise<TaskInfo[]>
}

export default function useTask(): [TaskInfo[], taskController] {
  const taskList: TaskInfo[] = reactive([])

  const addFn = async (task: TaskInfo) => {
    const { state, data } = await TaskService.addTask(task)
    if (state == '1') {
      task.id = data
    }
    console.log(data)
  }

  const deleteFn = async (taskId: string) => {
    const { state } = await TaskService.deleteTask(taskId)
    return state == '1'
  }

  const searchFn = async (filter?: TaskInfo) => {
    const { data } = await TaskService.getTaskList(filter)
    taskList.length = 0
    data?.forEach((task) => {
      taskList.push(task)
    })
    return data || []
  }

  onMounted(() => {
    searchFn()
  })

  return [taskList, { addFn, deleteFn, searchFn }]
}

// export default function useFlag(init: boolean): [Ref<boolean>, FlagController] {
//   const current = ref(init)

//   const toggle = (): boolean => {
//     current.value = !current.value
//     return current.value
//   }
//   const set = (flag: boolean): boolean => {
//     current.value = flag
//     return current.value
//   }
//   const reset = (flag?: boolean): boolean => {
//     if (flag) init = flag
//     current.value = init
//     return current.value
//   }

//   return [current, { toggle, set, reset }]
// }
