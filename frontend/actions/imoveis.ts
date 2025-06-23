'use server'

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api'
import type { Imovel } from '@/types'

export interface CreateImovelInput {
  title: string
  description?: string
  type: 'HOUSE' | 'APARTMENT' | 'COMMERCIAL' | 'LAND' | 'FARM' | 'WAREHOUSE'
  price: number
  rentPrice?: number
  area?: number
  bedrooms?: number
  bathrooms?: number
  parkingSpots?: number
  address: string
  city: string
  state: string
  zipCode: string
  neighborhood?: string
  amenities?: string[]
  features?: string[]
  images?: string[]
  condoFee?: number
  iptu?: number
}

export interface UpdateImovelInput extends Partial<CreateImovelInput> {
  id: string
  status?:
    | 'AVAILABLE'
    | 'RESERVED'
    | 'SOLD'
    | 'RENTED'
    | 'MAINTENANCE'
    | 'INACTIVE'
}

export async function getImoveisAction() {
  try {
    const result = await serverGet<any[]>('/properties')

    // Mapear dados do backend para o formato esperado pelo frontend
    const imoveis =
      result.data?.map((property: any) => ({
        id: property.id,
        titulo: property.title,
        descricao: property.description || '',
        preco: Number(property.price),
        tipo: mapPropertyType(property.type),
        categoria: property.rentPrice ? 'Aluguel' : 'Venda',
        quartos: property.bedrooms || 0,
        banheiros: property.bathrooms || 0,
        area: Number(property.area) || 0,
        endereco: property.address,
        bairro: property.neighborhood || '',
        cidade: property.city,
        estado: property.state,
        cep: property.zipCode,
        status: mapPropertyStatus(property.status),
        fotos: Array.isArray(property.images) ? property.images : [],
        caracteristicas: Array.isArray(property.features)
          ? property.features
          : [],
        proprietario: 'Proprietário',
        telefoneProprietario: '(11) 99999-9999',
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
      })) || []

    return {
      success: true,
      data: imoveis,
    }
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error)
    return {
      success: false,
      data: [] as Imovel[],
      error: 'Erro ao carregar imóveis',
    }
  }
}

export async function getImovelByIdAction(id: string) {
  try {
    const result = await serverGet<any>(`/properties/${id}`)

    if (!result.data) {
      return {
        success: false,
        data: null as any,
        error: 'Imóvel não encontrado',
      }
    }

    const property = result.data
    const imovel = {
      id: property.id,
      titulo: property.title,
      descricao: property.description || '',
      preco: Number(property.price),
      tipo: mapPropertyType(property.type),
      categoria: property.rentPrice ? 'Aluguel' : 'Venda',
      quartos: property.bedrooms || 0,
      banheiros: property.bathrooms || 0,
      area: Number(property.area) || 0,
      endereco: property.address,
      bairro: property.neighborhood || '',
      cidade: property.city,
      estado: property.state,
      cep: property.zipCode,
      status: mapPropertyStatus(property.status),
      fotos: Array.isArray(property.images) ? property.images : [],
      caracteristicas: Array.isArray(property.features)
        ? property.features
        : [],
      proprietario: 'Proprietário',
      telefoneProprietario: '(11) 99999-9999',
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    }

    return {
      success: true,
      data: imovel,
    }
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao carregar imóvel',
    }
  }
}

export async function createImovelAction(data: CreateImovelInput) {
  try {
    const result = await serverPost<any>('/properties', data)

    const property = result.data
    const imovel = {
      id: property.id,
      titulo: property.title,
      descricao: property.description || '',
      preco: Number(property.price),
      tipo: mapPropertyType(property.type),
      categoria: property.rentPrice ? 'Aluguel' : 'Venda',
      quartos: property.bedrooms || 0,
      banheiros: property.bathrooms || 0,
      area: Number(property.area) || 0,
      endereco: property.address,
      bairro: property.neighborhood || '',
      cidade: property.city,
      estado: property.state,
      cep: property.zipCode,
      status: mapPropertyStatus(property.status),
      fotos: Array.isArray(property.images) ? property.images : [],
      caracteristicas: Array.isArray(property.features)
        ? property.features
        : [],
      proprietario: 'Proprietário',
      telefoneProprietario: '(11) 99999-9999',
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    }

    return {
      success: true,
      data: imovel,
    }
  } catch (error) {
    console.error('Erro ao criar imóvel:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao criar imóvel',
    }
  }
}

export async function updateImovelAction(data: UpdateImovelInput) {
  try {
    const { id, ...updateData } = data
    const result = await serverPut<any>(`/properties/${id}`, updateData)

    const property = result.data
    const imovel = {
      id: property.id,
      titulo: property.title,
      descricao: property.description || '',
      preco: Number(property.price),
      tipo: mapPropertyType(property.type),
      categoria: property.rentPrice ? 'Aluguel' : 'Venda',
      quartos: property.bedrooms || 0,
      banheiros: property.bathrooms || 0,
      area: Number(property.area) || 0,
      endereco: property.address,
      bairro: property.neighborhood || '',
      cidade: property.city,
      estado: property.state,
      cep: property.zipCode,
      status: mapPropertyStatus(property.status),
      fotos: Array.isArray(property.images) ? property.images : [],
      caracteristicas: Array.isArray(property.features)
        ? property.features
        : [],
      proprietario: 'Proprietário',
      telefoneProprietario: '(11) 99999-9999',
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    }

    return {
      success: true,
      data: imovel,
    }
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar imóvel',
    }
  }
}

export async function deleteImovelAction(id: string) {
  try {
    await serverDelete(`/properties/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erro ao excluir imóvel:', error)
    return {
      success: false,
      error: 'Erro ao excluir imóvel',
    }
  }
}

export async function updateImovelStatusAction(
  id: string,
  status: Imovel['status']
) {
  try {
    const backendStatus = mapFrontendStatusToBackend(status)
    const result = await serverPut<any>(`/properties/${id}`, {
      status: backendStatus,
    })

    const property = result.data
    const imovel = {
      id: property.id,
      titulo: property.title,
      descricao: property.description || '',
      preco: Number(property.price),
      tipo: mapPropertyType(property.type),
      categoria: property.rentPrice ? 'Aluguel' : 'Venda',
      quartos: property.bedrooms || 0,
      banheiros: property.bathrooms || 0,
      area: Number(property.area) || 0,
      endereco: property.address,
      bairro: property.neighborhood || '',
      cidade: property.city,
      estado: property.state,
      cep: property.zipCode,
      status: mapPropertyStatus(property.status),
      fotos: Array.isArray(property.images) ? property.images : [],
      caracteristicas: Array.isArray(property.features)
        ? property.features
        : [],
      proprietario: 'Proprietário',
      telefoneProprietario: '(11) 99999-9999',
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    }

    return {
      success: true,
      data: imovel,
    }
  } catch (error) {
    console.error('Erro ao atualizar status do imóvel:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar status do imóvel',
    }
  }
}

// Funções auxiliares para mapear entre os tipos do backend e frontend
function mapPropertyType(backendType: string): Imovel['tipo'] {
  const typeMap: Record<string, Imovel['tipo']> = {
    HOUSE: 'Casa',
    APARTMENT: 'Apartamento',
    COMMERCIAL: 'Comercial',
    LAND: 'Terreno',
    FARM: 'Casa',
    WAREHOUSE: 'Comercial',
  }
  return typeMap[backendType] || 'Casa'
}

function mapPropertyStatus(backendStatus: string): Imovel['status'] {
  const statusMap: Record<string, Imovel['status']> = {
    AVAILABLE: 'Disponível',
    RESERVED: 'Reservado',
    SOLD: 'Vendido',
    RENTED: 'Alugado',
    MAINTENANCE: 'Disponível',
    INACTIVE: 'Disponível',
  }
  return statusMap[backendStatus] || 'Disponível'
}

function mapFrontendStatusToBackend(frontendStatus: Imovel['status']): string {
  const statusMap: Record<Imovel['status'], string> = {
    Disponível: 'AVAILABLE',
    Reservado: 'RESERVED',
    Vendido: 'SOLD',
    Alugado: 'RENTED',
  }
  return statusMap[frontendStatus] || 'AVAILABLE'
}
