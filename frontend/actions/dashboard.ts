'use server'

import { revalidateTag, unstable_cache } from 'next/cache'
import type { DashboardStats, ApiResponse } from '@/types'
import { serverGet } from '@/lib/api'

// Cache otimizado para estatísticas do dashboard
const getCachedDashboardStats = unstable_cache(
  async () => {
    return serverGet<DashboardStats>('/dashboard/stats')
  },
  ['dashboard-stats'],
  {
    revalidate: 300, // 5 minutos
    tags: ['dashboard', 'stats'],
  }
)

// Cache otimizado para gráfico de vendas
const getCachedSalesChart = unstable_cache(
  async () => {
    return serverGet<any[]>('/dashboard/sales-chart')
  },
  ['sales-chart'],
  {
    revalidate: 600, // 10 minutos
    tags: ['dashboard', 'sales'],
  }
)

// Cache otimizado para atividades recentes
const getCachedRecentActivities = unstable_cache(
  async () => {
    return serverGet<any[]>('/dashboard/recent-activities')
  },
  ['recent-activities'],
  {
    revalidate: 60, // 1 minuto
    tags: ['dashboard', 'activities'],
  }
)

// Buscar estatísticas do dashboard (otimizado)
export async function getDashboardStatsAction(): Promise<{
  success: boolean
  data?: DashboardStats
  message: string
}> {
  try {
    const result = await getCachedDashboardStats()

    return {
      success: true,
      data: result.data,
      message: 'Estatísticas carregadas com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Buscar dados do gráfico de vendas (otimizado)
export async function getSalesChartAction(): Promise<{
  success: boolean
  data?: any[]
  message: string
}> {
  try {
    const result = await getCachedSalesChart()

    return {
      success: true,
      data: result.data,
      message: 'Dados do gráfico carregados com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar dados do gráfico:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Buscar atividades recentes (otimizado)
export async function getRecentActivitiesAction(): Promise<{
  success: boolean
  data?: any[]
  message: string
}> {
  try {
    const result = await getCachedRecentActivities()

    return {
      success: true,
      data: result.data,
      message: 'Atividades carregadas com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar atividades:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Função para invalidar cache do dashboard
export async function revalidateDashboard() {
  revalidateTag('dashboard')
}

// Função para invalidar cache específico
export async function revalidateStats() {
  revalidateTag('stats')
}

export async function revalidateSales() {
  revalidateTag('sales')
}

export async function revalidateActivities() {
  revalidateTag('activities')
}

export async function getPropertyDashboardAction() {
  try {
    const result = await serverGet<any>('/properties/dashboard')

    const stats = {
      totalImoveis: result.data?.totalProperties || 0,
      imoveisDisponiveis: result.data?.availableProperties || 0,
      imoveisVendidos: result.data?.soldProperties || 0,
      imoveisAlugados: result.data?.rentedProperties || 0,
      totalLeads: result.data?.totalLeads || 0,
      leadsConvertidos: result.data?.convertedLeads || 0,
      visitasAgendadas: result.data?.scheduledVisits || 0,
      receitaTotal: result.data?.totalRevenue || 0,
      ticketMedio: result.data?.averageTicket || 0,
      chartData: result.data?.chartData || [],
      recentProperties: result.data?.recentProperties || [],
      topPerformers: result.data?.topPerformers || [],
    }

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas de imóveis:', error)
    return {
      success: false,
      data: {
        totalImoveis: 0,
        imoveisDisponiveis: 0,
        imoveisVendidos: 0,
        imoveisAlugados: 0,
        totalLeads: 0,
        leadsConvertidos: 0,
        visitasAgendadas: 0,
        receitaTotal: 0,
        ticketMedio: 0,
        chartData: [],
        recentProperties: [],
        topPerformers: [],
      },
      error: 'Erro ao carregar estatísticas de imóveis',
    }
  }
}

export async function getClinicaDashboardAction() {
  try {
    const result = await serverGet<any>('/doctors/dashboard')

    const stats = {
      totalPacientes: result.data?.totalPatients || 0,
      consultasHoje: result.data?.appointmentsToday || 0,
      consultasSemana: result.data?.appointmentsWeek || 0,
      consultasMes: result.data?.appointmentsMonth || 0,
      totalMedicos: result.data?.totalDoctors || 0,
      medicosAtivos: result.data?.activeDoctors || 0,
      receitaTotal: result.data?.totalRevenue || 0,
      ticketMedio: result.data?.averageTicket || 0,
      chartData: result.data?.chartData || [],
      upcomingAppointments: result.data?.upcomingAppointments || [],
      topDoctors: result.data?.topDoctors || [],
    }

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas da clínica:', error)
    return {
      success: false,
      data: {
        totalPacientes: 0,
        consultasHoje: 0,
        consultasSemana: 0,
        consultasMes: 0,
        totalMedicos: 0,
        medicosAtivos: 0,
        receitaTotal: 0,
        ticketMedio: 0,
        chartData: [],
        upcomingAppointments: [],
        topDoctors: [],
      },
      error: 'Erro ao carregar estatísticas da clínica',
    }
  }
}

export async function getAutopecasDashboardAction() {
  try {
    const result = await serverGet<any>('/products/dashboard')

    const stats = {
      totalProdutos: result.data?.totalProducts || 0,
      produtosAtivos: result.data?.activeProducts || 0,
      produtosBaixoEstoque: result.data?.lowStockProducts || 0,
      produtosSemEstoque: result.data?.outOfStockProducts || 0,
      totalPedidos: result.data?.totalOrders || 0,
      pedidosHoje: result.data?.ordersToday || 0,
      totalFornecedores: result.data?.totalSuppliers || 0,
      fornecedoresAtivos: result.data?.activeSuppliers || 0,
      receitaTotal: result.data?.totalRevenue || 0,
      ticketMedio: result.data?.averageTicket || 0,
      chartData: result.data?.chartData || [],
      recentOrders: result.data?.recentOrders || [],
      topProducts: result.data?.topProducts || [],
    }

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas de autopeças:', error)
    return {
      success: false,
      data: {
        totalProdutos: 0,
        produtosAtivos: 0,
        produtosBaixoEstoque: 0,
        produtosSemEstoque: 0,
        totalPedidos: 0,
        pedidosHoje: 0,
        totalFornecedores: 0,
        fornecedoresAtivos: 0,
        receitaTotal: 0,
        ticketMedio: 0,
        chartData: [],
        recentOrders: [],
        topProducts: [],
      },
      error: 'Erro ao carregar estatísticas de autopeças',
    }
  }
}
