export interface Message<T = string, P = any> {
  type: T
  payload: P
}
export interface MitterOptions {
  onError?: (err: Message | Error) => void
}
export interface Listener<P = any> {
  (payload: P): any
}
