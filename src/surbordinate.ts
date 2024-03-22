import Mitt from './mitt'

export class Subordinate {
  // 通信父目标
  readonly targetOrigin: string
  // 通信任务栈
  private mitt: Mitt
  // 错误处理
  onError?: (err: any) => any

  constructor({
    targetOrigin,
    typeList = [],
    onError
  }: constructorParamsSurboridinate) {
    if (targetOrigin === window.origin)
      throw new Error('Subordinate: targetOrigin不能为当前源')
    this.targetOrigin = targetOrigin
    this.onError = onError
    this.mitt = new Mitt({ typeList, onError, origin: targetOrigin })
  }

  // 初始化方法
  init() {
    const init = () => {
      this.send(window.origin, true)
      this.unsubscribe(this.targetOrigin)
    }

    this.subscribe(this.targetOrigin, init)
    window.addEventListener('message', this.mitt.execute)
  }

  // 通信方法
  send(type: string, payload: any) {
    if (this.mitt.isMounted) {
      const w = window.parent.window
      w.postMessage({ type, payload }, this.targetOrigin)
    } else this.onError && this.onError({ message: 'disconnect', payload })
  }

  // 停止监听方法
  stop() {
    this.mitt.clear()
    window.removeEventListener('message', this.mitt.execute)
  }

  subscribe(type: string, fn: task) {
    return Reflect.apply(this.mitt.subscribe, this.mitt, [type, fn])
  }

  unsubscribe(type: string, fn?: task) {
    return Reflect.apply(this.mitt.unsubscribe, this.mitt, [type, fn])
  }
}
