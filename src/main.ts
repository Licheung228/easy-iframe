import { Mitter } from '@likcheung/shared'
import { poll } from '@likcheung/shared'
import { initListener, initPostMessage } from './init'
import { DEFAULT_MESSAGE_TYPE } from './constant'
import type { Options, InitOptions } from './type'
import type {
  Message,
  MitterOptions,
} from '@likcheung/shared/src/mitter/type'
import { DEFAULT_MESSAGE_TYPE_INIT } from './_constant'

// 抽象一个类作为公共
abstract class Common extends Mitter {
  postMessage?: (message: Message<DEFAULT_MESSAGE_TYPE | string>) => void
  targetOrigin?: string = '*'

  constructor(options: MitterOptions & Options) {
    super({ onError: options.onError })
    this.targetOrigin = options.targetOrigin || '*'
  }
}

class MainAPP extends Common {
  duration: number = 1000
  iframe: HTMLIFrameElement
  src: string

  constructor({
    onError,
    src,
  }: Pick<Options, 'onError'> & { src: string }) {
    super({ onError, targetOrigin: src })
    this.src = src
    this.iframe = window.document.createElement('iframe')
    this.iframe.width = '100%'
    this.iframe.height = '100%'
  }

  init(
    container: HTMLElement,
    initOptions?: InitOptions,
  ): HTMLIFrameElement {
    initListener(this)

    // 设置 iframe 的 src 属性, 触发 iframe 的 onload 事件
    this.iframe.src = this.src
    container.append(this.iframe)

    // 轮询链接行为
    const pollConnectFn = () => {
      // 如果用户注册了 CONNECTING 事件，则触发
      if (this.has(DEFAULT_MESSAGE_TYPE.CONNECTING)) {
        this.emit(DEFAULT_MESSAGE_TYPE.CONNECTING, {
          type: DEFAULT_MESSAGE_TYPE.CONNECTING,
          payload: 'easy iframe is connecting',
        })
      }

      // 不断向子应用发送 init 消息，直到子应用初始化成功，携带自己的origin过去，来确认双方的origin配置没问题
      this.postMessage?.({
        type: DEFAULT_MESSAGE_TYPE_INIT,
        payload: window.location.origin,
      })
    }
    // 获取轮询控制器
    const pollConnect = poll(
      pollConnectFn,
      initOptions || {
        maxAttempts: 3,
        interval: 1000,
      },
    )
    // 监听来自子应用的消息，初始化成功后，停止轮询
    const initSuccess = (subOrigin: string) => {
      pollConnect.cancel()
      // 子应用会发送自己的window.origin，父应用与自己接收的targetOrigin进行对比
      if (subOrigin !== this.targetOrigin) {
        this.onError?.({
          type: 'From: MainAPP',
          reason: `Origin Not Match, the targetOrigin be set ${this.targetOrigin}, but SubAPP's origin is ${subOrigin}`,
        })
        return this.off(DEFAULT_MESSAGE_TYPE_INIT, initSuccess)
      }

      // 如果用户注册了 CONNECTED 事件，则触发
      if (this.has(DEFAULT_MESSAGE_TYPE.CONNECTED)) {
        this.emit(DEFAULT_MESSAGE_TYPE.CONNECTED, {
          type: DEFAULT_MESSAGE_TYPE.CONNECTED,
          payload: subOrigin,
        })
      }

      this.off(DEFAULT_MESSAGE_TYPE_INIT, initSuccess)
    }
    // 等待子应用的init回馈
    this.on(DEFAULT_MESSAGE_TYPE_INIT, initSuccess)
    this.iframe.onload = () => {
      // 绑定 postMessage 方法
      initPostMessage(this, this.iframe.contentWindow!)
      // 开始轮询连接
      pollConnect.start().catch(this.onError)
    }

    return this.iframe
  }
}

class SubAPP extends Common {
  constructor({ onError, targetOrigin }: Options) {
    super({ onError, targetOrigin })
  }

  init(): void {
    initPostMessage(this, window.parent)
    initListener(this)
    this.on(DEFAULT_MESSAGE_TYPE_INIT, (mainOrigin: string) => {
      // 父应用会发送自己的 window.location.origin ，与自己的 targetOrigin 进行对比
      if (mainOrigin !== this.targetOrigin) {
        this.onError?.({
          type: 'From: SubApp',
          reason: `Origin Not Match, the targetOrigin be set ${this.targetOrigin}, but MainAPP's origin is ${mainOrigin}`,
        })
      }
      this.postMessage?.({
        type: DEFAULT_MESSAGE_TYPE_INIT,
        payload: window.location.origin,
      })
    })
  }
}

export { MainAPP, SubAPP }
