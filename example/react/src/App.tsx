import { type FC, Suspense, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router/routes'
import { subApp } from './libs/easy-iframe'

const App: FC = () => {
  useEffect(() => {
    subApp.init()
  }, [])

  return (
    <Suspense fallback={'loading'}>
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true
        }}
      />
    </Suspense>
  )
}

export default App
