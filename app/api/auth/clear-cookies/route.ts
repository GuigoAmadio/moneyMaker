import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()

    cookieStore.delete('auth_token')
    cookieStore.delete('refresh_token')
    cookieStore.delete('client_id')

    return NextResponse.json({
      success: true,
      message: 'Cookies limpos com sucesso',
    })
  } catch (error) {
    console.error('Erro ao limpar cookies:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao limpar cookies',
      },
      { status: 500 }
    )
  }
}
