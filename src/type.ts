/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PollOptions } from '@likcheung/shared'
export interface Options {
  targetOrigin?: string
  onError?: (err: any) => void
}
export type InitOptions = Pick<
  PollOptions,
  'interval' | 'maxAttempts' | 'timeout'
>
