'use client'

import { useState, useEffect } from 'react'
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  ArrowUpDown,
  Wrench,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import AnimatedDiv from '@/components/animations/AnimatedDiv'
import {
  getProdutosAction,
  deleteProdutoAction,
  updateEstoqueAction,
} from '@/actions/produtos'
import type { Produto } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState<string>('all')
  const [filterMarca, setFilterMarca] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<
    'view' | 'create' | 'edit' | 'estoque'
  >('view')

  // Carregar produtos do backend
  const loadProdutos = async () => {
    setLoading(true)
    try {
      const result = await getProdutosAction()
      if (result.success && result.data) {
        setProdutos(result.data as Produto[])
      } else {
        console.error('Erro ao carregar produtos:', result.error)
        setProdutos([])
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      setProdutos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProdutos()
  }, [])

  // Filtrar produtos
  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch =
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.marca?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategoria =
      filterCategoria === 'all' || produto.categoria === filterCategoria
    const matchesMarca = filterMarca === 'all' || produto.marca === filterMarca
    const matchesStatus =
      filterStatus === 'all' || produto.status === filterStatus

    return matchesSearch && matchesCategoria && matchesMarca && matchesStatus
  })

  const handleView = (produto: Produto) => {
    setSelectedProduto(produto)
    setModalType('view')
    setShowModal(true)
  }

  const handleEdit = (produto: Produto) => {
    setSelectedProduto(produto)
    setModalType('edit')
    setShowModal(true)
  }

  const handleEstoque = (produto: Produto) => {
    setSelectedProduto(produto)
    setModalType('estoque')
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const result = await deleteProdutoAction(id)
        if (result.success) {
          setProdutos(produtos.filter((produto) => produto.id !== id))
        } else {
          alert('Erro ao excluir produto: ' + result.error)
        }
      } catch (error) {
        console.error('Erro ao excluir produto:', error)
        alert('Erro ao excluir produto')
      }
    }
  }

  const handleCreate = () => {
    setSelectedProduto(null)
    setModalType('create')
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível':
        return 'bg-green-100 text-green-800'
      case 'Estoque Baixo':
        return 'bg-orange-100 text-orange-800'
      case 'Sem Estoque':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Disponível':
        return <Package className="h-5 w-5 text-green-600" />
      case 'Estoque Baixo':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'Sem Estoque':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Package className="h-5 w-5 text-gray-600" />
    }
  }

  // Obter categorias e marcas únicas para filtros
  const categorias = Array.from(new Set(produtos.map((p) => p.categoria)))
  const marcas = Array.from(
    new Set(produtos.map((p) => p.marca).filter(Boolean))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedDiv animation="fadeIn">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-900">Produtos</h1>
            <p className="text-gray-600">
              Gerencie o catálogo de produtos e estoque
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>
      </AnimatedDiv>

      {/* Filtros */}
      <AnimatedDiv animation="slideUp" delay={0.1}>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nome, código ou marca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <select
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Todas</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Marca
              </label>
              <select
                value={filterMarca}
                onChange={(e) => setFilterMarca(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Todas</option>
                {marcas.map((marca) => (
                  <option key={marca} value={marca}>
                    {marca}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Todos</option>
                <option value="Disponível">Disponível</option>
                <option value="Estoque Baixo">Estoque Baixo</option>
                <option value="Sem Estoque">Sem Estoque</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setFilterCategoria('all')
                  setFilterMarca('all')
                  setFilterStatus('all')
                }}
                variant="outline"
                className="w-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </div>
          </div>
        </div>
      </AnimatedDiv>

      {/* Lista de Produtos */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-600"></div>
        </div>
      ) : filteredProdutos.length === 0 ? (
        <AnimatedDiv animation="fadeIn" delay={0.2}>
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <div className="mb-4 text-6xl text-gray-400">📦</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {searchTerm ||
              filterCategoria !== 'all' ||
              filterMarca !== 'all' ||
              filterStatus !== 'all'
                ? 'Nenhum produto encontrado'
                : 'Nenhum produto cadastrado'}
            </h3>
            <p className="mb-6 text-gray-600">
              {searchTerm ||
              filterCategoria !== 'all' ||
              filterMarca !== 'all' ||
              filterStatus !== 'all'
                ? 'Tente ajustar os filtros para encontrar produtos.'
                : 'Comece cadastrando seu primeiro produto.'}
            </p>
            {!searchTerm &&
              filterCategoria === 'all' &&
              filterMarca === 'all' &&
              filterStatus === 'all' && (
                <Button
                  onClick={handleCreate}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Produto
                </Button>
              )}
          </div>
        </AnimatedDiv>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProdutos.map((produto, index) => (
            <AnimatedDiv
              key={produto.id}
              animation="scale"
              delay={index * 0.05}
            >
              <div className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(produto.status)}
                    <div>
                      <h3 className="line-clamp-1 font-semibold text-gray-900">
                        {produto.nome}
                      </h3>
                      <p className="text-sm text-gray-600">{produto.codigo}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(produto.status)}`}
                  >
                    {produto.status}
                  </span>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Categoria:</span>
                    <span className="font-medium">{produto.categoria}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Marca:</span>
                    <span className="font-medium">{produto.marca}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(produto.preco)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estoque:</span>
                    <span
                      className={`font-medium ${
                        produto.estoque <= produto.estoqueMinimo
                          ? 'text-red-600'
                          : produto.estoque <= produto.estoqueMinimo * 2
                            ? 'text-orange-600'
                            : 'text-green-600'
                      }`}
                    >
                      {produto.estoque} un.
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Localização:</span>
                    <span className="font-medium">{produto.localizacao}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fornecedor:</span>
                    <span className="font-medium">{produto.fornecedor}</span>
                  </div>
                </div>

                <div className="flex gap-2 border-t pt-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleView(produto)}
                    className="flex-1"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEstoque(produto)}
                    className="flex-1"
                  >
                    <ArrowUpDown className="mr-1 h-3 w-3" />
                    Estoque
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(produto)}
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(produto.id)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </AnimatedDiv>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={
            modalType === 'create'
              ? 'Novo Produto'
              : modalType === 'edit'
                ? 'Editar Produto'
                : modalType === 'estoque'
                  ? 'Movimentar Estoque'
                  : 'Detalhes do Produto'
          }
        >
          <div className="space-y-4">
            {modalType === 'view' && selectedProduto && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-4 font-semibold text-gray-900">
                    Informações Gerais
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Nome:
                      </span>
                      <p className="text-gray-900">{selectedProduto.nome}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Código:
                      </span>
                      <p className="text-gray-900">{selectedProduto.codigo}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Categoria:
                      </span>
                      <p className="text-gray-900">
                        {selectedProduto.categoria}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Marca:
                      </span>
                      <p className="text-gray-900">{selectedProduto.marca}</p>
                    </div>
                    {selectedProduto.descricao && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Descrição:
                        </span>
                        <p className="text-gray-900">
                          {selectedProduto.descricao}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="mb-4 font-semibold text-gray-900">
                    Estoque e Preços
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Preço:
                      </span>
                      <p className="font-bold text-gray-900">
                        {formatCurrency(selectedProduto.preco)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Estoque Atual:
                      </span>
                      <p className="text-gray-900">
                        {selectedProduto.estoque} unidades
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Estoque Mínimo:
                      </span>
                      <p className="text-gray-900">
                        {selectedProduto.estoqueMinimo} unidades
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Localização:
                      </span>
                      <p className="text-gray-900">
                        {selectedProduto.localizacao}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Fornecedor:
                      </span>
                      <p className="text-gray-900">
                        {selectedProduto.fornecedor}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Status:
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(selectedProduto.status)}`}
                      >
                        {selectedProduto.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(modalType === 'create' ||
              modalType === 'edit' ||
              modalType === 'estoque') && (
              <div className="py-8 text-center">
                <div className="mb-4 text-4xl text-gray-400">🚧</div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Funcionalidade em Desenvolvimento
                </h3>
                <p className="text-gray-600">
                  O formulário para{' '}
                  {modalType === 'create'
                    ? 'cadastro'
                    : modalType === 'edit'
                      ? 'edição'
                      : 'movimentação de estoque'}{' '}
                  de produtos será implementado em breve.
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
