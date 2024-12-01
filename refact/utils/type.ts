export interface PollOptions<T> {
  interval?: number
  timeout?: number
  maxAttempts?: number
  successCondition?: (result: T) => boolean | Promise<boolean>
  failureCondition?: (result: T) => boolean | Promise<boolean>
  onInterval?: (attempt: number) => void
}

export interface Poll {
  <T>(pollFunction: () => any, options: PollOptions<T>): {
    start: () => Promise<T>
    cancel: () => void
  }
}
