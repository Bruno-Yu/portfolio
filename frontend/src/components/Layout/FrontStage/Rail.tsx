import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store/index'
import { setLang, setTheme, type Lang } from '@/store/ui-slice'
import { IoLogoGithub, IoMailOutline, IoLogoLinkedin, IoGlobeOutline } from 'react-icons/io5'
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

export default function Rail() {
  const dispatch = useDispatch<AppDispatch>()
  const { lang, theme } = useSelector((state: RootState) => state.ui)
  const navigate = useNavigate()
  const location = useLocation()

  function handleNavClick(item: NavItem, e: React.MouseEvent) {
    e.preventDefault()
    if (item.isAnchor) {
      // If not on home page, go home first then scroll
      const id = item.href.replace('#', '')
      if (location.pathname !== '/') {
        navigate('/')
        // Small delay for navigation
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }, 120)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(item.href)
    }
  }

  function isActive(item: NavItem): boolean {
    if (item.isAnchor) return false
    if (item.href === '/') return location.pathname === '/'
    return location.pathname.startsWith(item.href)
  }

  return (
    <aside className="rail">
      {/* Brand */}
      <div>
        <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigate('/') }}>
          Bruno Yu
        </a>
        <div className="brand-sub">
          {lang === 'en' ? 'Front-end Developer' : '前端工程師'} · TW
        </div>
      </div>

      {/* Status */}
      <div className="rail__status">
        <span className="rail__dot" />
        {lang === 'en' ? 'Open to work' : '可接案'}
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
      </div>
    </aside>
  )
}
