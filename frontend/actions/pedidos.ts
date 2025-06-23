'use server'

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api'
import type { Pedido } from '@/types'

export interface CreatePedidoInput {
  orderNumber?: string
  userId?: string
  items: {
    productId: string
    quantity: number
    price: number
  }[]
  deliveryAddress?: string
  deliveryFee?: number
  paymentMethod?: string
}

export interface UpdatePedidoInput extends Partial<CreatePedidoInput> {
  id: string
  status?:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PREPARING'
    | 'READY'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
  paymentStatus?:
    | 'PENDING'
    | 'PAID'
    | 'FAILED'
    | 'REFUNDED'
    | 'PARTIALLY_REFUNDED'
}

export async function getPedidosAction() {
  try {
    const result = await serverGet<any[]>('/orders')

    // Mapear dados do backend para o formato esperado pelo frontend
    const pedidos =
      result.data?.map((order: any) => ({
        id: order.id,
        numero: order.orderNumber || `PED-${order.id.slice(-6)}`,
        cliente: order.user
          ? {
              id: order.user.id,
              nome: order.user.name,
              email: order.user.email,
              telefone: order.user.phone || '',
            }
          : {
              id: '',
              nome: 'Cliente Padrão',
              email: '',
              telefone: '',
            },
        itens:
          order.items?.map((item: any) => ({
            id: item.id,
            produto: item.product
              ? {
                  id: item.product.id,
                  nome: item.product.name,
                  codigo:
                    item.product.sku || `PRD-${item.product.id.slice(-6)}`,
                  preco: Number(item.product.price),
                }
              : {
                  id: item.productId,
                  nome: 'Produto Não Encontrado',
                  codigo: '',
                  preco: Number(item.price),
                },
            quantidade: item.quantity,
            precoUnitario: Number(item.price),
            subtotal: Number(item.subtotal),
          })) || [],
        total: Number(order.total),
        status: mapOrderStatus(order.status),
        formaPagamento: order.paymentMethod || 'Não Informado',
        statusPagamento: mapPaymentStatus(order.paymentStatus),
        enderecoEntrega: order.deliveryAddress || '',
        taxaEntrega: Number(order.deliveryFee) || 0,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })) || []

    return {
      success: true,
      data: pedidos,
    }
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return {
      success: false,
      data: [] as Pedido[],
      error: 'Erro ao carregar pedidos',
    }
  }
}

export async function getPedidosByStatusAction(status: string) {
  try {
    const backendStatus = mapFrontendStatusToBackend(status)
    const result = await serverGet<any[]>(
      `/orders?status=${encodeURIComponent(backendStatus)}`
    )

    const pedidos =
      result.data?.map((order: any) => ({
        id: order.id,
        numero: order.orderNumber || `PED-${order.id.slice(-6)}`,
        cliente: order.user
          ? {
              id: order.user.id,
              nome: order.user.name,
              email: order.user.email,
              telefone: order.user.phone || '',
            }
          : {
              id: '',
              nome: 'Cliente Padrão',
              email: '',
              telefone: '',
            },
        itens:
          order.items?.map((item: any) => ({
            id: item.id,
            produto: item.product
              ? {
                  id: item.product.id,
                  nome: item.product.name,
                  codigo:
                    item.product.sku || `PRD-${item.product.id.slice(-6)}`,
                  preco: Number(item.product.price),
                }
              : {
                  id: item.productId,
                  nome: 'Produto Não Encontrado',
                  codigo: '',
                  preco: Number(item.price),
                },
            quantidade: item.quantity,
            precoUnitario: Number(item.price),
            subtotal: Number(item.subtotal),
          })) || [],
        total: Number(order.total),
        status: mapOrderStatus(order.status),
        formaPagamento: order.paymentMethod || 'Não Informado',
        statusPagamento: mapPaymentStatus(order.paymentStatus),
        enderecoEntrega: order.deliveryAddress || '',
        taxaEntrega: Number(order.deliveryFee) || 0,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })) || []

    return {
      success: true,
      data: pedidos,
    }
  } catch (error) {
    console.error('Erro ao buscar pedidos por status:', error)
    return {
      success: false,
      data: [] as Pedido[],
      error: 'Erro ao carregar pedidos por status',
    }
  }
}

export async function getPedidoByIdAction(id: string) {
  try {
    const result = await serverGet<any>(`/orders/${id}`)

    if (!result.data) {
      return {
        success: false,
        data: null as any,
        error: 'Pedido não encontrado',
      }
    }

    const order = result.data
    const pedido = {
      id: order.id,
      numero: order.orderNumber || `PED-${order.id.slice(-6)}`,
      cliente: order.user
        ? {
            id: order.user.id,
            nome: order.user.name,
            email: order.user.email,
            telefone: order.user.phone || '',
          }
        : {
            id: '',
            nome: 'Cliente Padrão',
            email: '',
            telefone: '',
          },
      itens:
        order.items?.map((item: any) => ({
          id: item.id,
          produto: item.product
            ? {
                id: item.product.id,
                nome: item.product.name,
                codigo: item.product.sku || `PRD-${item.product.id.slice(-6)}`,
                preco: Number(item.product.price),
              }
            : {
                id: item.productId,
                nome: 'Produto Não Encontrado',
                codigo: '',
                preco: Number(item.price),
              },
          quantidade: item.quantity,
          precoUnitario: Number(item.price),
          subtotal: Number(item.subtotal),
        })) || [],
      total: Number(order.total),
      status: mapOrderStatus(order.status),
      formaPagamento: order.paymentMethod || 'Não Informado',
      statusPagamento: mapPaymentStatus(order.paymentStatus),
      enderecoEntrega: order.deliveryAddress || '',
      taxaEntrega: Number(order.deliveryFee) || 0,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }

    return {
      success: true,
      data: pedido,
    }
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao carregar pedido',
    }
  }
}

export async function createPedidoAction(data: CreatePedidoInput) {
  try {
    // Calcular total baseado nos itens
    const total =
      data.items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      (data.deliveryFee || 0)

    const orderData = {
      ...data,
      total,
      orderNumber: data.orderNumber || `PED-${Date.now()}`,
    }

    const result = await serverPost<any>('/orders', orderData)

    const order = result.data
    const pedido = {
      id: order.id,
      numero: order.orderNumber || `PED-${order.id.slice(-6)}`,
      cliente: order.user
        ? {
            id: order.user.id,
            nome: order.user.name,
            email: order.user.email,
            telefone: order.user.phone || '',
          }
        : {
            id: '',
            nome: 'Cliente Padrão',
            email: '',
            telefone: '',
          },
      itens:
        order.items?.map((item: any) => ({
          id: item.id,
          produto: item.product
            ? {
                id: item.product.id,
                nome: item.product.name,
                codigo: item.product.sku || `PRD-${item.product.id.slice(-6)}`,
                preco: Number(item.product.price),
              }
            : {
                id: item.productId,
                nome: 'Produto Não Encontrado',
                codigo: '',
                preco: Number(item.price),
              },
          quantidade: item.quantity,
          precoUnitario: Number(item.price),
          subtotal: Number(item.subtotal),
        })) || [],
      total: Number(order.total),
      status: mapOrderStatus(order.status),
      formaPagamento: order.paymentMethod || 'Não Informado',
      statusPagamento: mapPaymentStatus(order.paymentStatus),
      enderecoEntrega: order.deliveryAddress || '',
      taxaEntrega: Number(order.deliveryFee) || 0,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }

    return {
      success: true,
      data: pedido,
    }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao criar pedido',
    }
  }
}

export async function updatePedidoAction(data: UpdatePedidoInput) {
  try {
    const { id, ...updateData } = data

    // Mapear status se fornecido
    const backendData = { ...updateData }
    if (updateData.status) {
      backendData.status = mapFrontendStatusToBackend(updateData.status)
    }

    const result = await serverPut<any>(`/orders/${id}`, backendData)

    const order = result.data
    const pedido = {
      id: order.id,
      numero: order.orderNumber || `PED-${order.id.slice(-6)}`,
      cliente: order.user
        ? {
            id: order.user.id,
            nome: order.user.name,
            email: order.user.email,
            telefone: order.user.phone || '',
          }
        : {
            id: '',
            nome: 'Cliente Padrão',
            email: '',
            telefone: '',
          },
      itens:
        order.items?.map((item: any) => ({
          id: item.id,
          produto: item.product
            ? {
                id: item.product.id,
                nome: item.product.name,
                codigo: item.product.sku || `PRD-${item.product.id.slice(-6)}`,
                preco: Number(item.product.price),
              }
            : {
                id: item.productId,
                nome: 'Produto Não Encontrado',
                codigo: '',
                preco: Number(item.price),
              },
          quantidade: item.quantity,
          precoUnitario: Number(item.price),
          subtotal: Number(item.subtotal),
        })) || [],
      total: Number(order.total),
      status: mapOrderStatus(order.status),
      formaPagamento: order.paymentMethod || 'Não Informado',
      statusPagamento: mapPaymentStatus(order.paymentStatus),
      enderecoEntrega: order.deliveryAddress || '',
      taxaEntrega: Number(order.deliveryFee) || 0,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }

    return {
      success: true,
      data: pedido,
    }
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar pedido',
    }
  }
}

export async function deletePedidoAction(id: string) {
  try {
    await serverDelete(`/orders/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erro ao excluir pedido:', error)
    return {
      success: false,
      error: 'Erro ao excluir pedido',
    }
  }
}

export async function updatePedidoStatusAction(
  id: string,
  status: Pedido['status']
) {
  try {
    const backendStatus = mapFrontendStatusToBackend(status)
    const result = await serverPut<any>(`/orders/${id}`, {
      status: backendStatus,
    })

    const order = result.data
    const pedido = {
      id: order.id,
      numero: order.orderNumber || `PED-${order.id.slice(-6)}`,
      cliente: order.user
        ? {
            id: order.user.id,
            nome: order.user.name,
            email: order.user.email,
            telefone: order.user.phone || '',
          }
        : {
            id: '',
            nome: 'Cliente Padrão',
            email: '',
            telefone: '',
          },
      itens:
        order.items?.map((item: any) => ({
          id: item.id,
          produto: item.product
            ? {
                id: item.product.id,
                nome: item.product.name,
                codigo: item.product.sku || `PRD-${item.product.id.slice(-6)}`,
                preco: Number(item.product.price),
              }
            : {
                id: item.productId,
                nome: 'Produto Não Encontrado',
                codigo: '',
                preco: Number(item.price),
              },
          quantidade: item.quantity,
          precoUnitario: Number(item.price),
          subtotal: Number(item.subtotal),
        })) || [],
      total: Number(order.total),
      status: mapOrderStatus(order.status),
      formaPagamento: order.paymentMethod || 'Não Informado',
      statusPagamento: mapPaymentStatus(order.paymentStatus),
      enderecoEntrega: order.deliveryAddress || '',
      taxaEntrega: Number(order.deliveryFee) || 0,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }

    return {
      success: true,
      data: pedido,
    }
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar status do pedido',
    }
  }
}

// Funções auxiliares para mapear entre os tipos do backend e frontend
function mapOrderStatus(backendStatus: string): Pedido['status'] {
  const statusMap: Record<string, Pedido['status']> = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    PREPARING: 'Separando',
    READY: 'Pronto',
    OUT_FOR_DELIVERY: 'Saiu para Entrega',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado',
  }
  return statusMap[backendStatus] || 'Pendente'
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
    Pendente: 'PENDING',
    Confirmado: 'CONFIRMED',
    Separando: 'PREPARING',
    Pronto: 'READY',
    'Saiu para Entrega': 'OUT_FOR_DELIVERY',
    Entregue: 'DELIVERED',
    Cancelado: 'CANCELLED',
  }
  return statusMap[frontendStatus] || 'PENDING'
}
