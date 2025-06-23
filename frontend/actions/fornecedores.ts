'use server'

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api'
import type { Fornecedor } from '@/types'

export interface CreateFornecedorInput {
  name: string
  document?: string
  email?: string
  phone?: string
  address?: string
}

export interface UpdateFornecedorInput extends Partial<CreateFornecedorInput> {
  id: string
  isActive?: boolean
}

export async function getFornecedoresAction() {
  try {
    const result = await serverGet<any[]>('/suppliers')

    // Mapear dados do backend para o formato esperado pelo frontend
    const fornecedores =
      result.data?.map((supplier: any) => ({
        id: supplier.id,
        nome: supplier.name,
        cnpj: supplier.document || '',
        razaoSocial: supplier.name,
        email: supplier.email || '',
        telefone: supplier.phone || '',
        endereco: supplier.address || '',
        bairro: '', // Não está no schema
        cidade: '', // Não está no schema
        estado: '', // Não está no schema
        cep: '', // Não está no schema
        produtos: [], // Não está mapeado diretamente
        ativo: supplier.isActive !== false,
        createdAt: supplier.createdAt,
        updatedAt: supplier.updatedAt,
      })) || []

    return {
      success: true,
      data: fornecedores,
    }
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error)
    return {
      success: false,
      data: [] as Fornecedor[],
      error: 'Erro ao carregar fornecedores',
    }
  }
}

export async function getFornecedoresAtivosAction() {
  try {
    const result = await serverGet<any[]>('/suppliers?active=true')

    const fornecedores =
      result.data?.map((supplier: any) => ({
        id: supplier.id,
        nome: supplier.name,
        cnpj: supplier.document || '',
        razaoSocial: supplier.name,
        email: supplier.email || '',
        telefone: supplier.phone || '',
        endereco: supplier.address || '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        produtos: [],
        ativo: supplier.isActive !== false,
        createdAt: supplier.createdAt,
        updatedAt: supplier.updatedAt,
      })) || []

    return {
      success: true,
      data: fornecedores,
    }
  } catch (error) {
    console.error('Erro ao buscar fornecedores ativos:', error)
    return {
      success: false,
      data: [] as Fornecedor[],
      error: 'Erro ao carregar fornecedores ativos',
    }
  }
}

export async function getFornecedorByIdAction(id: string) {
  try {
    const result = await serverGet<any>(`/suppliers/${id}`)

    if (!result.data) {
      return {
        success: false,
        data: null as any,
        error: 'Fornecedor não encontrado',
      }
    }

    const supplier = result.data
    const fornecedor = {
      id: supplier.id,
      nome: supplier.name,
      cnpj: supplier.document || '',
      razaoSocial: supplier.name,
      email: supplier.email || '',
      telefone: supplier.phone || '',
      endereco: supplier.address || '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      produtos: [],
      ativo: supplier.isActive !== false,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    }

    return {
      success: true,
      data: fornecedor,
    }
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao carregar fornecedor',
    }
  }
}

export async function createFornecedorAction(data: CreateFornecedorInput) {
  try {
    const result = await serverPost<any>('/suppliers', data)

    const supplier = result.data
    const fornecedor = {
      id: supplier.id,
      nome: supplier.name,
      cnpj: supplier.document || '',
      razaoSocial: supplier.name,
      email: supplier.email || '',
      telefone: supplier.phone || '',
      endereco: supplier.address || '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      produtos: [],
      ativo: supplier.isActive !== false,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    }

    return {
      success: true,
      data: fornecedor,
    }
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao criar fornecedor',
    }
  }
}

export async function updateFornecedorAction(data: UpdateFornecedorInput) {
  try {
    const { id, ...updateData } = data
    const result = await serverPut<any>(`/suppliers/${id}`, updateData)

    const supplier = result.data
    const fornecedor = {
      id: supplier.id,
      nome: supplier.name,
      cnpj: supplier.document || '',
      razaoSocial: supplier.name,
      email: supplier.email || '',
      telefone: supplier.phone || '',
      endereco: supplier.address || '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      produtos: [],
      ativo: supplier.isActive !== false,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    }

    return {
      success: true,
      data: fornecedor,
    }
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar fornecedor',
    }
  }
}

export async function deleteFornecedorAction(id: string) {
  try {
    await serverDelete(`/suppliers/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erro ao excluir fornecedor:', error)
    return {
      success: false,
      error: 'Erro ao excluir fornecedor',
    }
  }
}

export async function toggleFornecedorStatusAction(id: string) {
  try {
    // Primeiro buscar o fornecedor atual
    const fornecedorAtual = await getFornecedorByIdAction(id)
    if (!fornecedorAtual.success) {
      return fornecedorAtual
    }

    // Alternar o status
    const novoStatus = !fornecedorAtual.data.ativo
    const result = await serverPut<any>(`/suppliers/${id}`, {
      isActive: novoStatus,
    })

    const supplier = result.data
    const fornecedor = {
      id: supplier.id,
      nome: supplier.name,
      cnpj: supplier.document || '',
      razaoSocial: supplier.name,
      email: supplier.email || '',
      telefone: supplier.phone || '',
      endereco: supplier.address || '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      produtos: [],
      ativo: supplier.isActive !== false,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    }

    return {
      success: true,
      data: fornecedor,
    }
  } catch (error) {
    console.error('Erro ao alterar status do fornecedor:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao alterar status do fornecedor',
    }
  }
}
