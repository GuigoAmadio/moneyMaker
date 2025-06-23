'use server'

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api'
import type { Paciente } from '@/types'

export interface CreatePacienteInput {
  name: string
  email?: string
  phone: string
  document?: string
  birthDate?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  address?: string
  city?: string
  state?: string
  zipCode?: string
  bloodType?: string
  allergies?: string
  medications?: string
  medicalHistory?: string
  emergencyContact?: string
}

export interface UpdatePacienteInput extends Partial<CreatePacienteInput> {
  id: string
}

export async function getPacientesAction() {
  try {
    const result = await serverGet<any[]>('/patients')

    // Mapear dados do backend para o formato esperado pelo frontend
    const pacientes =
      result.data?.map((patient: any) => ({
        id: patient.id,
        nome: patient.name,
        email: patient.email || '',
        telefone: patient.phone,
        cpf: patient.document || '',
        dataNascimento: patient.birthDate
          ? new Date(patient.birthDate).toISOString().split('T')[0]
          : '',
        sexo: mapGender(patient.gender),
        endereco: patient.address || '',
        cidade: patient.cidade || patient.city || '',
        estado: patient.estado || patient.state || '',
        cep: patient.cep || patient.zipCode || '',
        convenio: 'Particular', // Não está no schema, valor padrão
        tipoSanguineo: patient.bloodType || '',
        alergias: patient.allergies || '',
        medicamentos: patient.medications || '',
        historico: patient.medicalHistory || '',
        contatoEmergencia: patient.emergencyContact || '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=3b82f6&color=ffffff`,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      })) || []

    return {
      success: true,
      data: pacientes,
    }
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error)
    return {
      success: false,
      data: [] as Paciente[],
      error: 'Erro ao carregar pacientes',
    }
  }
}

export async function getPacienteByIdAction(id: string) {
  try {
    const result = await serverGet<any>(`/patients/${id}`)

    if (!result.data) {
      return {
        success: false,
        data: null as any,
        error: 'Paciente não encontrado',
      }
    }

    const patient = result.data
    const paciente = {
      id: patient.id,
      nome: patient.name,
      email: patient.email || '',
      telefone: patient.phone,
      cpf: patient.document || '',
      dataNascimento: patient.birthDate
        ? new Date(patient.birthDate).toISOString().split('T')[0]
        : '',
      sexo: mapGender(patient.gender),
      endereco: patient.address || '',
      cidade: patient.cidade || patient.city || '',
      estado: patient.estado || patient.state || '',
      cep: patient.cep || patient.zipCode || '',
      convenio: 'Particular',
      tipoSanguineo: patient.bloodType || '',
      alergias: patient.allergies || '',
      medicamentos: patient.medications || '',
      historico: patient.medicalHistory || '',
      contatoEmergencia: patient.emergencyContact || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=3b82f6&color=ffffff`,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    }

    return {
      success: true,
      data: paciente,
    }
  } catch (error) {
    console.error('Erro ao buscar paciente:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao carregar paciente',
    }
  }
}

export async function createPacienteAction(data: CreatePacienteInput) {
  try {
    // Converter campos para o formato do backend
    const patientData = {
      ...data,
      birthDate: data.birthDate
        ? new Date(data.birthDate).toISOString()
        : undefined,
    }

    const result = await serverPost<any>('/patients', patientData)

    const patient = result.data
    const paciente = {
      id: patient.id,
      nome: patient.name,
      email: patient.email || '',
      telefone: patient.phone,
      cpf: patient.document || '',
      dataNascimento: patient.birthDate
        ? new Date(patient.birthDate).toISOString().split('T')[0]
        : '',
      sexo: mapGender(patient.gender),
      endereco: patient.address || '',
      cidade: patient.cidade || patient.city || '',
      estado: patient.estado || patient.state || '',
      cep: patient.cep || patient.zipCode || '',
      convenio: 'Particular',
      tipoSanguineo: patient.bloodType || '',
      alergias: patient.allergies || '',
      medicamentos: patient.medications || '',
      historico: patient.medicalHistory || '',
      contatoEmergencia: patient.emergencyContact || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=3b82f6&color=ffffff`,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    }

    return {
      success: true,
      data: paciente,
    }
  } catch (error) {
    console.error('Erro ao criar paciente:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao criar paciente',
    }
  }
}

export async function updatePacienteAction(data: UpdatePacienteInput) {
  try {
    const { id, ...updateData } = data

    // Converter campos para o formato do backend
    const patientData = {
      ...updateData,
      birthDate: updateData.birthDate
        ? new Date(updateData.birthDate).toISOString()
        : undefined,
    }

    const result = await serverPut<any>(`/patients/${id}`, patientData)

    const patient = result.data
    const paciente = {
      id: patient.id,
      nome: patient.name,
      email: patient.email || '',
      telefone: patient.phone,
      cpf: patient.document || '',
      dataNascimento: patient.birthDate
        ? new Date(patient.birthDate).toISOString().split('T')[0]
        : '',
      sexo: mapGender(patient.gender),
      endereco: patient.address || '',
      cidade: patient.cidade || patient.city || '',
      estado: patient.estado || patient.state || '',
      cep: patient.cep || patient.zipCode || '',
      convenio: 'Particular',
      tipoSanguineo: patient.bloodType || '',
      alergias: patient.allergies || '',
      medicamentos: patient.medications || '',
      historico: patient.medicalHistory || '',
      contatoEmergencia: patient.emergencyContact || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=3b82f6&color=ffffff`,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    }

    return {
      success: true,
      data: paciente,
    }
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar paciente',
    }
  }
}

export async function deletePacienteAction(id: string) {
  try {
    await serverDelete(`/patients/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erro ao excluir paciente:', error)
    return {
      success: false,
      error: 'Erro ao excluir paciente',
    }
  }
}

export async function searchPacientesAction(termo: string) {
  try {
    const result = await serverGet<any[]>(
      `/patients?search=${encodeURIComponent(termo)}`
    )

    const pacientes =
      result.data?.map((patient: any) => ({
        id: patient.id,
        nome: patient.name,
        email: patient.email || '',
        telefone: patient.phone,
        cpf: patient.document || '',
        dataNascimento: patient.birthDate
          ? new Date(patient.birthDate).toISOString().split('T')[0]
          : '',
        sexo: mapGender(patient.gender),
        endereco: patient.address || '',
        cidade: patient.cidade || patient.city || '',
        estado: patient.estado || patient.state || '',
        cep: patient.cep || patient.zipCode || '',
        convenio: 'Particular',
        tipoSanguineo: patient.bloodType || '',
        alergias: patient.allergies || '',
        medicamentos: patient.medications || '',
        historico: patient.medicalHistory || '',
        contatoEmergencia: patient.emergencyContact || '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=3b82f6&color=ffffff`,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      })) || []

    return {
      success: true,
      data: pacientes,
    }
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error)
    return {
      success: false,
      data: [] as Paciente[],
      error: 'Erro ao buscar pacientes',
    }
  }
}

// Função auxiliar para mapear gênero do backend para frontend
function mapGender(backendGender?: string): Paciente['sexo'] {
  const genderMap: Record<string, Paciente['sexo']> = {
    MALE: 'Masculino',
    FEMALE: 'Feminino',
    OTHER: 'Outro',
  }
  return backendGender
    ? genderMap[backendGender] || 'Não Informado'
    : 'Não Informado'
}
