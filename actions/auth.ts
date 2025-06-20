'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { LoginInput } from '@/lib/validations'
import type { User, ApiResponse } from '@/types'
import { serverPost, serverGet } from '@/lib/api'

// Login do usuário
export async function loginAction(data: LoginInput) {
  try {
    console.log('🔐 Tentativa de login para:', data.email)

    const result = await serverPost<{
      user: User
      token: string
      refresh_token?: string
      client_id: string
    }>('/auth/login', data)

    console.log(
      '📋 Estrutura completa da resposta:',
      JSON.stringify(result, null, 2)
    )
    console.log('📋 result.data:', JSON.stringify(result.data, null, 2))

    // Verificar se result.data existe, senão usar result diretamente
    const responseData = result.data || result

    console.log('✅ Login bem-sucedido!')
    console.log('- Token recebido:', !!responseData?.token)
    console.log('- Client ID recebido:', responseData?.client_id)
    console.log('- Refresh token recebido:', !!responseData?.refresh_token)
    console.log('- User recebido:', !!responseData?.user)

    // Verificar se temos os dados necessários
    if (!responseData?.token) {
      console.error('❌ Token não encontrado na resposta!')
      return {
        success: false,
        message: 'Token não recebido do servidor',
      }
    }

    if (!responseData?.client_id) {
      console.error('❌ Client ID não encontrado na resposta!')
      return {
        success: false,
        message: 'Client ID não recebido do servidor',
      }
    }

    // Salvar tokens e client_id nos cookies httpOnly
    const cookieStore = cookies()

    cookieStore.set('auth_token', responseData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    // Salvar client_id do usuário autenticado
    cookieStore.set('client_id', responseData.client_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    })

    // Salvar refresh token se fornecido
    if (responseData.refresh_token) {
      cookieStore.set('refresh_token', responseData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      })
    }

    console.log('🍪 Cookies salvos com sucesso!')
    console.log(
      '- auth_token:',
      cookieStore.get('auth_token') ? 'Salvo' : 'ERRO'
    )
    console.log('- client_id:', cookieStore.get('client_id')?.value)
    console.log(
      '- refresh_token:',
      cookieStore.get('refresh_token') ? 'Salvo' : 'N/A'
    )

    return {
      success: true,
      message: 'Login realizado com sucesso',
      user: responseData.user,
      clientId: responseData.client_id,
    }
  } catch (error: any) {
    console.error('❌ Erro no login:', error)
    console.error('❌ Erro completo:', JSON.stringify(error, null, 2))
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Logout do usuário
export async function logoutAction() {
  try {
    const cookieStore = cookies()

    // Tentar fazer logout no backend
    try {
      await serverPost('/auth/logout')
    } catch (error) {
      console.error('Erro ao fazer logout no backend:', error)
      // Continuar com logout local mesmo se der erro no backend
    }

    // Limpar todos os cookies
    cookieStore.delete('auth_token')
    cookieStore.delete('refresh_token')
    cookieStore.delete('client_id')

    redirect('/login')
  } catch (error) {
    console.error('Erro no logout:', error)
    redirect('/login')
  }
}

// Verificar se o usuário está autenticado
export async function getAuthUser(): Promise<User | null> {
  try {
    const result = await serverGet<User>('/auth/me')
    return result.data
  } catch (error: any) {
    console.error('Erro ao verificar autenticação:', error)

    // Se erro 401, limpar cookies
    if (error.code === '401') {
      const cookieStore = cookies()
      cookieStore.delete('auth_token')
      cookieStore.delete('refresh_token')
      cookieStore.delete('client_id')
    }

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

// Obter informações do tenant/cliente atual
export async function getCurrentClient() {
  const cookieStore = cookies()
  return {
    clientId: cookieStore.get('client_id')?.value || null,
    token: cookieStore.get('auth_token')?.value || null,
  }
}

// Refresh do token (para uso em caso de erro 401)
export async function refreshTokenAction() {
  try {
    const cookieStore = cookies()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) {
      throw new Error('Refresh token não encontrado')
    }

    const result = await serverPost<{ token: string; refresh_token: string }>(
      '/auth/refresh',
      {
        refresh_token: refreshToken,
      }
    )

    // Atualizar cookies com novos tokens
    cookieStore.set('auth_token', result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    cookieStore.set('refresh_token', result.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    })

    return {
      success: true,
      token: result.data.token,
    }
  } catch (error: any) {
    console.error('Erro ao renovar token:', error)

    // Limpar cookies se falhou o refresh
    const cookieStore = cookies()
    cookieStore.delete('auth_token')
    cookieStore.delete('refresh_token')
    cookieStore.delete('client_id')

    return {
      success: false,
      message: error.message || 'Erro ao renovar token',
    }
  }
}
