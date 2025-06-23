'use server'

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api'
import type { Client } from '@/types'

export interface CreateClientInput {
  name: string
  slug: string
  email: string
  phone?: string
  logo?: string
  website?: string
  plan: string
  settings?: Record<string, any>
}

export interface UpdateClientInput extends Partial<CreateClientInput> {
  id: string
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TRIAL'
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export async function getClientsAction(params?: PaginationParams) {
  try {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.status) searchParams.append('status', params.status)

    const url = `/clients${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const result = await serverGet<Client[]>(url)

    return {
      success: true,
      data: result.data || [],
    }
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return {
      success: false,
      data: [] as Client[],
      error: 'Erro ao carregar clientes',
    }
  }
}

export async function getClientByIdAction(id: string) {
  try {
    const result = await serverGet<Client>(`/clients/${id}`)

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Erro ao buscar cliente:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao carregar cliente',
    }
  }
}

export async function createClientAction(data: CreateClientInput) {
  try {
    const result = await serverPost<Client>('/clients', data)

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao criar cliente',
    }
  }
}

export async function updateClientAction(data: UpdateClientInput) {
  try {
    const { id, ...updateData } = data
    const result = await serverPut<Client>(`/clients/${id}`, updateData)

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar cliente',
    }
  }
}

export async function deleteClientAction(id: string) {
  try {
    await serverDelete(`/clients/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erro ao excluir cliente:', error)
    return {
      success: false,
      error: 'Erro ao excluir cliente',
    }
  }
}

export async function updateClientStatusAction(
  id: string,
  status: Client['status']
) {
  try {
    const result = await serverPut<Client>(`/clients/${id}/status`, { status })

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Erro ao atualizar status do cliente:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar status do cliente',
    }
  }
}
