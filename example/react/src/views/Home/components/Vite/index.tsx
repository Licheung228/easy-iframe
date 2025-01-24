import type { FC } from 'react'

interface ViteProps extends Partial<Element> {
  onClick?: () => void
}

const Vite: FC<ViteProps> = ({ onClick }) => {
  return (
    <div>
      <img
        onClick={onClick}
        className={`w-30 animate-keyframes-rotate-y animate-duration-2000 animate-count-infinite`}
        src="/vite.svg"
        alt="vitelogo"
      />
    </div>
  )
}

export default Vite
