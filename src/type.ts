import type { PollOptions } from './utils/type'
export interface Options {
  targetOrigin: string
  onError?: (err: any) => void
}
export type InitOptions = Pick<
  PollOptions<any>,
  'interval' | 'maxAttempts' | 'timeout'
>
