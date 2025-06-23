'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2,
  Stethoscope,
  Wrench,
  Settings,
  ChevronDown,
} from 'lucide-react'

export function TenantSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const tenants = [
    {
      id: 'master-admin',
      name: 'Master Admin',
      path: '/master-admin',
      icon: Settings,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'imobiliaria',
      name: 'Imobiliária Prime',
      path: '/dashboard/imobiliaria',
      icon: Building2,
      color: 'bg-green-50 text-green-600',
    },
    {
      id: 'clinica',
      name: 'Clínica São Paulo',
      path: '/dashboard/clinica',
      icon: Stethoscope,
      color: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'autopecas',
      name: 'AutoPeças Central',
      path: '/dashboard/autopecas',
      icon: Wrench,
      color: 'bg-red-50 text-red-600',
    },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-md ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
      >
        <span className="font-medium text-gray-900">Dashboards</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-2">
            {tenants.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => handleNavigation(tenant.path)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-50"
              >
                <div className={`rounded-lg p-2 ${tenant.color}`}>
                  <tenant.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {tenant.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  )
}
