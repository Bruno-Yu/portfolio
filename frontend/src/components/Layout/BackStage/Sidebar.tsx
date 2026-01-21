import { Sidebar } from 'flowbite-react'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { backRoutes } from '@/routes'
import { useAuth } from '@/store/auth-hook'
import { MdWorkspacesOutline, MdPeopleOutline, MdCode, MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { HiUser } from 'react-icons/hi'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MdWorkspacesOutline,
  MdPeopleOutline,
  MdCode,
}

const BackStageSidebar: FC = function () {
  const [currentPage, setCurrentPage] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, canManageUsers } = useAuth()

  useEffect(() => {
    setCurrentPage(window.location.pathname)
  }, [])

  // Filter routes that should appear in sidebar (exclude wildcard routes)
  const menuRoutes = backRoutes.filter(
    (route) => route.path && route.path !== '*' && route.path !== `${import.meta.env.BASE_URL}*`
  )

  return (
    <Sidebar
      aria-label="Sidebar with navigation"
      className={`h-screen ${isCollapsed ? 'w-16' : 'w-64'}`}
      collapsed={isCollapsed}
    >
      <div className="flex h-full flex-col justify-between py-2">
        <div>
          {/* Toggle button */}
          <div className="flex justify-end px-2 mb-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              aria-label={isCollapsed ? '展開側邊欄' : '收合側邊欄'}
            >
              {isCollapsed ? <MdChevronRight className="w-5 h-5" /> : <MdChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* User info */}
          {user && (
            <div className={`px-4 py-2 mb-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
              {isCollapsed ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <HiUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[60px]">
                    {user.username}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.isEnvAdmin ? '環境管理員' : user.role}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Navigation items */}
          <Sidebar.Items className={isCollapsed ? 'px-1' : ''}>
            <Sidebar.ItemGroup>
              {menuRoutes.map((route) => {
                // Check if user can access this route
                const isUsersRoute = route.path?.includes('users')
                if (isUsersRoute && !canManageUsers()) {
                  return null
                }

                const Icon = route.icon ? iconMap[route.icon] || MdWorkspacesOutline : MdWorkspacesOutline

                return (
                  <NavLink
                    key={route.path}
                    to={route.path || '#'}
                    className={({ isActive }) =>
                      `flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive || currentPage.startsWith(route.path || '')
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      } ${isCollapsed ? 'justify-center' : 'gap-x-3'}`
                    }
                    title={isCollapsed ? route.title : undefined}
                  >
                    <Icon className="text-lg flex-shrink-0" />
                    {!isCollapsed && <span>{route.title}</span>}
                  </NavLink>
                )
              })}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
  )
}

export default BackStageSidebar
