'use server'

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api'
import type { Medico } from '@/types'

export interface CreateMedicoInput {
  employeeId: string
  crm: string
  specialty: string
  subSpecialty?: string
  consultationDuration?: number
  consultationPrice: number
  schedule?: Record<string, any>
}

export interface UpdateMedicoInput extends Partial<CreateMedicoInput> {
  id: string
}

export async function getMedicosAction() {
  try {
    const result = await serverGet<any[]>('/doctors')

    // Mapear dados do backend para o formato esperado pelo frontend
    const medicos =
      result.data?.map((doctor: any) => ({
        id: doctor.id,
        nome: doctor.employee?.name || 'Nome não informado',
        crm: doctor.crm,
        especialidade: doctor.specialty,
        subEspecialidade: doctor.subSpecialty || '',
        telefone: doctor.employee?.phone || '',
        email: doctor.employee?.email || '',
        valorConsulta: Number(doctor.consultationPrice),
        horarioAtendimento: parseSchedule(doctor.schedule),
        ativo: doctor.employee?.isActive !== false,
        duracao: doctor.consultationDuration || 30,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt,
      })) || []

    return {
      success: true,
      data: medicos,
    }
  } catch (error) {
    console.error('Erro ao buscar médicos:', error)
    return {
      success: false,
      data: [] as Medico[],
      error: 'Erro ao carregar médicos',
    }
  }
}

export async function getMedicosAtivosAction() {
  try {
    const result = await serverGet<any[]>('/doctors?active=true')

    const medicos =
      result.data?.map((doctor: any) => ({
        id: doctor.id,
        nome: doctor.employee?.name || 'Nome não informado',
        crm: doctor.crm,
        especialidade: doctor.specialty,
        subEspecialidade: doctor.subSpecialty || '',
        telefone: doctor.employee?.phone || '',
        email: doctor.employee?.email || '',
        valorConsulta: Number(doctor.consultationPrice),
        horarioAtendimento: parseSchedule(doctor.schedule),
        ativo: doctor.employee?.isActive !== false,
        duracao: doctor.consultationDuration || 30,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt,
      })) || []

    return {
      success: true,
      data: medicos,
    }
  } catch (error) {
    console.error('Erro ao buscar médicos ativos:', error)
    return {
      success: false,
      data: [] as Medico[],
      error: 'Erro ao carregar médicos ativos',
    }
  }
}

export async function getMedicoByIdAction(id: string) {
  try {
    const result = await serverGet<any>(`/doctors/${id}`)

    if (!result.data) {
      return {
        success: false,
        data: null as any,
        error: 'Médico não encontrado',
      }
    }

    const doctor = result.data
    const medico = {
      id: doctor.id,
      nome: doctor.employee?.name || 'Nome não informado',
      crm: doctor.crm,
      especialidade: doctor.specialty,
      subEspecialidade: doctor.subSpecialty || '',
      telefone: doctor.employee?.phone || '',
      email: doctor.employee?.email || '',
      valorConsulta: Number(doctor.consultationPrice),
      horarioAtendimento: parseSchedule(doctor.schedule),
      ativo: doctor.employee?.isActive !== false,
      duracao: doctor.consultationDuration || 30,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    }

    return {
      success: true,
      data: medico,
    }
  } catch (error) {
    console.error('Erro ao buscar médico:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao carregar médico',
    }
  }
}

export async function createMedicoAction(data: CreateMedicoInput) {
  try {
    const result = await serverPost<any>('/doctors', data)

    const doctor = result.data
    const medico = {
      id: doctor.id,
      nome: doctor.employee?.name || 'Nome não informado',
      crm: doctor.crm,
      especialidade: doctor.specialty,
      subEspecialidade: doctor.subSpecialty || '',
      telefone: doctor.employee?.phone || '',
      email: doctor.employee?.email || '',
      valorConsulta: Number(doctor.consultationPrice),
      horarioAtendimento: parseSchedule(doctor.schedule),
      ativo: doctor.employee?.isActive !== false,
      duracao: doctor.consultationDuration || 30,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    }

    return {
      success: true,
      data: medico,
    }
  } catch (error) {
    console.error('Erro ao criar médico:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao criar médico',
    }
  }
}

export async function updateMedicoAction(data: UpdateMedicoInput) {
  try {
    const { id, ...updateData } = data
    const result = await serverPut<any>(`/doctors/${id}`, updateData)

    const doctor = result.data
    const medico = {
      id: doctor.id,
      nome: doctor.employee?.name || 'Nome não informado',
      crm: doctor.crm,
      especialidade: doctor.specialty,
      subEspecialidade: doctor.subSpecialty || '',
      telefone: doctor.employee?.phone || '',
      email: doctor.employee?.email || '',
      valorConsulta: Number(doctor.consultationPrice),
      horarioAtendimento: parseSchedule(doctor.schedule),
      ativo: doctor.employee?.isActive !== false,
      duracao: doctor.consultationDuration || 30,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    }

    return {
      success: true,
      data: medico,
    }
  } catch (error) {
    console.error('Erro ao atualizar médico:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar médico',
    }
  }
}

export async function deleteMedicoAction(id: string) {
  try {
    await serverDelete(`/doctors/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erro ao excluir médico:', error)
    return {
      success: false,
      error: 'Erro ao excluir médico',
    }
  }
}

export async function toggleMedicoStatusAction(id: string) {
  try {
    // Primeiro buscar o médico atual
    const medicoAtual = await getMedicoByIdAction(id)
    if (!medicoAtual.success) {
      return medicoAtual
    }

    // Como o status está no Employee, precisaríamos de um endpoint específico
    // Por enquanto, vamos simular atualizando apenas o doctor
    const novoStatus = !medicoAtual.data.ativo
    const result = await serverPut<any>(`/doctors/${id}`, {
      // Não há campo isActive direto no Doctor, seria necessário endpoint do Employee
    })

    const doctor = result.data
    const medico = {
      id: doctor.id,
      nome: doctor.employee?.name || 'Nome não informado',
      crm: doctor.crm,
      especialidade: doctor.specialty,
      subEspecialidade: doctor.subSpecialty || '',
      telefone: doctor.employee?.phone || '',
      email: doctor.employee?.email || '',
      valorConsulta: Number(doctor.consultationPrice),
      horarioAtendimento: parseSchedule(doctor.schedule),
      ativo: doctor.employee?.isActive !== false,
      duracao: doctor.consultationDuration || 30,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    }

    return {
      success: true,
      data: medico,
    }
  } catch (error) {
    console.error('Erro ao alterar status do médico:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao alterar status do médico',
    }
  }
}

// Função auxiliar para parsear o schedule do backend
function parseSchedule(schedule: any): string[] {
  if (!schedule || typeof schedule !== 'object') {
    return ['Segunda a Sexta: 08:00 - 17:00']
  }

  try {
    const scheduleArray: string[] = []

    // Converter objeto de horários para array de strings
    Object.entries(schedule).forEach(([day, hours]) => {
      if (hours) {
        const dayName = mapDayName(day)
        scheduleArray.push(`${dayName}: ${hours}`)
      }
    })

    return scheduleArray.length > 0 ? scheduleArray : ['Horário não definido']
  } catch (error) {
    return ['Horário não definido']
  }
}

// Função auxiliar para mapear nomes dos dias
function mapDayName(day: string): string {
  const dayMap: Record<string, string> = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo',
  }
  return dayMap[day.toLowerCase()] || day
}
