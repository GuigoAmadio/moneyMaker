'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Calendar,
  Clock,
  User as UserIcon,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import AnimatedDiv, {
  AnimatedContainer,
} from '@/components/animations/AnimatedDiv'
import {
  getAppointmentsAction,
  createAppointmentAction,
  updateAppointmentStatusAction,
  deleteAppointmentAction,
  getTodaysAppointmentsAction,
} from '@/actions/appointments'
import { getUsersAction } from '@/actions/clients'
import { getEmployeesAction } from '@/actions/employees'
import type { Appointment, User, Employee } from '@/types'
import type { AppointmentInput } from '@/lib/validations'

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>(
    []
  )
  const [users, setUsers] = useState<User[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState('')

  // Form state para criação/edição
  const [formData, setFormData] = useState<AppointmentInput>({
    userId: '',
    employeeId: '',
    serviceId: '',
    startTime: '',
    endTime: '',
    notes: '',
  })

  // Função loadAppointments com useCallback para evitar dependências desnecessárias
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getAppointmentsAction({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
      })

      if (result.success && result.data) {
        setAppointments(result.data.data)
        setTotalPages(result.data.totalPages)
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, statusFilter])

  const loadFormData = async () => {
    try {
      const [usersResult, employeesResult] = await Promise.all([
        getUsersAction({ limit: 100 }),
        getEmployeesAction({ limit: 100 }),
      ])

      if (usersResult.success && usersResult.data) {
        setUsers(usersResult.data.data)
      }

      if (employeesResult.success && employeesResult.data) {
        setEmployees(employeesResult.data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do formulário:', error)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [currentPage, searchTerm, statusFilter])

  useEffect(() => {
    loadFormData()
  }, [])

  // Handlers
  const handleCreateAppointment = () => {
    setEditingAppointment(null)
    setFormData({
      userId: '',
      employeeId: '',
      serviceId: '',
      startTime: '',
      endTime: '',
      notes: '',
    })
    setIsModalOpen(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setFormData({
      userId: appointment.userId,
      employeeId: appointment.employeeId,
      serviceId: appointment.serviceId,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      notes: appointment.notes || '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = await createAppointmentAction(formData)

      if (result.success) {
        setIsModalOpen(false)
        loadAppointments()
        setFormData({
          userId: '',
          employeeId: '',
          serviceId: '',
          startTime: '',
          endTime: '',
          notes: '',
        })
        setMessage(result.message)
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error)
    }
  }

  const handleStatusChange = async (
    appointmentId: string,
    status: Appointment['status']
  ) => {
    try {
      const result = await updateAppointmentStatusAction(appointmentId, status)
      if (result.success) {
        loadAppointments()
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (confirm('Tem certeza que deseja deletar este agendamento?')) {
      try {
        const result = await deleteAppointmentAction(appointmentId)
        if (result.success) {
          loadAppointments()
        }
      } catch (error) {
        console.error('Erro ao deletar agendamento:', error)
      }
    }
  }

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600">Gerencie os agendamentos do sistema</p>
        </div>
        <Button onClick={handleCreateAppointment}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Hoje</p>
              <p className="text-2xl font-bold text-gray-900">
                {todaysAppointments.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Confirmados</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  todaysAppointments.filter((a) => a.status === 'CONFIRMED')
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  todaysAppointments.filter((a) => a.status === 'SCHEDULED')
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Cancelados</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  todaysAppointments.filter((a) => a.status === 'CANCELLED')
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Buscar agendamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="SCHEDULED">Agendado</option>
          <option value="CONFIRMED">Confirmado</option>
          <option value="IN_PROGRESS">Em Andamento</option>
          <option value="COMPLETED">Concluído</option>
          <option value="CANCELLED">Cancelado</option>
          <option value="NO_SHOW">Não Compareceu</option>
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Carregando agendamentos...</p>
        </div>
      ) : (
        <>
          {/* Tabela */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Funcionário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {appointments && appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(appointment.startTime)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(appointment.startTime)} -{' '}
                          {formatTime(appointment.endTime)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.user?.name || 'Cliente não encontrado'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.user?.email}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.employee?.name ||
                            'Funcionário não encontrado'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.employee?.position}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.service?.name ||
                            'Serviço não encontrado'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.service?.duration} min
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(appointment.status)}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="space-x-2 whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditAppointment(appointment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <select
                          value={appointment.status}
                          onChange={(e) =>
                            handleStatusChange(
                              appointment.id,
                              e.target.value as Appointment['status']
                            )
                          }
                          className="rounded border border-gray-300 px-2 py-1 text-sm"
                        >
                          <option value="SCHEDULED">Agendado</option>
                          <option value="CONFIRMED">Confirmado</option>
                          <option value="IN_PROGRESS">Em Andamento</option>
                          <option value="COMPLETED">Concluído</option>
                          <option value="CANCELLED">Cancelado</option>
                          <option value="NO_SHOW">Não Compareceu</option>
                        </select>
                        <button
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {loading
                        ? 'Carregando agendamentos...'
                        : 'Nenhum agendamento encontrado'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
        title={editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <select
              required
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um cliente</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Funcionário
            </label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) =>
                setFormData({ ...formData, employeeId: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um funcionário</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.position})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Data/Hora de Início
            </label>
            <input
              type="datetime-local"
              required
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Data/Hora de Fim
            </label>
            <input
              type="datetime-local"
              required
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observações sobre o agendamento..."
            />
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
            <Button type="submit">
              {editingAppointment ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
