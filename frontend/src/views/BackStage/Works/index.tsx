import {
  Breadcrumb,
  Button,
  Card,
  Label,
  Modal,
  Textarea,
  TextInput,
  Badge,
  Alert,
  Spinner,
} from 'flowbite-react'
import type { FC } from 'react'
import { useState, useEffect } from 'react'
import {
  HiPlus,
  HiPencilAlt,
  HiTrash,
  HiExternalLink,
  HiCode,
  HiSparkles,
  HiUpload,
  HiX,
} from 'react-icons/hi'
import apiService from '@/api/request'

// ──────────────────────────────────────────────
// R2 helpers
// ──────────────────────────────────────────────

const R2_ORIGINS = ['images.jackhellowin.win', '.r2.dev']

/** Return true when the URL is hosted in our R2 bucket. */
function isR2Url(url: string): boolean {
  if (!url) return false
  try {
    const { hostname } = new URL(url)
    return R2_ORIGINS.some((o) => hostname === o || hostname.endsWith(o))
  } catch {
    return false
  }
}

/** Extract the object key from an R2 URL (everything after the first /). */
function extractR2Key(url: string): string {
  try {
    const { pathname } = new URL(url)
    // pathname starts with '/', strip it
    return pathname.slice(1)
  } catch {
    return ''
  }
}

/** Get JWT from localStorage the same way apiService does. */
function getAuthToken(): string | null {
  try {
    const state = localStorage.getItem('authState')
    if (!state) return null
    const parsed = JSON.parse(state)
    return parsed.accessToken ?? null
  } catch {
    return null
  }
}

// ──────────────────────────────────────────────
// Image URL helper (external vs local asset)
// ──────────────────────────────────────────────

function getImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return new URL(`../assets/images/${url}.png`, import.meta.url).href
}

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

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
  createdAt?: string
  updatedAt?: string
}

// ──────────────────────────────────────────────
// Shared image upload hook (task 4.1–4.4)
// ──────────────────────────────────────────────

interface UseImageUploadReturn {
  uploadLoading: boolean
  uploadError: string | null
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImgUrl: (url: string) => void,
    setImgLink: (url: string) => void,
  ) => Promise<void>
}

function useImageUpload(): UseImageUploadReturn {
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImgUrl: (url: string) => void,
    setImgLink: (url: string) => void,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadLoading(true)
    setUploadError(null)

    const token = getAuthToken()
    if (!token) {
      setUploadError('尚未登入，請重新整理後登入')
      setUploadLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const apiBase = import.meta.env.VITE_API_PREFIX || ''
      const res = await fetch(`${apiBase}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (res.status === 413) {
        setUploadError('File too large (max 5 MB)')
        return
      }
      if (res.status === 400) {
        const body = await res.json().catch(() => ({}))
        const msg = body?.error ?? 'Invalid file type'
        setUploadError(msg === 'Invalid file type' ? 'Invalid file type' : 'Upload failed, please retry')
        return
      }
      if (!res.ok) {
        setUploadError('Upload failed, please retry')
        return
      }

      const data = await res.json()
      if (data.success && data.url) {
        // task 4.3 — populate imgUrl and imgLink with the R2 URL
        setImgUrl(data.url)
        setImgLink(data.url)
      } else {
        setUploadError('Upload failed, please retry')
      }
    } catch {
      setUploadError('Upload failed, please retry')
    } finally {
      setUploadLoading(false)
      // Reset file input so the same file can be re-selected if needed
      e.target.value = ''
    }
  }

  return { uploadLoading, uploadError, handleFileUpload }
}

// ──────────────────────────────────────────────
// Shared image delete hook (task 4.6–4.8)
// ──────────────────────────────────────────────

interface UseImageDeleteReturn {
  deleteLoading: boolean
  deleteError: string | null
  handleDeleteImage: (
    imgUrl: string,
    setImgUrl: (url: string) => void,
    setImgLink: (url: string) => void,
  ) => Promise<void>
}

function useImageDelete(): UseImageDeleteReturn {
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDeleteImage = async (
    imgUrl: string,
    setImgUrl: (url: string) => void,
    setImgLink: (url: string) => void,
  ) => {
    const key = extractR2Key(imgUrl)
    if (!key) {
      setDeleteError('無效的 R2 圖片網址')
      return
    }

    const token = getAuthToken()
    if (!token) {
      setDeleteError('尚未登入，請重新整理後登入')
      return
    }

    setDeleteLoading(true)
    setDeleteError(null)

    try {
      const apiBase = import.meta.env.VITE_API_PREFIX || ''
      const res = await fetch(`${apiBase}/api/upload/${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        // task 4.7 — surface delete error, do NOT clear imgUrl
        setDeleteError('刪除失敗，請稍後再試')
        return
      }

      // task 4.6 — on success, clear imgUrl and imgLink
      setImgUrl('')
      setImgLink('')
    } catch {
      setDeleteError('刪除失敗，請稍後再試')
    } finally {
      setDeleteLoading(false)
    }
  }

  return { deleteLoading, deleteError, handleDeleteImage }
}

// ──────────────────────────────────────────────
// Shared ImageUploadSection component
// ──────────────────────────────────────────────

interface ImageUploadSectionProps {
  idPrefix: string
  imgUrl: string
  imgLink: string
  onImgUrlChange: (v: string) => void
  onImgLinkChange: (v: string) => void
}

const ImageUploadSection: FC<ImageUploadSectionProps> = ({
  idPrefix,
  imgUrl,
  imgLink: _imgLink,
  onImgUrlChange,
  onImgLinkChange,
}) => {
  const { uploadLoading, uploadError, handleFileUpload } = useImageUpload()
  const { deleteLoading, deleteError, handleDeleteImage } = useImageDelete()

  return (
    <div className="space-y-3">
      {/* task 4.1 — file input for image upload */}
      <div>
        <Label>上傳圖片</Label>
        <div className="mt-1">
          <label
            htmlFor={`${idPrefix}-file-upload`}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <HiUpload className="h-4 w-4" />
            選擇圖片上傳至 R2
          </label>
          <input
            id={`${idPrefix}-file-upload`}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFileUpload(e, onImgUrlChange, onImgLinkChange)}
          />
          {/* task 4.2 — loading indicator */}
          {uploadLoading && (
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <Spinner size="sm" />
              上傳中...
            </div>
          )}
          {/* task 4.4 — upload error message */}
          {uploadError && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{uploadError}</p>
          )}
        </div>
      </div>

      {/* task 4.5 — imgUrl text input always editable */}
      <div>
        <Label htmlFor={`${idPrefix}-imgUrl`}>圖片網址（可手動輸入或上傳後自動填入）</Label>
        <TextInput
          id={`${idPrefix}-imgUrl`}
          value={imgUrl}
          onChange={(e) => onImgUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1"
        />
      </div>

      {/* task 4.3 — image preview */}
      {imgUrl && (
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
          <img
            src={getImageUrl(imgUrl)}
            alt="預覽圖"
            className="max-h-40 w-full object-contain p-2"
          />

          {/* task 4.6 — delete button (R2 URLs only) */}
          {isR2Url(imgUrl) && (
            <div className="border-t border-gray-200 p-2 dark:border-gray-600">
              <Button
                color="failure"
                size="xs"
                disabled={deleteLoading}
                onClick={() => handleDeleteImage(imgUrl, onImgUrlChange, onImgLinkChange)}
              >
                {deleteLoading ? (
                  <>
                    <Spinner size="xs" className="mr-1" />
                    刪除中...
                  </>
                ) : (
                  <>
                    <HiX className="mr-1 h-3 w-3" />
                    刪除 R2 圖片
                  </>
                )}
              </Button>
              {/* task 4.7 — delete error message */}
              {deleteError && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{deleteError}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────

const WorksManagementPage: FC = function () {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorks = async () => {
    try {
      const data = await apiService.get('/api/works')
      if (data.success && data.data) {
        setWorks(data.data)
      }
    } catch {
      setError('Failed to fetch works')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorks()
  }, [])

  return (
    <>
      {/* Header */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 blur-3xl"></div>
        <div className="relative p-4 sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">作品管理</h1>
              <Breadcrumb className="mt-2">
                <Breadcrumb.Item href="#">後台</Breadcrumb.Item>
                <Breadcrumb.Item href="#">作品管理</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="mt-4 sm:mt-0">
              <AddWorkModal onWorkAdded={fetchWorks} />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            管理你的作品集項目，展示你的技術能力和專案經驗
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4">
          <Alert color="failure" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        </div>
      )}

      {/* Works Grid */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner size="xl" />
          </div>
        ) : works.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <HiSparkles className="mb-2 text-4xl" />
            <p>暫無作品，點擊上方按鈕新增</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} onUpdated={fetchWorks} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// ──────────────────────────────────────────────
// Work card
// ──────────────────────────────────────────────

const WorkCard: FC<{ work: Work; onUpdated: () => void }> = function ({ work, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false)

  const parseTags = (tags: string | string[] | undefined): string[] => {
    if (!tags) return []
    if (Array.isArray(tags)) return tags
    try {
      return JSON.parse(tags)
    } catch {
      return []
    }
  }

  const tags = parseTags(work.tags)

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/5 group-hover:to-purple-500/5"></div>

      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {work.imgUrl ? (
          <img
            src={getImageUrl(work.imgUrl)}
            alt={work.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <HiCode className="text-4xl text-gray-300 dark:text-gray-600" />
          </div>
        )}
        {/* Tags overlay */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} color="dark" className="bg-black/50 text-white backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge color="dark" className="bg-black/50 text-white backdrop-blur-sm">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-4">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="line-clamp-1 text-lg font-bold text-gray-900 dark:text-white">
            {work.title}
          </h3>
          <Button color="gray" size="xs" onClick={() => setIsEditing(true)}>
            <HiPencilAlt className="h-4 w-4" />
          </Button>
        </div>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {work.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {work.gitHubUrl && (
            <Button
              href={work.gitHubUrl}
              target="_blank"
              size="xs"
              color="gray"
              className="transition-colors hover:text-blue-500"
            >
              <HiCode className="mr-1 h-3 w-3" />
              GitHub
            </Button>
          )}
          {work.gitPageUrl && (
            <Button
              href={work.gitPageUrl}
              target="_blank"
              size="xs"
              color="gray"
              className="transition-colors hover:text-purple-500"
            >
              <HiExternalLink className="mr-1 h-3 w-3" />
              Demo
            </Button>
          )}
        </div>
      </div>

      {isEditing && (
        <EditWorkModal work={work} onClose={() => setIsEditing(false)} onUpdated={onUpdated} />
      )}
    </Card>
  )
}

// ──────────────────────────────────────────────
// Add Work Modal (task 4.1–4.6)
// ──────────────────────────────────────────────

const AddWorkModal: FC<{ onWorkAdded: () => void }> = function ({ onWorkAdded }) {
  const [isOpen, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const [imgLink, setImgLink] = useState('')
  const [gitHubUrl, setGitHubUrl] = useState('')
  const [gitPageUrl, setGitPageUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setContent('')
    setTags('')
    setImgUrl('')
    setImgLink('')
    setGitHubUrl('')
    setGitPageUrl('')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean)

    try {
      const data = await apiService.post('/api/works', {
        title,
        description,
        content,
        tags: tagsArray,
        imgUrl: imgUrl || null,
        imgLink: imgLink || imgUrl || null,
        gitHubUrl: gitHubUrl || null,
        gitPageUrl: gitPageUrl || null,
      })

      if (data.success) {
        setOpen(false)
        resetForm()
        onWorkAdded()
      } else {
        setError('Failed to add work')
      }
    } catch {
      setError('Network error')
    }
  }

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <HiPlus className="mr-2" />
        新增作品
      </Button>
      <Modal onClose={() => { setOpen(false); resetForm() }} show={isOpen} size="lg">
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <HiSparkles className="text-xl text-blue-500" />
            <strong>新增作品</strong>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="add-title">作品名稱 *</Label>
              <TextInput
                id="add-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入作品名稱"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="add-description">簡介 *</Label>
              <Textarea
                id="add-description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="簡短描述這個作品"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="add-content">詳細內容</Label>
              <Textarea
                id="add-content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="詳細說明這個作品的技術實現、功能特點等"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="add-tags">標籤 (逗號分隔) *</Label>
              <TextInput
                id="add-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, TypeScript, Node.js"
                required
                className="mt-1"
              />
            </div>

            {/* tasks 4.1–4.8: image upload + preview + delete */}
            <ImageUploadSection
              idPrefix="add"
              imgUrl={imgUrl}
              imgLink={imgLink}
              onImgUrlChange={setImgUrl}
              onImgLinkChange={setImgLink}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="add-github">GitHub URL</Label>
                <TextInput
                  id="add-github"
                  value={gitHubUrl}
                  onChange={(e) => setGitHubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="add-demo">Demo URL</Label>
                <TextInput
                  id="add-demo"
                  value={gitPageUrl}
                  onChange={(e) => setGitPageUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>

            {error && <Alert color="failure">{error}</Alert>}

            <div className="flex justify-end gap-2 pt-2">
              <Button color="gray" onClick={() => { setOpen(false); resetForm() }}>
                取消
              </Button>
              <Button color="primary" type="submit">
                確認新增
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}

// ──────────────────────────────────────────────
// Edit Work Modal (task 4.9)
// ──────────────────────────────────────────────

const EditWorkModal: FC<{ work: Work; onClose: () => void; onUpdated: () => void }> = function ({
  work,
  onClose,
  onUpdated,
}) {
  const [title, setTitle] = useState(work.title)
  const [description, setDescription] = useState(work.description)
  const [content, setContent] = useState(work.content || '')
  const [tags, setTags] = useState(() => {
    const t = work.tags
    if (Array.isArray(t)) return t.join(', ')
    if (typeof t === 'string') {
      try { return JSON.parse(t).join(', ') } catch { return '' }
    }
    return ''
  })
  const [imgUrl, setImgUrl] = useState(work.imgUrl || '')
  const [imgLink, setImgLink] = useState(work.imgLink || '')
  const [gitHubUrl, setGitHubUrl] = useState(work.gitHubUrl || '')
  const [gitPageUrl, setGitPageUrl] = useState(work.gitPageUrl || '')
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleUpdate = async () => {
    const tagsArray = tags.split(',').map((t: string) => t.trim()).filter(Boolean)

    try {
      const data = await apiService.request({
        url: `/api/works/${work.id}`,
        method: 'PUT',
        data: {
          title,
          description,
          content,
          tags: tagsArray,
          imgUrl: imgUrl || null,
          imgLink: imgLink || imgUrl || null,
          gitHubUrl: gitHubUrl || null,
          gitPageUrl: gitPageUrl || null,
        },
      })

      if (data.success) {
        onUpdated()
        onClose()
      } else {
        setError('Failed to update work')
      }
    } catch {
      setError('Network error')
    }
  }

  const handleDelete = async () => {
    if (!confirm('確定要刪除此作品嗎？')) return

    setDeleting(true)
    try {
      const data = await apiService.request({
        url: `/api/works/${work.id}`,
        method: 'DELETE',
      })

      if (data.success) {
        onUpdated()
        onClose()
      } else {
        setError('Failed to delete work')
      }
    } catch {
      setError('Network error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal onClose={onClose} show={true} size="lg">
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>編輯作品</strong>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">作品名稱 *</Label>
            <TextInput
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="edit-description">簡介 *</Label>
            <Textarea
              id="edit-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="edit-content">詳細內容</Label>
            <Textarea
              id="edit-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="edit-tags">標籤 (逗號分隔) *</Label>
            <TextInput
              id="edit-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* tasks 4.1–4.8: image upload + preview + delete (edit form) */}
          <ImageUploadSection
            idPrefix="edit"
            imgUrl={imgUrl}
            imgLink={imgLink}
            onImgUrlChange={setImgUrl}
            onImgLinkChange={setImgLink}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-github">GitHub URL</Label>
              <TextInput
                id="edit-github"
                value={gitHubUrl}
                onChange={(e) => setGitHubUrl(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-demo">Demo URL</Label>
              <TextInput
                id="edit-demo"
                value={gitPageUrl}
                onChange={(e) => setGitPageUrl(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {error && <Alert color="failure">{error}</Alert>}

          <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <Button color="failure" onClick={handleDelete} disabled={deleting}>
              <HiTrash className="mr-2" />
              刪除作品
            </Button>
            <div className="flex gap-2">
              <Button color="gray" onClick={onClose}>
                取消
              </Button>
              <Button color="primary" onClick={handleUpdate}>
                儲存變更
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default WorksManagementPage
