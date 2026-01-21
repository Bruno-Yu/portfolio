import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Spinner } from 'flowbite-react'
import { userActions } from '@/store/user-slice'
import store from '@/store/index'

const DefaultLayout = React.lazy(() => import('./layout/Layout.tsx'))

function App() {
  useEffect(() => {
    const savedState = localStorage.getItem('authState')
    if (savedState) {
      try {
        const { user, accessToken, isLogin } = JSON.parse(savedState)
        if (isLogin && user && accessToken) {
          store.dispatch(userActions.login({ user, accessToken }))
        } else if (isLogin) {
          store.dispatch(userActions.setLoginState(true))
        }
      } catch {
        // Invalid state, ignore
      }
    }
  }, [])

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="w-screen h-screen flex flex-col justify-center items-center">
            <Spinner aria-label="Extra large spinner" size="xl" />
          </div>
        }
      >
        <Routes>
          <Route path="*" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
