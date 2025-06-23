'use server'

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api'
import type { Consulta } from '@/types'

export interface CreateConsultaInput {
  doctorId: string
  patientId: string
  scheduledAt: string
  duration?: number
  symptoms?: string
  notes?: string
  price: number
}

export interface UpdateConsultaInput extends Partial<CreateConsultaInput> {
  id: string
  status?:
    | 'SCHEDULED'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW'
  diagnosis?: string
  prescription?: string
  paymentStatus?:
    | 'PENDING'
    | 'PAID'
    | 'FAILED'
    | 'REFUNDED'
    | 'PARTIALLY_REFUNDED'
}

export async function getConsultasAction() {
  try {
    const result = await serverGet<any[]>('/doctor-appointments')

    // Mapear dados do backend para o formato esperado pelo frontend
    const consultas =
      result.data?.map((appointment: any) => ({
        id: appointment.id,
        dataHora: appointment.scheduledAt,
        paciente: appointment.patient
          ? {
              id: appointment.patient.id,
              nome: appointment.patient.name,
              telefone: appointment.patient.phone || '',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patient.name)}&background=3b82f6&color=ffffff`,
            }
          : {
              id: '',
              nome: 'Paciente Não Encontrado',
              telefone: '',
              avatar: '',
            },
        medico: appointment.doctor
          ? {
              id: appointment.doctor.id,
              nome: appointment.doctor.employee?.name || 'Médico',
              especialidade: appointment.doctor.specialty || 'Clínica Geral',
              crm: appointment.doctor.crm || '',
            }
          : {
              id: '',
              nome: 'Médico Não Encontrado',
              especialidade: '',
              crm: '',
            },
        tipo: 'Consulta',
        duracao: appointment.duration || 30,
        status: mapAppointmentStatus(appointment.status),
        valor: Number(appointment.price),
        sintomas: appointment.symptoms || '',
        diagnostico: appointment.diagnosis || '',
        prescricao: appointment.prescription || '',
        observacoes: appointment.notes || '',
        pagamento: mapPaymentStatus(appointment.paymentStatus),
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      })) || []

    return {
      success: true,
      data: consultas,
    }
  } catch (error) {
    console.error('Erro ao buscar consultas:', error)
    return {
      success: false,
      data: [] as Consulta[],
      error: 'Erro ao carregar consultas',
    }
  }
}

export async function getConsultasByDateAction(data: string) {
  try {
    const result = await serverGet<any[]>(
      `/doctor-appointments?date=${encodeURIComponent(data)}`
    )

    const consultas =
      result.data?.map((appointment: any) => ({
        id: appointment.id,
        dataHora: appointment.scheduledAt,
        paciente: appointment.patient
          ? {
              id: appointment.patient.id,
              nome: appointment.patient.name,
              telefone: appointment.patient.phone || '',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patient.name)}&background=3b82f6&color=ffffff`,
            }
          : {
              id: '',
              nome: 'Paciente Não Encontrado',
              telefone: '',
              avatar: '',
            },
        medico: appointment.doctor
          ? {
              id: appointment.doctor.id,
              nome: appointment.doctor.employee?.name || 'Médico',
              especialidade: appointment.doctor.specialty || 'Clínica Geral',
              crm: appointment.doctor.crm || '',
            }
          : {
              id: '',
              nome: 'Médico Não Encontrado',
              especialidade: '',
              crm: '',
            },
        tipo: 'Consulta',
        duracao: appointment.duration || 30,
        status: mapAppointmentStatus(appointment.status),
        valor: Number(appointment.price),
        sintomas: appointment.symptoms || '',
        diagnostico: appointment.diagnosis || '',
        prescricao: appointment.prescription || '',
        observacoes: appointment.notes || '',
        pagamento: mapPaymentStatus(appointment.paymentStatus),
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      })) || []

    return {
      success: true,
      data: consultas,
    }
  } catch (error) {
    console.error('Erro ao buscar consultas por data:', error)
    return {
      success: false,
      data: [] as Consulta[],
      error: 'Erro ao carregar consultas por data',
    }
  }
}

export async function getConsultaByIdAction(id: string) {
  try {
    const result = await serverGet<any>(`/doctor-appointments/${id}`)

    if (!result.data) {
      return {
        success: false,
        data: null as any,
        error: 'Consulta não encontrada',
      }
    }

    const appointment = result.data
    const consulta = {
      id: appointment.id,
      dataHora: appointment.scheduledAt,
      paciente: appointment.patient
        ? {
            id: appointment.patient.id,
            nome: appointment.patient.name,
            telefone: appointment.patient.phone || '',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patient.name)}&background=3b82f6&color=ffffff`,
          }
        : {
            id: '',
            nome: 'Paciente Não Encontrado',
            telefone: '',
            avatar: '',
          },
      medico: appointment.doctor
        ? {
            id: appointment.doctor.id,
            nome: appointment.doctor.employee?.name || 'Médico',
            especialidade: appointment.doctor.specialty || 'Clínica Geral',
            crm: appointment.doctor.crm || '',
          }
        : {
            id: '',
            nome: 'Médico Não Encontrado',
            especialidade: '',
            crm: '',
          },
      tipo: 'Consulta',
      duracao: appointment.duration || 30,
      status: mapAppointmentStatus(appointment.status),
      valor: Number(appointment.price),
      sintomas: appointment.symptoms || '',
      diagnostico: appointment.diagnosis || '',
      prescricao: appointment.prescription || '',
      observacoes: appointment.notes || '',
      pagamento: mapPaymentStatus(appointment.paymentStatus),
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }

    return {
      success: true,
      data: consulta,
    }
  } catch (error) {
    console.error('Erro ao buscar consulta:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao carregar consulta',
    }
  }
}

export async function createConsultaAction(data: CreateConsultaInput) {
  try {
    const result = await serverPost<any>('/doctor-appointments', data)

    const appointment = result.data
    const consulta = {
      id: appointment.id,
      dataHora: appointment.scheduledAt,
      paciente: appointment.patient
        ? {
            id: appointment.patient.id,
            nome: appointment.patient.name,
            telefone: appointment.patient.phone || '',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patient.name)}&background=3b82f6&color=ffffff`,
          }
        : {
            id: '',
            nome: 'Paciente Não Encontrado',
            telefone: '',
            avatar: '',
          },
      medico: appointment.doctor
        ? {
            id: appointment.doctor.id,
            nome: appointment.doctor.employee?.name || 'Médico',
            especialidade: appointment.doctor.specialty || 'Clínica Geral',
            crm: appointment.doctor.crm || '',
          }
        : {
            id: '',
            nome: 'Médico Não Encontrado',
            especialidade: '',
            crm: '',
          },
      tipo: 'Consulta',
      duracao: appointment.duration || 30,
      status: mapAppointmentStatus(appointment.status),
      valor: Number(appointment.price),
      sintomas: appointment.symptoms || '',
      diagnostico: appointment.diagnosis || '',
      prescricao: appointment.prescription || '',
      observacoes: appointment.notes || '',
      pagamento: mapPaymentStatus(appointment.paymentStatus),
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }

    return {
      success: true,
      data: consulta,
    }
  } catch (error) {
    console.error('Erro ao criar consulta:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao criar consulta',
    }
  }
}

export async function updateConsultaAction(data: UpdateConsultaInput) {
  try {
    const { id, ...updateData } = data

    // Mapear status se fornecido
    const backendData = { ...updateData }
    if (updateData.status) {
      backendData.status = mapFrontendStatusToBackend(updateData.status)
    }

    const result = await serverPut<any>(
      `/doctor-appointments/${id}`,
      backendData
    )

    const appointment = result.data
    const consulta = {
      id: appointment.id,
      dataHora: appointment.scheduledAt,
      paciente: appointment.patient
        ? {
            id: appointment.patient.id,
            nome: appointment.patient.name,
            telefone: appointment.patient.phone || '',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patient.name)}&background=3b82f6&color=ffffff`,
          }
        : {
            id: '',
            nome: 'Paciente Não Encontrado',
            telefone: '',
            avatar: '',
          },
      medico: appointment.doctor
        ? {
            id: appointment.doctor.id,
            nome: appointment.doctor.employee?.name || 'Médico',
            especialidade: appointment.doctor.specialty || 'Clínica Geral',
            crm: appointment.doctor.crm || '',
          }
        : {
            id: '',
            nome: 'Médico Não Encontrado',
            especialidade: '',
            crm: '',
          },
      tipo: 'Consulta',
      duracao: appointment.duration || 30,
      status: mapAppointmentStatus(appointment.status),
      valor: Number(appointment.price),
      sintomas: appointment.symptoms || '',
      diagnostico: appointment.diagnosis || '',
      prescricao: appointment.prescription || '',
      observacoes: appointment.notes || '',
      pagamento: mapPaymentStatus(appointment.paymentStatus),
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }

    return {
      success: true,
      data: consulta,
    }
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar consulta',
    }
  }
}

export async function deleteConsultaAction(id: string) {
  try {
    await serverDelete(`/doctor-appointments/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erro ao excluir consulta:', error)
    return {
      success: false,
      error: 'Erro ao excluir consulta',
    }
  }
}

export async function updateConsultaStatusAction(
  id: string,
  status: Consulta['status']
) {
  try {
    const backendStatus = mapFrontendStatusToBackend(status)
    const result = await serverPut<any>(`/doctor-appointments/${id}`, {
      status: backendStatus,
    })

    const appointment = result.data
    const consulta = {
      id: appointment.id,
      dataHora: appointment.scheduledAt,
      paciente: appointment.patient
        ? {
            id: appointment.patient.id,
            nome: appointment.patient.name,
            telefone: appointment.patient.phone || '',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patient.name)}&background=3b82f6&color=ffffff`,
          }
        : {
            id: '',
            nome: 'Paciente Não Encontrado',
            telefone: '',
            avatar: '',
          },
      medico: appointment.doctor
        ? {
            id: appointment.doctor.id,
            nome: appointment.doctor.employee?.name || 'Médico',
            especialidade: appointment.doctor.specialty || 'Clínica Geral',
            crm: appointment.doctor.crm || '',
          }
        : {
            id: '',
            nome: 'Médico Não Encontrado',
            especialidade: '',
            crm: '',
          },
      tipo: 'Consulta',
      duracao: appointment.duration || 30,
      status: mapAppointmentStatus(appointment.status),
      valor: Number(appointment.price),
      sintomas: appointment.symptoms || '',
      diagnostico: appointment.diagnosis || '',
      prescricao: appointment.prescription || '',
      observacoes: appointment.notes || '',
      pagamento: mapPaymentStatus(appointment.paymentStatus),
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }

    return {
      success: true,
      data: consulta,
    }
  } catch (error) {
    console.error('Erro ao atualizar status da consulta:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar status da consulta',
    }
  }
}

// Funções auxiliares para mapear entre os tipos do backend e frontend
function mapAppointmentStatus(backendStatus: string): Consulta['status'] {
  const statusMap: Record<string, Consulta['status']> = {
    SCHEDULED: 'Agendada',
    CONFIRMED: 'Confirmada',
    IN_PROGRESS: 'Em Andamento',
    COMPLETED: 'Finalizada',
    CANCELLED: 'Cancelada',
    NO_SHOW: 'Não Compareceu',
  }
  return statusMap[backendStatus] || 'Agendada'
}

function mapPaymentStatus(backendStatus: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    FAILED: 'Falhou',
    REFUNDED: 'Reembolsado',
    PARTIALLY_REFUNDED: 'Parcialmente Reembolsado',
  }
  return statusMap[backendStatus] || 'Pendente'
}

function mapFrontendStatusToBackend(frontendStatus: string): string {
  const statusMap: Record<string, string> = {
    Agendada: 'SCHEDULED',
    Confirmada: 'CONFIRMED',
    'Em Andamento': 'IN_PROGRESS',
    Finalizada: 'COMPLETED',
    Cancelada: 'CANCELLED',
    'Não Compareceu': 'NO_SHOW',
  }
  return statusMap[frontendStatus] || 'SCHEDULED'
}
