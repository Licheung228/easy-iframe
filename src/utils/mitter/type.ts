export interface Message<T = string, P = any> {
  type: T
  payload: P
}
export interface Listener<P = any> {
  (payload: P): any
}
