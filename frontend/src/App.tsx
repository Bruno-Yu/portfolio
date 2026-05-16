import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { userActions } from '@/store/user-slice'
import store from '@/store/index'

// Layouts
const DefaultLayout = React.lazy(() => import('./layout/Layout.tsx'))
const AdminShell    = React.lazy(() => import('./components/Layout/BackStage/AdminShell.tsx'))
const Login         = React.lazy(() => import('./views/FrontStage/Login/index.tsx'))

// Backstage pages
const Overview      = React.lazy(() => import('./views/BackStage/Overview/index.tsx'))
const ContentEditor = React.lazy(() => import('./views/BackStage/Content/index.tsx'))
const AdminWorks    = React.lazy(() => import('./views/BackStage/Works/index.tsx'))
const AdminSkills   = React.lazy(() => import('./views/BackStage/Skills/index.tsx'))
const AdminUsers    = React.lazy(() => import('./views/BackStage/Users/index.tsx'))
const Messages      = React.lazy(() => import('./views/BackStage/Messages/index.tsx'))
const Settings      = React.lazy(() => import('./views/BackStage/Settings/index.tsx'))

const LoadingFallback = () => (
  <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 40, height: 40, border: '2.5px solid var(--ink)', borderTopColor: 'var(--accent-y)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
  </div>
)

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
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ── Full-screen auth route — not wrapped by the public rail ── */}
          <Route path="/login" element={<Login />} />

          {/* ── Backstage — nested routes under AdminShell layout ── */}
          <Route path="/backstage" element={<AdminShell />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview"  element={<Overview />} />
            <Route path="content"   element={<ContentEditor />} />
            <Route path="works"     element={<AdminWorks />} />
            <Route path="skills"    element={<AdminSkills />} />
            <Route path="users"     element={<AdminUsers />} />
            <Route path="messages"  element={<Messages />} />
            <Route path="settings"  element={<Settings />} />
          </Route>

          {/* ── Frontstage + Login + legacy backstage routes ── */}
          <Route path="*" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
