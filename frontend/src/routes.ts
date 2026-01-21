import React from 'react'

const Home = React.lazy(() => import('./views/FrontStage/Home/index'))
const Works = React.lazy(() => import('./views/FrontStage/Works/index'))
const Login = React.lazy(() => import('./views/FrontStage/Login/index'))
const Contents = React.lazy(() => import('./views/BackStage/Works/index'))
const Users = React.lazy(() => import('./views/BackStage/Users/index'))
const Skills = React.lazy(() => import('./views/BackStage/Skills/index'))

const BASE_URL = import.meta.env.BASE_URL

// FrontStage routes (public routes for visitors)
export const frontRoutes = [
  {
    path: BASE_URL,
    key: 'home',
    name: 'Home',
    element: Home,
    title: '首頁',
  },
  {
    path: `${BASE_URL}works`,
    key: 'works',
    name: 'Works',
    element: Works,
    title: '作品集',
  },
  {
    path: `${BASE_URL}login`,
    key: 'login',
    name: 'Login',
    element: Login,
    title: '登入',
  },
  // Fallback to Home for unmatched frontstage routes
  {
    path: '*',
    key: 'front-fallback',
    element: Home,
  },
]

// BackStage routes (protected routes for admin)
export const backRoutes = [
  {
    path: `${BASE_URL}contents`,
    key: 'contents',
    name: 'Contents',
    element: Contents,
    title: '作品管理',
    icon: 'MdWorkspacesOutline',
  },
  {
    path: `${BASE_URL}skills`,
    key: 'skills',
    name: 'Skills',
    element: Skills,
    title: '技能管理',
    icon: 'MdCode',
  },
  {
    path: `${BASE_URL}users`,
    key: 'users',
    name: 'Users',
    element: Users,
    title: '用戶管理',
    icon: 'MdPeopleOutline',
  },
  // Fallback to contents for unmatched backstage routes
  {
    path: '*',
    key: 'back-fallback',
    element: Contents,
    icon: 'MdWorkspacesOutline',
  },
]

export { Home, Works, Login, Contents, Users, Skills }
