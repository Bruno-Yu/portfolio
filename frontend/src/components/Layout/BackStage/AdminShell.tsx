import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/index'
import { userActions } from '@/store/user-slice'
import { setLang, toggleTheme } from '@/store/ui-slice'
import type { Lang } from '@/store/ui-slice'
import { getApiBaseUrl } from '@/config'

/* ─── JWT decode (no library) ─────────────────────────────── */
function getTokenPayload(token: string): { exp?: number } | null {
  try {
    const [, b64] = token.split('.')
    const json = atob(b64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json) as { exp?: number }
  } catch {
    return null
  }
}

/* ─── Inline SVG icons ─────────────────────────────────────── */
const IcoOverview = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
)
const IcoContent = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const IcoWorks = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
)
const IcoSkills = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
)
const IcoUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IcoMessages = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
const IcoSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)
const IcoLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const IcoSun = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)
const IcoMoon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)
const IcoGlobe = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

/* ─── Nav items ─────────────────────────────────────────────── */
const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? ''

interface NavItem {
  key: string
  label: string
  path: string
  Ico: () => JSX.Element
  group: 'main' | 'manage' | 'system'
  showBadge?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { key: 'overview',  label: 'Overview',  path: `${BASE}/backstage/overview`,  Ico: IcoOverview, group: 'main' },
  { key: 'content',   label: 'Content',   path: `${BASE}/backstage/content`,   Ico: IcoContent, group: 'manage' },
  { key: 'works',     label: 'Works',     path: `${BASE}/backstage/works`,     Ico: IcoWorks, group: 'manage', showBadge: true },
  { key: 'skills',    label: 'Skills',    path: `${BASE}/backstage/skills`,    Ico: IcoSkills, group: 'manage' },
  { key: 'users',     label: 'Users',     path: `${BASE}/backstage/users`,     Ico: IcoUsers, group: 'manage' },
  { key: 'messages',  label: 'Messages',  path: `${BASE}/backstage/messages`,  Ico: IcoMessages, group: 'manage' },
  { key: 'settings',  label: 'Settings',  path: `${BASE}/backstage/settings`,  Ico: IcoSettings, group: 'system' },
]

const NAV_GROUPS: Array<{ key: NavItem['group']; label: { en: string; zh: string } }> = [
  { key: 'main', label: { en: 'DASHBOARD', zh: '儀表板' } },
  { key: 'manage', label: { en: 'MANAGE', zh: '管理' } },
  { key: 'system', label: { en: 'SYSTEM', zh: '系統' } },
]

/* ─── AdminShell ─────────────────────────────────────────────── */
export default function AdminShell() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const dispatch  = useDispatch()

  const user  = useSelector((s: RootState) => s.user.user)
  const lang  = useSelector((s: RootState) => s.ui.lang)
  const theme = useSelector((s: RootState) => s.ui.theme)

  const [worksCount, setWorksCount] = useState<number | null>(null)

  /* ── Auth guard ─────────────────────────────────────────── */
  useEffect(() => {
    const raw = localStorage.getItem('authState')
    if (!raw) { navigate('/login', { replace: true }); return }
    try {
      const { accessToken, isLogin } = JSON.parse(raw) as { accessToken?: string; isLogin?: boolean }
      if (!isLogin || !accessToken) { navigate('/login', { replace: true }); return }
      const payload = getTokenPayload(accessToken)
      if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
        dispatch(userActions.logout())
        navigate('/login', { replace: true })
      }
    } catch {
      navigate('/login', { replace: true })
    }
  }, [navigate, dispatch])

  /* ── Works count for sidebar badge ──────────────────────── */
  useEffect(() => {
    const raw = localStorage.getItem('authState')
    if (!raw) return
    try {
      const { accessToken } = JSON.parse(raw) as { accessToken?: string }
      if (!accessToken) return
      fetch(`${getApiBaseUrl()}/api/works`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then(r => r.json())
        .then((d: { success?: boolean; data?: unknown[] }) => {
          if (d.success && Array.isArray(d.data)) setWorksCount(d.data.length)
        })
        .catch(() => { /* silent */ })
    } catch { /* ignore */ }
  }, [])

  /* ── Breadcrumb ─────────────────────────────────────────── */
  const parts = location.pathname.split('/').filter(Boolean)
  const segment = parts[parts.length - 1] ?? 'overview'
  const breadcrumb = segment.toUpperCase()

  /* ── Handlers ───────────────────────────────────────────── */
  function handleLogout() {
    dispatch(userActions.logout())
    navigate('/login', { replace: true })
  }

  /* ── Avatar initials ─────────────────────────────────────── */
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'A'

  return (
    <div className="admin-shell">
      {/* ═══ Sidebar ═══════════════════════════════════════════ */}
      <aside className="admin-side">

        {/* Brand */}
        <div className="admin-side__brand">
          <a href="/" className="name">Bruno Yu</a>
          <div className="role">BackStage</div>
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {NAV_GROUPS.map((group) => (
            <div className="admin-nav__section" key={group.key}>
              <div className="admin-nav__group">{lang === 'en' ? group.label.en : group.label.zh}</div>
              {NAV_ITEMS.filter((item) => item.group === group.key).map(({ key, label, path, Ico, showBadge }) => {
                const isActive = location.pathname === path ||
                  location.pathname.startsWith(path + '/')
                return (
                  <NavLink
                    key={key}
                    to={path}
                    className={`admin-nav__item${isActive ? ' is-active' : ''}`}
                  >
                    <span className="icn"><Ico /></span>
                    <span>{label}</span>
                    {showBadge && worksCount !== null && (
                      <span className="badge">{String(worksCount).padStart(2, '0')}</span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer — user info + logout */}
        <div className="admin-side__foot">
          <div className="admin-user">
            <div className="admin-user__avatar">{initials}</div>
            <div>
              <div className="admin-user__name">{user?.username ?? 'Admin'}</div>
              <div className="admin-user__role">{user?.role ?? 'admin'}</div>
            </div>
          </div>
          <button className="logout" onClick={handleLogout}>
            <IcoLogout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ═══ Main area ══════════════════════════════════════════ */}
      <div className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-crumbs">
            <span>BACKSTAGE</span>
            <span className="sep">/</span>
            <span className="crumb-active">{breadcrumb}</span>
          </div>

          <div className="admin-topbar__actions">
            <input
              className="admin-search"
              type="search"
              placeholder={lang === 'en' ? 'Search...' : '搜尋...'}
              aria-label="Search"
            />

            {/* Lang toggle */}
            <div className="seg" role="group" aria-label="Language">
              <button
                className={lang === 'zh' ? 'is-active' : ''}
                onClick={() => dispatch(setLang('zh' as Lang))}
              >ZH</button>
              <button
                className={lang === 'en' ? 'is-active' : ''}
                onClick={() => dispatch(setLang('en' as Lang))}
              >EN</button>
            </div>

            {/* Theme toggle */}
            <button
              className="icon-btn"
              onClick={() => dispatch(toggleTheme())}
              title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <IcoSun /> : <IcoMoon />}
            </button>

            {/* View site */}
            <a className="admin-view-site" href="/" target="_blank" rel="noreferrer">
              <IcoGlobe />
              <span>View site</span>
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
