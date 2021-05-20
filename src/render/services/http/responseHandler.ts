import axios, { AxiosResponse } from 'axios'
import { removePending } from './pendingHandler'

// const tip = (message = '操作失败', type = 'error') => {
//   Message.closeAll()
//   Message({ type, message, duration: 3000 })
// }

interface ErrorHandler {}

const errorHandlers = {
  401: (response: AxiosResponse) => {
    console.log(response)

    // tip('登录状态已过期，请重新登录', 'warning')
    // toLogin()
  },

  403: (response: AxiosResponse) => {
    console.log(response)

    // tip(res.data.msg)
    // router.push(routesPath.ERROR_403)
  },

  default: (response: AxiosResponse) => {
    console.log('default', response)
    alert(response.data.message || '未知请求错误')
    // tip(response.data.message || '未知请求错误')
  }
}

const getErrorMsg = (status: number) => {
  let message: string = ''
  let handler: (response: AxiosResponse) => void
  switch (status) {
    case 400:
      message = '请求错误(400)'
      break
    case 401:
      message = '未授权，请重新登录(401)'
      break
    case 403:
      message = '拒绝访问(403)'
      break
    case 404:
      message = '请求出错(404)'
      break
    case 408:
      message = '请求超时(408)'
      break
    case 500:
      message = '服务器错误(500)'
      break
    case 501:
      message = '服务未实现(501)'
      break
    case 502:
      message = '网络错误(502)'
      break
    case 503:
      message = '服务不可用(503)'
      break
    case 504:
      message = '网络超时(504)'
      break
    case 505:
      message = 'HTTP版本不受支持(505)'
      break
    default:
      message = `连接出错(${status})!`
  }
  handler = (response: AxiosResponse) => {
    alert(response.data.msg || '未知请求错误')
    // tip(response.data.message || '未知请求错误')
  }
  return handler
}

export function responseResolve(response: AxiosResponse) {
  const code = parseInt(response.data.state)
  removePending(response) // 在请求结束后，移除本次请求
  if (response.status === 200 && code === 1) {
    return Promise.resolve(response.data)
  }
  const key = response.status === 200 ? code : response.status

  // 获取错误处理方法
  const errorHandler = getErrorMsg(key)
  errorHandler(response)

  return Promise.reject(response.data)
}

export function responseReject(error: any) {
  if (axios.isCancel(error)) {
    console.log('repeated request: ' + error.message)
  } else {
    // handle error code
    // 错误抛到业务代码
    error.data = {}
    error.data.msg = '请求超时或服务器异常，请检查网络或联系管理员！'
    // ElMessage.error(error.data.msg)
  }
  return Promise.reject(error)
}
