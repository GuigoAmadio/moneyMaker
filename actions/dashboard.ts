'use server'

import type { DashboardStats, ApiResponse } from '@/types'
import { serverGet } from '@/lib/api'

// Buscar estatísticas do dashboard
export async function getDashboardStatsAction(): Promise<{
  success: boolean
  data?: DashboardStats
  message: string
}> {
  try {
    const result = await serverGet<DashboardStats>('/dashboard/stats')

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

// Buscar dados do gráfico de vendas
export async function getSalesChartAction(): Promise<{
  success: boolean
  data?: any[]
  message: string
}> {
  try {
    const result = await serverGet<any[]>('/dashboard/sales-chart')

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

// Buscar atividades recentes
export async function getRecentActivitiesAction(): Promise<{
  success: boolean
  data?: any[]
  message: string
}> {
  try {
    const result = await serverGet<any[]>('/dashboard/recent-activities')

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
