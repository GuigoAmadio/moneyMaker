'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { LoginInput } from '@/lib/validations'
import type { User, ApiResponse } from '@/types'

const API_URL = process.env.API_URL || 'http://localhost:3001/api'

// Login do usuário
export async function loginAction(data: LoginInput) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
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
        message: error.message || 'Erro ao fazer login',
      }
    }

    const result: ApiResponse<{ user: User; token: string }> =
      await response.json()

    // Salvar token no cookie httpOnly
    cookies().set('auth_token', result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    return {
      success: true,
      message: 'Login realizado com sucesso',
      user: result.data.user,
    }
  } catch (error) {
    console.error('Erro no login:', error)
    return {
      success: false,
      message: 'Erro interno do servidor',
    }
  }
}

// Logout do usuário
export async function logoutAction() {
  try {
    cookies().delete('auth_token')
    redirect('/login')
  } catch (error) {
    console.error('Erro no logout:', error)
  }
}

// Verificar se o usuário está autenticado
export async function getAuthUser(): Promise<User | null> {
  try {
    const token = cookies().get('auth_token')?.value

    if (!token) {
      return null
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      // Token inválido, limpar cookie
      cookies().delete('auth_token')
      return null
    }

    const result: ApiResponse<User> = await response.json()
    return result.data
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error)
    return null
  }
}

// Middleware para verificar autenticação
export async function requireAuth() {
  const user = await getAuthUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
} 