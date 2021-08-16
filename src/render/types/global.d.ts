// 接口响应通过格式
export interface HttpResponse<T> {
  state?: string
  code?: number
  msg: string
  data?: T
}
