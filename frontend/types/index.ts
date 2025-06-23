// Tipos de autenticação
export interface User {
  id: string
  clientId: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE' | 'CLIENT' | 'GUEST'
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'
  emailVerified: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
  client?: {
    id: string
    name: string
    status: string
  }
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Tipos da API
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  message: string
  code: string
  details?: any
}

// Tipos de cliente/empresa (tenant)
export interface Client {
  id: string
  name: string
  slug: string
  email: string
  phone?: string
  logo?: string
  website?: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TRIAL'
  plan: string
  settings: Record<string, any> & {
    type?: 'imobiliaria' | 'clinica' | 'autopecas'
  }
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

// Tipos de funcionários
export interface Employee {
  id: string
  clientId: string
  name: string
  email: string
  phone?: string
  avatar?: string
  position: string
  description?: string
  workingHours: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Tipos de serviços
export interface Service {
  id: string
  clientId: string
  name: string
  description?: string
  duration: number // em minutos
  price: number
  isActive: boolean
  maxAdvanceBooking?: number
  minAdvanceBooking?: number
  createdAt: string
  updatedAt: string
}

// Tipos de agendamentos
export interface Appointment {
  id: string
  clientId: string
  userId: string
  employeeId: string
  serviceId: string
  startTime: string
  endTime: string
  status:
    | 'SCHEDULED'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW'
  notes?: string
  totalPrice: number
  createdAt: string
  updatedAt: string
  user?: User
  employee?: Employee
  service?: Service
}

// Tipos de produtos
export interface Product {
  id: string
  clientId: string
  categoryId?: string
  name: string
  description?: string
  price: number
  stock?: number
  sku?: string
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Tipos de pedidos
export interface Order {
  id: string
  clientId: string
  userId: string
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PREPARING'
    | 'READY'
    | 'DELIVERED'
    | 'CANCELLED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user?: User
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product?: Product
}

// Tipos de dashboard
export interface DashboardStats {
  totalClients: number
  activeClients: number
  pendingPayments: number
  monthlyRevenue: number
  upcomingAppointments: number
}

// Tipos de formulários
export interface LoginForm {
  email: string
  password: string
}

// Tipos de input para criação/atualização
export interface UserInput {
  name: string
  email: string
  phone?: string
  password?: string
  role?: User['role']
  avatar?: string
}

export interface ClientInput {
  name: string
  slug: string
  email: string
  phone?: string
  logo?: string
  website?: string
  status?: Client['status']
  plan?: string
  settings?: Record<string, any>
}

export interface EmployeeInput {
  name: string
  email: string
  phone?: string
  avatar?: string
  position: string
  description?: string
  workingHours?: Record<string, any>
  isActive?: boolean
}

export interface ServiceInput {
  name: string
  description?: string
  duration: number
  price: number
  isActive?: boolean
  maxAdvanceBooking?: number
  minAdvanceBooking?: number
}

export interface AppointmentInput {
  userId: string
  employeeId: string
  serviceId: string
  startTime: string
  endTime: string
  notes?: string
}

// Tipos de paginação
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
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

// === TIPOS ESPECÍFICOS POR NEGÓCIO ===

// IMOBILIÁRIA
export interface Imovel {
  id: string
  titulo: string
  descricao: string
  preco: number
  tipo: 'Casa' | 'Apartamento' | 'Terreno' | 'Comercial' | 'Cobertura'
  categoria: 'Venda' | 'Aluguel'
  quartos: number
  banheiros: number
  area: number
  areaTerreno?: number
  endereco: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  status: 'Disponível' | 'Vendido' | 'Alugado' | 'Reservado'
  fotos: string[]
  caracteristicas: string[]
  proprietario: string
  telefoneProprietario: string
  createdAt: string
  updatedAt: string
}

export interface Lead {
  id: string
  nome: string
  email: string
  telefone: string
  interesse: 'Compra' | 'Aluguel' | 'Venda' | 'Informações'
  orcamento: number
  observacoes: string
  status:
    | 'Novo'
    | 'Contactado'
    | 'Qualificado'
    | 'Proposta Enviada'
    | 'Negociando'
    | 'Agendado'
    | 'Convertido'
    | 'Perdido'
  fonte: 'Site' | 'WhatsApp' | 'Indicação' | 'Facebook' | 'Google'
  createdAt?: string
  updatedAt?: string
  property?: {
    id: string
    title: string
    price: number
  }
}

export interface VisitaAgendada {
  id: string
  leadId: string
  lead: {
    id: string
    nome: string
    telefone: string
    email?: string
  }
  imovelId: string
  imovel: {
    id: string
    titulo: string
    endereco: string
    preco: number
    tipo: string
  }
  dataHora: string
  status: 'Agendada' | 'Confirmada' | 'Realizada' | 'Cancelada'
  observacoes?: string
  createdAt: string
  updatedAt: string
}

// CLÍNICA
export interface Paciente {
  id: string
  nome: string
  cpf: string
  rg?: string
  dataNascimento: string
  sexo: 'Masculino' | 'Feminino' | 'Outro' | 'Não Informado'
  telefone: string
  email?: string
  endereco: string
  bairro?: string
  cidade: string
  estado: string
  cep: string
  convenio?: string
  numeroCarterinha?: string
  tipoSanguineo?: string
  alergias?: string
  medicamentos?: string
  historico?: string
  contatoEmergencia: string
  telefoneEmergencia?: string
  observacoes?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface Medico {
  id: string
  nome: string
  crm: string
  especialidade: string
  telefone: string
  email?: string
  horarioAtendimento: string[]
  valorConsulta: number
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export interface Consulta {
  id: string
  dataHora: string
  paciente: {
    id: string
    nome: string
    telefone: string
    avatar: string
  }
  medico: {
    id: string
    nome: string
    especialidade: string
    crm: string
  }
  tipo: 'Primeira Consulta' | 'Retorno' | 'Urgência' | 'Exame' | 'Consulta'
  duracao: number
  status:
    | 'Agendada'
    | 'Confirmada'
    | 'Em Andamento'
    | 'Finalizada'
    | 'Cancelada'
    | 'Não Compareceu'
  valor: number
  sintomas?: string
  diagnostico?: string
  prescricao?: string
  observacoes?: string
  pagamento: string
  createdAt?: string
  updatedAt?: string
}

export interface Prontuario {
  id: string
  pacienteId: string
  consultaId: string
  sintomas: string
  diagnostico?: string
  prescricao?: string
  observacoes?: string
  proximaConsulta?: string
  createdAt: string
  updatedAt: string
}

// AUTOPEÇAS
export interface Produto {
  id: string
  nome: string
  codigo: string
  categoria: string
  marca: string
  preco: number
  estoque: number
  estoqueMinimo: number
  localizacao: string
  fornecedor: string
  fornecedorId?: string
  descricao?: string
  status: 'Disponível' | 'Estoque Baixo' | 'Sem Estoque'
  createdAt?: string
  updatedAt?: string
  isActive?: boolean
  image?: string
}

export interface Fornecedor {
  id: string
  nome: string
  razaoSocial: string
  cnpj: string
  telefone: string
  email?: string
  endereco: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  contato: string
  produtos: string[]
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export interface Pedido {
  id: string
  numero: string
  clienteId: string
  cliente: {
    id: string
    nome: string
    telefone: string
    email?: string
  }
  itens: PedidoItem[]
  total: number
  status:
    | 'Pendente'
    | 'Confirmado'
    | 'Separando'
    | 'Pronto'
    | 'Entregue'
    | 'Cancelado'
  formaPagamento:
    | 'Dinheiro'
    | 'Cartão Débito'
    | 'Cartão Crédito'
    | 'PIX'
    | 'Boleto'
    | 'Crediário'
  observacoes?: string
  createdAt: string
  updatedAt: string
}

export interface PedidoItem {
  id: string
  produtoId: string
  produto: {
    id: string
    nome: string
    codigo: string
    preco: number
  }
  quantidade: number
  precoUnitario: number
  subtotal: number
}

export interface MovimentacaoEstoque {
  id: string
  produtoId: string
  tipo: 'Entrada' | 'Saída' | 'Ajuste'
  quantidade: number
  motivo: string
  observacoes?: string
  usuarioId: string
  createdAt: string
}
