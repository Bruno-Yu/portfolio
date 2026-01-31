import {
  Breadcrumb,
  Button,
  Card,
  Label,
  Modal,
  TextInput,
  Textarea,
  Badge,
  Alert,
} from 'flowbite-react'
import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { HiPlus, HiPencilAlt, HiTrash, HiOutlineCode, HiSparkles } from 'react-icons/hi'
import { useAuth } from '@/store/auth-hook'
import apiService from '@/api/request'

interface Skill {
  id: number
  title: string
  icon: string
  details: string
  order: number
}

const SkillsManagementPage: FC = function () {
  const { canManageUsers } = useAuth()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchSkills = async () => {
    try {
      const data = await apiService.get('/api/skills')
      if (data.success && data.data) {
        setSkills(data.data)
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="w-full p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              技能管理
            </h1>
            <Breadcrumb className="mt-2">
              <Breadcrumb.Item href="#">後台</Breadcrumb.Item>
              <Breadcrumb.Item href="#">技能管理</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              管理你的技能分類，包含標題、圖標和詳細技能列表
            </p>
            {canManageUsers() && (
              <AddSkillModal onSkillAdded={fetchSkills} />
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4">
          <Alert color="failure" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        </div>
      )}

      {success && (
        <div className="p-4">
          <Alert color="success" onDismiss={() => setSuccess(null)}>
            {success}
          </Alert>
        </div>
      )}

      <div className="p-4">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onUpdated={fetchSkills}
                canEdit={canManageUsers()}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

const SkillCard: FC<{
  skill: Skill
  onUpdated: () => void
  canEdit: boolean
}> = function ({ skill, onUpdated, canEdit }) {
  const [isEditing, setIsEditing] = useState(false)

  const parseDetails = (details: string): string[] => {
    try {
      return JSON.parse(details)
    } catch {
      return []
    }
  }

  const details = parseDetails(skill.details)

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-2xl"></div>
      
      <div className="relative">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-xl text-white shadow-lg">
              <HiOutlineCode />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {skill.title}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                順序: {skill.order}
              </span>
            </div>
          </div>
          
          {canEdit && (
            <div className="flex gap-1">
              <Button
                color="gray"
                size="xs"
                onClick={() => setIsEditing(true)}
              >
                <HiPencilAlt className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {details.map((detail, idx) => (
            <Badge
              key={idx}
              color="info"
              className="transition-transform hover:scale-105"
            >
              {detail}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {details.map((detail, idx) => (
            <span
              key={idx}
              className="text-xs text-gray-600 dark:text-gray-400 after:content-[','] last:after:content-none"
            >
              {detail}
            </span>
          ))}
        </div>
      </div>

      {isEditing && (
        <EditSkillModal
          skill={skill}
          onClose={() => setIsEditing(false)}
          onUpdated={onUpdated}
        />
      )}
    </Card>
  )
}

const AddSkillModal: FC<{ onSkillAdded: () => void }> = function ({ onSkillAdded }) {
  const { accessToken } = useAuth()
  const [isOpen, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('price-item-visual')
  const [details, setDetails] = useState('')
  const [order, setOrder] = useState('0')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken) return

    const detailsArray = details.split(',').map((d: string) => d.trim()).filter(Boolean)

    try {
      const data = await apiService.post('/api/skills', {
        title,
        icon,
        details: detailsArray,
        order: parseInt(order) || 0,
      })

      if (data.success) {
        setOpen(false)
        setTitle('')
        setDetails('')
        setOrder('0')
        onSkillAdded()
      } else {
        setError('Failed to add skill')
      }
    } catch {
      setError('Network error')
    }
  }

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <HiPlus className="mr-2" />
        新增技能
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="lg">
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <HiSparkles className="text-xl text-blue-500" />
            <strong>新增技能分類</strong>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="title">技能標題</Label>
                <TextInput
                  id="title"
                  placeholder="例如: Frontend"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="order">顯示順序</Label>
                <TextInput
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="icon">圖標類別</Label>
              <select
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="price-item-visual">視覺設計</option>
                <option value="price-item-ui">UI 開發</option>
                <option value="service-item-html&css">前端基礎</option>
                <option value="service-item-front-end">前端框架</option>
              </select>
            </div>

            <div>
              <Label htmlFor="details">詳細技能 (逗號分隔)</Label>
              <Textarea
                id="details"
                placeholder="React, Vue, TypeScript..."
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-gray-500">
                多個技能請用逗號分隔
              </p>
            </div>

            {error && (
              <Alert color="failure">{error}</Alert>
            )}

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

const EditSkillModal: FC<{
  skill: Skill
  onClose: () => void
  onUpdated: () => void
}> = function ({ skill, onClose, onUpdated }) {
  const { accessToken } = useAuth()
  const [title, setTitle] = useState(skill.title)
  const [icon, setIcon] = useState(skill.icon)
  const parseDetails = (val: any) => {
    if (Array.isArray(val)) return val.join(', ')
    if (typeof val === 'string') {
      try {
        return JSON.parse(val).join(', ')
      } catch {
        return ''
      }
    }
    return ''
  }
  const [details, setDetails] = useState(() => parseDetails(skill.details))
  const [order, setOrder] = useState(String(skill.order))
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleUpdate = async () => {

    const detailsArray = details.split(',').map((d: string) => d.trim()).filter(Boolean)

    try {
      const data = await apiService.request({
        url: `/api/skills/${skill.id}`,
        method: 'PUT',
        data: {
          title,
          icon,
          details: detailsArray,
          order: parseInt(order) || 0,
        }
      })

      if (data.success) {
        onUpdated()
        onClose()
      } else {
        setError('Failed to update skill')
      }
    } catch {
      setError('Network error')
    }
  }

  const handleDelete = async () => {
    if (!accessToken || !confirm('確定要刪除此技能嗎？')) return

    setDeleting(true)
    try {
      const data = await apiService.request({
        url: `/api/skills/${skill.id}`,
        method: 'DELETE'
      })

      if (data.success) {
        onUpdated()
        onClose()
      } else {
        setError('Failed to delete skill')
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
        <strong>編輯技能</strong>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-title">技能標題</Label>
              <TextInput
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-order">顯示順序</Label>
              <TextInput
                id="edit-order"
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-icon">圖標類別</Label>
            <select
              id="edit-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="price-item-visual">視覺設計</option>
              <option value="price-item-ui">UI 開發</option>
              <option value="service-item-html&css">前端基礎</option>
              <option value="service-item-front-end">前端框架</option>
            </select>
          </div>

          <div>
            <Label htmlFor="edit-details">詳細技能 (逗號分隔)</Label>
            <Textarea
              id="edit-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-1"
            />
          </div>

          {error && <Alert color="failure">{error}</Alert>}

          <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <Button
              color="failure"
              onClick={handleDelete}
              disabled={deleting}
            >
              <HiTrash className="mr-2" />
              刪除技能
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

export default SkillsManagementPage
