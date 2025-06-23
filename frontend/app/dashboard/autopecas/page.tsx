'use client'

import React from 'react'
import Link from 'next/link'
import {
  Wrench,
  Package,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  ArrowUpDown,
} from 'lucide-react'
import { TenantSwitcher } from '@/components/TenantSwitcher'

export default function AutopecasDashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-900 sm:text-4xl">
              Dashboard Autopeças
            </h1>
            <p className="mt-2 text-gray-600">
              Controle de estoque, produtos e vendas
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/produtos">
              <button className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-red-700">
                <Plus className="h-4 w-4" />
                Novo Produto
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/produtos">
            <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total de Produtos
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">1,247</p>
                  <p className="mt-1 text-xs text-red-600">+23 este mês</p>
                </div>
                <div className="rounded-lg bg-red-50 p-3">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-red-500 to-red-600 transition-transform duration-300 group-hover:scale-x-100"></div>
            </div>
          </Link>

          <Link href="/dashboard/produtos">
            <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Estoque Baixo
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">15</p>
                  <p className="mt-1 text-xs text-orange-600">Requer atenção</p>
                </div>
                <div className="rounded-lg bg-orange-50 p-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-orange-500 to-orange-600 transition-transform duration-300 group-hover:scale-x-100"></div>
            </div>
          </Link>

          <Link href="/dashboard/pedidos">
            <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Pedidos Pendentes
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">8</p>
                  <p className="mt-1 text-xs text-yellow-600">Para processar</p>
                </div>
                <div className="rounded-lg bg-yellow-50 p-3">
                  <ShoppingCart className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-yellow-500 to-yellow-600 transition-transform duration-300 group-hover:scale-x-100"></div>
            </div>
          </Link>

          <Link href="/dashboard/relatorios">
            <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Receita Mensal
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {formatCurrency(48000)}
                  </p>
                  <p className="mt-1 text-xs text-emerald-600">
                    +22% vs mês anterior
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-emerald-500 to-emerald-600 transition-transform duration-300 group-hover:scale-x-100"></div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/produtos">
              <button className="flex w-full items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-red-200 hover:bg-red-50">
                <div className="rounded-lg bg-red-100 p-3">
                  <Plus className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Novo Produto</p>
                  <p className="text-sm text-gray-600">Cadastrar produto</p>
                </div>
              </button>
            </Link>

            <Link href="/dashboard/produtos">
              <button className="flex w-full items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-orange-200 hover:bg-orange-50">
                <div className="rounded-lg bg-orange-100 p-3">
                  <ArrowUpDown className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Movimentar Estoque
                  </p>
                  <p className="text-sm text-gray-600">Entrada/Saída</p>
                </div>
              </button>
            </Link>

            <Link href="/dashboard/pedidos">
              <button className="flex w-full items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-yellow-200 hover:bg-yellow-50">
                <div className="rounded-lg bg-yellow-100 p-3">
                  <ShoppingCart className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Processar Pedidos
                  </p>
                  <p className="text-sm text-gray-600">Pedidos pendentes</p>
                </div>
              </button>
            </Link>

            <Link href="/dashboard/relatorios">
              <button className="flex w-full items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-green-200 hover:bg-green-50">
                <div className="rounded-lg bg-green-100 p-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Relatórios</p>
                  <p className="text-sm text-gray-600">Vendas e estoque</p>
                </div>
              </button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white shadow-lg">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Produtos em Destaque
                  </h3>
                  <Link href="/dashboard/produtos">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100">
                      <Eye className="h-4 w-4" />
                      Ver Todos
                    </button>
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="p-6 transition-colors hover:bg-gray-50">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                        <Wrench className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Filtro de Óleo Motor
                        </h4>
                        <p className="text-sm text-gray-600">Código: FO-001</p>
                        <p className="text-sm text-gray-600">
                          Categoria: Filtros
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Estoque</p>
                        <p className="text-lg font-bold text-gray-900">145</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Preço</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(45.9)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 transition-colors hover:bg-gray-50">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                        <Wrench className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Pastilha de Freio Dianteira
                        </h4>
                        <p className="text-sm text-gray-600">Código: PF-002</p>
                        <p className="text-sm text-gray-600">
                          Categoria: Freios
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Estoque</p>
                        <p className="text-lg font-bold text-orange-600">8</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Preço</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(89.9)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 transition-colors hover:bg-gray-50">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                        <Wrench className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Vela de Ignição
                        </h4>
                        <p className="text-sm text-gray-600">Código: VI-003</p>
                        <p className="text-sm text-gray-600">
                          Categoria: Motor
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Estoque</p>
                        <p className="text-lg font-bold text-gray-900">87</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Preço</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(25.5)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div>
            <div className="rounded-xl bg-white shadow-lg">
              <div className="border-b border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Estoque Baixo
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="p-4 transition-colors hover:bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        Pastilha de Freio
                      </h4>
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                        Baixo
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Código: PF-002</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Estoque atual:
                      </span>
                      <span className="font-bold text-orange-600">
                        8 unidades
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Mínimo:</span>
                      <span className="text-sm text-gray-900">15 unidades</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 transition-colors hover:bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        Correia Dentada
                      </h4>
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Crítico
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Código: CD-005</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Estoque atual:
                      </span>
                      <span className="font-bold text-red-600">3 unidades</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Mínimo:</span>
                      <span className="text-sm text-gray-900">10 unidades</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 transition-colors hover:bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        Fluido de Freio
                      </h4>
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                        Baixo
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Código: FF-007</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Estoque atual:
                      </span>
                      <span className="font-bold text-orange-600">
                        12 unidades
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Mínimo:</span>
                      <span className="text-sm text-gray-900">20 unidades</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
