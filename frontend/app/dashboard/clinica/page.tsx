'use client'

import React from 'react'
import Link from 'next/link'
import {
  Stethoscope,
  Users,
  Calendar,
  UserCheck,
  DollarSign,
  Clock,
  Plus,
  Eye,
  Phone,
  Mail,
} from 'lucide-react'
import { TenantSwitcher } from '@/components/TenantSwitcher'

export default function ClinicaDashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const recentAppointments = [
    {
      id: '1',
      patient: 'Ana Silva',
      doctor: 'Dr. João Santos',
      time: '09:00',
      type: 'Consulta Geral',
      status: 'Confirmado',
    },
    {
      id: '2',
      patient: 'Carlos Costa',
      doctor: 'Dra. Maria Oliveira',
      time: '10:30',
      type: 'Cardiologia',
      status: 'Em Andamento',
    },
    {
      id: '3',
      patient: 'Fernanda Lima',
      doctor: 'Dr. Pedro Alves',
      time: '14:00',
      type: 'Dermatologia',
      status: 'Agendado',
    },
  ]

  const recentPatients = [
    {
      id: '1',
      name: 'Ana Silva',
      age: 35,
      phone: '(11) 99999-9999',
      email: 'ana@email.com',
      lastVisit: '2024-01-15',
      condition: 'Diabetes',
    },
    {
      id: '2',
      name: 'Carlos Costa',
      age: 42,
      phone: '(11) 88888-8888',
      email: 'carlos@email.com',
      lastVisit: '2024-01-14',
      condition: 'Hipertensão',
    },
    {
      id: '3',
      name: 'Fernanda Lima',
      age: 28,
      phone: '(11) 77777-7777',
      email: 'fernanda@email.com',
      lastVisit: '2024-01-13',
      condition: 'Check-up',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800'
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800'
      case 'Agendado':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sky-900 sm:text-4xl">
              Dashboard Clínica
            </h1>
            <p className="mt-2 text-gray-600">
              Gerencie consultas, pacientes e prontuários
            </p>
          </div>
          <div className="flex gap-3">
            <TenantSwitcher />
            <Link href="/dashboard/consultas">
              <button className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-sky-700">
                <Plus className="h-4 w-4" />
                Nova Consulta
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/consultas">
            <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Consultas Hoje
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">12</p>
                  <p className="mt-1 text-xs text-sky-600">3 concluídas</p>
                </div>
                <div className="rounded-lg bg-sky-50 p-3">
                  <Calendar className="h-6 w-6 text-sky-600" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-sky-500 to-sky-600 transition-transform duration-300 group-hover:scale-x-100"></div>
            </div>
          </Link>

          <Link href="/dashboard/pacientes">
            <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total de Pacientes
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">247</p>
                  <p className="mt-1 text-xs text-blue-600">+8 este mês</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-blue-500 to-blue-600 transition-transform duration-300 group-hover:scale-x-100"></div>
            </div>
          </Link>

          <Link href="/dashboard/medicos">
            <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Médicos Ativos
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">8</p>
                  <p className="mt-1 text-xs text-indigo-600">
                    Equipe completa
                  </p>
                </div>
                <div className="rounded-lg bg-indigo-50 p-3">
                  <UserCheck className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-indigo-500 to-indigo-600 transition-transform duration-300 group-hover:scale-x-100"></div>
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
                    {formatCurrency(62000)}
                  </p>
                  <p className="mt-1 text-xs text-emerald-600">
                    +18% vs mês anterior
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
            <Link href="/dashboard/consultas">
              <button className="flex w-full items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-sky-200 hover:bg-sky-50">
                <div className="rounded-lg bg-sky-100 p-3">
                  <Plus className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Nova Consulta</p>
                  <p className="text-sm text-gray-600">Agendar consulta</p>
                </div>
              </button>
            </Link>

            <Link href="/dashboard/pacientes">
              <button className="flex w-full items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-blue-200 hover:bg-blue-50">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Cadastrar Paciente
                  </p>
                  <p className="text-sm text-gray-600">Novo cadastro</p>
                </div>
              </button>
            </Link>

            <Link href="/dashboard/medicos">
              <button className="flex w-full items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50">
                <div className="rounded-lg bg-indigo-100 p-3">
                  <UserCheck className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Gerenciar Médicos
                  </p>
                  <p className="text-sm text-gray-600">Equipe médica</p>
                </div>
              </button>
            </Link>

            <Link href="/dashboard/relatorios">
              <button className="flex w-full items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50">
                <div className="rounded-lg bg-emerald-100 p-3">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Relatórios</p>
                  <p className="text-sm text-gray-600">Financeiro e vendas</p>
                </div>
              </button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Appointments List */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white shadow-lg">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Consultas de Hoje
                  </h3>
                  <Link href="/dashboard/consultas">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm font-medium text-sky-600 transition-colors hover:bg-sky-100">
                      <Eye className="h-4 w-4" />
                      Ver Todas
                    </button>
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-6 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100">
                            <Clock className="h-6 w-6 text-sky-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {appointment.patient}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {appointment.doctor}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {appointment.time}
                          </p>
                          <span
                            className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Patients List */}
          <div>
            <div className="rounded-xl bg-white shadow-lg">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pacientes Recentes
                  </h3>
                  <Link href="/dashboard/pacientes">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100">
                      <Eye className="h-4 w-4" />
                      Ver Todos
                    </button>
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">
                          {patient.name}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {patient.age} anos
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        {patient.email}
                      </div>
                      <p className="text-xs text-gray-500">
                        Condição: {patient.condition}
                      </p>
                      <p className="text-xs text-gray-400">
                        Última visita:{' '}
                        {new Date(patient.lastVisit).toLocaleDateString(
                          'pt-BR'
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
