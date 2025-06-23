'use client'

import { useState, useEffect } from 'react'
import {
  Home,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import AnimatedDiv from '@/components/animations/AnimatedDiv'
import {
  getImoveisAction,
  deleteImovelAction,
  updateImovelStatusAction,
} from '@/actions/imoveis'
import type { Imovel } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'view' | 'create' | 'edit'>('view')

  // Carregar imóveis do backend
  const loadImoveis = async () => {
    setLoading(true)
    try {
      const result = await getImoveisAction()
      if (result.success && result.data) {
        setImoveis(result.data as Imovel[])
      } else {
        console.error('Erro ao carregar imóveis:', result.error)
        setImoveis([]) // Usar array vazio se der erro
      }
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error)
      setImoveis([]) // Usar array vazio se der erro
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadImoveis()
  }, [])

  // Filtrar imóveis
  const filteredImoveis = imoveis.filter((imovel) => {
    const matchesSearch =
      imovel.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.bairro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.cidade?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' || imovel.tipo === filterType
    const matchesStatus =
      filterStatus === 'all' || imovel.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const handleView = (imovel: Imovel) => {
    setSelectedImovel(imovel)
    setModalType('view')
    setShowModal(true)
  }

  const handleEdit = (imovel: Imovel) => {
    setSelectedImovel(imovel)
    setModalType('edit')
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      try {
        const result = await deleteImovelAction(id)
        if (result.success) {
          setImoveis(imoveis.filter((imovel) => imovel.id !== id))
        } else {
          alert('Erro ao excluir imóvel: ' + result.error)
        }
      } catch (error) {
        console.error('Erro ao excluir imóvel:', error)
        alert('Erro ao excluir imóvel')
      }
    }
  }

  const handleCreate = () => {
    setSelectedImovel(null)
    setModalType('create')
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível':
        return 'bg-green-100 text-green-800'
      case 'Vendido':
        return 'bg-blue-100 text-blue-800'
      case 'Alugado':
        return 'bg-yellow-100 text-yellow-800'
      case 'Reservado':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTipoIcon = (tipo: string) => {
    return <Home className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedDiv animation="fadeIn">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Imóveis</h1>
            <p className="text-gray-600">Gerencie seu portfólio de imóveis</p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Imóvel
          </Button>
        </div>
      </AnimatedDiv>

      {/* Filtros */}
      <AnimatedDiv animation="slideUp" delay={0.1}>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar imóveis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Filtro por tipo */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos os tipos</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Terreno">Terreno</option>
              <option value="Comercial">Comercial</option>
              <option value="Cobertura">Cobertura</option>
            </select>

            {/* Filtro por status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos os status</option>
              <option value="Disponível">Disponível</option>
              <option value="Vendido">Vendido</option>
              <option value="Alugado">Alugado</option>
              <option value="Reservado">Reservado</option>
            </select>

            {/* Botão de filtro avançado */}
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros Avançados
            </Button>
          </div>
        </div>
      </AnimatedDiv>

      {/* Lista de Imóveis */}
      <AnimatedDiv animation="slideUp" delay={0.2}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredImoveis.map((imovel, index) => (
            <AnimatedDiv
              key={imovel.id}
              animation="scale"
              delay={0.3 + index * 0.1}
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg">
                {/* Imagem */}
                <div className="relative h-48 bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="h-12 w-12 text-gray-400" />
                  </div>
                  {/* Status Badge */}
                  <div className="absolute right-2 top-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(imovel.status)}`}
                    >
                      {imovel.status}
                    </span>
                  </div>
                  {/* Categoria Badge */}
                  <div className="absolute left-2 top-2">
                    <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-gray-800">
                      {imovel.categoria}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {imovel.titulo}
                    </h3>
                    <div className="flex items-center text-green-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm font-bold">
                        {imovel.categoria === 'Venda'
                          ? formatCurrency(imovel.preco)
                          : `${formatCurrency(imovel.preco)}/mês`}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>
                      {imovel.bairro}, {imovel.cidade}
                    </span>
                  </div>

                  {/* Características */}
                  <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="mr-1 h-4 w-4" />
                      <span>{imovel.quartos}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="mr-1 h-4 w-4" />
                      <span>{imovel.banheiros}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="mr-1 h-4 w-4" />
                      <span>{imovel.area}m²</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(imovel)}
                      className="flex-1"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(imovel)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(imovel.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedDiv>
          ))}
        </div>
      </AnimatedDiv>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredImoveis.length === 0 && (
        <div className="py-8 text-center">
          <Home className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum imóvel encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando seu primeiro imóvel.'}
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalType === 'create'
            ? 'Novo Imóvel'
            : modalType === 'edit'
              ? 'Editar Imóvel'
              : 'Detalhes do Imóvel'
        }
        size="lg"
      >
        <div className="space-y-4">
          {modalType === 'view' && selectedImovel && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Título
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedImovel.titulo}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Preço
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedImovel.categoria === 'Venda'
                      ? formatCurrency(selectedImovel.preco)
                      : `${formatCurrency(selectedImovel.preco)}/mês`}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <p className="text-sm text-gray-900">
                  {selectedImovel.descricao}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quartos
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedImovel.quartos}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Banheiros
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedImovel.banheiros}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Área
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedImovel.area}m²
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Endereço
                </label>
                <p className="text-sm text-gray-900">
                  {selectedImovel.endereco}, {selectedImovel.bairro},{' '}
                  {selectedImovel.cidade} - {selectedImovel.estado}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Proprietário
                </label>
                <p className="text-sm text-gray-900">
                  {selectedImovel.proprietario} -{' '}
                  {selectedImovel.telefoneProprietario}
                </p>
              </div>
            </div>
          )}

          {(modalType === 'create' || modalType === 'edit') && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Formulário de {modalType === 'create' ? 'criação' : 'edição'}{' '}
                será implementado aqui.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  {modalType === 'create' ? 'Criar' : 'Salvar'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
