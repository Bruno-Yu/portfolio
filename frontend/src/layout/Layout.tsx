// Frontstage layout — wraps all non-backstage routes.
// All /backstage/* routes are now handled by AdminShell in App.tsx.
import { Route, Routes } from 'react-router-dom'
import { FC } from 'react'
import { frontRoutes } from '../routes.ts'
import FrontStageLayout from '@/components/Layout/FrontStage/index.tsx'

const RouteContent: FC = function () {
  return (
    <Routes>
      {frontRoutes.map((route, idx) => (
        route.element && (
          <Route key={idx} path={route.path} element={<route.element />} />
        )
      ))}
    </Routes>
  )
}

export default function () {
  return (
    <FrontStageLayout>
      <RouteContent />
    </FrontStageLayout>
  )
}
