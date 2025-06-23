'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  FileText,
  Home,
  UserCheck,
  Stethoscope,
  Package,
  ShoppingCart,
  TrendingUp,
  MapPin,
  AlertTriangle,
  ClipboardList,
  Wrench,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/actions/auth'
import { useState, useEffect } from 'react'

// Navegação específica por tipo de negócio
const getNavigationByType = (tenantType: string) => {
  const baseNavigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
  ]

  switch (tenantType) {
    case 'imobiliaria':
      return [
        ...baseNavigation,
        {
          name: 'Imóveis',
          href: '/dashboard/imoveis',
          icon: Home,
        },
        {
          name: 'Leads',
          href: '/dashboard/leads',
          icon: Users,
        },
        {
          name: 'Visitas',
          href: '/dashboard/visitas',
          icon: MapPin,
        },
        {
          name: 'Relatórios',
          href: '/dashboard/relatorios',
          icon: FileText,
        },
        {
          name: 'Configurações',
          href: '/dashboard/configuracoes',
          icon: Settings,
        },
      ]

    case 'clinica':
      return [
        ...baseNavigation,
        {
          name: 'Pacientes',
          href: '/dashboard/pacientes',
          icon: Users,
        },
        {
          name: 'Consultas',
          href: '/dashboard/consultas',
          icon: Calendar,
        },
        {
          name: 'Médicos',
          href: '/dashboard/medicos',
          icon: UserCheck,
        },
        {
          name: 'Prontuários',
          href: '/dashboard/prontuarios',
          icon: ClipboardList,
        },
        {
          name: 'Relatórios',
          href: '/dashboard/relatorios',
          icon: FileText,
        },
        {
          name: 'Configurações',
          href: '/dashboard/configuracoes',
          icon: Settings,
        },
      ]

    case 'autopecas':
      return [
        ...baseNavigation,
        {
          name: 'Produtos',
          href: '/dashboard/produtos',
          icon: Package,
        },
        {
          name: 'Estoque',
          href: '/dashboard/estoque',
          icon: AlertTriangle,
        },
        {
          name: 'Pedidos',
          href: '/dashboard/pedidos',
          icon: ShoppingCart,
        },
        {
          name: 'Fornecedores',
          href: '/dashboard/fornecedores',
          icon: Wrench,
        },
        {
          name: 'Relatórios',
          href: '/dashboard/relatorios',
          icon: FileText,
        },
        {
          name: 'Configurações',
          href: '/dashboard/configuracoes',
          icon: Settings,
        },
      ]

    default:
      // Navegação padrão (para master admin ou quando não identificado)
      return [
        ...baseNavigation,
        {
          name: 'Clientes',
          href: '/dashboard/clientes',
          icon: Users,
        },
        {
          name: 'Agendamentos',
          href: '/dashboard/agendamentos',
          icon: Calendar,
        },
        {
          name: 'Relatórios',
          href: '/dashboard/relatorios',
          icon: FileText,
        },
        {
          name: 'Configurações',
          href: '/dashboard/configuracoes',
          icon: Settings,
        },
      ]
  }
}

// Função para detectar o tipo de tenant atual
const getCurrentTenantType = (): string => {
  if (typeof window === 'undefined') return 'default'

  // Detectar pelo pathname
  const pathname = window.location.pathname

  // Rotas específicas da imobiliária
  if (
    pathname.includes('/imobiliaria') ||
    pathname.includes('/imoveis') ||
    pathname.includes('/leads') ||
    pathname.includes('/visitas')
  ) {
    return 'imobiliaria'
  }

  // Rotas específicas da clínica
  if (
    pathname.includes('/clinica') ||
    pathname.includes('/pacientes') ||
    pathname.includes('/consultas') ||
    pathname.includes('/medicos') ||
    pathname.includes('/prontuarios')
  ) {
    return 'clinica'
  }

  // Rotas específicas da autopeças
  if (
    pathname.includes('/autopecas') ||
    pathname.includes('/produtos') ||
    pathname.includes('/fornecedores') ||
    pathname.includes('/pedidos') ||
    pathname.includes('/estoque')
  ) {
    return 'autopecas'
  }

  // Detectar pelo localStorage (fallback)
  const storedTenant = localStorage.getItem('current_tenant')
  if (storedTenant) return storedTenant

  return 'default'
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [tenantType, setTenantType] = useState<string>('default')

  useEffect(() => {
    setTenantType(getCurrentTenantType())
  }, [pathname])

  const navigation = getNavigationByType(tenantType)

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return (
        pathname === href ||
        pathname === '/dashboard/imobiliaria' ||
        pathname === '/dashboard/clinica' ||
        pathname === '/dashboard/autopecas'
      )
    }

    // Para rotas específicas, verificar se começa com o href
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await logoutAction()
  }

  const getTenantName = () => {
    switch (tenantType) {
      case 'imobiliaria':
        return 'Imobiliária'
      case 'clinica':
        return 'Clínica'
      case 'autopecas':
        return 'AutoPeças'
      default:
        return 'MoneyMaker'
    }
  }

  const getTenantIcon = () => {
    switch (tenantType) {
      case 'imobiliaria':
        return <Home className="h-5 w-5 text-white" />
      case 'clinica':
        return <Stethoscope className="h-5 w-5 text-white" />
      case 'autopecas':
        return <Wrench className="h-5 w-5 text-white" />
      default:
        return <span className="text-lg font-bold text-white">M</span>
    }
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              {getTenantIcon()}
            </div>
            <span className="text-xl font-bold text-gray-900">
              {getTenantName()}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors',
                        isActive(item.href)
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-6 w-6 shrink-0',
                          isActive(item.href)
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-primary-600'
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Logout */}
            <li className="mt-auto">
              <button
                onClick={handleLogout}
                className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-700" />
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
