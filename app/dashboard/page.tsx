import {
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { getDashboardStatsAction } from '@/actions/dashboard'
import { formatCurrency } from '@/lib/utils'
import { DevUserInfo } from '@/components/ui/DevModeIndicator'
import AnimatedDiv, {
  AnimatedContainer,
} from '@/components/animations/AnimatedDiv'

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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Clientes Ativos',
      value: stats.activeClients.toString(),
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      title: 'Pagamentos Pendentes',
      value: stats.pendingPayments.toString(),
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Próximos Agendamentos',
      value: stats.upcomingAppointments.toString(),
      icon: Calendar,
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-50',
      iconColor: 'text-secondary-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Informação de desenvolvimento */}
      <DevUserInfo />

      <AnimatedDiv animationType="fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Bem-vindo de volta! Aqui está o resumo dos seus negócios
          </p>
        </div>
      </AnimatedDiv>

      {/* Stats Grid */}
      <AnimatedContainer animationType="slideUp">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((stat, index) => (
            <AnimatedDiv
              key={stat.title}
              animationType="scale"
              delay={index * 0.1}
              whileHover={true}
            >
              <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} rounded-lg p-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div
                  className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${stat.color} origin-left scale-x-0 transform transition-transform duration-300 group-hover:scale-x-100`}
                ></div>
              </div>
            </AnimatedDiv>
          ))}
        </div>
      </AnimatedContainer>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <AnimatedDiv animationType="slideLeft" delay={0.3}>
          <div className="rounded-xl bg-white shadow-lg">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-100 p-2">
                  <Clock className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Próximas Ações
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">
                      Agendamentos
                    </span>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {stats.upcomingAppointments} esta semana
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-orange-50 p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-gray-900">
                      Pagamentos
                    </span>
                  </div>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                    {stats.pendingPayments} pendentes
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">
                      Clientes Ativos
                    </span>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    {stats.activeClients} clientes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedDiv>

        {/* Performance Summary */}
        <AnimatedDiv animationType="slideRight" delay={0.4}>
          <div className="rounded-xl bg-white shadow-lg">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary-100 p-2">
                  <TrendingUp className="h-5 w-5 text-secondary-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Performance do Mês
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Receita Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(stats.monthlyRevenue)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Novos Clientes</span>
                    <span className="font-semibold text-gray-900">
                      {Math.max(0, stats.totalClients - stats.activeClients)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de Conversão</span>
                    <span className="font-semibold text-green-600">
                      {stats.totalClients > 0
                        ? Math.round(
                            (stats.activeClients / stats.totalClients) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Receita Média</span>
                    <span className="font-semibold text-gray-900">
                      {stats.activeClients > 0
                        ? formatCurrency(
                            stats.monthlyRevenue / stats.activeClients
                          )
                        : formatCurrency(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedDiv>
      </div>
    </div>
  )
}
