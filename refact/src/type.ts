import type { Message } from '../mitter/type'

export enum DEFAULT_MESSAGE_TYPE {
  INIT = '__EASY_IFRAME_INIT__',
  CONNECTED = '__EASY_IFRAME_CONNECTED__',
  CONNECTING = '__EASY_IFRAME_CONNECTING__'
}
export interface Options {
  targetOrigin: string
  onError?: (err: any) => void
}
export interface PostMessageMessage extends Message {
  source: string
}
