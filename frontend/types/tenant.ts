// Tipos específicos para sistema multi-tenant
export type TenantType = 'imobiliaria' | 'clinica' | 'autopecas'

export interface TenantConfig {
  type: TenantType
  name: string
  slug: string
  primaryColor: string
  icon: string
  features: string[]
  dashboardConfig: DashboardConfig
}

export interface DashboardConfig {
  sidebarItems: SidebarItem[]
  statsCards: StatsCardConfig[]
  quickActions: QuickAction[]
}

export interface SidebarItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: string
  children?: SidebarItem[]
}

export interface StatsCardConfig {
  id: string
  title: string
  icon: string
  color: string
  bgColor: string
  iconColor: string
  valueKey: string
  format?: 'currency' | 'number' | 'percentage'
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  href: string
  color: string
}

// Configurações específicas por tipo de negócio
export const TENANT_CONFIGS: Record<TenantType, TenantConfig> = {
  imobiliaria: {
    type: 'imobiliaria',
    name: 'Imobiliária',
    slug: 'imobiliaria',
    primaryColor: '#059669', // green-600
    icon: 'Building2',
    features: ['properties', 'leads', 'visits', 'contracts'],
    dashboardConfig: {
      sidebarItems: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'LayoutDashboard',
          href: '/dashboard/imobiliaria',
        },
        {
          id: 'properties',
          label: 'Imóveis',
          icon: 'Building2',
          href: '/dashboard/imobiliaria/imoveis',
        },
        {
          id: 'leads',
          label: 'Leads',
          icon: 'Users',
          href: '/dashboard/imobiliaria/leads',
        },
        {
          id: 'visits',
          label: 'Visitas',
          icon: 'Calendar',
          href: '/dashboard/imobiliaria/visitas',
        },
        {
          id: 'contracts',
          label: 'Contratos',
          icon: 'FileText',
          href: '/dashboard/imobiliaria/contratos',
        },
        {
          id: 'reports',
          label: 'Relatórios',
          icon: 'BarChart3',
          href: '/dashboard/imobiliaria/relatorios',
        },
      ],
      statsCards: [
        {
          id: 'total_properties',
          title: 'Total de Imóveis',
          icon: 'Building2',
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600',
          valueKey: 'totalProperties',
        },
        {
          id: 'active_leads',
          title: 'Leads Ativos',
          icon: 'Users',
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          valueKey: 'activeLeads',
        },
        {
          id: 'scheduled_visits',
          title: 'Visitas Agendadas',
          icon: 'Calendar',
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-600',
          valueKey: 'scheduledVisits',
        },
        {
          id: 'monthly_revenue',
          title: 'Receita Mensal',
          icon: 'DollarSign',
          color: 'from-emerald-500 to-emerald-600',
          bgColor: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          valueKey: 'monthlyRevenue',
          format: 'currency',
        },
      ],
      quickActions: [
        {
          id: 'add_property',
          title: 'Cadastrar Imóvel',
          description: 'Adicionar novo imóvel ao sistema',
          icon: 'Plus',
          href: '/dashboard/imobiliaria/imoveis/novo',
          color: 'bg-green-500',
        },
        {
          id: 'schedule_visit',
          title: 'Agendar Visita',
          description: 'Agendar visita para cliente',
          icon: 'Calendar',
          href: '/dashboard/imobiliaria/visitas/nova',
          color: 'bg-blue-500',
        },
      ],
    },
  },
  clinica: {
    type: 'clinica',
    name: 'Clínica',
    slug: 'clinica',
    primaryColor: '#0EA5E9', // sky-500
    icon: 'Stethoscope',
    features: ['appointments', 'patients', 'doctors', 'medical_records'],
    dashboardConfig: {
      sidebarItems: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'LayoutDashboard',
          href: '/dashboard/clinica',
        },
        {
          id: 'appointments',
          label: 'Agendamentos',
          icon: 'Calendar',
          href: '/dashboard/clinica/agendamentos',
        },
        {
          id: 'patients',
          label: 'Pacientes',
          icon: 'Users',
          href: '/dashboard/clinica/pacientes',
        },
        {
          id: 'doctors',
          label: 'Médicos',
          icon: 'UserCheck',
          href: '/dashboard/clinica/medicos',
        },
        {
          id: 'medical_records',
          label: 'Prontuários',
          icon: 'FileText',
          href: '/dashboard/clinica/prontuarios',
        },
        {
          id: 'reports',
          label: 'Relatórios',
          icon: 'BarChart3',
          href: '/dashboard/clinica/relatorios',
        },
      ],
      statsCards: [
        {
          id: 'todays_appointments',
          title: 'Consultas Hoje',
          icon: 'Calendar',
          color: 'from-sky-500 to-sky-600',
          bgColor: 'bg-sky-50',
          iconColor: 'text-sky-600',
          valueKey: 'todaysAppointments',
        },
        {
          id: 'total_patients',
          title: 'Total de Pacientes',
          icon: 'Users',
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          valueKey: 'totalPatients',
        },
        {
          id: 'active_doctors',
          title: 'Médicos Ativos',
          icon: 'UserCheck',
          color: 'from-indigo-500 to-indigo-600',
          bgColor: 'bg-indigo-50',
          iconColor: 'text-indigo-600',
          valueKey: 'activeDoctors',
        },
        {
          id: 'monthly_revenue',
          title: 'Receita Mensal',
          icon: 'DollarSign',
          color: 'from-emerald-500 to-emerald-600',
          bgColor: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          valueKey: 'monthlyRevenue',
          format: 'currency',
        },
      ],
      quickActions: [
        {
          id: 'new_appointment',
          title: 'Nova Consulta',
          description: 'Agendar nova consulta',
          icon: 'Plus',
          href: '/dashboard/clinica/agendamentos/nova',
          color: 'bg-sky-500',
        },
        {
          id: 'add_patient',
          title: 'Cadastrar Paciente',
          description: 'Adicionar novo paciente',
          icon: 'UserPlus',
          href: '/dashboard/clinica/pacientes/novo',
          color: 'bg-blue-500',
        },
      ],
    },
  },
  autopecas: {
    type: 'autopecas',
    name: 'Autopeças',
    slug: 'autopecas',
    primaryColor: '#DC2626', // red-600
    icon: 'Wrench',
    features: ['inventory', 'products', 'suppliers', 'orders'],
    dashboardConfig: {
      sidebarItems: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'LayoutDashboard',
          href: '/dashboard/autopecas',
        },
        {
          id: 'inventory',
          label: 'Estoque',
          icon: 'Package',
          href: '/dashboard/autopecas/estoque',
        },
        {
          id: 'products',
          label: 'Produtos',
          icon: 'Box',
          href: '/dashboard/autopecas/produtos',
        },
        {
          id: 'suppliers',
          label: 'Fornecedores',
          icon: 'Truck',
          href: '/dashboard/autopecas/fornecedores',
        },
        {
          id: 'orders',
          label: 'Pedidos',
          icon: 'ShoppingCart',
          href: '/dashboard/autopecas/pedidos',
        },
        {
          id: 'reports',
          label: 'Relatórios',
          icon: 'BarChart3',
          href: '/dashboard/autopecas/relatorios',
        },
      ],
      statsCards: [
        {
          id: 'total_products',
          title: 'Total de Produtos',
          icon: 'Package',
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-600',
          valueKey: 'totalProducts',
        },
        {
          id: 'low_stock_items',
          title: 'Estoque Baixo',
          icon: 'AlertTriangle',
          color: 'from-orange-500 to-orange-600',
          bgColor: 'bg-orange-50',
          iconColor: 'text-orange-600',
          valueKey: 'lowStockItems',
        },
        {
          id: 'pending_orders',
          title: 'Pedidos Pendentes',
          icon: 'ShoppingCart',
          color: 'from-yellow-500 to-yellow-600',
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-600',
          valueKey: 'pendingOrders',
        },
        {
          id: 'monthly_revenue',
          title: 'Receita Mensal',
          icon: 'DollarSign',
          color: 'from-emerald-500 to-emerald-600',
          bgColor: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          valueKey: 'monthlyRevenue',
          format: 'currency',
        },
      ],
      quickActions: [
        {
          id: 'add_product',
          title: 'Cadastrar Produto',
          description: 'Adicionar novo produto ao estoque',
          icon: 'Plus',
          href: '/dashboard/autopecas/produtos/novo',
          color: 'bg-red-500',
        },
        {
          id: 'stock_movement',
          title: 'Movimentar Estoque',
          description: 'Registrar entrada/saída',
          icon: 'ArrowUpDown',
          href: '/dashboard/autopecas/estoque/movimentar',
          color: 'bg-orange-500',
        },
      ],
    },
  },
}

// Estatísticas específicas por tenant
export interface ImobiliariaStats {
  totalProperties: number
  activeLeads: number
  scheduledVisits: number
  monthlyRevenue: number
  propertiesForSale: number
  propertiesForRent: number
  closedDeals: number
}

export interface ClinicaStats {
  todaysAppointments: number
  totalPatients: number
  activeDoctors: number
  monthlyRevenue: number
  cancelledAppointments: number
  newPatients: number
  totalConsultations: number
}

export interface AutopecasStats {
  totalProducts: number
  lowStockItems: number
  pendingOrders: number
  monthlyRevenue: number
  totalSuppliers: number
  stockValue: number
  topSellingProducts: Array<{ name: string; quantity: number }>
}

export type TenantStats = ImobiliariaStats | ClinicaStats | AutopecasStats

// Interface para dados do Master Admin
export interface MasterAdminStats {
  totalClients: number
  activeClients: number
  totalRevenue: number
  totalUsers: number
  clientsByType: {
    imobiliaria: number
    clinica: number
    autopecas: number
  }
  revenueByClient: Array<{
    clientName: string
    revenue: number
    growth: number
  }>
  systemHealth: {
    uptime: number
    responseTime: number
    errors: number
  }
}
