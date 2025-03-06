import type { DEFAULT_MESSAGE_TYPE } from './constant'
import { initListener } from './init'
import type { Options } from './type'
import type { Message, MitterOptions } from './utils/mitter'
import { Mitter } from './utils/mitter'

// Comomon, abstarct class
export abstract class Common extends Mitter {
  postMessage?: (message: Message<DEFAULT_MESSAGE_TYPE | string>) => void
  targetOrigin?: string = '*'

  constructor(options: MitterOptions & Options) {
    super({ onError: options.onError })
    this.targetOrigin = options.targetOrigin || '*'
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

  // 需要拼接 src 的 qs.stringify 方法
  protected qsStringify(src: string, obj: object | undefined): string {
    if (obj === undefined || obj === null || Object.keys(obj).length === 0)
      return src

    const seen = new Set()
    const result = []

    // 遍历所有 own properties
    for (const key of Object.keys(obj)) {
      // URL 编码键和对应的值
      const encodedKey = encodeURIComponent(key)
      const value: any = obj[key as keyof typeof obj]

      if (!seen.has(encodedKey)) {
        seen.add(encodedKey)
        result.push([encodedKey, value.toString()]) // 将 value 转换为字符串以确保一致性
      }
    }

    // 按自然顺序排序键值对，并拼接结果
    const sorted = result.sort((a, b) => a[0].localeCompare(b[0]))
    return (
      src + '?' + sorted.map((part) => part[0] + '=' + part[1]).join('&')
    )
  }
}
