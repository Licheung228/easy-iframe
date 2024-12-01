import type { Message } from './mitter/type'
import type { PollOptions } from './utils/type'
export interface Options {
  targetOrigin: string
  onError?: (err: any) => void
}
export interface PostMessageMessage extends Message {
  source: string
}
export type InitOptions = Pick<
  PollOptions<any>,
  'interval' | 'maxAttempts' | 'timeout'
>
