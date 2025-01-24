import { createHashRouter } from 'react-router-dom'
import Layout from '@/views/Layout'
import About from '@/views/About'
import Home from '@/views/Home'
import { layoutLoader } from './loaders'

const router = createHashRouter(
  [
    {
      path: '/',
      element: <Layout />,
      loader: layoutLoader,
      children: [
        {
          path: '/home',
          element: <Home />
        },
        {
          path: '/about-me',
          element: <About />
        }
      ]
    }
  ],
  {
    future: {
      v7_partialHydration: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true
    }
  }
)

export default router
