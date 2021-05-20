import axios from 'axios'
import { axiosConfig } from './config'
import { requestResolve } from './requestHandler'
import { responseResolve } from './responseHandler'

const service = axios.create(axiosConfig)

// 请求拦截器
service.interceptors.request.use(requestResolve)

// 响应拦截器
service.interceptors.response.use(responseResolve)

export default service
