export interface PollOptions<T = any> {
  interval?: number
  timeout?: number
  maxAttempts?: number
  successCondition?: (result: T) => boolean | Promise<boolean>
  failureCondition?: (result: T) => boolean | Promise<boolean>
  onInterval?: (attempt: number) => void
}

export interface Poll {
  <T = any>(
    pollFunction: (...args: any[]) => any,
    options: PollOptions<T>,
  ): {
    start: () => Promise<T>
    cancel: () => void
  }
}
