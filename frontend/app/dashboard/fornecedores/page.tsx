'use client'

import { useState, useEffect } from 'react'
import { AnimatedDiv } from '@/components/animations/AnimatedDiv'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  getFornecedoresAction,
  deleteFornecedorAction,
  toggleFornecedorStatusAction,
} from '@/actions/fornecedores'
import type { Fornecedor } from '@/types'

// Mock data para desenvolvimento
const mockFornecedores: Fornecedor[] = [
  {
    id: '1',
    nome: 'AutoPeças Brasil Ltda',
    razaoSocial: 'AutoPeças Brasil Comércio de Peças Ltda',
    cnpj: '12.345.678/0001-90',
    telefone: '(11) 3333-4444',
    email: 'vendas@autopecasbrasil.com.br',
    endereco: 'Rua das Autopeças, 1500',
    bairro: 'Vila Industrial',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '03456-789',
    contato: 'João Silva',
    produtos: ['Freios', 'Suspensão', 'Filtros', 'Embreagem'],
    ativo: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    nome: 'Distribuidora Lubrax',
    razaoSocial: 'Lubrax Distribuidora de Lubrificantes S.A.',
    cnpj: '98.765.432/0001-12',
    telefone: '(11) 5555-6666',
    email: 'comercial@lubrax.com.br',
    endereco: 'Av. dos Lubrificantes, 800',
    bairro: 'Distrito Industrial',
    cidade: 'Guarulhos',
    estado: 'SP',
    cep: '07123-456',
    contato: 'Maria Santos',
    produtos: ['Lubrificantes', 'Óleos', 'Graxas', 'Aditivos'],
    ativo: true,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
  },
  {
    id: '3',
    nome: 'Eletrônica Automotiva Mega',
    razaoSocial: 'Mega Eletrônica Automotiva Ltda',
    cnpj: '45.678.912/0001-34',
    telefone: '(11) 7777-8888',
    email: 'vendas@megaeletronica.com.br',
    endereco: 'Rua da Eletrônica, 250',
    bairro: 'Centro',
    cidade: 'São Caetano do Sul',
    estado: 'SP',
    cep: '09876-543',
    contato: 'Carlos Oliveira',
    produtos: ['Baterias', 'Alternadores', 'Motores de Partida', 'Sensores'],
    ativo: false,
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
  },
]

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] =
    useState<Fornecedor[]>(mockFornecedores)
  const [filteredFornecedores, setFilteredFornecedores] =
    useState<Fornecedor[]>(mockFornecedores)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [cidadeFilter, setCidadeFilter] = useState<string>('')

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view')
  const [selectedFornecedor, setSelectedFornecedor] =
    useState<Fornecedor | null>(null)

  useEffect(() => {
    loadFornecedores()
  }, [])

  useEffect(() => {
    filterFornecedores()
  }, [searchTerm, statusFilter, cidadeFilter, fornecedores])

  const loadFornecedores = async () => {
    setLoading(true)
    try {
      const result = await getFornecedoresAction()
      if (result.success) {
        setFornecedores(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error)
      // Usar mock data em caso de erro
      setFornecedores(mockFornecedores)
    } finally {
      setLoading(false)
    }
  }

  const filterFornecedores = () => {
    let filtered = fornecedores

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (fornecedor) =>
          fornecedor.nome.toLowerCase().includes(term) ||
          fornecedor.razaoSocial.toLowerCase().includes(term) ||
          fornecedor.cnpj.includes(term) ||
          fornecedor.contato.toLowerCase().includes(term) ||
          fornecedor.produtos.some((produto) =>
            produto.toLowerCase().includes(term)
          )
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((fornecedor) =>
        statusFilter === 'ativo' ? fornecedor.ativo : !fornecedor.ativo
      )
    }

    if (cidadeFilter) {
      filtered = filtered.filter(
        (fornecedor) => fornecedor.cidade === cidadeFilter
      )
    }

    setFilteredFornecedores(filtered)
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const result = await toggleFornecedorStatusAction(id)
      if (result.success) {
        setFornecedores((prev) =>
          prev.map((f) => (f.id === id ? { ...f, ativo: !f.ativo } : f))
        )
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este fornecedor?')) return

    try {
      const result = await deleteFornecedorAction(id)
      if (result.success) {
        setFornecedores((prev) => prev.filter((f) => f.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error)
    }
  }

  const handleView = (fornecedor: Fornecedor) => {
    setSelectedFornecedor(fornecedor)
    setModalMode('view')
    setShowModal(true)
  }

  const handleEdit = (fornecedor: Fornecedor) => {
    setSelectedFornecedor(fornecedor)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleCreate = () => {
    setSelectedFornecedor(null)
    setModalMode('create')
    setShowModal(true)
  }

  const cidades = Array.from(new Set(fornecedores.map((f) => f.cidade)))

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
          <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-gray-600">Gerencie seus parceiros comerciais</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + Novo Fornecedor
        </Button>
      </div>

      {/* Filtros */}
      <AnimatedDiv className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome, CNPJ, contato, produtos..."
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
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Cidade
            </label>
            <select
              value={cidadeFilter}
              onChange={(e) => setCidadeFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {cidades.map((cidade) => (
                <option key={cidade} value={cidade}>
                  {cidade}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setCidadeFilter('')
              }}
              variant="outline"
              className="w-full"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </AnimatedDiv>

      {/* Lista de Fornecedores */}
      {filteredFornecedores.length === 0 ? (
        <AnimatedDiv className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">🏢</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {searchTerm || statusFilter || cidadeFilter
              ? 'Nenhum fornecedor encontrado'
              : 'Nenhum fornecedor cadastrado'}
          </h3>
          <p className="mb-6 text-gray-600">
            {searchTerm || statusFilter || cidadeFilter
              ? 'Tente ajustar os filtros para encontrar fornecedores.'
              : 'Comece cadastrando seu primeiro fornecedor.'}
          </p>
          {!searchTerm && !statusFilter && !cidadeFilter && (
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              + Cadastrar Primeiro Fornecedor
            </Button>
          )}
        </AnimatedDiv>
      ) : (
        <div className="grid gap-4">
          {filteredFornecedores.map((fornecedor, index) => (
            <AnimatedDiv
              key={fornecedor.id}
              delay={index * 0.1}
              className="rounded-lg border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <div className="mb-2 flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                          <span className="font-semibold text-blue-600">
                            {fornecedor.nome
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {fornecedor.nome}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {fornecedor.cnpj}
                          </p>
                          <div className="mt-1">
                            {fornecedor.ativo ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Ativo
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                Inativo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-gray-600">
                        <span className="font-medium">Contato:</span>{' '}
                        {fornecedor.contato}
                      </p>
                      <p className="mb-1 text-sm text-gray-600">
                        <span className="font-medium">Telefone:</span>{' '}
                        {fornecedor.telefone}
                      </p>
                      {fornecedor.email && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span>{' '}
                          {fornecedor.email}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">Local:</span>{' '}
                        {fornecedor.cidade}/{fornecedor.estado}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        Produtos Fornecidos:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {fornecedor.produtos.slice(0, 3).map((produto, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                          >
                            {produto}
                          </span>
                        ))}
                        {fornecedor.produtos.length > 3 && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                            +{fornecedor.produtos.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(fornecedor)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(fornecedor)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleToggleStatus(fornecedor.id)}
                      className={
                        fornecedor.ativo
                          ? 'bg-yellow-600 text-xs hover:bg-yellow-700'
                          : 'bg-green-600 text-xs hover:bg-green-700'
                      }
                    >
                      {fornecedor.ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(fornecedor.id)}
                      className="border-red-300 text-xs text-red-600 hover:bg-red-50"
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedDiv>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === 'create'
            ? 'Novo Fornecedor'
            : modalMode === 'edit'
              ? 'Editar Fornecedor'
              : 'Detalhes do Fornecedor'
        }
        size="lg"
      >
        <div className="space-y-4">
          {modalMode === 'view' && selectedFornecedor && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">
                  Dados da Empresa
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Nome:</span>{' '}
                    {selectedFornecedor.nome}
                  </p>
                  <p>
                    <span className="font-medium">Razão Social:</span>{' '}
                    {selectedFornecedor.razaoSocial}
                  </p>
                  <p>
                    <span className="font-medium">CNPJ:</span>{' '}
                    {selectedFornecedor.cnpj}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        selectedFornecedor.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedFornecedor.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Contato</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Responsável:</span>{' '}
                    {selectedFornecedor.contato}
                  </p>
                  <p>
                    <span className="font-medium">Telefone:</span>{' '}
                    {selectedFornecedor.telefone}
                  </p>
                  {selectedFornecedor.email && (
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      {selectedFornecedor.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Endereço</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Logradouro:</span>{' '}
                    {selectedFornecedor.endereco}
                  </p>
                  <p>
                    <span className="font-medium">Bairro:</span>{' '}
                    {selectedFornecedor.bairro}
                  </p>
                  <p>
                    <span className="font-medium">Cidade:</span>{' '}
                    {selectedFornecedor.cidade}
                  </p>
                  <p>
                    <span className="font-medium">Estado:</span>{' '}
                    {selectedFornecedor.estado}
                  </p>
                  <p>
                    <span className="font-medium">CEP:</span>{' '}
                    {selectedFornecedor.cep}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">
                  Produtos Fornecidos
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFornecedor.produtos.map((produto, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                    >
                      {produto}
                    </span>
                  ))}
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
                {modalMode === 'create' ? 'cadastro' : 'edição'} de fornecedores
                será implementado em breve.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
