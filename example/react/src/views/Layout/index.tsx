import { type FC } from 'react'
import { Outlet, Link } from 'react-router-dom'

const Layout: FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#F8F8FF]">
      <div className="flex justify-evenly py-6">
        <Link className="w-[50%] text-center link" to="/home">
          Home
        </Link>
        <Link className="w-[50%] text-center link" to="/about-me">
          AboutMe
        </Link>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
