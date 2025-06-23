'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Download,
  Calendar,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
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

// Detectar tipo de tenant baseado na URL ou localStorage
const detectTenantType = ():
  | 'imobiliaria'
  | 'clinica'
  | 'autopecas'
  | 'master' => {
  if (typeof window === 'undefined') return 'master'

  const path = window.location.pathname
  const storedType = localStorage.getItem('currentTenantType')

  if (path.includes('/imobiliaria')) return 'imobiliaria'
  if (path.includes('/clinica')) return 'clinica'
  if (path.includes('/autopecas')) return 'autopecas'
  if (storedType) return storedType as any

  return 'master'
}

// Configurações específicas por tipo de negócio
const tenantConfigs = {
  imobiliaria: {
    title: 'Relatórios Imobiliários',
    description: 'Analise o desempenho de vendas e locações',
    color: 'purple',
    icon: '🏠',
    reports: [
      {
        id: 'vendas-periodo',
        title: 'Vendas por Período',
        description: 'Relatório de vendas realizadas em um período específico',
        type: 'Vendas',
      },
      {
        id: 'leads-conversao',
        title: 'Conversão de Leads',
        description: 'Análise da conversão de leads em vendas/locações',
        type: 'Leads',
      },
      {
        id: 'imoveis-populares',
        title: 'Imóveis Mais Visitados',
        description: 'Ranking dos imóveis com mais visitas agendadas',
        type: 'Imóveis',
      },
      {
        id: 'comissoes',
        title: 'Relatório de Comissões',
        description: 'Comissões por corretor e período',
        type: 'Financeiro',
      },
      {
        id: 'tempo-venda',
        title: 'Tempo Médio de Venda',
        description: 'Análise do tempo médio para venda/locação',
        type: 'Performance',
      },
      {
        id: 'regiao-demanda',
        title: 'Demanda por Região',
        description: 'Análise de demanda por bairros e regiões',
        type: 'Localização',
      },
    ],
  },
  clinica: {
    title: 'Relatórios Médicos',
    description: 'Analise atendimentos e desempenho da clínica',
    color: 'green',
    icon: '🏥',
    reports: [
      {
        id: 'consultas-periodo',
        title: 'Consultas por Período',
        description: 'Relatório de consultas realizadas por data',
        type: 'Atendimentos',
      },
      {
        id: 'receita-medica',
        title: 'Receita por Médico',
        description: 'Faturamento por profissional médico',
        type: 'Financeiro',
      },
      {
        id: 'especialidades',
        title: 'Atendimentos por Especialidade',
        description: 'Distribuição de consultas por especialidade médica',
        type: 'Especialidades',
      },
      {
        id: 'pacientes-frequencia',
        title: 'Frequência de Pacientes',
        description: 'Análise de retorno e frequência dos pacientes',
        type: 'Pacientes',
      },
      {
        id: 'horarios-pico',
        title: 'Horários de Maior Demanda',
        description: 'Análise dos horários com mais agendamentos',
        type: 'Agenda',
      },
      {
        id: 'convenios',
        title: 'Relatório por Convênio',
        description: 'Distribuição de atendimentos por convênio',
        type: 'Convênios',
      },
    ],
  },
  autopecas: {
    title: 'Relatórios Comerciais',
    description: 'Analise vendas, estoque e fornecedores',
    color: 'blue',
    icon: '🔧',
    reports: [
      {
        id: 'vendas-produtos',
        title: 'Vendas por Produto',
        description: 'Relatório de produtos mais vendidos',
        type: 'Vendas',
      },
      {
        id: 'estoque-baixo',
        title: 'Produtos em Estoque Baixo',
        description: 'Relatório de produtos que precisam de reposição',
        type: 'Estoque',
      },
      {
        id: 'fornecedores-performance',
        title: 'Performance de Fornecedores',
        description: 'Análise de entrega e qualidade dos fornecedores',
        type: 'Fornecedores',
      },
      {
        id: 'margem-lucro',
        title: 'Margem de Lucro por Categoria',
        description: 'Análise de lucratividade por categoria de produto',
        type: 'Financeiro',
      },
      {
        id: 'giro-estoque',
        title: 'Giro de Estoque',
        description: 'Velocidade de rotação dos produtos',
        type: 'Estoque',
      },
      {
        id: 'sazonalidade',
        title: 'Análise de Sazonalidade',
        description: 'Variação de vendas por época do ano',
        type: 'Vendas',
      },
    ],
  },
  master: {
    title: 'Relatórios Gerais',
    description: 'Visão geral de todos os negócios',
    color: 'gray',
    icon: '📊',
    reports: [
      {
        id: 'visao-geral',
        title: 'Visão Geral',
        description: 'Dashboard executivo com principais métricas',
        type: 'Geral',
      },
    ],
  },
}

export default function RelatoriosPage() {
  const [tenantType, setTenantType] =
    useState<keyof typeof tenantConfigs>('master')
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  })

  useEffect(() => {
    setTenantType(detectTenantType())

    // Definir período padrão (últimos 30 dias)
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    setDateRange({
      start: thirtyDaysAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0],
    })
  }, [])

  const config = tenantConfigs[tenantType]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple':
        return {
          bg: 'bg-purple-600 hover:bg-purple-700',
          border: 'border-purple-200',
          text: 'text-purple-600',
          lightBg: 'bg-purple-50',
        }
      case 'green':
        return {
          bg: 'bg-green-600 hover:bg-green-700',
          border: 'border-green-200',
          text: 'text-green-600',
          lightBg: 'bg-green-50',
        }
      case 'blue':
        return {
          bg: 'bg-blue-600 hover:bg-blue-700',
          border: 'border-blue-200',
          text: 'text-blue-600',
          lightBg: 'bg-blue-50',
        }
      default:
        return {
          bg: 'bg-gray-600 hover:bg-gray-700',
          border: 'border-gray-200',
          text: 'text-gray-600',
          lightBg: 'bg-gray-50',
        }
    }
  }

  const colors = getColorClasses(config.color)

  const handleGenerateReport = (reportId: string) => {
    // Aqui seria implementada a lógica de geração do relatório
    alert(
      `Gerando relatório: ${reportId}\nPeríodo: ${dateRange.start} até ${dateRange.end}`
    )
  }

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)

    const today = new Date()
    const startDate = new Date(today)

    switch (period) {
      case '7':
        startDate.setDate(today.getDate() - 7)
        break
      case '30':
        startDate.setDate(today.getDate() - 30)
        break
      case '90':
        startDate.setDate(today.getDate() - 90)
        break
      case '365':
        startDate.setFullYear(today.getFullYear() - 1)
        break
      case 'custom':
        return // Usuário define as datas manualmente
    }

    setDateRange({
      start: startDate.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0],
    })
  }

  const reportTypes = Array.from(new Set(config.reports.map((r) => r.type)))

  return (
    <div className="space-y-6">
      <DevUserInfo />

      {/* Header */}
      <AnimatedDiv animation="fadeIn">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <span className="text-3xl">{config.icon}</span>
              {config.title}
            </h1>
            <p className="text-gray-600">{config.description}</p>
          </div>
          <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg hover:from-primary-700 hover:to-secondary-700">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </AnimatedDiv>

      {/* Filtros de Período */}
      <AnimatedDiv className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Período Rápido
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Último ano</option>
              <option value="custom">Período personalizado</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Data Inicial
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Data Final
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSelectedPeriod('30')
                handlePeriodChange('30')
              }}
              variant="outline"
              className="w-full"
            >
              Resetar Filtros
            </Button>
          </div>
        </div>
      </AnimatedDiv>

      {/* KPI Cards */}
      <AnimatedContainer animationType="slideUp">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            {
              label: 'Receita Total',
              value: `R$ ${(monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0) / 1000).toFixed(0)}k`,
              change: '+12%',
              changeType: 'positive',
              color: 'from-green-500 to-green-600',
              icon: DollarSign,
            },
            {
              label: 'Média Mensal',
              value: `R$ ${(monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0) / monthlyRevenue.length / 1000).toFixed(0)}k`,
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
              value: '+12%',
              change: '+2.3%',
              changeType: 'positive',
              color: 'from-orange-500 to-orange-600',
              icon: BarChart3,
            },
          ].map((kpi, index) => (
            <AnimatedDiv key={kpi.label} animation="scale" delay={index * 0.1}>
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
        <AnimatedDiv animation="slideLeft" delay={0.2}>
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
        <AnimatedDiv animation="slideRight" delay={0.2}>
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
      <AnimatedDiv animation="slideUp" delay={0.4}>
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
                animation="scale"
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
      <AnimatedDiv animation="fadeIn" delay={0.6}>
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

      {/* Relatórios por Categoria */}
      {reportTypes.map((type, typeIndex) => (
        <AnimatedDiv key={type} delay={typeIndex * 0.1}>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <div
              className={`h-3 w-3 rounded-full ${colors.lightBg} border-2 ${colors.border}`}
            ></div>
            Relatórios de {type}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {config.reports
              .filter((report) => report.type === type)
              .map((report, index) => (
                <AnimatedDiv
                  key={report.id}
                  delay={typeIndex * 0.1 + index * 0.05}
                  className="rounded-lg border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-2 font-semibold text-gray-900">
                          {report.title}
                        </h3>
                        <p className="mb-4 text-sm text-gray-600">
                          {report.description}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.lightBg} ${colors.text}`}
                        >
                          {report.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleGenerateReport(report.id)}
                        className={`flex-1 ${colors.bg} text-white`}
                        size="sm"
                      >
                        Gerar Relatório
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          alert(`Visualizando prévia de: ${report.title}`)
                        }
                      >
                        Prévia
                      </Button>
                    </div>
                  </div>
                </AnimatedDiv>
              ))}
          </div>
        </AnimatedDiv>
      ))}

      {/* Seção de Desenvolvimento */}
      <AnimatedDiv className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
        <div className="flex items-center space-x-3">
          <div className="text-2xl text-yellow-600">⚠️</div>
          <div>
            <h3 className="font-semibold text-yellow-800">
              Relatórios em Desenvolvimento
            </h3>
            <p className="mt-1 text-yellow-700">
              Os relatórios estão sendo implementados. Por enquanto, você pode
              visualizar a estrutura e configurar os períodos. Em breve, todos
              os relatórios estarão funcionais com dados reais.
            </p>
          </div>
        </div>
      </AnimatedDiv>
    </div>
  )
}
