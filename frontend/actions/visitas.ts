'use server'

import { api } from '@/lib/api'
import type { VisitaAgendada } from '@/types'

export interface CreateVisitaInput {
  leadId: string
  imovelId: string
  dataHora: string
  observacoes?: string
}

export interface UpdateVisitaInput extends Partial<CreateVisitaInput> {
  id: string
  status?: 'Agendada' | 'Confirmada' | 'Realizada' | 'Cancelada'
}

export async function getVisitasAction() {
  try {
    const response = await api.get('/visitas')
    return {
      success: true,
      data: response.data as VisitaAgendada[],
    }
  } catch (error) {
    console.error('Erro ao buscar visitas:', error)
    return {
      success: false,
      data: [] as VisitaAgendada[],
      error: 'Erro ao carregar visitas',
    }
  }
}

export async function getVisitasByDateAction(date: string) {
  try {
    const response = await api.get(`/visitas/date/${date}`)
    return {
      success: true,
      data: response.data as VisitaAgendada[],
    }
  } catch (error) {
    console.error('Erro ao buscar visitas por data:', error)
    return {
      success: false,
      error: 'Erro ao carregar visitas',
    }
  }
}

export async function getVisitaByIdAction(id: string) {
  try {
    const response = await api.get(`/visitas/${id}`)
    return {
      success: true,
      data: response.data as VisitaAgendada,
    }
  } catch (error) {
    console.error('Erro ao buscar visita:', error)
    return {
      success: false,
      error: 'Erro ao carregar visita',
    }
  }
}

export async function createVisitaAction(data: CreateVisitaInput) {
  try {
    const response = await api.post('/visitas', data)
    return {
      success: true,
      data: response.data as VisitaAgendada,
    }
  } catch (error) {
    console.error('Erro ao criar visita:', error)
    return {
      success: false,
      error: 'Erro ao agendar visita',
    }
  }
}

export async function updateVisitaAction(data: UpdateVisitaInput) {
  try {
    const { id, ...updateData } = data
    const response = await api.put(`/visitas/${id}`, updateData)
    return {
      success: true,
      data: response.data as VisitaAgendada,
    }
  } catch (error) {
    console.error('Erro ao atualizar visita:', error)
    return {
      success: false,
      error: 'Erro ao atualizar visita',
    }
  }
}

export async function deleteVisitaAction(id: string) {
  try {
    await api.delete(`/visitas/${id}`)
    return {
      success: true,
    }
  } catch (error) {
    console.error('Erro ao excluir visita:', error)
    return {
      success: false,
      error: 'Erro ao excluir visita',
    }
  }
}

export async function updateVisitaStatusAction(
  id: string,
  status: VisitaAgendada['status']
) {
  try {
    const response = await api.patch(`/visitas/${id}/status`, { status })
    return {
      success: true,
      data: response.data as VisitaAgendada,
    }
  } catch (error) {
    console.error('Erro ao atualizar status da visita:', error)
    return {
      success: false,
      error: 'Erro ao atualizar status da visita',
    }
  }
}
