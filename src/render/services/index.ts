// const modulesFiles = import.meta.globEager('./module/*.ts')
// const API: { [key: string]: any } = {}

// for (const key in modulesFiles) {
//   if (Object.prototype.hasOwnProperty.call(modulesFiles, key)) {
//     const element = modulesFiles[key]
//     const keyName = key.replace('./module/', '').replace('.ts', '')
//     API[keyName] = element[keyName]
//   }
// }

// export { API }

export { default as ProjectService } from './module/projectService'
export { default as TaskService } from './module/taskService'
