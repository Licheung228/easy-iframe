export interface Message<T = string, P = any> {
  type: T
  payload: P
  // source: string
}
export interface MitterOptions {
  onError?: (err: Message | Error) => void
}
