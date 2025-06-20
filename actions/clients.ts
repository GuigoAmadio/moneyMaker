'use server'

import { revalidatePath } from 'next/cache'
import type { Client, ApiResponse } from '@/types'
import type { ClientInput } from '@/lib/validations'
import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api'

// Buscar todos os clientes
export async function getClientsAction(): Promise<{
  success: boolean
  data?: Client[]
  message: string
}> {
  try {
    const result = await serverGet<Client[]>('/clients')

    return {
      success: true,
      data: result.data,
      message: 'Clientes carregados com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Buscar cliente por ID
export async function getClientAction(id: string): Promise<{
  success: boolean
  data?: Client
  message: string
}> {
  try {
    const result = await serverGet<Client>(`/clients/${id}`)

    return {
      success: true,
      data: result.data,
      message: 'Cliente carregado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Criar novo cliente
export async function createClientAction(data: ClientInput): Promise<{
  success: boolean
  data?: Client
  message: string
}> {
  try {
    const result = await serverPost<Client>('/clients', data)

    // Revalidar cache da página de clientes
    revalidatePath('/dashboard/clientes')

    return {
      success: true,
      data: result.data,
      message: 'Cliente criado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Atualizar cliente
export async function updateClientAction(
  id: string,
  data: Partial<ClientInput>
): Promise<{
  success: boolean
  data?: Client
  message: string
}> {
  try {
    const result = await serverPut<Client>(`/clients/${id}`, data)

    // Revalidar cache
    revalidatePath('/dashboard/clientes')
    revalidatePath(`/dashboard/clientes/${id}`)

    return {
      success: true,
      data: result.data,
      message: 'Cliente atualizado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Deletar cliente
export async function deleteClientAction(id: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    await serverDelete(`/clients/${id}`)

    // Revalidar cache
    revalidatePath('/dashboard/clientes')

    return {
      success: true,
      message: 'Cliente deletado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao deletar cliente:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Buscar clientes com filtros e paginação
export async function getClientsWithFiltersAction(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
}): Promise<{
  success: boolean
  data?: {
    clients: Client[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
  message: string
}> {
  try {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.status) queryParams.append('status', params.status)

    const url = `/clients?${queryParams.toString()}`
    const result = await serverGet<{
      clients: Client[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>(url)

    return {
      success: true,
      data: result.data,
      message: 'Clientes carregados com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}
