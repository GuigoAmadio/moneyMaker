'use server'

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api'
import type { Produto } from '@/types'

export interface CreateProdutoInput {
  name: string
  description?: string
  price: number
  sku?: string
  categoryId?: string
  stock?: number
  minStock?: number
  image?: string
  isFeatured?: boolean
}

export interface UpdateProdutoInput extends Partial<CreateProdutoInput> {
  id: string
  isActive?: boolean
}

export interface MovimentacaoEstoqueInput {
  productId: string
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER' | 'LOSS' | 'RETURN'
  quantity: number
  reason?: string
  unitCost?: number
  supplierId?: string
  batchNumber?: string
  expiryDate?: string
}

export async function getProdutosAction() {
  try {
    const result = await serverGet<any[]>('/products')

    // Mapear dados do backend para o formato esperado pelo frontend
    const produtos =
      result.data?.map((product: any) => ({
        id: product.id,
        nome: product.name,
        descricao: product.description || '',
        codigo: product.sku || `PRD-${product.id.slice(-6)}`,
        categoria: product.category?.name || 'Geral',
        marca: 'Sem Marca', // Não está no schema, valor padrão
        preco: Number(product.price),
        estoque: product.stock || 0,
        estoqueMinimo: product.minStock || 0,
        localizacao: 'A1-B2', // Não está no schema, valor padrão
        fornecedor: 'Fornecedor Padrão', // Não está no schema
        fornecedorId: undefined, // Não está no schema
        status: getEstoqueStatus(product.stock || 0, product.minStock || 0),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        isActive: product.isActive !== false,
        image: product.image,
      })) || []

    return {
      success: true,
      data: produtos,
    }
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return {
      success: false,
      data: [] as Produto[],
      error: 'Erro ao carregar produtos',
    }
  }
}

export async function getProdutosByCategoria(categoria: string) {
  try {
    const result = await serverGet<any[]>(
      `/products?category=${encodeURIComponent(categoria)}`
    )

    const produtos =
      result.data?.map((product: any) => ({
        id: product.id,
        nome: product.name,
        descricao: product.description || '',
        codigo: product.sku || `PRD-${product.id.slice(-6)}`,
        categoria: product.category?.name || 'Geral',
        marca: 'Sem Marca',
        preco: Number(product.price),
        estoque: product.stock || 0,
        estoqueMinimo: product.minStock || 0,
        localizacao: 'A1-B2',
        fornecedor: 'Fornecedor Padrão',
        fornecedorId: undefined,
        status: getEstoqueStatus(product.stock || 0, product.minStock || 0),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        isActive: product.isActive !== false,
        image: product.image,
      })) || []

    return {
      success: true,
      data: produtos,
    }
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error)
    return {
      success: false,
      data: [] as Produto[],
      error: 'Erro ao carregar produtos por categoria',
    }
  }
}

export async function getProdutoByIdAction(id: string) {
  try {
    const result = await serverGet<any>(`/products/${id}`)

    if (!result.data) {
      return {
        success: false,
        data: null as any,
        error: 'Produto não encontrado',
      }
    }

    const product = result.data
    const produto = {
      id: product.id,
      nome: product.name,
      descricao: product.description || '',
      codigo: product.sku || `PRD-${product.id.slice(-6)}`,
      categoria: product.category?.name || 'Geral',
      marca: 'Sem Marca',
      preco: Number(product.price),
      estoque: product.stock || 0,
      estoqueMinimo: product.minStock || 0,
      localizacao: 'A1-B2',
      fornecedor: 'Fornecedor Padrão',
      fornecedorId: undefined,
      status: getEstoqueStatus(product.stock || 0, product.minStock || 0),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      isActive: product.isActive !== false,
      image: product.image,
    }

    return {
      success: true,
      data: produto,
    }
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao carregar produto',
    }
  }
}

export async function createProdutoAction(data: CreateProdutoInput) {
  try {
    const result = await serverPost<any>('/products', data)

    const product = result.data
    const produto = {
      id: product.id,
      nome: product.name,
      descricao: product.description || '',
      codigo: product.sku || `PRD-${product.id.slice(-6)}`,
      categoria: product.category?.name || 'Geral',
      marca: 'Sem Marca',
      preco: Number(product.price),
      estoque: product.stock || 0,
      estoqueMinimo: product.minStock || 0,
      localizacao: 'A1-B2',
      fornecedor: 'Fornecedor Padrão',
      fornecedorId: undefined,
      status: getEstoqueStatus(product.stock || 0, product.minStock || 0),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      isActive: product.isActive !== false,
      image: product.image,
    }

    return {
      success: true,
      data: produto,
    }
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao criar produto',
    }
  }
}

export async function updateProdutoAction(data: UpdateProdutoInput) {
  try {
    const { id, ...updateData } = data
    const result = await serverPut<any>(`/products/${id}`, updateData)

    const product = result.data
    const produto = {
      id: product.id,
      nome: product.name,
      descricao: product.description || '',
      codigo: product.sku || `PRD-${product.id.slice(-6)}`,
      categoria: product.category?.name || 'Geral',
      marca: 'Sem Marca',
      preco: Number(product.price),
      estoque: product.stock || 0,
      estoqueMinimo: product.minStock || 0,
      localizacao: 'A1-B2',
      fornecedor: 'Fornecedor Padrão',
      fornecedorId: undefined,
      status: getEstoqueStatus(product.stock || 0, product.minStock || 0),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      isActive: product.isActive !== false,
      image: product.image,
    }

    return {
      success: true,
      data: produto,
    }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar produto',
    }
  }
}

export async function deleteProdutoAction(id: string) {
  try {
    await serverDelete(`/products/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return {
      success: false,
      error: 'Erro ao excluir produto',
    }
  }
}

export async function searchProdutosAction(termo: string) {
  try {
    const result = await serverGet<any[]>(
      `/products?search=${encodeURIComponent(termo)}`
    )

    const produtos =
      result.data?.map((product: any) => ({
        id: product.id,
        nome: product.name,
        descricao: product.description || '',
        codigo: product.sku || `PRD-${product.id.slice(-6)}`,
        categoria: product.category?.name || 'Geral',
        marca: 'Sem Marca',
        preco: Number(product.price),
        estoque: product.stock || 0,
        estoqueMinimo: product.minStock || 0,
        localizacao: 'A1-B2',
        fornecedor: 'Fornecedor Padrão',
        fornecedorId: undefined,
        status: getEstoqueStatus(product.stock || 0, product.minStock || 0),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        isActive: product.isActive !== false,
        image: product.image,
      })) || []

    return {
      success: true,
      data: produtos,
    }
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return {
      success: false,
      data: [] as Produto[],
      error: 'Erro ao buscar produtos',
    }
  }
}

export async function updateEstoqueAction(data: MovimentacaoEstoqueInput) {
  try {
    // Criar movimentação de estoque
    const movimentacao = await serverPost<any>('/stock-movements', data)

    // Buscar produto atualizado
    const produtoAtualizado = await getProdutoByIdAction(data.productId)

    return {
      success: true,
      data: produtoAtualizado.data,
      movimentacao: movimentacao.data,
    }
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error)
    return {
      success: false,
      data: null as any,
      error: 'Erro ao atualizar estoque',
    }
  }
}

// Função auxiliar para determinar status do estoque
function getEstoqueStatus(
  estoque: number,
  estoqueMinimo: number
): Produto['status'] {
  if (estoque === 0) return 'Sem Estoque'
  if (estoque <= estoqueMinimo) return 'Estoque Baixo'
  return 'Disponível'
}
