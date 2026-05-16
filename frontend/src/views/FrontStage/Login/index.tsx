import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import { useAuth } from '@/store/auth-hook'

export default function LoginPage() {
  const lang = useSelector((state: RootState) => state.ui.lang)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/backstage/overview'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await login(username, password)

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(
        lang === 'en'
          ? result.error || 'Wrong username or password.'
          : result.error || '帳號或密碼錯誤。',
      )
    }

    setLoading(false)
  }

  return (
    <div className="login-shell">
      {/* Left art panel */}
      <aside className="login-shell__art">
        <a
          href="/"
          className="login-shell__brand"
          onClick={(e) => { e.preventDefault(); navigate('/') }}
        >
          Bruno Yu
        </a>

        <img
          src="/images/stamp.webp"
          alt=""
          className="login-shell__art-stamp"
        />

        <div className="login-shell__intro">
          <h1>{lang === 'en' ? 'BackStage' : '後台管理'}</h1>
          <p>
            {lang === 'en'
              ? 'Manage works, skills, messages, analytics, and account settings.'
              : '管理作品、技能、訊息、流量分析與帳號設定。'}
          </p>
        </div>
      </aside>

      {/* Right form panel */}
      <section className="login-shell__form">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card__eyebrow">
            {lang === 'en' ? 'ADMIN ACCESS' : '後台登入'}
          </div>

          <h2>{lang === 'en' ? 'Sign in' : '登入'}</h2>

          <p className="login-card__sub">
            {lang === 'en' ? 'Authorised users only.' : '僅限管理員登入。'}
          </p>

          {error && (
            <div className="login-error">{error}</div>
          )}

          <label className="field">
            <span className="field__label">
              {lang === 'en' ? 'Username' : '帳號'}
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={lang === 'en' ? 'admin' : '請輸入帳號'}
              autoFocus
              required
            />
          </label>

          <label className="field">
            <span className="field__label">
              {lang === 'en' ? 'Password' : '密碼'}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <label className="field field--check">
            <input type="checkbox" defaultChecked />
            <span>{lang === 'en' ? 'Keep me signed in for 7 days' : '保持登入 7 天'}</span>
          </label>

          <button
            className="btn btn-yellow"
            type="submit"
            disabled={loading}
          >
            {loading
              ? (lang === 'en' ? 'Signing in…' : '登入中…')
              : (lang === 'en' ? 'Sign in →' : '登入 →')}
          </button>

          <div className="login-foot">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate('/') }}
            >
              ← {lang === 'en' ? 'Back to site' : '返回首頁'}
            </a>
            <span>{lang === 'en' ? 'Forgot password?' : '忘記密碼？'}</span>
          </div>

          <div className="login-hint">
            {lang === 'en'
              ? 'Use your Cloudflare-backed admin credentials.'
              : '請使用已設定的後台管理員帳密登入。'}
          </div>
        </form>
      </section>
    </div>
  )
}
