import { useEffect, useState, type FC } from 'react'
import AdminPageHead from '@/components/Layout/BackStage/AdminPageHead'
import apiService from '@/api/request'
import { getApiBaseUrl } from '@/config'

const R2_ORIGINS = ['images.jackhellowin.win', '.r2.dev']
const LEGACY_R2_PREFIX = 'https://pub-8cc5e3d2aa544c399e62ef9eb9e5a7c9.r2.dev/'

interface Work {
  id: number
  title: string
  description: string
  content: string
  imgUrl: string | null
  imgLink: string | null
  tags: string | string[]
  gitHubUrl: string | null
  gitPageUrl: string | null
  updatedAt?: string
}

function isR2Url(url: string) {
  if (!url) return false
  try {
    const host = new URL(url).hostname
    return R2_ORIGINS.some(origin => host.endsWith(origin))
  } catch {
    return false
  }
}

function extractR2Key(url: string) {
  try { return new URL(url).pathname.slice(1) } catch { return '' }
}

function getAuthToken() {
  try {
    const state = localStorage.getItem('authState')
    return state ? JSON.parse(state).accessToken ?? null : null
  } catch {
    return null
  }
}

function getImageUrl(url?: string | null) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return new URL(`../assets/images/${url}.png`, import.meta.url).href
}

function normalizeR2Url(url: string) {
  return url.replace(LEGACY_R2_PREFIX, 'https://images.jackhellowin.win/')
}

function parseTags(tags?: string | string[]) {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  try { return JSON.parse(tags) } catch { return [] }
}

function useImageUpload() {
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function uploadFile(file: File, setImgUrl: (url: string) => void, setImgLink: (url: string) => void) {
    setUploadLoading(true)
    setUploadError(null)
    const token = getAuthToken()
    if (!token) {
      setUploadError('Not authenticated')
      setUploadLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (res.status === 413) {
        setUploadError('File too large (max 5 MB)')
        return
      }
      if (!res.ok) {
        setUploadError('Upload failed, please retry')
        return
      }
      const data = await res.json()
      const url = data.data?.url ?? data.url
      if (data.success && url) {
        const next = normalizeR2Url(url)
        setImgUrl(next)
        setImgLink(next)
      } else {
        setUploadError('Upload failed, please retry')
      }
    } catch {
      setUploadError('Upload failed, please retry')
    } finally {
      setUploadLoading(false)
    }
  }

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    setImgUrl: (url: string) => void,
    setImgLink: (url: string) => void,
  ) {
    const file = event.target.files?.[0]
    if (!file) return
    await uploadFile(file, setImgUrl, setImgLink)
    event.target.value = ''
  }

  return { uploadLoading, uploadError, handleFileUpload, uploadFile }
}

function useImageDelete() {
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleDeleteImage(
    imgUrl: string,
    setImgUrl: (url: string) => void,
    setImgLink: (url: string) => void,
  ) {
    const key = extractR2Key(imgUrl)
    if (!key) return setDeleteError('Invalid R2 URL')
    const token = getAuthToken()
    if (!token) return setDeleteError('Not authenticated')
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/upload/${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return setDeleteError('Delete failed, please retry')
      setImgUrl('')
      setImgLink('')
    } catch {
      setDeleteError('Delete failed, please retry')
    } finally {
      setDeleteLoading(false)
    }
  }

  return { deleteLoading, deleteError, handleDeleteImage }
}

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const PencilIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M9 6V4h6v2" />
  </svg>
)

const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const ImageEditor: FC<{
  idPrefix: string
  imgUrl: string
  imgLink: string
  onImgUrlChange: (url: string) => void
  onImgLinkChange: (url: string) => void
}> = ({ idPrefix, imgUrl, onImgUrlChange, onImgLinkChange }) => {
  const [replacing, setReplacing] = useState(!imgUrl)
  const { uploadLoading, uploadError, handleFileUpload, uploadFile } = useImageUpload()
  const { deleteLoading, deleteError, handleDeleteImage } = useImageDelete()

  async function onDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (!file) return
    await uploadFile(file, onImgUrlChange, onImgLinkChange)
    setReplacing(false)
  }

  async function removeImage() {
    if (!imgUrl) return
    if (isR2Url(imgUrl)) await handleDeleteImage(imgUrl, onImgUrlChange, onImgLinkChange)
    else {
      onImgUrlChange('')
      onImgLinkChange('')
    }
    setReplacing(true)
  }

  return (
    <div className="field">
      <label className="field__label">Cover image</label>
      {imgUrl && !replacing ? (
        <div className="image-editor">
          <img src={getImageUrl(imgUrl)} alt="Work preview" />
          <div className="image-editor__actions">
            <button type="button" className="icon-btn" onClick={() => setReplacing(true)} title="Replace image" aria-label="Replace image"><PencilIcon /></button>
            <button type="button" className="icon-btn danger" onClick={removeImage} disabled={deleteLoading} title="Remove image" aria-label="Remove image"><TrashIcon /></button>
          </div>
        </div>
      ) : (
        <label htmlFor={`${idPrefix}-file`} className="image-dropzone" onDragOver={e => e.preventDefault()} onDrop={onDrop}>
          <span>{uploadLoading ? 'Uploading to R2...' : 'Drop image here or choose file'}</span>
          <small>Cloudflare R2 upload</small>
        </label>
      )}
      <input id={`${idPrefix}-file`} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, onImgUrlChange, onImgLinkChange).then(() => setReplacing(false))} />
      {replacing && imgUrl && <button type="button" className="reset-link image-cancel" onClick={() => setReplacing(false)}>Cancel replace</button>}
      {uploadError && <span className="field__error">{uploadError}</span>}
      {deleteError && <span className="field__error">{deleteError}</span>}
    </div>
  )
}

const WorkModal: FC<{ mode: 'add' | 'edit'; work?: Work; onClose: () => void; onSaved: () => void }> = ({ mode, work, onClose, onSaved }) => {
  const [title, setTitle] = useState(work?.title ?? '')
  const [description, setDescription] = useState(work?.description ?? '')
  const [content, setContent] = useState(work?.content ?? '')
  const [tags, setTags] = useState(() => parseTags(work?.tags).join(', '))
  const [imgUrl, setImgUrl] = useState(work?.imgUrl ?? '')
  const [imgLink, setImgLink] = useState(work?.imgLink ?? '')
  const [gitHubUrl, setGitHubUrl] = useState(work?.gitHubUrl ?? '')
  const [gitPageUrl, setGitPageUrl] = useState(work?.gitPageUrl ?? '')
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const payload = {
      title,
      description,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      imgUrl: imgUrl || null,
      imgLink: imgLink || imgUrl || null,
      gitHubUrl: gitHubUrl || null,
      gitPageUrl: gitPageUrl || null,
    }
    try {
      const result = mode === 'add'
        ? await apiService.post('/api/works', payload)
        : await apiService.request({ url: `/api/works/${work!.id}`, method: 'PUT', data: payload })
      if (result.success) { onSaved(); onClose() } else setError(`Failed to ${mode === 'add' ? 'add' : 'update'} work`)
    } catch { setError('Network error') }
  }

  async function deleteWork() {
    if (!confirm('Delete this work?')) return
    setDeleting(true)
    try {
      const result = await apiService.request({ url: `/api/works/${work!.id}`, method: 'DELETE' })
      if (result.success) { onSaved(); onClose() } else setError('Failed to delete work')
    } catch { setError('Network error') } finally { setDeleting(false) }
  }

  return (
    <div className="modal-overlay" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
      <div className="modal modal--lg">
        <div className="modal__head">
          <h3>{mode === 'add' ? 'Add Work' : 'Edit Work'}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal__body">
            {error && <div className="field__error" style={{ fontSize: 12, marginBottom: 4 }}>{error}</div>}
            <div className="field"><label className="field__label">Title *</label><input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Project name" /></div>
            <div className="field"><label className="field__label">Description *</label><textarea value={description} onChange={e => setDescription(e.target.value)} required placeholder="Short summary" style={{ minHeight: 64 }} /></div>
            <div className="field"><label className="field__label">Content</label><textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Detailed description, tech highlights..." /></div>
            <div className="field"><label className="field__label">Tags (comma-separated) *</label><input value={tags} onChange={e => setTags(e.target.value)} required placeholder="React, TypeScript, Node.js" /></div>
            <ImageEditor idPrefix={mode} imgUrl={imgUrl} imgLink={imgLink} onImgUrlChange={setImgUrl} onImgLinkChange={setImgLink} />
            <div className="field-row">
              <div className="field"><label className="field__label">GitHub URL</label><input value={gitHubUrl} onChange={e => setGitHubUrl(e.target.value)} placeholder="https://github.com/..." /></div>
              <div className="field"><label className="field__label">Demo URL</label><input value={gitPageUrl} onChange={e => setGitPageUrl(e.target.value)} placeholder="https://..." /></div>
            </div>
          </div>
          <div className="modal__foot">
            {mode === 'edit' ? <button type="button" className="btn" style={{ color: '#b91c1c', borderColor: '#b91c1c' }} onClick={deleteWork} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete work'}</button> : <div />}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-solid">{mode === 'add' ? 'Add work' : 'Save changes'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

const WorksManagementPage: FC = () => {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Work | null>(null)

  async function fetchWorks() {
    try {
      const data = await apiService.get('/api/works')
      if (data.success && data.data) setWorks(data.data)
    } catch { setError('Failed to fetch works') } finally { setLoading(false) }
  }

  useEffect(() => { fetchWorks() }, [])

  return (
    <div>
      <AdminPageHead title="Works" description="Manage your portfolio projects">
        <button className="btn btn-solid" onClick={() => setAdding(true)}>+ Add work</button>
      </AdminPageHead>
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#b91c1c', marginBottom: 20 }}>{error}<button style={{ marginLeft: 12, textDecoration: 'underline' }} onClick={() => setError(null)}>dismiss</button></div>}
      <div className="dt-wrap">
        <table className="dt">
          <thead><tr><th style={{ width: 72 }}>Image</th><th>Title</th><th style={{ width: 100 }}>Status</th><th style={{ width: 120 }}>Updated</th><th style={{ width: 90 }}>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}><div style={{ width: 28, height: 28, border: '2px solid var(--ink)', borderTopColor: 'var(--accent-y)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} /></td></tr>
              : works.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>No works yet - click "Add work" to get started.</td></tr>
              : works.map(work => (
                <tr key={work.id}>
                  <td><div className="cell-thumb">{work.imgUrl ? <img src={getImageUrl(work.imgUrl)} alt={work.title} /> : <div style={{ width: '100%', height: '100%', background: 'var(--bg-sunk)' }} />}</div></td>
                  <td><div className="cell-title">{work.title}</div><div className="cell-sub">{parseTags(work.tags).slice(0, 4).join(' · ')}</div></td>
                  <td><span className="status-pill is-pub">Published</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>{work.updatedAt ? new Date(work.updatedAt).toLocaleDateString() : '-'}</td>
                  <td><div className="row-actions">
                    {work.gitPageUrl && <a className="icon-btn" href={work.gitPageUrl} target="_blank" rel="noreferrer" title="View demo" aria-label="View demo"><ExternalIcon /></a>}
                    <button className="icon-btn" onClick={() => setEditing(work)} title="Edit" aria-label="Edit"><PencilIcon /></button>
                  </div></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {adding && <WorkModal mode="add" onClose={() => setAdding(false)} onSaved={fetchWorks} />}
      {editing && <WorkModal mode="edit" work={editing} onClose={() => setEditing(null)} onSaved={fetchWorks} />}
    </div>
  )
}

export default WorksManagementPage
