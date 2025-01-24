import { makeObservable, action, observable } from 'mobx'

class CountStore {
  count: number = 0
  constructor() {
    console.log('countStore cunstructed')
    makeObservable(this, {
      count: observable,
      increment: action
    })
  }

  increment(): void {
    this.count++
  }
}

const countStore = new CountStore()

export { countStore }
