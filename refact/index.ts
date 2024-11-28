import { Mitter, MitterOptions } from './mitter'

class Common extends Mitter {
  constructor(options: MitterOptions) {
    super({ onError: options.onError })
  }

  dispatch() {}
}

interface AOptions {
  targetOrigin: string
  onError?: (err: any) => void
}

class A extends Common {
  iframe: HTMLIFrameElement
  targetOrigin: string

  constructor({ targetOrigin, onError }: AOptions) {
    super({ onError })
    this.targetOrigin = targetOrigin
    this.iframe = document.createElement('iframe')
    this.iframe.width = '100%'
    this.iframe.height = '100%'
  }

  private iframeLoaded() {
    this.iframe.onload = () => {}
    this.iframe.onerror = this.onError as any
    return this.iframe
  }

  async init() {
    this.iframeLoaded()
    this.iframe.src = this.targetOrigin
    return this.iframe
  }
}

class B extends Common {
  constructor({ onError }: MitterOptions) {
    super({ onError })
  }

  init() {
    // 监听 message 事件
    window.addEventListener('message', event => {
      if (event.data.source?.startsWith('react-devtools')) return
      console.log(event)
    })
  }
}

export { A, B }
