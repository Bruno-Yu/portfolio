import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store/index'
import { setLang, setTheme, type Lang } from '@/store/ui-slice'
import { IoArrowForward, IoGlobeOutline, IoLogoGithub, IoLogoLinkedin, IoMailOutline } from 'react-icons/io5'
import { meta } from '@/content/portfolio'

interface NavItem {
  label: { en: string; zh: string }
  num: string
  href: string
  isAnchor?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: { en: 'Home', zh: '首頁' }, num: '01', href: '/' },
  { label: { en: 'Works', zh: '作品' }, num: '02', href: '/works' },
  { label: { en: 'About', zh: '關於' }, num: '03', href: '#about', isAnchor: true },
  { label: { en: 'Contact', zh: '聯繫' }, num: '04', href: '#contact', isAnchor: true },
]

function hasValidSession(): boolean {
  try {
    const raw = localStorage.getItem('authState')
    if (!raw) return false
    const { accessToken, isLogin } = JSON.parse(raw) as { accessToken?: string; isLogin?: boolean }
    if (!isLogin || !accessToken) return false

    const [, payload] = accessToken.split('.')
    if (!payload) return false
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number }
    return !json.exp || json.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export default function Rail() {
  const dispatch = useDispatch<AppDispatch>()
  const { lang, theme, activeSection } = useSelector((state: RootState) => state.ui)
  const navigate = useNavigate()
  const location = useLocation()

  function handleNavClick(item: NavItem, e: React.MouseEvent) {
    e.preventDefault()
    if (item.isAnchor) {
      const id = item.href.replace('#', '')
      if (location.pathname !== '/') {
        navigate('/')
        // Wait for React Router + DOM render before scrolling
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      if (item.href === '/' && location.pathname === '/') {
        // Already on home — scroll back to very top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate(item.href)
      }
    }
  }

  function isActive(item: NavItem): boolean {
    if (location.pathname !== '/') {
      // On non-home pages, match by pathname only
      if (item.href === '/') return false
      return location.pathname.startsWith(item.href)
    }
    // On home page: anchor items use scroll-spy activeSection
    if (item.isAnchor) return activeSection === item.href
    // Home item is active when no anchor section is active
    if (item.href === '/') return !activeSection || activeSection === '/'
    return false
  }

  return (
    <aside className="rail">
      {/* Brand */}
      <div>
        <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigate('/') }}>
          Bruno Yu
        </a>
        <div className="brand-sub">
          {lang === 'en' ? 'Frontend / Full-stack Engineer' : '前端/全端工程師'}
        </div>
      </div>

      {/* Status */}
      <div className="rail__status">
        <span className="rail__dot" />
        {lang === 'en' ? 'Open to conversations' : '歡迎聯繫'}
      </div>

      {/* Navigation */}
      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.num}
            href={item.href}
            className={`nav__item${isActive(item) ? ' is-active' : ''}`}
            onClick={(e) => handleNavClick(item, e)}
          >
            <span>{lang === 'en' ? item.label.en : item.label.zh}</span>
            <span className="num">{item.num}</span>
          </a>
        ))}
      </nav>

      {/* Bottom */}
      <div className="rail__bottom">
        {/* Socials */}
        <div className="socials">
          <a
            className="social"
            href={meta.github}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <IoLogoGithub />
          </a>
          <a
            className="social"
            href={meta.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
          >
            <IoLogoLinkedin />
          </a>
          <a className="social" href={`mailto:${meta.email}`} title="Email">
            <IoMailOutline />
          </a>
          <a
            className="social"
            href={meta.blog}
            target="_blank"
            rel="noopener noreferrer"
            title="Blog"
          >
            <IoGlobeOutline />
          </a>
        </div>

        {/* Lang / Theme toggles */}
        <div className="tools-row">
          <button
            className={`tool${lang === 'en' ? ' is-active' : ''}`}
            onClick={() => dispatch(setLang('en' as Lang))}
          >
            EN
          </button>
          <button
            className={`tool${lang === 'zh' ? ' is-active' : ''}`}
            onClick={() => dispatch(setLang('zh' as Lang))}
          >
            中
          </button>
          <button
            className="tool"
            onClick={() => dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))}
            title="Toggle theme"
          >
            {theme === 'light' ? '◐' : '○'}
          </button>
        </div>

        {/* Footer meta */}
        <div className="foot-meta">
          © 2026 Bruno Yu
          <br />
          {lang === 'en' ? 'Tainan, Taiwan' : '台南，台灣'}
        </div>

        <a
          href="/login"
          className="rail__backstage"
          title="BackStage"
          onClick={(e) => {
            e.preventDefault()
            navigate(hasValidSession() ? '/backstage/overview' : '/login')
          }}
        >
          <IoArrowForward />
          <span>{lang === 'en' ? 'BackStage' : '後台'}</span>
        </a>
      </div>
    </aside>
  )
}
