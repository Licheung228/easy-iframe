import { Mitter } from './mitter/mitter'
import { initListener, initPostMessage } from './init'
import { poll } from './utils/utils'
import { DEFAULT_MESSAGE_TYPE } from './constant'
import type { Options, InitOptions } from './type'
import type { Message, MitterOptions } from './mitter/type'

class Common extends Mitter {
  postMessage?: (message: Message<DEFAULT_MESSAGE_TYPE | string>) => void
  targetOrigin: string

  constructor(options: MitterOptions & Options) {
    super({ onError: options.onError })
    this.targetOrigin = options.targetOrigin
  }
}

class MainAPP extends Common {
  duration: number = 1000
  iframe: HTMLIFrameElement
  connection: boolean = false

  constructor({ targetOrigin, onError }: Options) {
    super({ onError, targetOrigin })
    this.iframe = document.createElement('iframe')
    this.iframe.width = '100%'
    this.iframe.height = '100%'
  }

  init(container: HTMLElement, initOptions?: InitOptions) {
    initListener(this)

    // 设置 iframe 的 src 属性, 触发 iframe 的 onload 事件
    this.iframe.src = this.targetOrigin
    container.append(this.iframe)
    // 获取轮询控制器
    const pollConnect = poll(
      () => {
        // 如果用户注册了 CONNECTING 事件，则触发
        this.has(DEFAULT_MESSAGE_TYPE.CONNECTING) &&
          this.emit(DEFAULT_MESSAGE_TYPE.CONNECTING, {
            type: DEFAULT_MESSAGE_TYPE.CONNECTING,
            payload: 'easy iframe is connecting',
          })
        // 不断向子应用发送 init 消息，直到子应用初始化成功
        this.postMessage?.({
          type: DEFAULT_MESSAGE_TYPE.INIT,
          payload: true,
        })
      },
      initOptions || {
        maxAttempts: 3,
        interval: 1000,
      },
    )
    // 监听来自子应用的消息，初始化成功后，停止轮询
    const initSuccess = (e: Message) => {
      this.connection = true
      pollConnect.cancel()
      // 如果用户注册了 CONNECTED 事件，则触发
      this.has(DEFAULT_MESSAGE_TYPE.CONNECTED) &&
        this.emit(DEFAULT_MESSAGE_TYPE.CONNECTED, {
          type: DEFAULT_MESSAGE_TYPE.CONNECTED,
          payload: e,
        })
      this.off(DEFAULT_MESSAGE_TYPE.INIT, initSuccess)
    }
    this.on(DEFAULT_MESSAGE_TYPE.INIT, initSuccess)
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

  init() {
    initPostMessage(this, window.parent)
    initListener(this)
    this.on(DEFAULT_MESSAGE_TYPE.INIT, () => {
      this.postMessage?.({
        type: DEFAULT_MESSAGE_TYPE.INIT,
        payload: true,
      })
    })
  }
}

export { MainAPP, SubAPP }
