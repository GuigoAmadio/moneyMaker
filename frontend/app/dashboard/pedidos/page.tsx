'use client'

import { useState, useEffect } from 'react'
import { AnimatedDiv } from '@/components/animations/AnimatedDiv'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  getPedidosAction,
  updatePedidoStatusAction,
  deletePedidoAction,
} from '@/actions/pedidos'
import type { Pedido } from '@/types'

// Mock data para desenvolvimento
const mockPedidos: Pedido[] = [
  {
    id: '1',
    numero: 'PED-2024-001',
    clienteId: '1',
    cliente: {
      id: '1',
      nome: 'João da Silva',
      telefone: '(11) 99999-1111',
      email: 'joao.silva@email.com',
    },
    itens: [
      {
        id: '1',
        produtoId: '1',
        produto: {
          id: '1',
          nome: 'Pastilha de Freio Dianteira',
          codigo: 'PF001',
          preco: 89.9,
        },
        quantidade: 2,
        precoUnitario: 89.9,
        subtotal: 179.8,
      },
      {
        id: '2',
        produtoId: '2',
        produto: {
          id: '2',
          nome: 'Óleo Motor 5W30',
          codigo: 'OM005',
          preco: 45.5,
        },
        quantidade: 4,
        precoUnitario: 45.5,
        subtotal: 182.0,
      },
    ],
    total: 361.8,
    status: 'Confirmado',
    formaPagamento: 'PIX',
    observacoes: 'Cliente prefere retirar no balcão',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: '2',
    numero: 'PED-2024-002',
    clienteId: '2',
    cliente: {
      id: '2',
      nome: 'Maria Santos',
      telefone: '(11) 99999-2222',
      email: 'maria.santos@email.com',
    },
    itens: [
      {
        id: '3',
        produtoId: '3',
        produto: {
          id: '3',
          nome: 'Filtro de Ar Condicionado',
          codigo: 'FAC012',
          preco: 32.0,
        },
        quantidade: 1,
        precoUnitario: 32.0,
        subtotal: 32.0,
      },
    ],
    total: 32.0,
    status: 'Pronto',
    formaPagamento: 'Cartão Débito',
    observacoes: 'Entrega agendada para hoje às 16h',
    createdAt: '2024-01-19T14:15:00Z',
    updatedAt: '2024-01-20T11:30:00Z',
  },
  {
    id: '3',
    numero: 'PED-2024-003',
    clienteId: '3',
    cliente: {
      id: '3',
      nome: 'Carlos Lima',
      telefone: '(11) 99999-3333',
    },
    itens: [
      {
        id: '4',
        produtoId: '1',
        produto: {
          id: '1',
          nome: 'Pastilha de Freio Dianteira',
          codigo: 'PF001',
          preco: 89.9,
        },
        quantidade: 1,
        precoUnitario: 89.9,
        subtotal: 89.9,
      },
      {
        id: '5',
        produtoId: '2',
        produto: {
          id: '2',
          nome: 'Óleo Motor 5W30',
          codigo: 'OM005',
          preco: 45.5,
        },
        quantidade: 2,
        precoUnitario: 45.5,
        subtotal: 91.0,
      },
    ],
    total: 180.9,
    status: 'Separando',
    formaPagamento: 'Dinheiro',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-20T08:45:00Z',
  },
]

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos)
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>(mockPedidos)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [formaPagamentoFilter, setFormaPagamentoFilter] = useState<string>('')
  const [dataFilter, setDataFilter] = useState<string>('')

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view')
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)

  useEffect(() => {
    loadPedidos()
  }, [])

  useEffect(() => {
    filterPedidos()
  }, [searchTerm, statusFilter, formaPagamentoFilter, dataFilter, pedidos])

  const loadPedidos = async () => {
    setLoading(true)
    try {
      const result = await getPedidosAction()
      if (result.success) {
        setPedidos(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      // Usar mock data em caso de erro
      setPedidos(mockPedidos)
    } finally {
      setLoading(false)
    }
  }

  const filterPedidos = () => {
    let filtered = pedidos

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (pedido) =>
          pedido.numero.toLowerCase().includes(term) ||
          pedido.cliente.nome.toLowerCase().includes(term) ||
          pedido.cliente.telefone.includes(term) ||
          pedido.itens.some(
            (item) =>
              item.produto.nome.toLowerCase().includes(term) ||
              item.produto.codigo.toLowerCase().includes(term)
          )
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((pedido) => pedido.status === statusFilter)
    }

    if (formaPagamentoFilter) {
      filtered = filtered.filter(
        (pedido) => pedido.formaPagamento === formaPagamentoFilter
      )
    }

    if (dataFilter) {
      const filterDate = new Date(dataFilter).toDateString()
      filtered = filtered.filter(
        (pedido) => new Date(pedido.createdAt).toDateString() === filterDate
      )
    }

    setFilteredPedidos(
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    )
  }

  const handleStatusChange = async (
    pedidoId: string,
    newStatus: Pedido['status']
  ) => {
    try {
      const result = await updatePedidoStatusAction(pedidoId, newStatus)
      if (result.success) {
        setPedidos((prev) =>
          prev.map((p) => (p.id === pedidoId ? { ...p, status: newStatus } : p))
        )
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return

    try {
      const result = await deletePedidoAction(id)
      if (result.success) {
        setPedidos((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir pedido:', error)
    }
  }

  const handleView = (pedido: Pedido) => {
    setSelectedPedido(pedido)
    setModalMode('view')
    setShowModal(true)
  }

  const handleEdit = (pedido: Pedido) => {
    setSelectedPedido(pedido)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleCreate = () => {
    setSelectedPedido(null)
    setModalMode('create')
    setShowModal(true)
  }

  const getStatusColor = (status: Pedido['status']) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800'
      case 'Confirmado':
        return 'bg-blue-100 text-blue-800'
      case 'Separando':
        return 'bg-orange-100 text-orange-800'
      case 'Pronto':
        return 'bg-green-100 text-green-800'
      case 'Entregue':
        return 'bg-gray-100 text-gray-800'
      case 'Cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getFormaPagamentoColor = (forma: Pedido['formaPagamento']) => {
    switch (forma) {
      case 'PIX':
        return 'bg-purple-100 text-purple-800'
      case 'Dinheiro':
        return 'bg-green-100 text-green-800'
      case 'Cartão Débito':
      case 'Cartão Crédito':
        return 'bg-blue-100 text-blue-800'
      case 'Boleto':
        return 'bg-orange-100 text-orange-800'
      case 'Crediário':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getNextStatus = (
    currentStatus: Pedido['status']
  ): Pedido['status'] | null => {
    switch (currentStatus) {
      case 'Pendente':
        return 'Confirmado'
      case 'Confirmado':
        return 'Separando'
      case 'Separando':
        return 'Pronto'
      case 'Pronto':
        return 'Entregue'
      default:
        return null
    }
  }

  const formasPagamento = Array.from(
    new Set(pedidos.map((p) => p.formaPagamento))
  )

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600">Gerencie os pedidos de clientes</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + Novo Pedido
        </Button>
      </div>

      {/* Filtros */}
      <AnimatedDiv className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nº pedido, cliente, produto..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="Pendente">Pendente</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Separando">Separando</option>
              <option value="Pronto">Pronto</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Pagamento
            </label>
            <select
              value={formaPagamentoFilter}
              onChange={(e) => setFormaPagamentoFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {formasPagamento.map((forma) => (
                <option key={forma} value={forma}>
                  {forma}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              type="date"
              value={dataFilter}
              onChange={(e) => setDataFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setFormaPagamentoFilter('')
                setDataFilter('')
              }}
              variant="outline"
              className="w-full"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </AnimatedDiv>

      {/* Lista de Pedidos */}
      {filteredPedidos.length === 0 ? (
        <AnimatedDiv className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">📋</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {searchTerm || statusFilter || formaPagamentoFilter || dataFilter
              ? 'Nenhum pedido encontrado'
              : 'Nenhum pedido cadastrado'}
          </h3>
          <p className="mb-6 text-gray-600">
            {searchTerm || statusFilter || formaPagamentoFilter || dataFilter
              ? 'Tente ajustar os filtros para encontrar pedidos.'
              : 'Comece criando seu primeiro pedido.'}
          </p>
          {!searchTerm &&
            !statusFilter &&
            !formaPagamentoFilter &&
            !dataFilter && (
              <Button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                + Criar Primeiro Pedido
              </Button>
            )}
        </AnimatedDiv>
      ) : (
        <div className="grid gap-4">
          {filteredPedidos.map((pedido, index) => {
            const nextStatus = getNextStatus(pedido.status)

            return (
              <AnimatedDiv
                key={pedido.id}
                delay={index * 0.1}
                className="rounded-lg border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-4">
                      <div>
                        <div className="mb-2 flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <span className="text-xs font-semibold text-blue-600">
                              #{pedido.numero.split('-')[2]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {pedido.numero}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(pedido.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-1 font-medium text-gray-900">
                          {pedido.cliente.nome}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {pedido.cliente.telefone}
                        </p>
                        {pedido.cliente.email && (
                          <p className="text-xs text-gray-500">
                            {pedido.cliente.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-gray-600">
                          <span className="font-medium">Itens:</span>{' '}
                          {pedido.itens.length}
                        </p>
                        <p className="mb-2 text-lg font-bold text-gray-900">
                          R$ {pedido.total.toFixed(2)}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getFormaPagamentoColor(pedido.formaPagamento)}`}
                        >
                          {pedido.formaPagamento}
                        </span>
                      </div>
                      <div>
                        <div className="mb-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(pedido.status)}`}
                          >
                            {pedido.status}
                          </span>
                        </div>
                        {pedido.observacoes && (
                          <p
                            className="truncate text-sm text-gray-600"
                            title={pedido.observacoes}
                          >
                            <span className="font-medium">Obs:</span>{' '}
                            {pedido.observacoes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(pedido)}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(pedido)}
                      >
                        Editar
                      </Button>
                      {nextStatus && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(pedido.id, nextStatus)
                          }
                          className="bg-green-600 text-xs hover:bg-green-700"
                        >
                          {nextStatus === 'Confirmado' && 'Confirmar'}
                          {nextStatus === 'Separando' && 'Separar'}
                          {nextStatus === 'Pronto' && 'Finalizar'}
                          {nextStatus === 'Entregue' && 'Entregar'}
                        </Button>
                      )}
                      {pedido.status === 'Pendente' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(pedido.id, 'Cancelado')
                          }
                          className="bg-red-600 text-xs hover:bg-red-700"
                        >
                          Cancelar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(pedido.id)}
                        className="border-red-300 text-xs text-red-600 hover:bg-red-50"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              </AnimatedDiv>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === 'create'
            ? 'Novo Pedido'
            : modalMode === 'edit'
              ? 'Editar Pedido'
              : 'Detalhes do Pedido'
        }
        size="lg"
      >
        <div className="space-y-4">
          {modalMode === 'view' && selectedPedido && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-semibold text-gray-900">
                    Informações do Pedido
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Número:</span>{' '}
                      {selectedPedido.numero}
                    </p>
                    <p>
                      <span className="font-medium">Data:</span>{' '}
                      {formatDate(selectedPedido.createdAt)}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(selectedPedido.status)}`}
                      >
                        {selectedPedido.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Total:</span> R${' '}
                      {selectedPedido.total.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 font-semibold text-gray-900">Cliente</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Nome:</span>{' '}
                      {selectedPedido.cliente.nome}
                    </p>
                    <p>
                      <span className="font-medium">Telefone:</span>{' '}
                      {selectedPedido.cliente.telefone}
                    </p>
                    {selectedPedido.cliente.email && (
                      <p>
                        <span className="font-medium">Email:</span>{' '}
                        {selectedPedido.cliente.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 font-semibold text-gray-900">
                    Pagamento
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Forma:</span>
                      <span
                        className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getFormaPagamentoColor(selectedPedido.formaPagamento)}`}
                      >
                        {selectedPedido.formaPagamento}
                      </span>
                    </p>
                  </div>
                </div>
                {selectedPedido.observacoes && (
                  <div>
                    <h4 className="mb-3 font-semibold text-gray-900">
                      Observações
                    </h4>
                    <p className="text-sm text-gray-700">
                      {selectedPedido.observacoes}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-gray-900">
                  Itens do Pedido
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Código
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Qtd
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Preço Unit.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {selectedPedido.itens.map((item) => (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            {item.produto.nome}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item.produto.codigo}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item.quantidade}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            R$ {item.precoUnitario.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            R$ {item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-right text-sm font-medium text-gray-900"
                        >
                          Total:
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">
                          R$ {selectedPedido.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {(modalMode === 'create' || modalMode === 'edit') && (
            <div className="py-8 text-center">
              <div className="mb-4 text-4xl text-gray-400">🚧</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Formulário em Desenvolvimento
              </h3>
              <p className="text-gray-600">
                O formulário para{' '}
                {modalMode === 'create' ? 'criação' : 'edição'} de pedidos será
                implementado em breve.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
