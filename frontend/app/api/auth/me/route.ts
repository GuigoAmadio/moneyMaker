import { NextRequest, NextResponse } from 'next/server'
import { serverGet } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    // Obter dados do usuário atual
    const result = await serverGet<any>('/auth/me')

    return NextResponse.json({
      success: true,
      user: result.data,
    })
  } catch (error: any) {
    console.error('Erro ao obter dados do usuário:', error)

    return NextResponse.json(
      { error: error.message || 'Erro ao obter dados do usuário' },
      { status: error.code === '401' ? 401 : 500 }
    )
  }
}
