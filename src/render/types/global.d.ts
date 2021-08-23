// 接口响应通过格式
export interface HttpResponse<T> {
  state?: string
  code?: 1 | 0
  msg: string
  data: T
}
