import type { MainAPP, SubAPP } from './main'
import type { Message } from './utils/mitter/type'

/**
 * init postMessage
 * @param _this instance. -todo maybe should use bind...
 * @param window_this main app | sub app 's window context
 */
export const initPostMessage = (
  _this: MainAPP | SubAPP,
  window_this: Window,
): void => {
  // assignment postMessage
  _this.postMessage = (message: Message) => {
    try {
      // trans message to json
      const data: string = JSON.stringify({
        ...message,
        // all message should be signed by easy-iframe
        source: '__EASY_IFRAME__',
      })

      // use window.postMessage to send message
      window_this?.postMessage.call(
        window_this,
        data,
        // targetOrigin:
        {
          targetOrigin: _this.targetOrigin,
        },
      )
    } catch {
      _this.onError?.({
        type: 'json stringify error',
        payload: message,
      })
    }
  }
}
/**
 * init listener
 * @param _this instance of MainAPP or SubAPP
 */
export const initListener = (_this: MainAPP | SubAPP): void => {
  window.addEventListener('message', (event) => {
    // the data must be string from easy-iframe, in postMessage the data had be stringify
    if (typeof event.data !== 'string') return
    try {
      // parse the data
      const data: Message & { source: '__EASY_IFRAME__' } = JSON.parse(
        event.data,
      )
      // verify the source
      if (data?.source !== '__EASY_IFRAME__') return
      // emit event
      const { type, payload } = data
      _this.emit(type, payload)
    } catch {
      // fail to parse the data, emit error
      _this.onError?.({
        type: 'json parse error',
        payload: event.data,
      })
    }
  })
}
