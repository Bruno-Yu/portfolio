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
import { HiPlus, HiPencilAlt, HiTrash, HiExternalLink, HiCode, HiSparkles } from 'react-icons/hi'
import apiService from '@/api/request'

// Helper function to get image URL - handles both local assets and external URLs
function getImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  // If it's already an absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // Otherwise, treat as local asset
  return new URL(`../assets/images/${url}.png`, import.meta.url).href
}

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
        {/* Decorative gradient */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 blur-3xl"></div>
        
        <div className="relative p-4 sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                作品管理
              </h1>
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
      {/* Gradient overlay on hover */}
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
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
            {work.title}
          </h3>
          <Button
            color="gray"
            size="xs"
            onClick={() => setIsEditing(true)}
          >
            <HiPencilAlt className="h-4 w-4" />
          </Button>
        </div>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {work.description}
        </p>

        {/* Action links */}
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

const AddWorkModal: FC<{ onWorkAdded: () => void }> = function ({ onWorkAdded }) {
  const [isOpen, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const [gitHubUrl, setGitHubUrl] = useState('')
  const [gitPageUrl, setGitPageUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean)

    try {
      const data = await apiService.post('/api/works', {
        title,
        description,
        content,
        tags: tagsArray,
        imgUrl: imgUrl || null,
        gitHubUrl: gitHubUrl || null,
        gitPageUrl: gitPageUrl || null,
      })

      if (data.success) {
        setOpen(false)
        setTitle('')
        setDescription('')
        setContent('')
        setTags('')
        setImgUrl('')
        setGitHubUrl('')
        setGitPageUrl('')
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
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <HiPlus className="mr-2" />
        新增作品
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="lg">
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <HiSparkles className="text-xl text-blue-500" />
            <strong>新增作品</strong>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">作品名稱 *</Label>
              <TextInput
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入作品名稱"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">簡介 *</Label>
              <Textarea
                id="description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="簡短描述這個作品"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="content">詳細內容</Label>
              <Textarea
                id="content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="詳細說明這個作品的技術實現、功能特點等"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="tags">標籤 (逗號分隔) *</Label>
              <TextInput
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, TypeScript, Node.js"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="imgUrl">圖片網址</Label>
              <TextInput
                id="imgUrl"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="github">GitHub URL</Label>
                <TextInput
                  id="github"
                  value={gitHubUrl}
                  onChange={(e) => setGitHubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="demo">Demo URL</Label>
                <TextInput
                  id="demo"
                  value={gitPageUrl}
                  onChange={(e) => setGitPageUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>

            {error && <Alert color="failure">{error}</Alert>}

            <div className="flex justify-end gap-2 pt-2">
              <Button color="gray" onClick={() => setOpen(false)}>
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
          gitHubUrl: gitHubUrl || null,
          gitPageUrl: gitPageUrl || null,
        }
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
        method: 'DELETE'
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

          <div>
            <Label htmlFor="edit-imgUrl">圖片網址</Label>
            <TextInput
              id="edit-imgUrl"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-1"
            />
          </div>

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
