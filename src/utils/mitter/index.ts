import type { Listener } from './type'
export * from './type'

export class Mitter {
  private listeners: Map<string, Set<Listener>> = new Map()

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
    if (!listeners) return
    listeners.forEach((listener) => listener(payload))
  }

  public off(type: string, listener: Listener<any>): void {
    const listeners = this.listeners.get(type)
    if (!listeners) return
    listeners.delete(listener)
  }

  public clear(type: string): void {
    this.listeners.delete(type)
  }

  public clearAll(): void {
    this.listeners.clear()
  }
}
