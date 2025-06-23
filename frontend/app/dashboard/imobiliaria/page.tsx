'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Plus,
  Eye,
} from 'lucide-react'
import AnimatedDiv from '@/components/animations/AnimatedDiv'

interface ImobiliariaStats {
  totalImoveis: number
  leadsAtivos: number
  visitasAgendadas: number
  receitaMensal: number
}

interface Imovel {
  id: string
  titulo: string
  preco: number
  tipo: string
  quartos: number
  banheiros: number
  area: number
  endereco: string
  status: 'disponivel' | 'vendido' | 'alugado'
}

const mockStats: ImobiliariaStats = {
  totalImoveis: 47,
  leadsAtivos: 23,
  visitasAgendadas: 8,
  receitaMensal: 245000,
}

const mockImoveis: Imovel[] = [
  {
    id: '1',
    titulo: 'Apartamento Luxo Jardins',
    preco: 850000,
    tipo: 'Apartamento',
    quartos: 3,
    banheiros: 2,
    area: 120,
    endereco: 'Jardins, São Paulo',
    status: 'disponivel',
  },
  {
    id: '2',
    titulo: 'Casa Condomínio Alphaville',
    preco: 1200000,
    tipo: 'Casa',
    quartos: 4,
    banheiros: 3,
    area: 200,
    endereco: 'Alphaville, Barueri',
    status: 'disponivel',
  },
  {
    id: '3',
    titulo: 'Cobertura Vila Madalena',
    preco: 950000,
    tipo: 'Cobertura',
    quartos: 2,
    banheiros: 2,
    area: 150,
    endereco: 'Vila Madalena, São Paulo',
    status: 'vendido',
  },
]

export default function ImobiliariaDashboard() {
  const [stats, setStats] = useState<ImobiliariaStats>(mockStats)
  const [imoveis, setImoveis] = useState<Imovel[]>(mockImoveis)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'bg-green-100 text-green-800'
      case 'vendido':
        return 'bg-blue-100 text-blue-800'
      case 'alugado':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <AnimatedDiv animation="fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Imobiliária
            </h1>
            <p className="text-gray-600">Gerencie seus imóveis e leads</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-green-600">
              <Home className="h-5 w-5" />
              <span className="font-medium">Imobiliária Prime</span>
            </div>
            <Link href="/dashboard/imoveis">
              <button className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-green-700">
                <Plus className="h-4 w-4" />
                Novo Imóvel
              </button>
            </Link>
          </div>
        </div>
      </AnimatedDiv>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedDiv animation="slideUp" delay={0.1}>
          <Link href="/dashboard/imoveis">
            <div className="cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg">
              <div className="flex items-center">
                <Home className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Total Imóveis
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalImoveis}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </AnimatedDiv>

        <AnimatedDiv animation="slideUp" delay={0.2}>
          <Link href="/dashboard/leads">
            <div className="cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Leads Ativos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.leadsAtivos}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </AnimatedDiv>

        <AnimatedDiv animation="slideUp" delay={0.3}>
          <Link href="/dashboard/visitas">
            <div className="cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Visitas Agendadas
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.visitasAgendadas}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </AnimatedDiv>

        <AnimatedDiv animation="slideUp" delay={0.4}>
          <Link href="/dashboard/relatorios">
            <div className="cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Receita Mensal
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.receitaMensal)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </AnimatedDiv>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedDiv animation="slideUp" delay={0.5}>
          <Link href="/dashboard/imoveis">
            <div className="cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Home className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Gerenciar Imóveis
                </h3>
                <p className="text-sm text-gray-600">
                  Adicione, edite e organize seus imóveis
                </p>
              </div>
            </div>
          </Link>
        </AnimatedDiv>

        <AnimatedDiv animation="slideUp" delay={0.6}>
          <Link href="/dashboard/leads">
            <div className="cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Leads</h3>
                <p className="text-sm text-gray-600">
                  Gerencie prospects e oportunidades
                </p>
              </div>
            </div>
          </Link>
        </AnimatedDiv>

        <AnimatedDiv animation="slideUp" delay={0.7}>
          <Link href="/dashboard/visitas">
            <div className="cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Visitas</h3>
                <p className="text-sm text-gray-600">
                  Agende e acompanhe visitas
                </p>
              </div>
            </div>
          </Link>
        </AnimatedDiv>

        <AnimatedDiv animation="slideUp" delay={0.8}>
          <Link href="/dashboard/relatorios">
            <div className="cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Relatórios</h3>
                <p className="text-sm text-gray-600">
                  Analise vendas e performance
                </p>
              </div>
            </div>
          </Link>
        </AnimatedDiv>
      </div>

      {/* Imóveis Recentes */}
      <AnimatedDiv animation="slideUp" delay={0.5}>
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Imóveis Recentes
              </h2>
              <Link href="/dashboard/imoveis">
                <button className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-100">
                  <Eye className="h-4 w-4" />
                  Ver Todos
                </button>
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {imoveis.map((imovel, index) => (
                <AnimatedDiv
                  key={imovel.id}
                  animation="fadeIn"
                  delay={0.6 + index * 0.1}
                >
                  <Link href={`/dashboard/imoveis`}>
                    <div className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Home className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {imovel.titulo}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {imovel.quartos} quartos • {imovel.banheiros}{' '}
                            banheiros • {imovel.area}m²
                          </p>
                          <p className="flex items-center text-xs text-gray-400">
                            <MapPin className="mr-1 h-3 w-3" />
                            {imovel.endereco}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(imovel.preco)}
                        </p>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(imovel.status)}`}
                        >
                          {imovel.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedDiv>
              ))}
            </div>
          </div>
        </div>
      </AnimatedDiv>
    </div>
  )
}
