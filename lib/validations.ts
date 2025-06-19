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

// Schema para contato
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter um formato válido'),
  phone: z
    .string()
    .optional()
    .refine(
      (phone) => !phone || /^\(\d{2}\)\s\d{5}-\d{4}$/.test(phone),
      'Telefone deve ter o formato (XX) XXXXX-XXXX'
    ),
  company: z.string().optional(),
  service: z.string().min(1, 'Serviço é obrigatório'),
  message: z
    .string()
    .min(1, 'Mensagem é obrigatória')
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

// Schema para cliente
export const clientSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter um formato válido'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .refine(
      (phone) => /^\(\d{2}\)\s\d{5}-\d{4}$/.test(phone),
      'Telefone deve ter o formato (XX) XXXXX-XXXX'
    ),
  company: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  paymentStatus: z.enum(['paid', 'pending', 'overdue']).default('pending'),
})

// Schema para serviço
export const serviceSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z
    .number()
    .min(0, 'Preço deve ser maior que zero')
    .positive('Preço deve ser um valor positivo'),
  duration: z
    .number()
    .min(1, 'Duração deve ser pelo menos 1 hora')
    .positive('Duração deve ser um valor positivo'),
  category: z.enum(['web', 'mobile', 'design', 'consultoria']),
  isActive: z.boolean().default(true),
})

// Schema para agendamento
export const appointmentSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  serviceId: z.string().min(1, 'Serviço é obrigatório'),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled'),
})

// Tipos inferidos dos schemas
export type LoginInput = z.infer<typeof loginSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type ClientInput = z.infer<typeof clientSchema>
export type ServiceInput = z.infer<typeof serviceSchema>
export type AppointmentInput = z.infer<typeof appointmentSchema> 