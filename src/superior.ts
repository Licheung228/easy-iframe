type constructorParams = {
  targetOrigin: string
  typeList?: string[]
  onError?: (err: any) => void
  query?: Record<string, any>
}

export class Superior {
  connection: boolean
  readonly targetOrigin: URL
  readonly frame: HTMLIFrameElement
  private onError?: (err: any) => void
  private typeList: string[]
  private stacks: Map<string, Set<task>>
  private query?: Record<string, any>

  constructor({
    targetOrigin,
    onError,
    query,
    typeList = []
  }: constructorParams) {
    if (targetOrigin === window.origin)
      throw new Error('Superior: targetOrigin不能为当前源')
    // 通信目标
    this.targetOrigin = new URL(targetOrigin)
    // 错误处理
    this.onError = onError
    // 通信链接状态
    this.connection = false
    // 允许的通信类型
    this.typeList = [this.targetOrigin.origin].concat(typeList)
    // 通信任务栈
    this.stacks = new Map()
    // query
    this.query = query

    // 创建 iframe dom
    const frame = document.createElement('iframe')
    // 保存到实例
    this.frame = frame
    // 为 iframe 赋值 src
    frame.src = this.targetOrigin.href
    this.setSrc({ query })
  }

  // 初始化工作
  init(srcObj: { query?: Record<string, any>; hash?: string }) {
    if (srcObj) {
      this.setSrc(srcObj)
    }
    return new Promise<void>((resolve, reject) => {
      this.frame.addEventListener('load', () => {
        this.frame.contentWindow!.postMessage(
          { type: window.origin, payload: window.origin },
          this.targetOrigin.origin
        )

        const init = (payload: any, type?: string) => {
          if (type && type === this.targetOrigin.origin && payload) {
            this.connection = true
            resolve()
            console.log('%c🚀>>>', 'color: red;', 'connect success')
          } else reject(new Error('connect fail'))
          // 初始化只有一次
          this.unsubscribe(this.targetOrigin.origin)
        }

        this.subscribe(this.targetOrigin.origin, init)
        window.addEventListener('message', this.execute)
      })
    })
  }

  // 发送消息
  send(type: any, payload: any) {
    if (this.connection) {
      this.frame.contentWindow!.postMessage(
        { type, payload },
        this.targetOrigin.origin
      )
    } else this.onError && this.onError({ message: 'disconnect', payload })
  }

  // frame 的 src 的 query || hash 设置
  setSrc({ query, hash }: { query?: Record<string, any>; hash?: string }) {
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

  // 通信任务执栈执行
  private execute = (e: MessageEvent) => {
    const { type, payload } = e.data

    if (type === 'error') {
      return this.onError && this.onError(payload)
    }

    if (!this.typeList.includes(type)) {
      if (e.origin !== this.targetOrigin.origin) return
      this.onError && this.onError('unknown type')
    } else {
      const targetStacks = this.stacks.get(type)
      if (targetStacks) {
        targetStacks.forEach(fn => {
          fn(payload, type)
        })
      }
    }
  }

  // 监听器
  subscribe(type: string, fn: task) {
    const s = this.stacks.get(type)
    // 如果已经存在，则直接压入栈
    if (s) {
      s.add(fn)
    }
    // 如果该类型还没有任务栈，则创建任务栈
    else {
      // 如果被允许的任务类型中没有需要被监听的任务类型。则加入进去
      if (!this.typeList.includes(type)) this.typeList.push(type)
      const set = new Set<task>()
      set.add(fn)
      this.stacks.set(type, set)
    }
  }

  // 停止监听器
  unsubscribe(type: string, fn?: task) {
    const s = this.stacks.get(type)
    if (!s) return
    if (fn) {
      s.delete(fn)
    } else {
      // 如果没有传入函数，则清空该类型的任务栈
      s.clear()
      this.stacks.delete(type)
    }
  }

  // 卸载方法
  unmount() {
    this.stacks.clear()
    window.removeEventListener('message', this.execute)
  }
}
