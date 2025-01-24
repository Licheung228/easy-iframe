import { makeAutoObservable } from 'mobx'

class FavoriteStore {
  favorite: 'vite' | 'react' = 'vite'

  constructor() {
    console.log('favoriteStore cunstructed')
    makeAutoObservable(this)
  }

  changeFavorite(fav: 'vite' | 'react'): void {
    this.favorite = fav
  }
}

const favoriteStore = new FavoriteStore()

export { favoriteStore }
