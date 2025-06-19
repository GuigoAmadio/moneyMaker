'use server'

import { cookies } from 'next/headers'
import type { DashboardStats, ApiResponse } from '@/types'

const API_URL = process.env.API_URL || 'http://localhost:3001/api'

// Função auxiliar para obter token
function getAuthToken() {
  return cookies().get('auth_token')?.value
}

// Função auxiliar para headers com auth
function getAuthHeaders() {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Buscar estatísticas do dashboard
export async function getDashboardStatsAction(): Promise<{
  success: boolean
  data?: DashboardStats
  message: string
}> {
  try {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        message: error.message || 'Erro ao buscar estatísticas',
      }
    }

    const result: ApiResponse<DashboardStats> = await response.json()

    return {
      success: true,
      data: result.data,
      message: 'Estatísticas carregadas com sucesso',
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return {
      success: false,
      message: 'Erro interno do servidor',
    }
  }
} 