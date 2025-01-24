import { type FC } from 'react'

const Lic: FC<{ favorite: string }> = ({ favorite }) => {
  return (
    <div className="animate-keyframes-bounce-in animate-duration-1000 animate-count-1 flex-center flex-col">
      <img className="w-30" src="/lic.svg" alt="liclogo" />
      <p className="text-8xl mt6">{favorite.toUpperCase()}</p>
    </div>
  )
}

export default Lic
