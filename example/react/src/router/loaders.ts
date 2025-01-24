import { redirect, type LoaderFunction } from 'react-router'

export const layoutLoader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url)
  if (url.pathname === '/') {
    return redirect('/home')
  }

  return null
}
