import type { Listener, MitterOptions } from './type'
export * from './type'

export class Mitter {
  private listeners: Map<string, Set<Listener>> = new Map()
  onError?: (err: any) => void

  constructor({ onError }: MitterOptions) {
    this.onError = onError
  }

  public has(type: string): boolean {
    return this.listeners.has(type)
  }

  public on<P = any>(type: string, listener: Listener<P>): void {
    const listeners = this.listeners.get(type) || new Set()
    listeners.add(listener)
    this.listeners.set(type, listeners)
  }

  public emit<P = any>(type: string, payload?: P): void {
    const listeners = this.listeners.get(type)
    if (!listeners) {
      return this.onError?.({
        type: 'event',
        payload: `emit event "${type}" failed, listeners not found`,
      })
    }
    listeners.forEach((listener) => listener(payload))
  }

  public off(type: string, listener: Listener<any>): void {
    const listeners = this.listeners.get(type)
    if (!listeners) {
      return this.onError?.({
        type: 'event',
        payload: `off event "${type}" failed, listeners not found`,
      })
    }
    listeners.delete(listener)
  }

  public clear(type: string): void {
    this.listeners.delete(type)
  }

  public clearAll(): void {
    this.listeners.clear()
  }
}
