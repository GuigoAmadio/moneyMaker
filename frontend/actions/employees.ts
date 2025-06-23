'use server'

import { revalidatePath } from 'next/cache'
import type { Employee, ApiResponse, PaginatedResponse } from '@/types'
import type { EmployeeInput, SearchFiltersInput } from '@/lib/validations'
import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api'

// Buscar todos os funcionários
export async function getEmployeesAction(params?: SearchFiltersInput): Promise<{
  success: boolean
  data?: PaginatedResponse<Employee>
  message: string
}> {
  try {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status) queryParams.append('status', params.status)

    const url = `/employees${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const result = await serverGet<PaginatedResponse<Employee>>(url)

    return {
      success: true,
      data: result.data,
      message: 'Funcionários carregados com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar funcionários:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Buscar funcionário por ID
export async function getEmployeeAction(id: string): Promise<{
  success: boolean
  data?: Employee
  message: string
}> {
  try {
    const result = await serverGet<Employee>(`/employees/${id}`)

    return {
      success: true,
      data: result.data,
      message: 'Funcionário carregado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao buscar funcionário:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Criar novo funcionário
export async function createEmployeeAction(data: EmployeeInput): Promise<{
  success: boolean
  data?: Employee
  message: string
}> {
  try {
    const result = await serverPost<Employee>('/employees', data)

    // Revalidar cache
    revalidatePath('/dashboard/funcionarios')
    revalidatePath('/dashboard/agendamentos')

    return {
      success: true,
      data: result.data,
      message: 'Funcionário criado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao criar funcionário:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Atualizar funcionário
export async function updateEmployeeAction(
  id: string,
  data: Partial<EmployeeInput>
): Promise<{
  success: boolean
  data?: Employee
  message: string
}> {
  try {
    const result = await serverPut<Employee>(`/employees/${id}`, data)

    // Revalidar cache
    revalidatePath('/dashboard/funcionarios')
    revalidatePath(`/dashboard/funcionarios/${id}`)
    revalidatePath('/dashboard/agendamentos')

    return {
      success: true,
      data: result.data,
      message: 'Funcionário atualizado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao atualizar funcionário:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Deletar funcionário
export async function deleteEmployeeAction(id: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    await serverDelete(`/employees/${id}`)

    // Revalidar cache
    revalidatePath('/dashboard/funcionarios')
    revalidatePath('/dashboard/agendamentos')

    return {
      success: true,
      message: 'Funcionário deletado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao deletar funcionário:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}

// Atualizar status do funcionário
export async function updateEmployeeStatusAction(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean
  data?: Employee
  message: string
}> {
  try {
    const result = await serverPut<Employee>(`/employees/${id}/status`, {
      isActive,
    })

    // Revalidar cache
    revalidatePath('/dashboard/funcionarios')
    revalidatePath(`/dashboard/funcionarios/${id}`)
    revalidatePath('/dashboard/agendamentos')

    return {
      success: true,
      data: result.data,
      message: 'Status do funcionário atualizado com sucesso',
    }
  } catch (error: any) {
    console.error('Erro ao atualizar status do funcionário:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor',
    }
  }
}
