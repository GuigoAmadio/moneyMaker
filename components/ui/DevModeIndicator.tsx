'use client'

import { isAuthenticationEnabled, getCurrentUser } from '@/lib/auth-config'
import { Shield, ShieldOff, User } from 'lucide-react'

export default function DevModeIndicator() {
  const authEnabled = isAuthenticationEnabled()
  const user = getCurrentUser()

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      {!authEnabled && (
        <div className="flex animate-pulse items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-yellow-900 shadow-lg">
          <ShieldOff className="h-4 w-4" />
          <div className="text-sm font-semibold">
            🚀 MODO DEV
            <div className="text-xs opacity-75">Auth desabilitada</div>
          </div>
        </div>
      )}

      {authEnabled && (
        <div className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-green-900 shadow-lg">
          <Shield className="h-4 w-4" />
          <div className="text-sm font-semibold">
            🔒 AUTH ON
            <div className="text-xs opacity-75">Modo produção</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para mostrar info do usuário atual
export function DevUserInfo() {
  const authEnabled = isAuthenticationEnabled()
  const user = getCurrentUser()

  if (process.env.NODE_ENV === 'production' || authEnabled) {
    return null
  }

  return (
    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-blue-800">
        <User className="h-4 w-4" />
        <span className="font-semibold">Usuário de Desenvolvimento</span>
      </div>
      <div className="text-sm text-blue-600">
        <p>
          <strong>Nome:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p className="mt-2 text-xs opacity-75">
          💡 Este é um usuário fictício para desenvolvimento. A autenticação
          real será implementada para produção.
        </p>
      </div>
    </div>
  )
}
