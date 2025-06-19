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
  return (
    <div className="space-y-6">
      {/* Dev Info */}
      <DevUserInfo />

      {/* Header */}
      <AnimatedDiv animationType="fadeIn">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600">Gerencie seus clientes e contratos</p>
          </div>
          <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg hover:from-primary-700 hover:to-secondary-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </AnimatedDiv>

      {/* Stats Cards */}
      <AnimatedContainer animationType="slideUp">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            {
              label: 'Total de Clientes',
              value: '156',
              color: 'from-blue-500 to-blue-600',
            },
            {
              label: 'Clientes Ativos',
              value: '142',
              color: 'from-green-500 to-green-600',
            },
            {
              label: 'Pagamentos Pendentes',
              value: '8',
              color: 'from-yellow-500 to-yellow-600',
            },
            {
              label: 'Contratos Vencidos',
              value: '3',
              color: 'from-red-500 to-red-600',
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
      <AnimatedDiv animationType="slideUp" delay={0.2}>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Buscar clientes..."
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

      {/* Clients Table */}
      <AnimatedDiv animationType="slideUp" delay={0.4}>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Clientes
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contato
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Pagamento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Data de Cadastro
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockClients.map((client, index) => (
                  <AnimatedDiv
                    key={client.id}
                    animationType="fadeIn"
                    delay={index * 0.1}
                  >
                    <tr className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {client.name}
                          </div>
                          {client.company && (
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <Building className="mr-1 h-3 w-3" />
                              {client.company}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="mr-2 h-3 w-3 text-gray-400" />
                            {client.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="mr-2 h-3 w-3 text-gray-400" />
                            {client.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColors[client.status]}`}
                        >
                          {statusLabels[client.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${paymentStatusColors[client.paymentStatus]}`}
                        >
                          {paymentStatusLabels[client.paymentStatus]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
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
    </div>
  )
}
