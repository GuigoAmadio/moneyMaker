'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { Client, ApiResponse } from '@/types'
import type { ClientInput } from '@/lib/validations'

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

// Buscar todos os clientes
export async function getClientsAction(): Promise<{
  success: boolean
  data?: Client[]
  message: string
}> {
  try {
    const response = await fetch(`${API_URL}/clients`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        message: error.message || 'Erro ao buscar clientes',
      }
    }

    const result: ApiResponse<Client[]> = await response.json()

    return {
      success: true,
      data: result.data,
      message: 'Clientes carregados com sucesso',
    }
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return {
      success: false,
      message: 'Erro interno do servidor',
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
    const response = await fetch(`${API_URL}/clients/${id}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        message: error.message || 'Erro ao buscar cliente',
      }
    }

    const result: ApiResponse<Client> = await response.json()

    return {
      success: true,
      data: result.data,
      message: 'Cliente carregado com sucesso',
    }
  } catch (error) {
    console.error('Erro ao buscar cliente:', error)
    return {
      success: false,
      message: 'Erro interno do servidor',
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
    const response = await fetch(`${API_URL}/clients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        message: error.message || 'Erro ao criar cliente',
      }
    }

    const result: ApiResponse<Client> = await response.json()

    // Revalidar cache da página de clientes
    revalidatePath('/dashboard/clientes')

    return {
      success: true,
      data: result.data,
      message: 'Cliente criado com sucesso',
    }
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    return {
      success: false,
      message: 'Erro interno do servidor',
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
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        message: error.message || 'Erro ao atualizar cliente',
      }
    }

    const result: ApiResponse<Client> = await response.json()

    // Revalidar cache
    revalidatePath('/dashboard/clientes')
    revalidatePath(`/dashboard/clientes/${id}`)

    return {
      success: true,
      data: result.data,
      message: 'Cliente atualizado com sucesso',
    }
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error)
    return {
      success: false,
      message: 'Erro interno do servidor',
    }
  }
}

// Deletar cliente
export async function deleteClientAction(id: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        message: error.message || 'Erro ao deletar cliente',
      }
    }

    // Revalidar cache
    revalidatePath('/dashboard/clientes')

    return {
      success: true,
      message: 'Cliente deletado com sucesso',
    }
  } catch (error) {
    console.error('Erro ao deletar cliente:', error)
    return {
      success: false,
      message: 'Erro interno do servidor',
    }
  }
} 