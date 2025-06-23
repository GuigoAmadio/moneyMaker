import { NextRequest, NextResponse } from 'next/server'
import { serverGet } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    // Obter token dos cookies
    const token = request.cookies.get('auth_token')?.value
    const clientId = request.cookies.get('client_id')?.value

    if (!token || !clientId) {
      return NextResponse.json(
        { error: 'Token não encontrado nos cookies' },
        { status: 401 }
      )
    }

    // Verificar token no backend
    const result = await serverGet<any>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Client-ID': clientId,
      },
    })

    return NextResponse.json({
      success: true,
      user: result.data,
    })
  } catch (error: any) {
    console.error('Erro ao verificar token dos cookies:', error)

    return NextResponse.json(
      { error: error.message || 'Token inválido' },
      { status: 401 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, clientId } = await request.json()

    if (!token || !clientId) {
      return NextResponse.json(
        { error: 'Token e client ID são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar token no backend
    const result = await serverGet<any>('/auth/me')

    return NextResponse.json({
      success: true,
      user: result.data,
    })
  } catch (error: any) {
    console.error('Erro ao verificar token:', error)

    return NextResponse.json(
      { error: error.message || 'Token inválido' },
      { status: 401 }
    )
  }
}
