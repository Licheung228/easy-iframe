class Mitt {
  private typeList: string[] = []
  private stacks: Map<string, Set<task>>
  private onError?: (err: any) => void
  private origin: string

  constructor({ typeList = [], onError, origin }: constructorParamsMitt) {
    // 允许的通信类型
    this.typeList = this.typeList.concat([origin, ...typeList])
    // 通信任务队列
    this.stacks = new Map()
    // 错误处理
    this.onError = onError
    // 通信源
    this.origin = origin
  }

  // 链接状态
  get isMounted() {
    return this.stacks && this.stacks.size
  }

  // 监听器
  subscribe(type: string, fn: task) {
    if (!this.stacks)
      return this.onError && this.onError(new Error('mitt is unmounted'))
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

  // 通信任务执栈执行
  execute = (e: MessageEvent) => {
    const { type, payload } = e.data
    if (type === 'error') {
      return this.onError && this.onError(payload)
    }
    if (!this.typeList.includes(type)) {
      if (e.origin !== this.origin) return
      this.onError && this.onError(new Error('unknown type'))
    } else {
      const targetStacks = this.stacks.get(type)

      targetStacks &&
        targetStacks.forEach(fn => {
          fn(payload, type)
        })
    }
  }

  clear() {
    if (this.stacks) {
      this.stacks.clear()
    }
  }

  unmount() {
    if (this.stacks) {
      this.stacks = null as any
    }
  }
}

export default Mitt
