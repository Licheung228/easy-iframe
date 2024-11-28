import Mitt from './mitt'

export class Superior {
  connection: boolean
  readonly targetOrigin: URL
  frame: HTMLIFrameElement
  private onError?: (err: any) => void
  private query?: Record<string, any>
  private mitt: Mitt

  constructor({
    targetOrigin,
    onError,
    query,
    typeList
  }: constructorParamsSuperior) {
    if (targetOrigin === window.origin)
      throw new Error('Superior: targetOrigin不能为当前源')
    // 通信目标
    this.targetOrigin = new URL(targetOrigin)
    // 错误处理
    this.onError = onError
    // 通信链接状态
    this.connection = false
    // query
    this.query = query
    // 通信栈
    this.mitt = new Mitt({ typeList, onError, origin: targetOrigin })

    // 创建 iframe dom
    const frame = document.createElement('iframe')
    // 保存到实例
    this.frame = frame
    // 为 iframe 赋值 src
    frame.src = this.targetOrigin.href
    this.setSrc({ query })
  }

  subscribe(type: string, fn: task) {
    return Reflect.apply(this.mitt.subscribe, this.mitt, [type, fn])
  }

  unsubscribe(type: string, fn?: task) {
    return Reflect.apply(this.mitt.unsubscribe, this.mitt, [type, fn])
  }

  // 初始化工作
  init(srcObj?: { query?: Record<string, any>; hash?: string }) {
    if (srcObj) {
      this.setSrc(srcObj)
    }

    if (this.connection) {
      console.log('%c🚀>>>', 'color: red;', 'connect active')
      return Promise.resolve()
    }

    return new Promise<void>((resolve, reject) => {
      const request = () => {
        this.frame.contentWindow!.postMessage(
          { type: window.origin, payload: window.origin },
          this.targetOrigin.origin
        )
      }
      this.frame.addEventListener('load', request)

      const init = (payload: any, type?: string) => {
        if (type && type === this.targetOrigin.origin && payload) {
          this.connection = true
          resolve()
          console.log('%c🚀>>>', 'color: red;', 'connect success')
        } else reject(new Error('connect fail'))
        // 初始化只有一次
        this.unsubscribe(this.targetOrigin.origin)
        this.frame.removeEventListener('load', request)
      }

      this.subscribe(this.targetOrigin.origin, init)
      window.addEventListener('message', this.mitt.execute)
    })
  }

  // 发送消息
  send(type: any, payload: any) {
    if (this.connection && this.mitt.isMounted && this.frame) {
      this.frame.contentWindow!.postMessage(
        { type, payload },
        this.targetOrigin.origin
      )
    } else this.onError && this.onError(new Error('disconnect'))
  }

  // frame 的 src 的 query || hash 设置
  setSrc({ query, hash }: { query?: Record<string, any>; hash?: string }) {
    if (!this.frame) {
      return this.onError && this.onError(new Error('setSrc is not ready'))
    }

    if (query) {
      this.query = { ...this.query, ...query }
      for (const k in this.query) {
        this.targetOrigin.searchParams.set(k, this.query[k])
      }
      this.frame.src = this.targetOrigin.href
    }
    if (hash) {
      this.frame.src = `${this.frame.src}#${hash}`
    }
  }

  // 停止监听方法
  stop() {
    this.mitt.clear()
    this.connection = false
    window.removeEventListener('message', this.mitt.execute)
  }

  unmount() {
    this.mitt.clear()
    if (this.frame) {
      this.frame.remove()
      this.frame = null as any
    }
  }
}
