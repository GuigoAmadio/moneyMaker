'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2,
  Stethoscope,
  Wrench,
  Settings,
  ExternalLink,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react'
import { Client } from '@/types'
import { TenantType, TENANT_CONFIGS } from '@/types/tenant'
import { useTenant } from '@/hooks/useTenant'

interface TenantSwitcherProps {
  clients: Client[]
  showMasterAdminOption?: boolean
}

export function TenantSwitcher({
  clients,
  showMasterAdminOption = true,
}: TenantSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { currentTenant, currentClient, switchTenant, exitTenantMode } =
    useTenant()
  const router = useRouter()

  const getIcon = (type: string) => {
    switch (type) {
      case 'imobiliaria':
        return <Building2 className="h-4 w-4" />
      case 'clinica':
        return <Stethoscope className="h-4 w-4" />
      case 'autopecas':
        return <Wrench className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'imobiliaria':
        return 'text-green-600 bg-green-50 hover:bg-green-100'
      case 'clinica':
        return 'text-sky-600 bg-sky-50 hover:bg-sky-100'
      case 'autopecas':
        return 'text-red-600 bg-red-50 hover:bg-red-100'
      default:
        return 'text-gray-600 bg-gray-50 hover:bg-gray-100'
    }
  }

  const handleSwitchTenant = async (client: Client) => {
    if (client.settings.type) {
      await switchTenant(client.settings.type as TenantType, client.id)
      setIsOpen(false)
    }
  }

  const handleGoToMasterAdmin = () => {
    exitTenantMode()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Current Dashboard Indicator */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-w-[200px] items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-md ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
      >
        <div className="flex flex-1 items-center gap-2">
          {currentTenant ? (
            <>
              <div
                className={`rounded-lg p-2 ${getColor(currentTenant).split(' ').slice(1).join(' ')}`}
              >
                {getIcon(currentTenant)}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {currentClient?.name || TENANT_CONFIGS[currentTenant].name}
                </p>
                <p className="text-xs text-gray-500">
                  {TENANT_CONFIGS[currentTenant].name}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg bg-blue-50 p-2">
                <Settings className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  Master Admin
                </p>
                <p className="text-xs text-gray-500">Visão geral</p>
              </div>
            </>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[300px] rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-2">
            {showMasterAdminOption && (
              <>
                <button
                  onClick={handleGoToMasterAdmin}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Settings className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Master Admin Dashboard
                    </p>
                    <p className="text-xs text-gray-500">
                      Visão geral de todos os clientes
                    </p>
                  </div>
                  {!currentTenant && (
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  )}
                </button>
                <div className="my-2 border-t border-gray-100"></div>
              </>
            )}

            {/* Clients List */}
            <div className="space-y-1">
              <p className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                Dashboards dos Clientes
              </p>
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleSwitchTenant(client)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    currentClient?.id === client.id
                      ? 'border border-blue-200 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`rounded-lg p-2 ${getColor(
                      client.settings.type || ''
                    )
                      .split(' ')
                      .slice(1)
                      .join(' ')}`}
                  >
                    {getIcon(client.settings.type || '')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {client.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {client.settings.type
                        ? TENANT_CONFIGS[client.settings.type as TenantType]
                            ?.name
                        : 'Dashboard'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        client.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {client.status}
                    </span>
                    {currentClient?.id === client.id && (
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {currentTenant && (
              <>
                <div className="my-2 border-t border-gray-100"></div>
                <button
                  onClick={handleGoToMasterAdmin}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao Master Admin
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  )
}
