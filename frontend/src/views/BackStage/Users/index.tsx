import {
  Breadcrumb,
  Button,
  Card,
  Label,
  Modal,
  TextInput,
  Alert,
  Spinner,
  Badge,
} from 'flowbite-react'
import type { FC } from 'react'
import { useState, useEffect } from 'react'
import apiService from '@/api/request'
import type { User } from '@/api/auth'
import {
  HiPlus,
  HiTrash,
  HiUser,
  HiShieldCheck,
  HiClock,
  HiCalendar,
  HiOutlineExclamationCircle,
} from 'react-icons/hi'

const UsersManagementPage: FC = function () {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      const response = await apiService.get('/api/admin/users')
      if (response.success && response.data) {
        setUsers(response.data.users)
      } else {
        setError(response.error?.message || 'Failed to fetch users')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      {/* Header */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Decorative gradient */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-green-500/5 to-teal-500/5 blur-3xl"></div>

        <div className="relative p-4 sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                用戶管理
              </h1>
              <Breadcrumb className="mt-2">
                <Breadcrumb.Item href="#">後台</Breadcrumb.Item>
                <Breadcrumb.Item href="#">用戶管理</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-2">
              <AddUserModal onUserAdded={fetchUsers} />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            管理系統用戶帳號，控制訪問權限和操作權限
          </p>
        </div>
      </div>

      {/* Alerts */}
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

      {/* Users Grid */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner size="xl" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <HiUser className="mb-2 text-4xl" />
            <p>暫無用戶，點擊上方按鈕新增</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <UserCard key={user.id} user={user} onDeleted={fetchUsers} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

const UserCard: FC<{ user: User; onDeleted: () => void }> = function ({ user }) {
  const isEnvAdmin = user.id === 0

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 dark:hover:shadow-green-500/20">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-teal-500/0 opacity-0 transition-opacity duration-300 group-hover:from-green-500/5 group-hover:to-teal-500/5"></div>

      <div className="relative p-4">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <HiUser className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {user.username}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {user.id}
              </p>
            </div>
          </div>
          <Badge color={user.role === 'admin' ? 'green' : 'gray'} icon={HiShieldCheck}>
            {user.role === 'admin' ? '管理員' : '用戶'}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <HiCalendar className="h-4 w-4" />
            <span>建立時間: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiClock className="h-4 w-4" />
            <span>最後登入: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '從未'}</span>
          </div>
        </div>

        {/* Delete action */}
        <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
          {!isEnvAdmin && (
            <DeleteUserModal
              userId={user.id}
              username={user.username}
            />
          )}
        </div>
      </div>
    </Card>
  )
}

const AddUserModal: FC<{ onUserAdded: () => void }> = function ({ onUserAdded }) {
  const [isOpen, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await apiService.post('/api/admin/users', {
        username,
        password,
        role
      })
      if (response.success) {
        setOpen(false)
        setUsername('')
        setPassword('')
        setRole('admin')
        onUserAdded()
      } else {
        setError(response.error?.message || 'Failed to create user')
      }
    } catch {
      setError('Network error')
    }
  }

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <HiPlus className="mr-2" />
        新增用戶
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <HiUser className="text-xl text-green-500" />
            <strong>新增用戶</strong>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">用戶名</Label>
              <TextInput
                id="username"
                placeholder="請輸入用戶名"
                className="mt-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">密碼</Label>
              <TextInput
                id="password"
                type="password"
                placeholder="請輸入密碼"
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">角色</Label>
              <select
                id="role"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            {error && (
              <Alert color="failure">
                {error}
              </Alert>
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

const DeleteUserModal: FC<{ userId: number; username: string; onDeleted?: () => void }> = function ({
  userId,
  username,
  onDeleted = () => { },
}) {
  const [isOpen, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await apiService.request({
        url: `/api/admin/users/${userId}`,
        method: 'DELETE'
      })
      if (response.success) {
        setOpen(false)
        onDeleted()
      }
    } catch {
      // Handle error
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Button color="failure" size="xs" onClick={() => setOpen(!isOpen)} disabled={deleting}>
        <HiTrash className="mr-1" />
        {deleting ? '刪除中...' : '刪除'}
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <HiOutlineExclamationCircle className="text-red-500" />
            <strong>確認刪除</strong>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col items-center gap-y-4 text-center">
            <HiOutlineExclamationCircle className="text-6xl text-red-500" />
            <p className="text-gray-600 dark:text-gray-300">
              確定要刪除用戶 <strong>{username}</strong> 嗎？<br />
              <span className="text-sm text-gray-500">此操作無法撤銷</span>
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={handleDelete}>
                確認刪除
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                取消
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default UsersManagementPage
