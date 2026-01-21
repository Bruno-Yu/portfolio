// import { Children } from 'react'
import { Route, Routes } from 'react-router-dom'
import { FC } from 'react'
import Menu from '../components/Layout/Ｍenu.tsx'
import Footer from '../components/Layout/Footer.tsx'
import { frontRoutes, backRoutes } from '../routes.ts'
import { useSelector, useDispatch } from 'react-redux'
import FrontStageLayout from '@/components/Layout/FrontStage/index.tsx'
import BackStageLayout from '@/components/Layout/BackStage/index.tsx'

const RouteContent: FC = function ({ isLogin }) {
  const routes = isLogin ? backRoutes : frontRoutes

  return (
    <Routes>
      {routes.map((route, idx) => {
        return (
          route.element && (
            <Route
              key={idx}
              path={route.path}
              exact={route.exact}
              name={route.name}
              element={<route.element />}
            />
          )
        )
      })}
      {/* <Route path="/" element={<Navigate to="home" replace />} /> */}
    </Routes>
  )
}

export default function () {
  const isLogin = useSelector((state) => state.user.isLogin)

  if (isLogin) {
    return (
      <BackStageLayout isFooter={false}>
        <RouteContent isLogin={isLogin} />
      </BackStageLayout>
    )
  } else {
    return (
      <FrontStageLayout>
        <RouteContent isLogin={isLogin} />
      </FrontStageLayout>
    )
  }
}
