import { Users, Calendar, DollarSign, AlertCircle } from 'lucide-react'
import { getDashboardStatsAction } from '@/actions/dashboard'
import { formatCurrency } from '@/lib/utils'
import { DevUserInfo } from '@/components/ui/DevModeIndicator'

const defaultStats = {
  totalClients: 0,
  activeClients: 0,
  pendingPayments: 0,
  monthlyRevenue: 0,
  upcomingAppointments: 0,
}

export default async function DashboardPage() {
  const result = await getDashboardStatsAction()
  const stats = result.success ? result.data! : defaultStats

  const statCards = [
    {
      title: 'Total de Clientes',
      value: stats.totalClients.toString(),
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Clientes Ativos',
      value: stats.activeClients.toString(),
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'bg-primary-500',
    },
    {
      title: 'Pagamentos Pendentes',
      value: stats.pendingPayments.toString(),
      icon: AlertCircle,
      color: 'bg-orange-500',
    },
    {
      title: 'Próximos Agendamentos',
      value: stats.upcomingAppointments.toString(),
      icon: Calendar,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div>
      {/* Informação de desenvolvimento */}
      <DevUserInfo />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral dos seus negócios</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat) => (
          <div key={stat.title} className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Resumo</h2>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-md mb-3 font-medium text-gray-900">
                Próximas Ações
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                  {stats.upcomingAppointments} agendamentos esta semana
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <AlertCircle className="mr-2 h-4 w-4 text-orange-500" />
                  {stats.pendingPayments} pagamentos pendentes
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4 text-green-500" />
                  {stats.activeClients} clientes ativos
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-md mb-3 font-medium text-gray-900">
                Performance do Mês
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Receita:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(stats.monthlyRevenue)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Novos clientes:</span>
                  <span className="font-medium text-gray-900">
                    {Math.max(0, stats.totalClients - stats.activeClients)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
