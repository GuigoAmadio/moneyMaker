import { Suspense } from 'react'
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { DevUserInfo } from '@/components/ui/DevModeIndicator'
import AnimatedDiv, {
  AnimatedContainer,
} from '@/components/animations/AnimatedDiv'

// Mock data para desenvolvimento
const mockAppointments = [
  {
    id: '1',
    clientName: 'João Silva',
    serviceName: 'Desenvolvimento Web',
    date: '2024-01-20',
    time: '14:00',
    status: 'scheduled' as const,
    notes: 'Reunião inicial para definir escopo do projeto',
  },
  {
    id: '2',
    clientName: 'Maria Santos',
    serviceName: 'Consultoria Digital',
    date: '2024-01-22',
    time: '10:30',
    status: 'completed' as const,
    notes: 'Análise completa da estratégia digital',
  },
  {
    id: '3',
    clientName: 'Pedro Costa',
    serviceName: 'App Mobile',
    date: '2024-01-25',
    time: '16:00',
    status: 'cancelled' as const,
    notes: 'Cliente cancelou devido a mudanças no orçamento',
  },
]

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels = {
  scheduled: 'Agendado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
}

const statusIcons = {
  scheduled: Clock,
  completed: CheckCircle,
  cancelled: XCircle,
}

const upcomingAppointments = mockAppointments.filter(
  (apt) => apt.status === 'scheduled' && new Date(apt.date) >= new Date()
)

export default function AgendamentosPage() {
  return (
    <div className="space-y-6">
      {/* Dev Info */}
      <DevUserInfo />

      {/* Header */}
      <AnimatedDiv animationType="fadeIn">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
            <p className="text-gray-600">
              Gerencie seus compromissos e reuniões
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg hover:from-primary-700 hover:to-secondary-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </AnimatedDiv>

      {/* Stats Cards */}
      <AnimatedContainer animationType="slideUp">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            {
              label: 'Agendamentos Hoje',
              value: '3',
              color: 'from-blue-500 to-blue-600',
              icon: Calendar,
            },
            {
              label: 'Esta Semana',
              value: '12',
              color: 'from-green-500 to-green-600',
              icon: Clock,
            },
            {
              label: 'Concluídos',
              value: '85',
              color: 'from-purple-500 to-purple-600',
              icon: CheckCircle,
            },
            {
              label: 'Cancelados',
              value: '5',
              color: 'from-red-500 to-red-600',
              icon: XCircle,
            },
          ].map((stat, index) => (
            <AnimatedDiv
              key={stat.label}
              animationType="scale"
              delay={index * 0.1}
            >
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-r ${stat.color} mb-4 flex items-center justify-center`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="mb-1 text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </AnimatedDiv>
          ))}
        </div>
      </AnimatedContainer>

      {/* Quick View - Próximos Agendamentos */}
      <AnimatedDiv animationType="slideUp" delay={0.2}>
        <div className="rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50 to-secondary-50 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Próximos Agendamentos
              </h2>
              <p className="text-sm text-gray-600">
                Compromissos para os próximos dias
              </p>
            </div>
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>

          <div className="grid gap-4">
            {upcomingAppointments.slice(0, 3).map((appointment, index) => (
              <AnimatedDiv
                key={appointment.id}
                animationType="fadeIn"
                delay={index * 0.1}
              >
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {appointment.clientName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {appointment.serviceName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString(
                            'pt-BR'
                          )}{' '}
                          às {appointment.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColors[appointment.status]}`}
                      >
                        {statusLabels[appointment.status]}
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </AnimatedDiv>

      {/* Filters */}
      <AnimatedDiv animationType="slideUp" delay={0.3}>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="flex flex-wrap gap-3">
              <select className="rounded-lg border border-gray-200 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary-500">
                <option value="">Todos os Status</option>
                <option value="scheduled">Agendado</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
              <input
                type="date"
                className="rounded-lg border border-gray-200 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Button variant="outline" className="border-gray-200">
              <Filter className="mr-2 h-4 w-4" />
              Mais Filtros
            </Button>
          </div>
        </div>
      </AnimatedDiv>

      {/* Appointments List */}
      <AnimatedDiv animationType="slideUp" delay={0.4}>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Agendamentos
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {mockAppointments.map((appointment, index) => {
              const StatusIcon = statusIcons[appointment.status]
              return (
                <AnimatedDiv
                  key={appointment.id}
                  animationType="fadeIn"
                  delay={index * 0.1}
                >
                  <div className="p-6 transition-colors hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`h-12 w-12 rounded-xl bg-gradient-to-r ${
                            appointment.status === 'scheduled'
                              ? 'from-blue-500 to-blue-600'
                              : appointment.status === 'completed'
                                ? 'from-green-500 to-green-600'
                                : 'from-red-500 to-red-600'
                          } flex items-center justify-center`}
                        >
                          <StatusIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {appointment.clientName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.serviceName}
                          </p>
                          <p className="mt-1 flex items-center text-sm text-gray-500">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(appointment.date).toLocaleDateString(
                              'pt-BR'
                            )}{' '}
                            às {appointment.time}
                          </p>
                          {appointment.notes && (
                            <p className="mt-1 text-sm text-gray-500">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColors[appointment.status]}`}
                        >
                          {statusLabels[appointment.status]}
                        </span>
                        <div className="flex space-x-2">
                          {appointment.status === 'scheduled' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                              >
                                Concluir
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                Cancelar
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Editar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedDiv>
              )
            })}
          </div>
        </div>
      </AnimatedDiv>
    </div>
  )
}
