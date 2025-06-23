'use server'

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api'
import type { Lead } from '@/types'

export interface CreateLeadInput {
  name: string
  email: string
  phone: string
  propertyId?: string
  message?: string
  source?: string
}

export interface UpdateLeadInput extends Partial<CreateLeadInput> {
  id: string
  status?:
    | 'NEW'
    | 'CONTACTED'
    | 'QUALIFIED'
    | 'PROPOSAL_SENT'
    | 'NEGOTIATING'
    | 'CLOSED_WON'
    | 'CLOSED_LOST'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

export async function getLeadsAction() {
  try {
    // Buscar property leads do backend
    const result = await serverGet<any[]>('/properties/leads')

    // Mapear dados do backend para o formato esperado pelo frontend
    const leads =
      result.data?.map((lead: any) => ({
        id: lead.id,
        nome: lead.name,
        email: lead.email,
        telefone: lead.phone,
        interesse: lead.propertyId ? 'Compra' : 'Informações',
        orcamento: 500000, // Valor padrão, pois não está no schema do backend
        observacoes: lead.message || '',
        status: mapLeadStatus(lead.status),
        fonte: lead.source || 'Site',
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        property: lead.property
          ? {
              id: lead.property.id,
              title: lead.property.title,
              price: Number(lead.property.price),
            }
          : undefined,
      })) || []

    return {
      success: true,
      data: leads,
    }
  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    return {
      success: false,
      data: [] as Lead[],
      error: 'Erro ao carregar leads',
    }
  }
}

export async function getLeadByIdAction(id: string) {
  try {
    const result = await serverGet<any>(`/properties/leads/${id}`)

    if (!result.data) {
      return {
        success: false,
        data: null as any,
        error: 'Lead não encontrado',
      }
    }

    const leadData = result.data
    const lead = {
      id: leadData.id,
      nome: leadData.name,
      email: leadData.email,
      telefone: leadData.phone,
      interesse: leadData.propertyId ? 'Compra' : 'Informações',
      orcamento: 500000, // Valor padrão
      observacoes: leadData.message || '',
      status: mapLeadStatus(leadData.status),
      fonte: leadData.source || 'Site',
      createdAt: leadData.createdAt,
      updatedAt: leadData.updatedAt,
      property: leadData.property
        ? {
            id: leadData.property.id,
            title: leadData.property.title,
            price: Number(leadData.property.price),
          }
        : undefined,
    }

    return {
      success: true,
      data: lead,
    }
  } catch (error) {
    console.error('Erro ao buscar lead:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao carregar lead',
    }
  }
}

export async function createLeadAction(data: CreateLeadInput) {
  try {
    const result = await serverPost<any>('/properties/leads', data)

    const leadData = result.data
    const lead = {
      id: leadData.id,
      nome: leadData.name,
      email: leadData.email,
      telefone: leadData.phone,
      interesse: leadData.propertyId ? 'Compra' : 'Informações',
      orcamento: 500000, // Valor padrão
      observacoes: leadData.message || '',
      status: mapLeadStatus(leadData.status),
      fonte: leadData.source || 'Site',
      createdAt: leadData.createdAt,
      updatedAt: leadData.updatedAt,
      property: leadData.property
        ? {
            id: leadData.property.id,
            title: leadData.property.title,
            price: Number(leadData.property.price),
          }
        : undefined,
    }

    return {
      success: true,
      data: lead,
    }
  } catch (error) {
    console.error('Erro ao criar lead:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao criar lead',
    }
  }
}

export async function updateLeadAction(data: UpdateLeadInput) {
  try {
    const { id, ...updateData } = data

    // Mapear status se fornecido
    const backendData = { ...updateData }
    if (updateData.status) {
      backendData.status = mapFrontendStatusToBackend(updateData.status)
    }

    const result = await serverPut<any>(`/properties/leads/${id}`, backendData)

    const leadData = result.data
    const lead = {
      id: leadData.id,
      nome: leadData.name,
      email: leadData.email,
      telefone: leadData.phone,
      interesse: leadData.propertyId ? 'Compra' : 'Informações',
      orcamento: 500000, // Valor padrão
      observacoes: leadData.message || '',
      status: mapLeadStatus(leadData.status),
      fonte: leadData.source || 'Site',
      createdAt: leadData.createdAt,
      updatedAt: leadData.updatedAt,
      property: leadData.property
        ? {
            id: leadData.property.id,
            title: leadData.property.title,
            price: Number(leadData.property.price),
          }
        : undefined,
    }

    return {
      success: true,
      data: lead,
    }
  } catch (error) {
    console.error('Erro ao atualizar lead:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar lead',
    }
  }
}

export async function deleteLeadAction(id: string) {
  try {
    await serverDelete(`/properties/leads/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erro ao excluir lead:', error)
    return {
      success: false,
      error: 'Erro ao excluir lead',
    }
  }
}

export async function updateLeadStatusAction(
  id: string,
  status: Lead['status']
) {
  try {
    const backendStatus = mapFrontendStatusToBackend(status)
    const result = await serverPut<any>(`/properties/leads/${id}`, {
      status: backendStatus,
    })

    const leadData = result.data
    const lead = {
      id: leadData.id,
      nome: leadData.name,
      email: leadData.email,
      telefone: leadData.phone,
      interesse: leadData.propertyId ? 'Compra' : 'Informações',
      orcamento: 500000, // Valor padrão
      observacoes: leadData.message || '',
      status: mapLeadStatus(leadData.status),
      fonte: leadData.source || 'Site',
      createdAt: leadData.createdAt,
      updatedAt: leadData.updatedAt,
      property: leadData.property
        ? {
            id: leadData.property.id,
            title: leadData.property.title,
            price: Number(leadData.property.price),
          }
        : undefined,
    }

    return {
      success: true,
      data: lead,
    }
  } catch (error) {
    console.error('Erro ao atualizar status do lead:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar status do lead',
    }
  }
}

// Funções auxiliares para mapear entre os tipos do backend e frontend
function mapLeadStatus(backendStatus: string): Lead['status'] {
  const statusMap: Record<string, Lead['status']> = {
    NEW: 'Novo',
    CONTACTED: 'Contactado',
    QUALIFIED: 'Qualificado',
    PROPOSAL_SENT: 'Proposta Enviada',
    NEGOTIATING: 'Negociando',
    CLOSED_WON: 'Convertido',
    CLOSED_LOST: 'Perdido',
  }
  return statusMap[backendStatus] || 'Novo'
}

function mapFrontendStatusToBackend(
  frontendStatus: Lead['status'] | string
): string {
  const statusMap: Record<string, string> = {
    Novo: 'NEW',
    Contactado: 'CONTACTED',
    Qualificado: 'QUALIFIED',
    'Proposta Enviada': 'PROPOSAL_SENT',
    Negociando: 'NEGOTIATING',
    Convertido: 'CLOSED_WON',
    Perdido: 'CLOSED_LOST',
  }
  return statusMap[frontendStatus] || 'NEW'
}
