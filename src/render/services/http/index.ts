import axios from 'axios'
import { axiosConfig } from './config'
import { requestResolve } from './requestHandler'
import { responseResolve } from './responseHandler'
import { errorHandler } from './errorHandler'
import type { HttpResponse } from '@/types/global'

import type { AxiosResponse, AxiosError } from 'axios'

const service = axios.create(axiosConfig)

// 请求拦截器
service.interceptors.request.use(requestResolve, errorHandler)

// 响应拦截器
service.interceptors.response.use(responseResolve, errorHandler)

export const get = <T>(
  url: string,
  data?: unknown,
  headers?: Record<string, unknown>,
  baseURL = ''
): Promise<HttpResponse<T>> =>
  new Promise((reslove, reject) => {
    service({
      url,
      method: 'GET',
      params: data,
      headers,
      baseURL
    })
      .then((res: AxiosResponse<HttpResponse<T>>) => {
        reslove(res.data)
      })
      .catch((err: AxiosError) => {
        reject(err)
      })
  })

export const post = <T>(
  url: string,
  data?: unknown,
  headers?: Record<string, unknown>,
  baseURL = ''
): Promise<HttpResponse<T>> =>
  new Promise((reslove, reject) => {
    service({
      url,
      method: 'POST',
      data,
      headers,
      baseURL
    })
      .then((res: AxiosResponse<HttpResponse<T>>) => {
        reslove(res.data)
      })
      .catch((err: AxiosError) => {
        reject(err)
      })
  })

// export const doRequest = <T>(
//   url: string,
//   options: {
//     method: Method
//     data?: unknown
//     params?: unknown
//     headers?: Record<string, unknown>
//   }
// ): Promise<Common.IResponseData<T>> =>
//   new Promise((reslove, reject) => {
//     service({
//       url,
//       ...options
//     })
//       .then((res: AxiosResponse<Common.IResponseData<T>>) => {
//         reslove(res.data)
//       })
//       .catch((err: AxiosError) => {
//         reject(err)
//       })
//   })

export default service
