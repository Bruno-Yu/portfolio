import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '@/store/index'
import { home, pick } from '@/content/portfolio'

/** 在特定詞組上套黃色 mark */
function Headline({ text, accent }: { text: string; accent: string }) {
  if (accent && text.includes(accent)) {
    const idx = text.indexOf(accent)
    return (
      <>
        {text.slice(0, idx)}
        <mark className="hero__hl-accent">{accent}</mark>
        {text.slice(idx + accent.length)}
      </>
    )
  }
  return <>{text}</>
}

export default function HeroSection() {
  const lang = useSelector((state: RootState) => state.ui.lang)
  const navigate = useNavigate()

  const headlineText = lang === 'en' ? home.headline.en : home.headline.zh
  const accentWord   = lang === 'en' ? home.headline.accentEn : home.headline.accentZh
  const quickTags    = lang === 'en' ? home.quick.en : home.quick.zh

  function scrollTo(id: string, e: React.MouseEvent) {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="home">

      {/* ── 頂部 meta bar ── */}
      <div className="hero__meta">
        {lang === 'en' ? 'PORTFOLIO · 2026' : '作品集 · 2026'}
      </div>

      {/* ── 主體（照片右浮動，文字繞排） ── */}
      <div className="hero__main">

        {/* 右浮動：照片框 + 黃色裝飾 + 戳章 */}
        <div className="hero__portrait-area" aria-hidden="true">
          <div className="hero__frame hero__frame--1" />
          <div className="hero__portrait">
            <img src="/images/avatar.webp" alt="Bruno Yu" />
          </div>
          <img className="hero__stamp" src="/images/stamp.webp" alt="" />
        </div>

        {/* 文字內容 */}
        <p className="hero__hello">{pick(home.hello, lang)}</p>

        <h1 className="hero__headline" lang={lang === 'zh' ? 'zh-Hant' : 'en'}>
          <Headline text={headlineText} accent={accentWord} />
        </h1>

        <p className="hero__sub" lang={lang === 'zh' ? 'zh-Hant' : 'en'}>
          {pick(home.sub, lang)}
        </p>

        <div className="hero__quick">
          {quickTags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>

        <div className="hero__cta-row">
          <a href="#works" className="btn btn-solid" onClick={(e) => scrollTo('works', e)}>
            {lang === 'en' ? 'SEE MY WORK' : '看我的作品'} →
          </a>
          <a href="#contact" className="btn" onClick={(e) => scrollTo('contact', e)}>
            {lang === 'en' ? 'CONTACT' : '聯繫我'}
          </a>
        </div>
      </div>

      {/* ── 底部三格快速導覽 ── */}
      <div className="hero__navs">
        <a className="hero__nav" href="#about" onClick={(e) => scrollTo('about', e)}>
          <span className="hero__nav-meta">
            MORE · 01
            <span className="hero__nav-arr">→</span>
          </span>
          <p className="hero__nav-title">
            {lang === 'en' ? 'About me' : '關於我'}
          </p>
          <p className="hero__nav-desc">
            {lang === 'en'
              ? 'A quick intro — who I am, what I do.'
              : '我是誰，我在做什麼。'}
          </p>
        </a>

        <a className="hero__nav" href="#works" onClick={(e) => scrollTo('works', e)}>
          <span className="hero__nav-meta">
            MORE · 02
            <span className="hero__nav-arr">→</span>
          </span>
          <p className="hero__nav-title">
            {lang === 'en' ? 'Selected work' : '代表作品'}
          </p>
          <p className="hero__nav-desc">
            {lang === 'en'
              ? 'Side projects and hackathon entries.'
              : '側邊專案與黑客松參賽作品。'}
          </p>
        </a>

        <a className="hero__nav" href="#contact" onClick={(e) => scrollTo('contact', e)}>
          <span className="hero__nav-meta">
            MORE · 03
            <span className="hero__nav-arr">→</span>
          </span>
          <p className="hero__nav-title">
            {lang === 'en' ? 'Get in touch' : '聯絡方式'}
          </p>
          <p className="hero__nav-desc">
            {lang === 'en'
              ? 'Email, GitHub, LinkedIn — pick one.'
              : '電子郵件、GitHub、LinkedIn — 選一個。'}
          </p>
        </a>
      </div>

    </section>
  )
}
