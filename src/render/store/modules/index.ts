export function loadModules(): { context: AnyObject; modules: AnyObject } {
  const context = import.meta.globEager('./*.ts') as AnyObject

  const modules: AnyObject = {}

  Object.keys(context).forEach((key: string) => {
    if (key === './index.ts') return
    modules[key.replace(/(\.\/|\.ts)/g, '')] = context[key].default
  })

  console.log({ context, modules }, 'loadModules')

  return { context, modules }
}

export const { context, modules } = loadModules()
