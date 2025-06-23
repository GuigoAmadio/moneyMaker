'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Building2,
  Stethoscope,
  Wrench,
  DollarSign,
  Activity,
  BarChart3,
  Globe,
  Settings,
  ExternalLink,
} from 'lucide-react'
import { TenantSwitcher } from '@/components/TenantSwitcher'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function MasterAdminPage() {
  const router = useRouter()

  const stats = {
    totalClients: 3,
    activeClients: 3,
    totalRevenue: 25000, // R$ 25.000 (estimativa)
    totalUsers: 6, // 3 admins + super admin + funcionários futuros
  }

  const clients = [
    {
      id: 'clnt_imobiliaria_prime',
      name: 'Imobiliária Prime',
      email: 'admin@imobiliariaprime.com.br',
      type: 'imobiliaria',
      status: 'ACTIVE',
      plan: 'premium',
      dashboardUrl: '/dashboard/imobiliaria',
      description: 'Especializada em imóveis de alto padrão',
    },
    {
      id: 'clnt_clinica_sao_paulo',
      name: 'Clínica São Paulo',
      email: 'admin@clinicasp.com.br',
      type: 'clinica',
      status: 'ACTIVE',
      plan: 'premium',
      dashboardUrl: '/dashboard/clinica',
      description: 'Clínica médica com especialidades diversas',
    },
    {
      id: 'clnt_autopecas_central',
      name: 'AutoPeças Central',
      email: 'admin@autopecascentral.com.br',
      type: 'autopecas',
      status: 'ACTIVE',
      plan: 'basic',
      dashboardUrl: '/dashboard/autopecas',
      description: 'Distribuição de peças automotivas',
    },
  ]

  const handleAccessDashboard = (
    dashboardUrl: string,
    clientId: string,
    type: string
  ) => {
    // Verificar se estamos no cliente antes de usar localStorage
    if (typeof window !== 'undefined') {
      // Simular mudança de tenant no localStorage para funcionar com os dashboards
      localStorage.setItem('current_tenant', type)
      localStorage.setItem(
        'current_client',
        JSON.stringify({
          id: clientId,
          name: clients.find((c) => c.id === clientId)?.name || '',
          type: type,
        })
      )
    }

    router.push(dashboardUrl)
  }

  const getBusinessIcon = (type: string) => {
    switch (type) {
      case 'imobiliaria':
        return <Building2 className="h-6 w-6 text-green-600" />
      case 'clinica':
        return <Stethoscope className="h-6 w-6 text-sky-600" />
      case 'autopecas':
        return <Wrench className="h-6 w-6 text-red-600" />
      default:
        return <Globe className="h-6 w-6 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Master Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Visão geral completa de todos os seus clientes e sistema
              </p>
            </div>
            <div className="flex gap-3">
              <TenantSwitcher />
              <button className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md ring-1 ring-gray-200 transition-colors hover:bg-gray-50">
                <Settings className="h-4 w-4" />
                Configurações
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700">
                <Users className="h-4 w-4" />
                Novo Cliente
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Dashboards */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            🚀 Acesso Rápido aos Dashboards
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() =>
                  handleAccessDashboard(
                    client.dashboardUrl,
                    client.id,
                    client.type
                  )
                }
                className="group flex items-center gap-4 rounded-lg border-2 border-gray-200 p-4 text-left transition-all duration-300 hover:border-blue-500 hover:bg-blue-50"
              >
                <div
                  className={`rounded-lg p-3 transition-colors ${
                    client.type === 'imobiliaria'
                      ? 'bg-green-50 group-hover:bg-green-100'
                      : client.type === 'clinica'
                        ? 'bg-sky-50 group-hover:bg-sky-100'
                        : 'bg-red-50 group-hover:bg-red-100'
                  }`}
                >
                  {getBusinessIcon(client.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-900">
                    {client.name}
                  </h4>
                  <p className="text-sm text-gray-600 group-hover:text-blue-700">
                    {client.description}
                  </p>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Total de Clientes
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stats.totalClients}
                </p>
                <p className="mt-1 text-xs text-gray-500">+2 este mês</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-blue-500 to-blue-600 transition-transform duration-300 group-hover:scale-x-100"></div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Clientes Ativos
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stats.activeClients}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  100% taxa de atividade
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-green-500 to-green-600 transition-transform duration-300 group-hover:scale-x-100"></div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Receita Total
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  +15% vs mês anterior
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-emerald-500 to-emerald-600 transition-transform duration-300 group-hover:scale-x-100"></div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Total de Usuários
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
                <p className="mt-1 text-xs text-gray-500">Todos os clientes</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-purple-500 to-purple-600 transition-transform duration-300 group-hover:scale-x-100"></div>
          </div>
        </div>

        {/* Business Types Stats */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">
            Clientes por Tipo de Negócio
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <div className="rounded-lg bg-green-50 p-3">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Imobiliárias
                </p>
                <p className="text-xl font-bold text-gray-900">1</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <div className="rounded-lg bg-sky-50 p-3">
                <Stethoscope className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Clínicas</p>
                <p className="text-xl font-bold text-gray-900">1</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <div className="rounded-lg bg-red-50 p-3">
                <Wrench className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Autopeças</p>
                <p className="text-xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clients List */}
        <div className="rounded-xl bg-white shadow-lg">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Seus Clientes
              </h3>
              <button className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100">
                <BarChart3 className="h-4 w-4" />
                Ver Todos
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {clients.map((client) => (
              <div
                key={client.id}
                className="p-6 transition-colors hover:bg-gray-50"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                      {getBusinessIcon(client.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {client.name}
                      </h4>
                      <p className="text-sm text-gray-600">{client.email}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {client.description}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Plano:</span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            client.plan === 'premium'
                              ? 'bg-purple-100 text-purple-800'
                              : client.plan === 'professional'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {client.plan}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      Ativo
                    </span>
                    <button
                      onClick={() =>
                        handleAccessDashboard(
                          client.dashboardUrl,
                          client.id,
                          client.type
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Acessar Dashboard
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
