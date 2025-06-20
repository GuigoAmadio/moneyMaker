'use server'

import type { ContactInput } from '@/lib/validations'
import type { ApiResponse } from '@/types'
import { serverPost } from '@/lib/api'

// Enviar formulário de contato
export async function sendContactAction(data: ContactInput) {
  try {
    // Para formulário de contato, geralmente não precisa de autenticação
    // Mas ainda precisa do header x-client-id
    const result = await serverPost<{ message: string }>('/contact', data)

    return {
      success: true,
      message:
        result.data.message ||
        'Mensagem enviada com sucesso! Entraremos em contato em breve.',
    }
  } catch (error: any) {
    console.error('Erro ao enviar contato:', error)
    return {
      success: false,
      message:
        error.message || 'Erro ao enviar mensagem. Tente novamente mais tarde.',
    }
  }
}

// Buscar mensagens de contato (para dashboard admin)
export async function getContactMessagesAction(): Promise<{
  success: boolean
  data?: any[]
  message: string
}> {
  try {
    const result = await serverPost<any[]>('/contact/list')

    return {
      success: true,
      data: result.data,
      message: 'Mensagens carregadas com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar mensagens:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Marcar mensagem como lida
export async function markContactAsReadAction(id: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    await serverPost(`/contact/${id}/read`)

    return {
      success: true,
      message: 'Mensagem marcada como lida',
    }
  } catch (error: any) {
    console.error('Erro ao marcar mensagem como lida:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}
