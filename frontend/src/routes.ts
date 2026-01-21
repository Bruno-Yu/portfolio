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
    exact: true,
    key: 'home',
    name: 'Home',
    element: Home,
    title: '首頁',
  },
  {
    path: `${BASE_URL}works`,
    exact: true,
    key: 'works',
    name: 'Works',
    element: Works,
    title: '作品集',
  },
  {
    path: 'https://bruno-yu.github.io/bruno_blog/',
    exact: true,
    key: 'blog',
    name: 'Blog',
    element: Home,
    title: '部落格',
  },
  {
    path: `${BASE_URL}login`,
    exact: true,
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
    exact: true,
    key: 'contents',
    name: 'Contents',
    element: Contents,
    title: '作品管理',
    icon: 'MdWorkspacesOutline',
  },
  {
    path: `${BASE_URL}skills`,
    exact: true,
    key: 'skills',
    name: 'Skills',
    element: Skills,
    title: '技能管理',
    icon: 'MdCode',
  },
  {
    path: `${BASE_URL}users`,
    exact: true,
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
