import type { FC } from 'react'
import { useState, useEffect } from 'react'
import AdminPageHead from '@/components/Layout/BackStage/AdminPageHead'
import apiService from '@/api/request'
import type { User } from '@/api/auth'

/* ─── AddUserModal ───────────────────────────────────────────── */
const AddUserModal: FC<{ onClose: () => void; onSaved: () => void }> = ({ onClose, onSaved }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole]         = useState('admin')
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const d = await apiService.post('/api/admin/users', { username, password, role })
      if (d.success) { onSaved(); onClose() }
      else setError(d.error?.message ?? 'Failed to create user')
    } catch { setError('Network error') }
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal__head">
          <h3>Add User</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            {error && <div className="field__error" style={{ fontSize: 12 }}>{error}</div>}
            <div className="field">
              <label className="field__label">Username *</label>
              <input value={username} onChange={e => setUsername(e.target.value)} required placeholder="johndoe" />
            </div>
            <div className="field">
              <label className="field__label">Password *</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
            </div>
            <div className="field">
              <label className="field__label">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
          <div className="modal__foot">
            <div />
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-solid">Add user</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── UsersManagementPage ────────────────────────────────────── */
const UsersManagementPage: FC = function () {
  const [users, setUsers]     = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  async function fetchUsers() {
    try {
      const d = await apiService.get('/api/admin/users')
      if (d.success && d.data) setUsers(d.data.users ?? d.data)
      else setError(d.error?.message ?? 'Failed to fetch users')
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  async function handleDelete(userId: number, username: string) {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return
    try {
      const d = await apiService.request({ url: `/api/admin/users/${userId}`, method: 'DELETE' })
      if (d.success) fetchUsers()
      else setError(d.error?.message ?? 'Failed to delete user')
    } catch { setError('Network error') }
  }

  useEffect(() => { fetchUsers() }, [])

  return (
    <div>
      <AdminPageHead title="Users" description="Manage admin accounts and access control">
        <button className="btn btn-solid" onClick={() => setAddOpen(true)}>
          + Add user
        </button>
      </AdminPageHead>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '10px 14px',
          fontFamily: 'var(--font-mono)', fontSize: 12, color: '#b91c1c', marginBottom: 20 }}>
          {error}
          <button style={{ marginLeft: 12, textDecoration: 'underline' }} onClick={() => setError(null)}>dismiss</button>
        </div>
      )}

      <div className="dt-wrap">
        <table className="dt">
          <thead>
            <tr>
              <th style={{ width: 48 }}></th>
              <th>Username</th>
              <th style={{ width: 100 }}>Role</th>
              <th style={{ width: 130 }}>Created</th>
              <th style={{ width: 130 }}>Last login</th>
              <th style={{ width: 70 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>
                  <div style={{ width: 28, height: 28, border: '2px solid var(--ink)', borderTopColor: 'var(--accent-y)',
                    borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>
                  No users found.
                </td>
              </tr>
            ) : users.map(user => {
              const initials = user.username.slice(0, 2).toUpperCase()
              const isEnvAdmin = user.id === 0
              return (
                <tr key={user.id}>
                  <td>
                    <div style={{
                      width: 32, height: 32, borderRadius: 999,
                      background: 'var(--accent-y)', color: 'var(--ink)',
                      display: 'grid', placeItems: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
                    }}>{initials}</div>
                  </td>
                  <td>
                    <div className="cell-title">{user.username}</div>
                    {isEnvAdmin && (
                      <div className="cell-sub">ENV_ADMIN — password managed via Wrangler secrets</div>
                    )}
                  </td>
                  <td>
                    <span className={`status-pill ${user.role === 'admin' ? 'is-pub' : 'is-draft'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td>
                    {!isEnvAdmin && (
                      <div className="row-actions">
                        <button
                          className="icon-btn danger"
                          onClick={() => handleDelete(user.id, user.username)}
                          title="Delete user"
                          aria-label="Delete"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {addOpen && (
        <AddUserModal onClose={() => setAddOpen(false)} onSaved={fetchUsers} />
      )}
    </div>
  )
}

export default UsersManagementPage
