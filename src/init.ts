import type { MainAPP, SubAPP } from './main'
import type { Message } from '@likcheung/shared/src/mitter/type'

/**
 * 初始化 postMessage 方法
 * @param _this 当前实例
 * @param window_this 父窗口 | iframe 窗口 的 window 对象
 */
export const initPostMessage = (
  _this: MainAPP | SubAPP,
  window_this: Window,
): void => {
  // 绑定在A｜B 实例上的 postMessage 方法
  _this.postMessage = (message: Message) => {
    try {
      // 将 message 转换为 json 字符串
      const data: string = JSON.stringify({
        ...message,
        // 新增 source 属性
        source: '__EASY_IFRAME__',
      })

      // 调用父窗口 | iframe 窗口 的 postMessage 方法
      window_this?.postMessage.call(
        window_this,
        data,
        // 传递 targetOrigin 参数
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
 * 注册 message 事件
 * @param _this 当前实例
 */
export const initListener = (_this: MainAPP | SubAPP): void => {
  window.addEventListener('message', (event) => {
    // easy iframe 发送的消息是 json 字符串
    if (typeof event.data !== 'string') return
    try {
      // 解析消息
      const data: Message & { source: '__EASY_IFRAME__' } = JSON.parse(
        event.data,
      )
      // 消息来源必须是 easy iframe
      if (data?.source !== '__EASY_IFRAME__') return
      // 触发事件
      const { type, payload } = data
      _this.emit(type, payload)
    } catch {
      // 解析失败
      _this.onError?.({
        type: 'json parse error',
        payload: event.data,
      })
    }
  })
}
