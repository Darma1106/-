import { onMounted, reactive } from 'vue'
import type { Ref } from 'vue'
import ProjectService, { ProjectInfo } from '../../services/module/projectService'

import useFlag from '../hooks/useFlag'

export interface ProjectController {
  loading: Ref<boolean>
  addFn: (project: ProjectInfo) => Promise<void>
  // editFn: (task: TaskInfo) => string
  deleteFn: (projectId: string) => Promise<boolean>
  selectFn: (filter?: ProjectInfo) => Promise<void>
}

export default function useProject(): [ProjectInfo[], ProjectController] {
  const projectList: ProjectInfo[] = reactive([])
  const [loading, loadingController] = useFlag(false)

  const selectFn = async (filter?: ProjectInfo) => {
    loadingController.set(true)
    const { data } = await ProjectService.gettingProjects(filter)
    projectList.clean()
    data?.forEach((project) => {
      projectList.push(project)
    })
    loadingController.toggle()
  }

  const addFn = async (project: ProjectInfo) => {
    const { state, data } = await ProjectService.addProject(project)
    if (state == '1') {
      project.id = data
      projectList.push(project)
    }
  }

  const deleteFn = async (projectId: string) => {
    const { state } = await ProjectService.deleteProject(projectId)
    if (state == '1') {
      projectList.delete(
        projectList.findIndex((project) => {
          project.id == projectId
        })
      )
    }
    return state == '1'
  }

  onMounted(() => {
    selectFn()
  })

  return [projectList, { addFn, deleteFn, selectFn, loading }]
}
