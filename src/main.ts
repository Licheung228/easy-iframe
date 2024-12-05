import { Mitter } from '@likcheung/shared'
import { poll } from '@likcheung/shared'
import { initListener, initPostMessage } from './init'
import { DEFAULT_MESSAGE_TYPE } from './constant'
import type { Options, InitOptions } from './type'
import type { Message, MitterOptions } from '@likcheung/shared'
import { DEFAULT_MESSAGE_TYPE_INIT } from './_constant'

// Comomon, abstarct class
abstract class Common extends Mitter {
  postMessage?: (message: Message<DEFAULT_MESSAGE_TYPE | string>) => void
  targetOrigin?: string = '*'

  constructor(options: MitterOptions & Options) {
    super({ onError: options.onError })
    this.targetOrigin = options.targetOrigin || '*'
  }
}

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
    initListener(this)

    // set src to iframe, for trigger iframe.onload
    this.iframe.src = this.src
    container.append(this.iframe)

    // polling connect
    const pollConnectFn = () => {
      // if DEFAULT_MESSAGE_TYPE.CONNECTING event had registered, emit it
      if (this.has(DEFAULT_MESSAGE_TYPE.CONNECTING)) {
        this.emit(DEFAULT_MESSAGE_TYPE.CONNECTING, {
          type: DEFAULT_MESSAGE_TYPE.CONNECTING,
          payload: 'easy iframe is connecting',
        })
      }

      // send init message to sub app, until sub app is init, payload is main app origin, use to sub app check sub's targetOrigin
      this.postMessage?.({
        type: DEFAULT_MESSAGE_TYPE_INIT,
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
        return this.off(DEFAULT_MESSAGE_TYPE_INIT, initSuccess)
      }

      // if DEFAULT_MESSAGE_TYPE.CONNECTED had be registered, emit it
      if (this.has(DEFAULT_MESSAGE_TYPE.CONNECTED)) {
        this.emit(DEFAULT_MESSAGE_TYPE.CONNECTED, {
          type: DEFAULT_MESSAGE_TYPE.CONNECTED,
          payload: subOrigin,
        })
      }

      this.off(DEFAULT_MESSAGE_TYPE_INIT, initSuccess)
    }
    // wait for sub app init
    this.on(DEFAULT_MESSAGE_TYPE_INIT, initSuccess)
    this.iframe.onload = () => {
      // init postMessage, must before load, if not iframe.contentWindow maybe null
      initPostMessage(this, this.iframe.contentWindow!)
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
    initPostMessage(this, window.parent)
    initListener(this)
    this.on(DEFAULT_MESSAGE_TYPE_INIT, (mainOrigin: string) => {
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
      }
      this.postMessage?.({
        type: DEFAULT_MESSAGE_TYPE_INIT,
        payload: window.location.origin,
      })
    })
  }
}

export { MainAPP, SubAPP }
