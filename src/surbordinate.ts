type constructorParams = {
  targetOrigin: string
  typeList?: string[]
  onError?: (err: any) => any
}

export class Subordinate {
  // 链接状态
  connection: boolean
  // 通信父目标
  readonly targetOrigin: string
  // 允许的通信类型
  private typeList: string[]
  // 通信任务栈
  private stacks: Map<string, Set<task>>
  onError?: (err: any) => any

  constructor({ targetOrigin, typeList = [], onError }: constructorParams) {
    if (targetOrigin === window.origin)
      throw new Error('Subordinate: targetOrigin不能为当前源')
    this.targetOrigin = targetOrigin
    this.typeList = [this.targetOrigin].concat(typeList || [])
    this.connection = false
    this.stacks = new Map()
    this.onError = onError
  }

  // 初始化方法
  init() {
    const init = (payload: any) => {
      this.connection = this.targetOrigin === payload
      this.send(window.origin, true)
      this.unsubscribe(this.targetOrigin)
    }

    this.subscribe(this.targetOrigin, init)
    window.addEventListener('message', this.execute)
  }

  // 通信任务执栈执行
  private execute = (e: MessageEvent) => {
    const { type, payload } = e.data

    if (!this.typeList.includes(type)) {
      if (e.origin !== this.targetOrigin) return
      this.send('error', 'typeError')
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
    if (s) {
      s.add(fn)
    } else {
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
      s.clear()
      this.stacks.delete(type)
    }
  }

  // 通信方法
  send(type: string, payload: any) {
    if (this.connection) {
      const w = window.parent.window
      w.postMessage({ type, payload }, this.targetOrigin)
    } else this.onError && this.onError({ message: 'disconnect', payload })
  }

  // 卸载方法
  unmount() {
    this.stacks.clear()
    window.removeEventListener('message', this.execute)
  }
}
