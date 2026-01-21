import { Route, Routes } from 'react-router-dom'
import Menu from './Ｍenu.tsx'
import Footer from './Footer.tsx'
import type { FC, PropsWithChildren } from 'react'

const MainContent: FC = function ({ children }) {
  return (
    <div className="container flex flex-col min-h-screen mx-auto min-[992px] max-w-[1296px]">
      <Menu />
      {children}
      <Footer />
    </div>
  )
}

export default MainContent
