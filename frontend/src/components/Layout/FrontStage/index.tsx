import type { FC, PropsWithChildren } from 'react'
import Rail from './Rail'

const FrontStageLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <div className="shell">
      <Rail />
      <main className="main">
        {children}
      </main>
    </div>
  )
}

export default FrontStageLayout
