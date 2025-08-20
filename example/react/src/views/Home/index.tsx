import { observer } from 'mobx-react-lite'
import { useEffect, type FC } from 'react'
import Lic from '@/components/Lic'
import { favoriteStore } from '@/store'
import React from './components/React'
import Vite from './components/Vite'
import { subApp } from '@/libs/easy-iframe'

const Button: FC<{ target: 'vite' | 'react'; disabled: boolean }> = ({
  target,
  disabled,
}) => {
  return (
    <button
      className="btn"
      disabled={disabled}
      onClick={() => {
        favoriteStore.changeFavorite(target)
      }}
    >
      choose {target.toUpperCase()}
    </button>
  )
}

const Home: FC = observer(() => {
  useEffect(() => {
    const handler = () => {
      favoriteStore.changeFavorite(
        favoriteStore.favorite === 'vite' ? 'react' : 'vite',
      )
    }
    subApp.on('switch', handler)
    return () => subApp.off('switch', handler)
  }, [])

  return (
    <div
      className={
        'flex items-center h-full relative w-full justify-around text-center'
      }
    >
      <div
        className={`
          flex-1 flex-center flex-col gap-10 
          animate-count-1 animate-duration-1000 
          ${favoriteStore.favorite === 'vite' ? 'animate-keyframes-bounce-alt' : ''}
        `}
      >
        <Vite />
        <Button
          target="vite"
          disabled={favoriteStore.favorite === 'vite'}
        />
      </div>
      <div
        className={`
          flex-1 flex-center flex-col gap-10 
          animate-count-1 animate-duration-1000 
          ${favoriteStore.favorite === 'react' ? 'animate-keyframes-bounce-alt' : ''}
        `}
      >
        <React />
        <Button
          target="react"
          disabled={favoriteStore.favorite === 'react'}
        />
      </div>
      <div className="absolute translate-x-[50%] right-[50%] top-[10%]">
        <Lic favorite={favoriteStore.favorite} />
      </div>
    </div>
  )
})

export default Home
