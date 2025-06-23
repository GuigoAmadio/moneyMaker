'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Plus,
  Filter,
  Mail,
  Phone,
  Building,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { DevUserInfo } from '@/components/ui/DevModeIndicator'
import AnimatedDiv, {
  AnimatedContainer,
} from '@/components/animations/AnimatedDiv'
import Modal from '@/components/ui/Modal'
import {
  createUserAction,
  getUsersAction,
  updateUserStatusAction,
  deleteUserAction,
} from '@/actions/clients'
import type { User, PaginatedResponse } from '@/types'
import type { UserInput } from '@/lib/validations'

// Mock data para desenvolvimento
const mockClients = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    phone: '(11) 99999-9999',
    company: 'Tech Solutions Ltda',
    status: 'active' as const,
    paymentStatus: 'paid' as const,
    services: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@startup.com',
    phone: '(11) 88888-8888',
    company: 'StartupXYZ',
    status: 'active' as const,
    paymentStatus: 'pending' as const,
    services: [],
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@freelance.com',
    phone: '(11) 77777-7777',
    company: undefined,
    status: 'inactive' as const,
    paymentStatus: 'overdue' as const,
    services: [],
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
  },
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
}

const paymentStatusColors = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
}

const statusLabels = {
  active: 'Ativo',
  inactive: 'Inativo',
  pending: 'Pendente',
}

const paymentStatusLabels = {
  paid: 'Pago',
  pending: 'Pendente',
  overdue: 'Atrasado',
}

export default function ClientesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Form state para criação/edição
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    email: '',
    phone: '',
    role: 'CLIENT',
  })

  const [message, setMessage] = useState('')

  // Função loadUsers com useCallback para evitar dependências desnecessárias
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getUsersAction({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
      })

      if (result.success && result.data) {
        setUsers(result.data.data)
        setTotalPages(result.data.totalPages)
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, statusFilter])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  // Handlers
  const handleCreateUser = () => {
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'CLIENT',
    })
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = await createUserAction(formData)

      if (result.success) {
        setIsModalOpen(false)
        loadUsers()
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: 'CLIENT',
        })
        setMessage(result.message)
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
    }
  }

  const handleStatusChange = async (userId: string, status: User['status']) => {
    try {
      const result = await updateUserStatusAction(userId, status)
      if (result.success) {
        loadUsers()
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        const result = await deleteUserAction(userId)
        if (result.success) {
          loadUsers()
        }
      } catch (error) {
        console.error('Erro ao deletar usuário:', error)
      }
    }
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800'
      case 'PENDING_VERIFICATION':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800'
      case 'EMPLOYEE':
        return 'bg-indigo-100 text-indigo-800'
      case 'CLIENT':
        return 'bg-green-100 text-green-800'
      case 'GUEST':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Dev Info */}
      <DevUserInfo />

      {/* Header */}
      <AnimatedDiv animation="fadeIn">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-600">Gerencie os usuários do sistema</p>
          </div>
          <Button onClick={handleCreateUser}>Novo Usuário</Button>
        </div>
      </AnimatedDiv>

      {/* Stats Cards */}
      <AnimatedContainer animationType="slideUp">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            {
              label: 'Total de Usuários',
              value: '156',
              color: 'from-blue-500 to-blue-600',
            },
            {
              label: 'Usuários Ativos',
              value: '142',
              color: 'from-green-500 to-green-600',
            },
            {
              label: 'Usuários Inativos',
              value: '14',
              color: 'from-gray-500 to-gray-600',
            },
          ].map((stat, index) => (
            <AnimatedDiv key={stat.label} animation="scale" delay={index * 0.1}>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-r ${stat.color} mb-4 flex items-center justify-center`}
                >
                  <span className="text-xl font-bold text-white">
                    {stat.value.slice(0, 1)}
                  </span>
                </div>
                <p className="mb-1 text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </AnimatedDiv>
          ))}
        </div>
      </AnimatedContainer>

      {/* Filters and Search */}
      <AnimatedDiv animation="slideUp" delay={0.2}>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-gray-200">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </AnimatedDiv>

      {/* Loading */}
      {loading ? (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Carregando usuários...</p>
        </div>
      ) : (
        <>
          {/* Clients Table */}
          <AnimatedDiv animation="slideUp" delay={0.4}>
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Lista de Usuários
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-100 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Usuário
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Último Login
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user, index) => (
                      <AnimatedDiv
                        key={user.id}
                        animation="fadeIn"
                        delay={index * 0.1}
                      >
                        <tr className="transition-colors hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {user.avatar ? (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={user.avatar}
                                    alt={user.name}
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                                    <span className="text-sm font-medium text-gray-700">
                                      {user.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                                {user.phone && (
                                  <div className="text-sm text-gray-500">
                                    {user.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getRoleColor(user.role)}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(user.status)}`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {user.lastLogin
                              ? new Date(user.lastLogin).toLocaleDateString(
                                  'pt-BR'
                                )
                              : 'Nunca'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-gray-700"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </AnimatedDiv>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedDiv>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modal de Criação/Edição */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {!editingUser && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                required
                value={formData.password || ''}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as User['role'],
                })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CLIENT">Cliente</option>
              <option value="EMPLOYEE">Funcionário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {message && (
            <div className="rounded-md bg-blue-100 p-3 text-blue-700">
              {message}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">{editingUser ? 'Atualizar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
