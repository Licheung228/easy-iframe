import type { DEFAULT_MESSAGE_TYPE } from './constant'
import { initListener } from './init'
import type { Options } from './type'
import type { Message } from './utils/mitter'
import { Mitter } from './utils/mitter'

// Comomon, abstarct class
export abstract class Common extends Mitter {
  postMessage?: (message: Message<DEFAULT_MESSAGE_TYPE | string>) => void
  onError?: (err: any) => void
  targetOrigin?: string = '*'

  constructor(options: Options) {
    super()
    this.targetOrigin = options.targetOrigin || '*'
    this.onError = options.onError
    initListener(this)
  }

  // 触发订阅事件 (包括父/子容器)
  public emitMessage<P = any>({
    type,
    payload,
  }: {
    type: string
    payload?: P
  }): void {
    // 触发当前对象的订阅事件
    this.emit(type, payload)
    // 触发父/子容器对象的订阅事件
    this.postMessage?.({ type, payload })
  }
}
