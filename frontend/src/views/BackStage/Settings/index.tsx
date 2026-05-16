import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import AdminPageHead from '@/components/Layout/BackStage/AdminPageHead'
import { meta } from '@/content/portfolio'
import { usePageContent, resetContentCache } from '@/Hooks/usePageContent'
import { getApiBaseUrl } from '@/config'

/* ─── Types ─────────────────────────────────────────────────── */
interface SiteFields {
  'settings.title':    string
  'settings.tagline':  string
  'settings.email':    string
  'settings.location': string
}

type PwStatus = 'idle' | 'submitting' | 'success' | 'error'
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

/* ─── SettingsPage ───────────────────────────────────────────── */
export default function SettingsPage() {
  const user = useSelector((s: RootState) => s.user.user)
  const { get } = usePageContent()

  const [siteFields, setSiteFields] = useState<SiteFields>({
    'settings.title':    get('settings.title',    'en', meta.enName),
    'settings.tagline':  get('settings.tagline',  'en', meta.role.en),
    'settings.email':    get('settings.email',    'en', meta.email),
    'settings.location': get('settings.location', 'en', meta.location.en),
  })

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Refresh fields when content cache loads
  useEffect(() => {
    setSiteFields({
      'settings.title':    get('settings.title',    'en', meta.enName),
      'settings.tagline':  get('settings.tagline',  'en', meta.role.en),
      'settings.email':    get('settings.email',    'en', meta.email),
      'settings.location': get('settings.location', 'en', meta.location.en),
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // runs once after mount; `get` is stable after cache loads

  function handleFieldChange(key: keyof SiteFields, value: string) {
    setSiteFields(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaveStatus('saving')
    const token = getToken()
    if (!token) { setSaveStatus('error'); return }
    try {
      const blocks = (Object.entries(siteFields) as [keyof SiteFields, string][]).flatMap(
        ([key, value]) => [
          { key, lang: 'en', value },
          { key, lang: 'zh', value }, // site meta is lang-neutral; store in both
        ]
      )
      const res = await fetch(`${getApiBaseUrl()}/api/content-blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ blocks }),
      })
      if (!res.ok) throw new Error('save failed')
      resetContentCache()
      setSaveStatus('saved')
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
    }
  }

  /* ── Change-password modal ──────────────────────────────── */
  const [pwModal, setPwModal] = useState(false)
  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew]     = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const [pwStatus, setPwStatus]   = useState<PwStatus>('idle')
  const [pwError, setPwError]     = useState('')

  function openPwModal() {
    setPwCurrent(''); setPwNew(''); setPwConfirm('')
    setPwError(''); setPwStatus('idle')
    setPwModal(true)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (pwNew !== pwConfirm) { setPwError('Passwords do not match'); return }
    setPwStatus('submitting')
    setPwError('')
    const token = getToken()
    if (!token) { setPwError('Not authenticated'); setPwStatus('error'); return }
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
      })
      const d = await res.json() as { success?: boolean; error?: { code?: string; message?: string } }
      if (d.success) {
        setPwStatus('success')
        setTimeout(() => setPwModal(false), 1500)
      } else {
        setPwError(
          d.error?.code === 'INVALID_CREDENTIALS'
            ? 'Current password is incorrect'
            : d.error?.message ?? 'Change failed'
        )
        setPwStatus('error')
      }
    } catch {
      setPwError('Network error — please try again')
      setPwStatus('error')
    }
  }

  return (
    <div>
      <AdminPageHead
        title="Settings"
        description="Site configuration and account management"
      >
        <button
          className="btn btn-solid"
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved ✓' : 'Save'}
        </button>
      </AdminPageHead>

      {saveStatus === 'error' && (
        <div className="admin-toast admin-toast--error" style={{ marginBottom: 24 }}>
          Save failed — check your connection and try again.
        </div>
      )}

      <div className="settings-grid">
        {/* ── Left — Site information ──────────────────── */}
        <div className="panel">
          <div className="panel__head">
            <h3>Site Information</h3>
          </div>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field">
              <label className="field__label">Site title</label>
              <input
                type="text"
                value={siteFields['settings.title']}
                onChange={e => handleFieldChange('settings.title', e.target.value)}
                placeholder={meta.enName}
              />
            </div>
            <div className="field">
              <label className="field__label">Tagline / Role</label>
              <input
                type="text"
                value={siteFields['settings.tagline']}
                onChange={e => handleFieldChange('settings.tagline', e.target.value)}
                placeholder={meta.role.en}
              />
            </div>
            <div className="field">
              <label className="field__label">Contact email</label>
              <input
                type="email"
                value={siteFields['settings.email']}
                onChange={e => handleFieldChange('settings.email', e.target.value)}
                placeholder={meta.email}
              />
            </div>
            <div className="field">
              <label className="field__label">Location</label>
              <input
                type="text"
                value={siteFields['settings.location']}
                onChange={e => handleFieldChange('settings.location', e.target.value)}
                placeholder={meta.location.en}
              />
            </div>
          </div>
        </div>

        {/* ── Right — Account ──────────────────────────── */}
        <div className="panel">
          <div className="panel__head">
            <h3>Account</h3>
          </div>
          <ul className="activity" style={{ padding: '16px 24px', margin: 0 }}>
            <li style={{ display: 'flex', gap: 14, paddingBottom: 14 }}>
              <span className="marker-dot is-y" style={{ marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Username</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, marginTop: 2 }}>{user?.username ?? '—'}</div>
              </div>
            </li>
            <li style={{ display: 'flex', gap: 14, paddingBottom: 14 }}>
              <span className="marker-dot" style={{ marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Role</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, marginTop: 2 }}>{user?.role ?? 'admin'}</div>
              </div>
            </li>
            <li style={{ display: 'flex', gap: 14, paddingBottom: 14 }}>
              <span className="marker-dot" style={{ marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Plan</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, marginTop: 2 }}>BackStage Pro</div>
              </div>
            </li>
            <li style={{ display: 'flex', gap: 14, paddingBottom: 14 }}>
              <span className="marker-dot" style={{ marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Sessions</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, marginTop: 2 }}>1 active</div>
              </div>
            </li>
          </ul>
          <div style={{ padding: '0 24px 20px' }}>
            <button className="btn" onClick={openPwModal}>
              Change password
            </button>
          </div>
        </div>
      </div>

      {/* ── Change-password modal ───────────────────────── */}
      {pwModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setPwModal(false) }}>
          <div className="modal">
            <div className="modal__head">
              <h3>Change Password</h3>
              <button
                className="modal__close"
                onClick={() => setPwModal(false)}
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="modal__body">
                {pwStatus === 'success' && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#15803d' }}>
                    Password updated successfully ✓
                  </div>
                )}
                {pwError && (
                  <div className="field__error" style={{ fontSize: 12 }}>{pwError}</div>
                )}
                <div className="field">
                  <label className="field__label">Current password</label>
                  <input
                    type="password"
                    value={pwCurrent}
                    onChange={e => setPwCurrent(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div className="field">
                  <label className="field__label">New password (min 8 characters)</label>
                  <input
                    type="password"
                    value={pwNew}
                    onChange={e => setPwNew(e.target.value)}
                    minLength={8}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div className="field">
                  <label className="field__label">Confirm new password</label>
                  <input
                    type="password"
                    value={pwConfirm}
                    onChange={e => setPwConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className="modal__foot">
                <button type="button" className="btn" onClick={() => setPwModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-solid"
                  disabled={pwStatus === 'submitting'}
                >
                  {pwStatus === 'submitting' ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('authState')
    if (!raw) return null
    return (JSON.parse(raw) as { accessToken?: string }).accessToken ?? null
  } catch { return null }
}
