import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import AdminPageHead from '@/components/Layout/BackStage/AdminPageHead'
import { home, about, experience as staticExperience } from '@/content/portfolio'
import { getApiBaseUrl } from '@/config'
import { resetContentCache } from '@/Hooks/usePageContent'
import type { ApiExpItem } from '@/Hooks/useExperiences'

/* ─── Types ─────────────────────────────────────────────────── */
type Lang = 'en' | 'zh'

interface ContentFields {
  'hero.greeting': { en: string; zh: string }
  'hero.headline': { en: string; zh: string }
  'hero.sub':      { en: string; zh: string }
  'about.paragraphs': { en: string; zh: string }
}

interface ExpRow extends Partial<ApiExpItem> {
  _localId: string          // temp id for new (unsaved) rows
  _dirty: boolean
  _deleted: boolean
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

/* ─── Helpers ───────────────────────────────────────────────── */
function uid() { return Math.random().toString(36).slice(2) }

function toList(value: string[] | string | null | undefined): string[] {
  if (Array.isArray(value)) return value.map(item => item.trim()).filter(Boolean)
  if (!value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string').map(item => item.trim()).filter(Boolean)
    }
  } catch {
    // plain textarea/csv fallback below
  }
  return value.split(/\n|,/).map(item => item.trim()).filter(Boolean)
}

function listToTextarea(value: string[] | string | null | undefined): string {
  return toList(value).join('\n')
}

function listToCsv(value: string[] | string | null | undefined): string {
  return toList(value).join(', ')
}

function staticToExpRow(item: typeof staticExperience[0], idx: number): ExpRow {
  const [fromYear, toYear] = item.period.split(' → ')
  return {
    _localId: `static-${idx}`,
    _dirty: false,
    _deleted: false,
    id: undefined,
    sortOrder: idx,
    fromYear: fromYear?.trim() ?? '',
    toYear: toYear?.trim() === 'Now' ? null : (toYear?.trim() ?? null),
    roleEn: item.role.en,
    roleZh: item.role.zh,
    orgEn: item.company.en,
    orgZh: item.company.zh,
    location: item.location,
    tags: item.stack,
    bulletsEn: item.bullets.en,
    bulletsZh: item.bullets.zh,
    noteEn: item.bullets.en.join('\n'),
    noteZh: item.bullets.zh.join('\n'),
  }
}

function apiToExpRow(item: ApiExpItem): ExpRow {
  return {
    ...item,
    tags: toList(item.tags),
    bulletsEn: toList(item.bulletsEn ?? item.noteEn),
    bulletsZh: toList(item.bulletsZh ?? item.noteZh),
    _localId: String(item.id),
    _dirty: false,
    _deleted: false,
  }
}

/* ─── ContentPage ─────────────────────────────────────────────── */
export default function ContentPage() {
  const globalLang = useSelector((s: RootState) => s.ui.lang)
  // Local lang toggle — does NOT change public site language
  const [lang, setLang] = useState<Lang>(globalLang)

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Content block state ──────────────────────────────────── */
  const [fields, setFields] = useState<ContentFields>({
    'hero.greeting':    { en: home.hello.en,    zh: home.hello.zh },
    'hero.headline':    { en: home.headline.en, zh: home.headline.zh },
    'hero.sub':         { en: home.sub.en,      zh: home.sub.zh },
    'about.paragraphs': {
      en: about.paragraphs.en.join('\n\n'),
      zh: about.paragraphs.zh.join('\n\n'),
    },
  })
  const [originalFields, setOriginalFields] = useState<ContentFields>(fields)

  /* ── Experience rows state ────────────────────────────────── */
  const [expRows, setExpRows] = useState<ExpRow[]>([])
  const [originalExpRows, setOriginalExpRows] = useState<ExpRow[]>([])

  /* ── Load data on mount ───────────────────────────────────── */
  useEffect(() => {
    const token = getToken()

    // 1. Fetch content blocks
    fetch(`${getApiBaseUrl()}/api/content-blocks`)
      .then(r => r.json())
      .then((d: { success?: boolean; data?: Record<string, string> }) => {
        if (d.success && d.data) {
          setFields(prev => {
            const next = { ...prev }
            for (const key of Object.keys(next) as Array<keyof ContentFields>) {
              const enVal = d.data![`${key}.en`]
              const zhVal = d.data![`${key}.zh`]
              if (enVal !== undefined || zhVal !== undefined) {
                next[key] = {
                  en: enVal !== undefined ? enVal : prev[key].en,
                  zh: zhVal !== undefined ? zhVal : prev[key].zh,
                }
              }
            }
            setOriginalFields(next)
            return next
          })
        }
      })
      .catch(() => { /* keep defaults */ })

    // 2. Fetch experiences
    fetch(`${getApiBaseUrl()}/api/experiences`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then((d: { success?: boolean; data?: ApiExpItem[] }) => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          const rows = d.data.map(apiToExpRow)
          setExpRows(rows)
          setOriginalExpRows(rows)
        } else {
          const rows = staticExperience.map(staticToExpRow)
          setExpRows(rows)
          setOriginalExpRows(rows)
        }
      })
      .catch(() => {
        const rows = staticExperience.map(staticToExpRow)
        setExpRows(rows)
        setOriginalExpRows(rows)
      })
  }, [])

  /* ── Field change handler ─────────────────────────────────── */
  function handleFieldChange(key: keyof ContentFields, value: string) {
    setFields(prev => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }))
  }

  /* ── Experience row handlers ──────────────────────────────── */
  function handleExpChange(localId: string, field: keyof ApiExpItem, value: string | null) {
    setExpRows(rows => rows.map(r =>
      r._localId === localId ? { ...r, [field]: value, _dirty: true } : r
    ))
  }

  function handleExpTagsChange(localId: string, value: string) {
    setExpRows(rows => rows.map(r =>
      r._localId === localId ? { ...r, tags: toList(value), _dirty: true } : r
    ))
  }

  function handleExpBulletsChange(localId: string, field: 'bulletsEn' | 'bulletsZh', value: string) {
    setExpRows(rows => rows.map(r =>
      r._localId === localId ? { ...r, [field]: toList(value), _dirty: true } : r
    ))
  }

  function addExpRow() {
    const newRow: ExpRow = {
      _localId: `new-${uid()}`,
      _dirty: true,
      _deleted: false,
      sortOrder: expRows.filter(r => !r._deleted).length,
      fromYear: '',
      toYear: null,
      roleEn: '', roleZh: '',
      orgEn: '',  orgZh: '',
      location: '',
      tags: [],
      bulletsEn: [],
      bulletsZh: [],
      noteEn: '', noteZh: '',
    }
    setExpRows(prev => [...prev, newRow])
  }

  function deleteExpRow(localId: string) {
    setExpRows(rows => rows.map(r =>
      r._localId === localId ? { ...r, _deleted: true, _dirty: true } : r
    ))
  }

  /* ── Reset ────────────────────────────────────────────────── */
  function handleReset() {
    setFields(originalFields)
    setExpRows(originalExpRows)
    setSaveStatus('idle')
  }

  /* ── Save ─────────────────────────────────────────────────── */
  async function handleSave() {
    setSaveStatus('saving')
    const token = getToken()
    if (!token) { setSaveStatus('error'); return }

    try {
      // 1. Save content blocks
      const blocks = (Object.entries(fields) as Array<[keyof ContentFields, { en: string; zh: string }]>).flatMap(
        ([key, val]) => [
          { key, lang: 'en', value: val.en },
          { key, lang: 'zh', value: val.zh },
        ]
      )
      const cbRes = await fetch(`${getApiBaseUrl()}/api/content-blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ blocks }),
      })
      if (!cbRes.ok) throw new Error('content-blocks save failed')

      // 2. Save experience rows
      for (const row of expRows) {
        if (!row._dirty) continue
        if (row._deleted && row.id) {
          await fetch(`${getApiBaseUrl()}/api/experiences/${row.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        } else if (!row._deleted) {
          const body = {
            fromYear: row.fromYear ?? '',
            toYear: row.toYear ?? null,
            roleEn: row.roleEn ?? null, roleZh: row.roleZh ?? null,
            orgEn: row.orgEn ?? null,   orgZh: row.orgZh ?? null,
            location: row.location ?? null,
            tags: toList(row.tags),
            bulletsEn: toList(row.bulletsEn ?? row.noteEn),
            bulletsZh: toList(row.bulletsZh ?? row.noteZh),
            noteEn: toList(row.bulletsEn ?? row.noteEn).join('\n') || null,
            noteZh: toList(row.bulletsZh ?? row.noteZh).join('\n') || null,
            sortOrder: row.sortOrder ?? 0,
          }
          if (row.id) {
            await fetch(`${getApiBaseUrl()}/api/experiences/${row.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify(body),
            })
          } else {
            const res = await fetch(`${getApiBaseUrl()}/api/experiences`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify(body),
            })
            const saved = await res.json() as { success?: boolean; data?: ApiExpItem }
            if (saved.success && saved.data) {
              setExpRows(prev => prev.map(r =>
                r._localId === row._localId
                  ? { ...r, id: saved.data!.id, _dirty: false }
                  : r
              ))
            }
          }
        }
      }

      // Mark all rows clean, remove deleted
      setExpRows(prev => prev.filter(r => !r._deleted).map(r => ({ ...r, _dirty: false })))
      setOriginalFields(fields)

      // Reset content-blocks cache so frontstage picks up new values
      resetContentCache()

      setSaveStatus('saved')
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
    }
  }

  const visibleRows = expRows.filter(r => !r._deleted)

  return (
    <div>
      <AdminPageHead
        title="Content"
        description="Edit the bilingual text displayed on your portfolio site"
      >
        {/* Lang toggle inside page head right slot */}
        <div className="seg" role="group" aria-label="Edit language">
          <button className={lang === 'zh' ? 'is-active' : ''} onClick={() => setLang('zh')}>ZH</button>
          <button className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
      </AdminPageHead>

      {/* ─── Section 01 — Hero / Homepage ──────────────────── */}
      <div className="editor-section">
        <div className="editor-section__head">
          <span className="editor-section__num">01</span>
          <span className="editor-section__title">Hero / Homepage</span>
        </div>
        <div className="editor-section__body editor-grid">
          <div className="field">
            <label className="field__label">Greeting line</label>
            <input
              type="text"
              value={fields['hero.greeting'][lang]}
              onChange={e => handleFieldChange('hero.greeting', e.target.value)}
              placeholder={lang === 'en' ? home.hello.en : home.hello.zh}
            />
          </div>
          <div className="field">
            <label className="field__label">Headline</label>
            <textarea
              value={fields['hero.headline'][lang]}
              onChange={e => handleFieldChange('hero.headline', e.target.value)}
              placeholder={lang === 'en' ? home.headline.en : home.headline.zh}
            />
          </div>
          <div className="field">
            <label className="field__label">Sub-headline</label>
            <textarea
              value={fields['hero.sub'][lang]}
              onChange={e => handleFieldChange('hero.sub', e.target.value)}
              placeholder={lang === 'en' ? home.sub.en : home.sub.zh}
            />
          </div>
        </div>
      </div>

      {/* ─── Section 02 — About ─────────────────────────────── */}
      <div className="editor-section">
        <div className="editor-section__head">
          <span className="editor-section__num">02</span>
          <span className="editor-section__title">About</span>
        </div>
        <div className="editor-section__body">
          <div className="field">
            <label className="field__label">About paragraphs (separate with blank line)</label>
            <textarea
              style={{ minHeight: 180 }}
              value={fields['about.paragraphs'][lang]}
              onChange={e => handleFieldChange('about.paragraphs', e.target.value)}
              placeholder={about.paragraphs[lang].join('\n\n')}
            />
          </div>
        </div>
      </div>

      {/* ─── Section 03 — Work Experience ───────────────────── */}
      <div className="editor-section">
        <div className="editor-section__head">
          <span className="editor-section__num">03</span>
          <span className="editor-section__title">Work Experience</span>
        </div>
        <div className="editor-section__body">
          {visibleRows.map((row) => (
            <div key={row._localId} className="experience-row">
              <div className="experience-row__header">
                <div className="field-row" style={{ flex: 1 }}>
                  <div className="field" style={{ width: 80 }}>
                    <label className="field__label">From</label>
                    <input
                      type="text"
                      value={row.fromYear ?? ''}
                      onChange={e => handleExpChange(row._localId, 'fromYear', e.target.value)}
                      placeholder="2022"
                    />
                  </div>
                  <div className="field" style={{ width: 80 }}>
                    <label className="field__label">To</label>
                    <input
                      type="text"
                      value={row.toYear ?? ''}
                      onChange={e => handleExpChange(row._localId, 'toYear', e.target.value)}
                      placeholder="Now"
                    />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label className="field__label">Role ({lang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={(lang === 'en' ? row.roleEn : row.roleZh) ?? ''}
                      onChange={e => handleExpChange(row._localId, lang === 'en' ? 'roleEn' : 'roleZh', e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label className="field__label">Organisation ({lang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={(lang === 'en' ? row.orgEn : row.orgZh) ?? ''}
                      onChange={e => handleExpChange(row._localId, lang === 'en' ? 'orgEn' : 'orgZh', e.target.value)}
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label className="field__label">Location</label>
                    <input
                      type="text"
                      value={row.location ?? ''}
                      onChange={e => handleExpChange(row._localId, 'location', e.target.value)}
                      placeholder="Tainan, TW"
                    />
                  </div>
                </div>
                <button
                  className="icon-btn danger"
                  onClick={() => deleteExpRow(row._localId)}
                  title="Delete entry"
                  aria-label="Delete"
                  style={{ marginTop: 22 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
              <div className="field">
                <label className="field__label">Tags / keywords</label>
                <input
                  type="text"
                  value={listToCsv(row.tags)}
                  onChange={e => handleExpTagsChange(row._localId, e.target.value)}
                  placeholder="Vue 3, Nuxt 3, TypeScript"
                />
              </div>
              <div className="field">
                <label className="field__label">Bullet points ({lang.toUpperCase()}, one per line)</label>
                <textarea
                  value={lang === 'en' ? listToTextarea(row.bulletsEn ?? row.noteEn) : listToTextarea(row.bulletsZh ?? row.noteZh)}
                  onChange={e => handleExpBulletsChange(row._localId, lang === 'en' ? 'bulletsEn' : 'bulletsZh', e.target.value)}
                  placeholder="Key contributions and highlights…"
                />
              </div>
            </div>
          ))}

          <button className="btn" onClick={addExpRow} style={{ marginTop: 12 }}>
            + Add experience
          </button>
        </div>
      </div>

      {/* ─── Sticky save bar ────────────────────────────────── */}
      <div className="save-bar">
        <div className="left">
          {saveStatus === 'saved' && (
            <span className="saved-flag">Saved</span>
          )}
          {saveStatus === 'error' && (
            <span className="save-error">Save failed — check connection</span>
          )}
          {saveStatus === 'saving' && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
              Saving…
            </span>
          )}
        </div>
        <div className="right">
          <button className="reset-link" onClick={handleReset}>
            Reset
          </button>
          <button
            className="btn btn-solid"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Token helper ───────────────────────────────────────────── */
function getToken(): string | null {
  try {
    const raw = localStorage.getItem('authState')
    if (!raw) return null
    return (JSON.parse(raw) as { accessToken?: string }).accessToken ?? null
  } catch {
    return null
  }
}
