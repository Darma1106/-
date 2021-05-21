import { AxiosRequestConfig } from 'axios'
export const axiosConfig: AxiosRequestConfig = {
  // 联调
  // baseURL: process.env. === 'production' ? `/` : '/api',
  baseURL: 'http://192.168.2.234:60020/ZyPgrj-Service',
  // baseURL: 'http://8.141.51.130:60020/ZyPgrj-Service',
  // headers: { 'content-type': 'application/json' },
  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    post: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  },
  // 是否跨站点访问控制请求
  // withCredentials: true,
  timeout: 30000,
  transformRequest: [
    (data) => {
      data = JSON.stringify(data)
      return data
    }
  ],
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true
  },
  transformResponse: [
    (data) => {
      if (typeof data === 'string' && data.startsWith('{')) {
        data = JSON.parse(data)
      }
      return data
    }
  ]
}
