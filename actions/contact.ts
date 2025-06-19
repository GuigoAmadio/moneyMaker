'use server'

import type { ContactInput } from '@/lib/validations'

const API_URL = process.env.API_URL || 'http://localhost:3001/api'

// Enviar formulário de contato
export async function submitContactAction(data: ContactInput): Promise<{
  success: boolean
  message: string
}> {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        message: error.message || 'Erro ao enviar mensagem',
      }
    }

    return {
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
    }
  } catch (error) {
    console.error('Erro ao enviar contato:', error)
    return {
      success: false,
      message: 'Erro interno do servidor. Tente novamente mais tarde.',
    }
  }
} 