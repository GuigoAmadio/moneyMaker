import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Download,
  Calendar,
  Filter,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { DevUserInfo } from '@/components/ui/DevModeIndicator'
import AnimatedDiv, {
  AnimatedContainer,
} from '@/components/animations/AnimatedDiv'

// Mock data para desenvolvimento
const monthlyRevenue = [
  { month: 'Jan', revenue: 45000, clients: 23 },
  { month: 'Fev', revenue: 52000, clients: 28 },
  { month: 'Mar', revenue: 48000, clients: 25 },
  { month: 'Abr', revenue: 61000, clients: 31 },
  { month: 'Mai', revenue: 55000, clients: 29 },
  { month: 'Jun', revenue: 67000, clients: 34 },
]

const topServices = [
  { name: 'Desenvolvimento Web', revenue: 120000, percentage: 35 },
  { name: 'App Mobile', revenue: 95000, percentage: 28 },
  { name: 'Consultoria Digital', revenue: 68000, percentage: 20 },
  { name: 'Design UI/UX', revenue: 58000, percentage: 17 },
]

const clientsStats = [
  { status: 'Ativos', count: 142, color: 'bg-green-500' },
  { status: 'Inativos', count: 28, color: 'bg-gray-500' },
  { status: 'Pendentes', count: 15, color: 'bg-yellow-500' },
]

export default function RelatoriosPage() {
  const totalRevenue = monthlyRevenue.reduce(
    (sum, month) => sum + month.revenue,
    0
  )
  const averageMonthlyRevenue = totalRevenue / monthlyRevenue.length
  const growthRate = (
    ((monthlyRevenue[5].revenue - monthlyRevenue[0].revenue) /
      monthlyRevenue[0].revenue) *
    100
  ).toFixed(1)

  return (
    <div className="space-y-6">
      <DevUserInfo />

      {/* Header */}
      <AnimatedDiv animationType="fadeIn">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">
              Análise detalhada do desempenho do negócio
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg hover:from-primary-700 hover:to-secondary-700">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </AnimatedDiv>

      {/* KPI Cards */}
      <AnimatedContainer animationType="slideUp">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            {
              label: 'Receita Total',
              value: `R$ ${(totalRevenue / 1000).toFixed(0)}k`,
              change: `+${growthRate}%`,
              changeType: 'positive',
              color: 'from-green-500 to-green-600',
              icon: DollarSign,
            },
            {
              label: 'Média Mensal',
              value: `R$ ${(averageMonthlyRevenue / 1000).toFixed(0)}k`,
              change: '+12%',
              changeType: 'positive',
              color: 'from-blue-500 to-blue-600',
              icon: TrendingUp,
            },
            {
              label: 'Clientes Ativos',
              value: '142',
              change: '+8',
              changeType: 'positive',
              color: 'from-purple-500 to-purple-600',
              icon: Users,
            },
            {
              label: 'Taxa de Crescimento',
              value: `${growthRate}%`,
              change: '+2.3%',
              changeType: 'positive',
              color: 'from-orange-500 to-orange-600',
              icon: BarChart3,
            },
          ].map((kpi, index) => (
            <AnimatedDiv
              key={kpi.label}
              animationType="scale"
              delay={index * 0.1}
            >
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`h-12 w-12 rounded-xl bg-gradient-to-r ${kpi.color} flex items-center justify-center`}
                  >
                    <kpi.icon className="h-6 w-6 text-white" />
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-sm font-medium bg-${
                      kpi.changeType === 'positive'
                        ? 'green-100 text-green-800'
                        : 'red-100 text-red-800'
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
                <p className="mb-1 text-sm text-gray-600">{kpi.label}</p>
                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            </AnimatedDiv>
          ))}
        </div>
      </AnimatedContainer>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <AnimatedDiv animationType="slideLeft" delay={0.2}>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
              Receita Mensal
            </h2>
            <div className="space-y-4">
              {monthlyRevenue.map((month, index) => {
                const maxRevenue = Math.max(
                  ...monthlyRevenue.map((m) => m.revenue)
                )
                const percentage = (month.revenue / maxRevenue) * 100

                return (
                  <div key={month.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {month.month}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        R$ {(month.revenue / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </AnimatedDiv>

        {/* Top Services */}
        <AnimatedDiv animationType="slideRight" delay={0.2}>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
              Serviços Mais Rentáveis
            </h2>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full bg-gradient-to-r ${
                        index === 0
                          ? 'from-green-400 to-green-600'
                          : index === 1
                            ? 'from-blue-400 to-blue-600'
                            : index === 2
                              ? 'from-purple-400 to-purple-600'
                              : 'from-orange-400 to-orange-600'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {service.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {service.percentage}% do total
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    R$ {(service.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedDiv>
      </div>

      {/* Clients Distribution */}
      <AnimatedDiv animationType="slideUp" delay={0.4}>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Distribuição de Clientes
              </h2>
              <p className="text-sm text-gray-600">
                Status atual da base de clientes
              </p>
            </div>
            <Users className="h-6 w-6 text-primary-600" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {clientsStats.map((stat, index) => (
              <AnimatedDiv
                key={stat.status}
                animationType="scale"
                delay={index * 0.1}
              >
                <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-center">
                  <div
                    className={`mx-auto mb-4 h-16 w-16 rounded-full ${stat.color} flex items-center justify-center`}
                  >
                    <span className="text-2xl font-bold text-white">
                      {stat.count}
                    </span>
                  </div>
                  <h3 className="mb-1 font-semibold text-gray-900">
                    {stat.status}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {(
                      (stat.count /
                        clientsStats.reduce((sum, s) => sum + s.count, 0)) *
                      100
                    ).toFixed(1)}
                    % do total
                  </p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </AnimatedDiv>

      {/* Quick Actions */}
      <AnimatedDiv animationType="fadeIn" delay={0.6}>
        <div className="rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50 to-secondary-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Ações Rápidas
              </h3>
              <p className="text-sm text-gray-600">
                Exportar relatórios ou configurar alertas
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-primary-200 text-primary-700 hover:bg-primary-100"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Relatório Mensal
              </Button>
              <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>
      </AnimatedDiv>
    </div>
  )
}
