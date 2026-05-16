import type { FC } from 'react'
import { useState, useEffect } from 'react'
import AdminPageHead from '@/components/Layout/BackStage/AdminPageHead'
import { useAuth } from '@/store/auth-hook'
import apiService from '@/api/request'

/* ─── Types ─────────────────────────────────────────────────── */
interface Skill {
  id: number
  title: string
  icon: string
  details: string | string[]
  order: number
}

function parseDetails(details: string | string[] | undefined): string[] {
  if (!details) return []
  if (Array.isArray(details)) return details
  try { return JSON.parse(details) } catch { return [] }
}

/* ─── SkillModal ─────────────────────────────────────────────── */
interface SkillModalProps {
  mode: 'add' | 'edit'
  skill?: Skill
  onClose: () => void
  onSaved: () => void
}
const SkillModal: FC<SkillModalProps> = ({ mode, skill, onClose, onSaved }) => {
  const [title, setTitle]   = useState(skill?.title ?? '')
  const [icon, setIcon]     = useState(skill?.icon ?? 'price-item-visual')
  const [details, setDetails] = useState(() => parseDetails(skill?.details).join(', '))
  const [order, setOrder]   = useState(String(skill?.order ?? 0))
  const [error, setError]   = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const detailsArr = details.split(',').map(d => d.trim()).filter(Boolean)
    const payload = { title, icon, details: detailsArr, order: parseInt(order) || 0 }
    try {
      const d = mode === 'add'
        ? await apiService.post('/api/skills', payload)
        : await apiService.request({ url: `/api/skills/${skill!.id}`, method: 'PUT', data: payload })
      if (d.success) { onSaved(); onClose() }
      else setError(`Failed to ${mode} skill`)
    } catch { setError('Network error') }
  }

  async function handleDelete() {
    if (!confirm('Delete this skill group?')) return
    setDeleting(true)
    try {
      const d = await apiService.request({ url: `/api/skills/${skill!.id}`, method: 'DELETE' })
      if (d.success) { onSaved(); onClose() }
      else setError('Failed to delete skill')
    } catch { setError('Network error') }
    finally { setDeleting(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal__head">
          <h3>{mode === 'add' ? 'Add Skill Group' : 'Edit Skill Group'}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            {error && <div className="field__error" style={{ fontSize: 12 }}>{error}</div>}
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label className="field__label">Group title *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Frontend, Backend, Tools…" />
              </div>
              <div className="field" style={{ width: 80 }}>
                <label className="field__label">Order</label>
                <input type="number" value={order} onChange={e => setOrder(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label className="field__label">Icon type</label>
              <select value={icon} onChange={e => setIcon(e.target.value)}>
                <option value="price-item-visual">Visual Design</option>
                <option value="price-item-ui">UI Development</option>
                <option value="service-item-html&css">HTML &amp; CSS</option>
                <option value="service-item-front-end">Frontend Framework</option>
              </select>
            </div>
            <div className="field">
              <label className="field__label">Skills (comma-separated)</label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="React, Vue, TypeScript, Next.js…"
              />
            </div>
          </div>
          <div className="modal__foot">
            {mode === 'edit' ? (
              <button type="button" className="btn" style={{ color: '#b91c1c', borderColor: '#b91c1c' }}
                onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete group'}
              </button>
            ) : <div />}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-solid">
                {mode === 'add' ? 'Add group' : 'Save changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── SkillCard ─────────────────────────────────────────────── */
const SkillCard: FC<{ skill: Skill; onUpdated: () => void; canEdit: boolean }> = ({ skill, onUpdated, canEdit }) => {
  const [editing, setEditing] = useState(false)
  const tags = parseDetails(skill.details)

  return (
    <div className="skill-admin-card">
      <div className="skill-admin-card__head">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{skill.title}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-4)', marginTop: 2 }}>
            ORDER {skill.order}
          </div>
        </div>
        {canEdit && (
          <div className="row-actions">
            <button className="icon-btn" onClick={() => setEditing(true)} title="Edit" aria-label="Edit">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="skill-admin-card__tags">
        {tags.map((tag, i) => (
          <span key={i} className="tag">{tag}</span>
        ))}
        {tags.length === 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-4)' }}>No skills yet</span>
        )}
      </div>
      {editing && (
        <SkillModal mode="edit" skill={skill} onClose={() => setEditing(false)} onSaved={onUpdated} />
      )}
    </div>
  )
}

/* ─── SkillsManagementPage ───────────────────────────────────── */
const SkillsManagementPage: FC = function () {
  const { canManageUsers } = useAuth()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  async function fetchSkills() {
    try {
      const data = await apiService.get('/api/skills')
      if (data.success && data.data) setSkills(data.data)
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSkills() }, [])

  return (
    <div>
      <AdminPageHead title="Skills" description="Manage your skill groups and technologies">
        {canManageUsers() && (
          <button className="btn btn-solid" onClick={() => setAddOpen(true)}>
            + Add group
          </button>
        )}
      </AdminPageHead>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '10px 14px',
          fontFamily: 'var(--font-mono)', fontSize: 12, color: '#b91c1c', marginBottom: 20 }}>
          {error}
          <button style={{ marginLeft: 12, textDecoration: 'underline' }} onClick={() => setError(null)}>dismiss</button>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 28, height: 28, border: '2px solid var(--ink)', borderTopColor: 'var(--accent-y)',
            borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : (
        <div className="skill-admin-grid">
          {skills.map(skill => (
            <SkillCard key={skill.id} skill={skill} onUpdated={fetchSkills} canEdit={canManageUsers()} />
          ))}
          {skills.length === 0 && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)', padding: 20 }}>
              No skill groups yet.
            </div>
          )}
        </div>
      )}

      {addOpen && (
        <SkillModal mode="add" onClose={() => setAddOpen(false)} onSaved={fetchSkills} />
      )}
    </div>
  )
}

export default SkillsManagementPage
