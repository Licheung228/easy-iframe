import type { Message, MitterOptions } from './type'

export class Mitter {
  private listeners: Map<string, Set<(data: Message) => void>> = new Map()
  onError?: (err: any) => void

  constructor({ onError }: MitterOptions) {
    this.onError = onError
  }

  has(type: string) {
    return this.listeners.has(type)
  }

  on(type: string, listener: (data: Message) => void) {
    const listeners = this.listeners.get(type) || new Set()
    listeners.add(listener)
    this.listeners.set(type, listeners)
  }

  emit(type: string, data: Message) {
    const listeners = this.listeners.get(type)
    if (!listeners) {
      return this.onError?.({
        type: 'event',
        payload: `emit event "${type}" failed, listeners not found`
      })
    }
    listeners.forEach(listener => listener(data))
  }

  off(type: string, listener: (data: Message) => void) {
    const listeners = this.listeners.get(type)
    if (!listeners) {
      return this.onError?.({
        type: 'event',
        payload: `off event "${type}" failed, listeners not found`
      })
    }
    listeners.delete(listener)
  }

  clear(type: string) {
    this.listeners.delete(type)
  }

  clearAll() {
    this.listeners.clear()
  }
}
