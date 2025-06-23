import { z } from 'zod'

// Schema para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter um formato válido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

// Schema para criação de usuário
export const userSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter um formato válido'),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
    )
    .optional(),
  role: z
    .enum(['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'CLIENT', 'GUEST'])
    .optional(),
  avatar: z.string().url('Avatar deve ser uma URL válida').optional(),
})

// Schema para criação de funcionário
export const employeeSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter um formato válido'),
  phone: z.string().optional(),
  avatar: z.string().url('Avatar deve ser uma URL válida').optional(),
  position: z
    .string()
    .min(2, 'Cargo deve ter pelo menos 2 caracteres')
    .max(100, 'Cargo deve ter no máximo 100 caracteres'),
  description: z.string().optional(),
  workingHours: z.record(z.any()).optional(),
  isActive: z.boolean().optional(),
})

// Schema para criação de serviço
export const serviceSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z.string().optional(),
  duration: z
    .number()
    .min(15, 'Duração deve ser pelo menos 15 minutos')
    .max(480, 'Duração deve ser no máximo 8 horas (480 minutos)'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  isActive: z.boolean().optional(),
  maxAdvanceBooking: z.number().min(1, 'Deve ser pelo menos 1 dia').optional(),
  minAdvanceBooking: z.number().min(0, 'Deve ser 0 ou mais dias').optional(),
})

// Schema para criação de agendamento
export const appointmentSchema = z.object({
  userId: z.string().min(1, 'Usuário é obrigatório'),
  employeeId: z.string().min(1, 'Funcionário é obrigatório'),
  serviceId: z.string().min(1, 'Serviço é obrigatório'),
  startTime: z.string().min(1, 'Data/hora de início é obrigatória'),
  endTime: z.string().min(1, 'Data/hora de fim é obrigatória'),
  notes: z.string().optional(),
})

// Schema para filtros e busca
export const searchFiltersSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  status: z.string().optional(),
})

// Schema para contato
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter um formato válido'),
  phone: z
    .string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .optional(),
  company: z
    .string()
    .max(100, 'Nome da empresa deve ter no máximo 100 caracteres')
    .optional(),
  service: z.string().min(1, 'Serviço é obrigatório'),
  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(1000, 'Mensagem deve ter no máximo 1000 caracteres'),
})

// Tipos inferidos dos schemas
export type LoginInput = z.infer<typeof loginSchema>
export type UserInput = z.infer<typeof userSchema>
export type EmployeeInput = z.infer<typeof employeeSchema>
export type ServiceInput = z.infer<typeof serviceSchema>
export type AppointmentInput = z.infer<typeof appointmentSchema>
export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>
export type ContactInput = z.infer<typeof contactSchema>
