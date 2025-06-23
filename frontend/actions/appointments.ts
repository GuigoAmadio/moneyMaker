'use server'

import { revalidatePath } from 'next/cache'
import type { Appointment, ApiResponse, PaginatedResponse } from '@/types'
import type { AppointmentInput, SearchFiltersInput } from '@/lib/validations'
import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api'

// Buscar todos os agendamentos
export async function getAppointmentsAction(
  params?: SearchFiltersInput
): Promise<{
  success: boolean
  data?: PaginatedResponse<Appointment>
  message: string
}> {
  try {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status) queryParams.append('status', params.status)

    const url = `/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const result = await serverGet<PaginatedResponse<Appointment>>(url)

    return {
      success: true,
      data: result.data,
      message: 'Agendamentos carregados com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Buscar agendamento por ID
export async function getAppointmentAction(id: string): Promise<{
  success: boolean
  data?: Appointment
  message: string
}> {
  try {
    const result = await serverGet<Appointment>(`/appointments/${id}`)

    return {
      success: true,
      data: result.data,
      message: 'Agendamento carregado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar agendamento:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Criar novo agendamento
export async function createAppointmentAction(data: AppointmentInput): Promise<{
  success: boolean
  data?: Appointment
  message: string
}> {
  try {
    const result = await serverPost<Appointment>('/appointments', data)

    // Revalidar cache
    revalidatePath('/dashboard/agendamentos')
    revalidatePath('/dashboard')

    return {
      success: true,
      data: result.data,
      message: 'Agendamento criado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao criar agendamento:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Atualizar agendamento
export async function updateAppointmentAction(
  id: string,
  data: Partial<AppointmentInput>
): Promise<{
  success: boolean
  data?: Appointment
  message: string
}> {
  try {
    const result = await serverPut<Appointment>(`/appointments/${id}`, data)

    // Revalidar cache
    revalidatePath('/dashboard/agendamentos')
    revalidatePath(`/dashboard/agendamentos/${id}`)
    revalidatePath('/dashboard')

    return {
      success: true,
      data: result.data,
      message: 'Agendamento atualizado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao atualizar agendamento:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Deletar agendamento
export async function deleteAppointmentAction(id: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    await serverDelete(`/appointments/${id}`)

    // Revalidar cache
    revalidatePath('/dashboard/agendamentos')
    revalidatePath('/dashboard')

    return {
      success: true,
      message: 'Agendamento deletado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao deletar agendamento:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Atualizar status do agendamento
export async function updateAppointmentStatusAction(
  id: string,
  status: Appointment['status']
): Promise<{
  success: boolean
  data?: Appointment
  message: string
}> {
  try {
    const result = await serverPut<Appointment>(`/appointments/${id}/status`, {
      status,
    })

    // Revalidar cache
    revalidatePath('/dashboard/agendamentos')
    revalidatePath(`/dashboard/agendamentos/${id}`)
    revalidatePath('/dashboard')

    return {
      success: true,
      data: result.data,
      message: 'Status do agendamento atualizado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao atualizar status do agendamento:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Buscar agendamentos do dia
export async function getTodaysAppointmentsAction(): Promise<{
  success: boolean
  data?: Appointment[]
  message: string
}> {
  try {
    const today = new Date().toISOString().split('T')[0]
    const result = await serverGet<Appointment[]>(`/appointments/date/${today}`)

    return {
      success: true,
      data: result.data,
      message: 'Agendamentos de hoje carregados com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos de hoje:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Buscar próximos agendamentos
export async function getUpcomingAppointmentsAction(days: number = 7): Promise<{
  success: boolean
  data?: Appointment[]
  message: string
}> {
  try {
    const result = await serverGet<Appointment[]>(
      `/appointments/upcoming?days=${days}`
    )

    return {
      success: true,
      data: result.data,
      message: 'Próximos agendamentos carregados com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar próximos agendamentos:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Estatísticas de agendamentos
export async function getAppointmentStatsAction(): Promise<{
  success: boolean
  data?: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
    byStatus: Record<string, number>
  }
  message: string
}> {
  try {
    const result = await serverGet<{
      total: number
      today: number
      thisWeek: number
      thisMonth: number
      byStatus: Record<string, number>
    }>('/appointments/stats')

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
