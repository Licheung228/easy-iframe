import type { Poll, PollOptions } from './type'
export * from './type'

/**
 * 轮询函数
 * @param {Function} pollFunction 轮询接口函数
 * @param {PollOptions<T>} options 轮询配置选项
 * @returns 轮询对象
 */
export const poll: Poll = <T = any>(
  pollFunction: (...args: any[]) => any,
  options: PollOptions<T>,
) => {
  const {
    interval = 1000,
    timeout = 30000,
    maxAttempts = Infinity,
    successCondition,
    failureCondition,
    onInterval,
  } = options

  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const controller = new AbortController()

  const cancel = () => {
    controller.abort()
    clearTimeout(timeoutId)
    timeoutId = void 0
  }

  const start = () => {
    const startTime = Date.now()
    let attempts = 0

    return new Promise<T>((resolve, reject) => {
      const executePoll = async () => {
        if (controller.signal.aborted) {
          reject(new Error('Poll: polling was cancelled'))
          return
        }

        try {
          attempts++
          const result = await pollFunction()

          // 检查成功条件
          if (await successCondition?.(result)) {
            resolve(result)
            return
          }

          // 检查失败条件
          if (await failureCondition?.(result)) {
            reject(new Error('Poll: Failure condition met'))
            return
          }

          // 检查是否超过最大尝试次数
          if (attempts >= maxAttempts) {
            reject(
              new Error(
                `Poll: Exceeded maximum attempts (${maxAttempts})`,
              ),
            )
            return
          }

          // 检查是否超时
          if (Date.now() - startTime >= timeout) {
            reject(new Error(`Poll:Polling timed out after ${timeout}ms`))
            return
          }

          // 触发间隔回调
          onInterval?.(attempts)

          if (!controller.signal.aborted) {
            timeoutId = setTimeout(executePoll, interval)
          }
        } catch (error) {
          cancel()
          reject(error)
        }
      }

      executePoll()
    })
  }

  return { start, cancel }
}
