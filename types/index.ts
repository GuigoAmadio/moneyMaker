// Tipos de autenticação
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Tipos de cliente
export interface Client {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  status: 'active' | 'inactive' | 'pending'
  paymentStatus: 'paid' | 'pending' | 'overdue'
  services: Service[]
  createdAt: string
  updatedAt: string
}

// Tipos de serviço
export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number // em horas
  category: 'web' | 'mobile' | 'design' | 'consultoria'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Tipos de agendamento
export interface Appointment {
  id: string
  clientId: string
  serviceId: string
  date: string
  time: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface ApiError {
  message: string
  code: string
  details?: any
}

// Tipos de formulário
export interface ContactForm {
  name: string
  email: string
  phone?: string
  company?: string
  service: string
  message: string
}

export interface LoginForm {
  email: string
  password: string
}

// Tipos de dashboard
export interface DashboardStats {
  totalClients: number
  activeClients: number
  pendingPayments: number
  monthlyRevenue: number
  upcomingAppointments: number
}

// Tipos de componentes
import { ReactNode } from 'react'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
} 