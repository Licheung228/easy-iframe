import type { PollOptions } from './utils/poll'
export interface Options {
  targetOrigin?: string
  onError?: (err: any) => void
}
export type InitOptions = Pick<
  PollOptions,
  'interval' | 'maxAttempts' | 'timeout'
>
