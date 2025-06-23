import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { serverPost } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json()

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID é obrigatório' },
        { status: 400 }
      )
    }

    // Fazer requisição para trocar tenant no backend
    const result = await serverPost<{ token: string; refresh_token?: string }>(
      '/auth/switch-tenant',
      {
        client_id: clientId,
      }
    )

    // Atualizar cookies com novos tokens
    const cookieStore = cookies()

    cookieStore.set('auth_token', result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    cookieStore.set('client_id', clientId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    })

    if (result.data.refresh_token) {
      cookieStore.set('refresh_token', result.data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      })
    }

    return NextResponse.json({
      success: true,
      token: result.data.token,
      message: 'Tenant alterado com sucesso',
    })
  } catch (error: any) {
    console.error('Erro ao trocar tenant:', error)

    return NextResponse.json(
      { error: error.message || 'Erro ao trocar tenant' },
      { status: error.code === '401' ? 401 : 500 }
    )
  }
}
