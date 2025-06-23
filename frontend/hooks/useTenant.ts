'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { TenantType, TenantConfig, TENANT_CONFIGS } from '@/types/tenant'
import { Client } from '@/types'

interface TenantContextType {
  currentTenant: TenantType | null
  tenantConfig: TenantConfig | null
  currentClient: Client | null
  isLoading: boolean
  switchTenant: (tenantType: TenantType, clientId: string) => Promise<void>
  exitTenantMode: () => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant deve ser usado dentro de um TenantProvider')
  }
  return context
}

export function useTenantManagement() {
  const [currentTenant, setCurrentTenant] = useState<TenantType | null>(null)
  const [currentClient, setCurrentClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const detectTenantFromPath = () => {
      if (pathname.includes('/dashboard/imobiliaria')) {
        setCurrentTenant('imobiliaria')
      } else if (pathname.includes('/dashboard/clinica')) {
        setCurrentTenant('clinica')
      } else if (pathname.includes('/dashboard/autopecas')) {
        setCurrentTenant('autopecas')
      } else if (pathname.includes('/master-admin')) {
        setCurrentTenant(null)
      }
    }

    detectTenantFromPath()
  }, [pathname])

  const switchTenant = async (tenantType: TenantType, clientId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/v1/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar dados do cliente')
      }

      const clientData = await response.json()

      setCurrentTenant(tenantType)
      setCurrentClient(clientData.data)

      localStorage.setItem('current_tenant', tenantType)
      localStorage.setItem('current_client', JSON.stringify(clientData.data))

      router.push(`/dashboard/${tenantType}`)
    } catch (error) {
      console.error('Erro ao trocar tenant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const exitTenantMode = () => {
    setCurrentTenant(null)
    setCurrentClient(null)
    localStorage.removeItem('current_tenant')
    localStorage.removeItem('current_client')
    router.push('/master-admin')
  }

  useEffect(() => {
    const savedTenant = localStorage.getItem(
      'current_tenant'
    ) as TenantType | null
    const savedClient = localStorage.getItem('current_client')

    if (savedTenant && savedClient) {
      setCurrentTenant(savedTenant)
      setCurrentClient(JSON.parse(savedClient))
    }
  }, [])

  const tenantConfig = currentTenant ? TENANT_CONFIGS[currentTenant] : null

  return {
    currentTenant,
    tenantConfig,
    currentClient,
    isLoading,
    switchTenant,
    exitTenantMode,
  }
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const value = useTenantManagement()

  return React.createElement(TenantContext.Provider, { value }, children)
}
