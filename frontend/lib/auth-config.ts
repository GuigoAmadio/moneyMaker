/**
 * Configuração de Autenticação para Desenvolvimento
 * Permite desabilitar a autenticação em ambiente de desenvolvimento
 */

export const authConfig = {
  // Em desenvolvimento, permitir bypass da autenticação
  isAuthEnabled:
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true',

  // Se auth estiver desabilitada, usar usuário mockado
  mockUser: {
    id: 'dev-user-1',
    clientId: 'moneymaker',
    name: 'Desenvolvedor',
    email: 'dev@moneymaker.com.br',
    role: 'SUPER_ADMIN' as const,
    status: 'ACTIVE' as const,
    emailVerified: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
}

/**
 * Verifica se a autenticação está habilitada
 */
export function isAuthenticationEnabled(): boolean {
  return authConfig.isAuthEnabled
}

/**
 * Retorna usuário atual (real ou mockado)
 */
export function getCurrentUser() {
  if (!authConfig.isAuthEnabled) {
    return authConfig.mockUser
  }

  // Aqui seria a lógica real de obter o usuário
  // Por enquanto retorna o usuário mockado
  return authConfig.mockUser
}

/**
 * Simula verificação de autenticação
 */
export function isAuthenticated(): boolean {
  if (!authConfig.isAuthEnabled) {
    return true // Em dev, sempre autenticado
  }

  // Aqui seria a lógica real de verificação
  return false
}

/**
 * Middleware de autenticação para desenvolvimento
 */
export function devAuthMiddleware() {
  return {
    isAuthenticated: isAuthenticated(),
    user: getCurrentUser(),
    authEnabled: authConfig.isAuthEnabled,
  }
}
