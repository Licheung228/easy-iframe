import { favoriteStore } from '@/store'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'

const React: FC = observer(() => {
  return (
    <div className={`scale-${favoriteStore.favorite === 'react'}`}>
      <img
        className="w-30 animate-spin animate-duration-2000"
        src="/react.svg"
        alt="reactlogo"
      />
    </div>
  )
})

export default React
