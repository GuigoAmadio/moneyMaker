import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acesso a assets estáticos e API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // arquivos estáticos
  ) {
    return NextResponse.next()
  }

  // Páginas públicas que não precisam de autenticação
  const publicPaths = ['/', '/servicos', '/contato', '/login']
  const isPublicPath = publicPaths.includes(pathname)

  // Obter token dos cookies
  const token = request.cookies.get('auth_token')?.value
  const clientId = request.cookies.get('client_id')?.value

  // Se está tentando acessar uma página protegida (dashboard)
  if (pathname.startsWith('/dashboard')) {
    // Em desenvolvimento, permitir acesso sem token
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.NEXT_PUBLIC_ENABLE_AUTH !== 'true'
    ) {
      console.log(
        '🔓 [DEV MODE] Permitindo acesso ao dashboard sem autenticação'
      )
      return NextResponse.next()
    }

    // Em produção ou com auth habilitada, verificar token
    if (!token || !clientId) {
      console.log(
        '❌ Token ou client_id não encontrado, redirecionando para login'
      )
      return NextResponse.redirect(new URL('/login', request.url))
    }

    console.log('✅ Token encontrado, permitindo acesso ao dashboard')
    return NextResponse.next()
  }

  // Se está logado e tentando acessar login, redirecionar para dashboard
  if (pathname === '/login' && token && clientId) {
    console.log('🔄 Usuário já logado, redirecionando para dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Permitir acesso a páginas públicas
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Para outras rotas, permitir acesso
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
