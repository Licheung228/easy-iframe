import { Mitter, MitterOptions } from './mitter'

class Common extends Mitter {
  constructor(options: MitterOptions) {
    super({ onError: options.onError })
  }
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
    this.iframe = document.createElement('iframe')
    this.targetOrigin = targetOrigin
    this.iframe.width = '100%'
    this.iframe.height = '100%'
  }

  private iframeLoaded() {
    return new Promise((resolve, reject) => {
      this.iframe.onload = () => {
        resolve(true)
      }
      this.iframe.onerror = () => {
        reject(new Error('iframe load error'))
      }

      this.iframe.src = this.targetOrigin
    })
  }

  init() {
    this.iframeLoaded().then(re => {
      console.log(re)
      this.iframe.contentWindow!.postMessage('init', '*')
    })

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
