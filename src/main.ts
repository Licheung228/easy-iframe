import { poll } from './utils/poll'
import { DEFAULT_MESSAGE_TYPE } from './constant'
import type { Options, InitOptions } from './type'
import { Common } from './common'
import { initPostMessage } from './init'

class MainAPP extends Common {
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
    // set src to iframe, for trigger iframe.onload
    this.iframe.src = this.qsStringify(this.src, initOptions?.query)
    container.append(this.iframe)

    // init postMessage, must before load, if not iframe.contentWindow maybe null
    initPostMessage(this, this.iframe.contentWindow!)

    // polling connect
    const pollConnectFn = () => {
      // 则触发 CONNECTINNG 事件, 表示 父子容器正在连接
      this.emitMessage?.({
        type: DEFAULT_MESSAGE_TYPE.CONNECTING,
        payload: this.iframe.src,
      })
      // send init message to sub app, until sub app is init, payload is main app origin, use to sub app check sub's targetOrigin
      this.emitMessage?.({
        type: DEFAULT_MESSAGE_TYPE.SUB_INIT,
        payload: window.location.origin,
      })
    }
    // polling controller
    const pollConnect = poll(
      pollConnectFn,
      initOptions || {
        maxAttempts: 3,
        interval: 1000,
      },
    )
    // the init success handler, when init success, stop polling and check the sub app targetOrigin
    // must check targetOrigin, main app's targetOrigin maybe not equal to sub app's targetOrigin
    const initSuccess = (subOrigin: string) => {
      pollConnect.cancel()
      // 子应用会发送自己的window.origin，父应用与自己接收的targetOrigin进行对比
      if (this.targetOrigin !== '*' && subOrigin !== this.targetOrigin) {
        const error = {
          type: 'From: MainAPP',
          reason: `Origin Not Match, the targetOrigin be set ${this.targetOrigin}, but SubAPP's origin is ${subOrigin}`,
        }
        if (this.onError) {
          this.onError(error)
        } else {
          console.error(error)
        }
      }
      // 触发 CONNECTED 事件, 表示 父子容器连接成功
      this.emit(DEFAULT_MESSAGE_TYPE.CONNECTED, subOrigin)
      this.off(DEFAULT_MESSAGE_TYPE.MAIN_INIT, initSuccess)
    }
    // wait for sub app init
    this.on<string>(DEFAULT_MESSAGE_TYPE.MAIN_INIT, initSuccess)
    this.iframe.onload = () => {
      // start polling
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
    // init postMessage, must before load, if not iframe.contentWindow maybe null
    initPostMessage(this, window.parent)

    this.on<string>(DEFAULT_MESSAGE_TYPE.SUB_INIT, (mainOrigin) => {
      // verify origin, main app origin is mainApp's window.location.origin, it should be same as subApp's targetOrigin
      if (this.targetOrigin !== '*' && mainOrigin !== this.targetOrigin) {
        const error = {
          type: 'From: SubApp',
          reason: `Origin Not Match, the targetOrigin be set ${this.targetOrigin}, but MainAPP's origin is ${mainOrigin}`,
        }
        if (this.onError) {
          this.onError(error)
        } else {
          console.error(error)
        }
      } else if (!this.targetOrigin || this.targetOrigin === '*') {
        // if targetOrigin is *, then it will not verify origin
        this.targetOrigin = mainOrigin
      }
      this.emitMessage?.({
        type: DEFAULT_MESSAGE_TYPE.MAIN_INIT,
        payload: window.location.origin,
      })
    })
  }
}

export { MainAPP, SubAPP }
