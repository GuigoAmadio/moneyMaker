'use client'

import { useState, useEffect } from 'react'
import { AnimatedDiv } from '@/components/animations/AnimatedDiv'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  getVisitasAction,
  updateVisitaStatusAction,
  deleteVisitaAction,
} from '@/actions/visitas'
import type { VisitaAgendada } from '@/types'

// Mock data para desenvolvimento
const mockVisitas: VisitaAgendada[] = [
  {
    id: '1',
    leadId: '1',
    lead: {
      id: '1',
      nome: 'Carlos Silva',
      telefone: '(11) 99999-1111',
      email: 'carlos.silva@email.com',
    },
    imovelId: '1',
    imovel: {
      id: '1',
      titulo: 'Apartamento 3 Quartos - Vila Madalena',
      endereco: 'Rua Harmonia, 123',
      preco: 650000,
      tipo: 'Apartamento',
    },
    dataHora: '2024-01-22T10:00:00Z',
    status: 'Agendada',
    observacoes: 'Cliente interessado em financiamento',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    leadId: '2',
    lead: {
      id: '2',
      nome: 'Ana Santos',
      telefone: '(11) 99999-2222',
      email: 'ana.santos@email.com',
    },
    imovelId: '2',
    imovel: {
      id: '2',
      titulo: 'Casa 4 Quartos - Jardins',
      endereco: 'Rua Augusta, 456',
      preco: 1200000,
      tipo: 'Casa',
    },
    dataHora: '2024-01-22T14:30:00Z',
    status: 'Confirmada',
    observacoes: 'Visita com toda a família',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-21T16:00:00Z',
  },
  {
    id: '3',
    leadId: '3',
    lead: {
      id: '3',
      nome: 'Pedro Costa',
      telefone: '(11) 99999-3333',
      email: 'pedro.costa@email.com',
    },
    imovelId: '3',
    imovel: {
      id: '3',
      titulo: 'Cobertura Duplex - Moema',
      endereco: 'Av. Ibirapuera, 789',
      preco: 850000,
      tipo: 'Cobertura',
    },
    dataHora: '2024-01-20T16:00:00Z',
    status: 'Realizada',
    observacoes: 'Cliente muito interessado, aguardando proposta',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T17:00:00Z',
  },
]

export default function VisitasPage() {
  const [visitas, setVisitas] = useState<VisitaAgendada[]>(mockVisitas)
  const [filteredVisitas, setFilteredVisitas] =
    useState<VisitaAgendada[]>(mockVisitas)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [dataFilter, setDataFilter] = useState<string>('')
  const [tipoImovelFilter, setTipoImovelFilter] = useState<string>('')

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view')
  const [selectedVisita, setSelectedVisita] = useState<VisitaAgendada | null>(
    null
  )

  useEffect(() => {
    loadVisitas()
  }, [])

  useEffect(() => {
    filterVisitas()
  }, [searchTerm, statusFilter, dataFilter, tipoImovelFilter, visitas])

  const loadVisitas = async () => {
    setLoading(true)
    try {
      const result = await getVisitasAction()
      if (result.success) {
        setVisitas(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar visitas:', error)
      // Usar mock data em caso de erro
      setVisitas(mockVisitas)
    } finally {
      setLoading(false)
    }
  }

  const filterVisitas = () => {
    let filtered = visitas

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (visita) =>
          visita.lead.nome.toLowerCase().includes(term) ||
          visita.imovel.titulo.toLowerCase().includes(term) ||
          visita.imovel.endereco.toLowerCase().includes(term) ||
          visita.lead.telefone.includes(term)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((visita) => visita.status === statusFilter)
    }

    if (dataFilter) {
      const filterDate = new Date(dataFilter).toDateString()
      filtered = filtered.filter(
        (visita) => new Date(visita.dataHora).toDateString() === filterDate
      )
    }

    if (tipoImovelFilter) {
      filtered = filtered.filter(
        (visita) => visita.imovel.tipo === tipoImovelFilter
      )
    }

    setFilteredVisitas(
      filtered.sort(
        (a, b) =>
          new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
      )
    )
  }

  const handleStatusChange = async (
    visitaId: string,
    newStatus: VisitaAgendada['status']
  ) => {
    try {
      const result = await updateVisitaStatusAction(visitaId, newStatus)
      if (result.success) {
        setVisitas((prev) =>
          prev.map((v) => (v.id === visitaId ? { ...v, status: newStatus } : v))
        )
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta visita?')) return

    try {
      const result = await deleteVisitaAction(id)
      if (result.success) {
        setVisitas((prev) => prev.filter((v) => v.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir visita:', error)
    }
  }

  const handleView = (visita: VisitaAgendada) => {
    setSelectedVisita(visita)
    setModalMode('view')
    setShowModal(true)
  }

  const handleEdit = (visita: VisitaAgendada) => {
    setSelectedVisita(visita)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleCreate = () => {
    setSelectedVisita(null)
    setModalMode('create')
    setShowModal(true)
  }

  const getStatusColor = (status: VisitaAgendada['status']) => {
    switch (status) {
      case 'Agendada':
        return 'bg-blue-100 text-blue-800'
      case 'Confirmada':
        return 'bg-green-100 text-green-800'
      case 'Realizada':
        return 'bg-gray-100 text-gray-800'
      case 'Cancelada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
  }

  const isToday = (dateTime: string) => {
    const today = new Date().toDateString()
    const visitaDate = new Date(dateTime).toDateString()
    return today === visitaDate
  }

  const isTomorrow = (dateTime: string) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const visitaDate = new Date(dateTime).toDateString()
    return tomorrow.toDateString() === visitaDate
  }

  const tiposImovel = Array.from(new Set(visitas.map((v) => v.imovel.tipo)))

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Visitas Agendadas
          </h1>
          <p className="text-gray-600">
            Gerencie a agenda de visitas aos imóveis
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-orange-600 hover:bg-orange-700"
        >
          + Nova Visita
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
              placeholder="Cliente, imóvel, endereço..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todos</option>
              <option value="Agendada">Agendada</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Realizada">Realizada</option>
              <option value="Cancelada">Cancelada</option>
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tipo de Imóvel
            </label>
            <select
              value={tipoImovelFilter}
              onChange={(e) => setTipoImovelFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todos</option>
              {tiposImovel.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setDataFilter('')
                setTipoImovelFilter('')
              }}
              variant="outline"
              className="w-full"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </AnimatedDiv>

      {/* Lista de Visitas */}
      {filteredVisitas.length === 0 ? (
        <AnimatedDiv className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">🏠</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {searchTerm || statusFilter || dataFilter || tipoImovelFilter
              ? 'Nenhuma visita encontrada'
              : 'Nenhuma visita agendada'}
          </h3>
          <p className="mb-6 text-gray-600">
            {searchTerm || statusFilter || dataFilter || tipoImovelFilter
              ? 'Tente ajustar os filtros para encontrar visitas.'
              : 'Comece agendando sua primeira visita.'}
          </p>
          {!searchTerm && !statusFilter && !dataFilter && !tipoImovelFilter && (
            <Button
              onClick={handleCreate}
              className="bg-orange-600 hover:bg-orange-700"
            >
              + Agendar Primeira Visita
            </Button>
          )}
        </AnimatedDiv>
      ) : (
        <div className="grid gap-4">
          {filteredVisitas.map((visita, index) => {
            const { date, time } = formatDateTime(visita.dataHora)
            const todayVisita = isToday(visita.dataHora)
            const tomorrowVisita = isTomorrow(visita.dataHora)

            return (
              <AnimatedDiv
                key={visita.id}
                delay={index * 0.1}
                className={`rounded-lg border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md ${
                  todayVisita
                    ? 'ring-2 ring-orange-200'
                    : tomorrowVisita
                      ? 'ring-1 ring-yellow-200'
                      : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-4">
                      <div>
                        <div className="mb-2 flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                            <span className="text-sm font-semibold text-orange-600">
                              {time}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {date}
                            </p>
                            <div className="flex space-x-1">
                              {todayVisita && (
                                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-800">
                                  Hoje
                                </span>
                              )}
                              {tomorrowVisita && (
                                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                                  Amanhã
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold text-gray-900">
                          {visita.lead.nome}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {visita.lead.telefone}
                        </p>
                        {visita.lead.email && (
                          <p className="text-xs text-gray-500">
                            {visita.lead.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <h4 className="mb-1 font-medium text-gray-900">
                          {visita.imovel.titulo}
                        </h4>
                        <p className="mb-1 text-sm text-gray-600">
                          {visita.imovel.endereco}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          R$ {visita.imovel.preco.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(visita.status)}`}
                          >
                            {visita.status}
                          </span>
                          <br />
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                            {visita.imovel.tipo}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(visita)}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(visita)}
                      >
                        Editar
                      </Button>
                      {visita.status === 'Agendada' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(visita.id, 'Confirmada')
                          }
                          className="bg-green-600 text-xs hover:bg-green-700"
                        >
                          Confirmar
                        </Button>
                      )}
                      {visita.status === 'Confirmada' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(visita.id, 'Realizada')
                          }
                          className="bg-gray-600 text-xs hover:bg-gray-700"
                        >
                          Realizada
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(visita.id)}
                        className="border-red-300 text-xs text-red-600 hover:bg-red-50"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                  {visita.observacoes && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Observações:</span>{' '}
                        {visita.observacoes}
                      </p>
                    </div>
                  )}
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
            ? 'Nova Visita'
            : modalMode === 'edit'
              ? 'Editar Visita'
              : 'Detalhes da Visita'
        }
        size="lg"
      >
        <div className="space-y-4">
          {modalMode === 'view' && selectedVisita && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Cliente</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Nome:</span>{' '}
                    {selectedVisita.lead.nome}
                  </p>
                  <p>
                    <span className="font-medium">Telefone:</span>{' '}
                    {selectedVisita.lead.telefone}
                  </p>
                  {selectedVisita.lead.email && (
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      {selectedVisita.lead.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">
                  Agendamento
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Data/Hora:</span>{' '}
                    {formatDateTime(selectedVisita.dataHora).date} às{' '}
                    {formatDateTime(selectedVisita.dataHora).time}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(selectedVisita.status)}`}
                    >
                      {selectedVisita.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="mb-3 font-semibold text-gray-900">Imóvel</h4>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h5 className="mb-2 font-medium text-gray-900">
                    {selectedVisita.imovel.titulo}
                  </h5>
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                    <div>
                      <p>
                        <span className="font-medium">Endereço:</span>{' '}
                        {selectedVisita.imovel.endereco}
                      </p>
                      <p>
                        <span className="font-medium">Tipo:</span>{' '}
                        {selectedVisita.imovel.tipo}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">Preço:</span> R${' '}
                        {selectedVisita.imovel.preco.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {selectedVisita.observacoes && (
                <div className="md:col-span-2">
                  <h4 className="mb-3 font-semibold text-gray-900">
                    Observações
                  </h4>
                  <p className="text-sm text-gray-700">
                    {selectedVisita.observacoes}
                  </p>
                </div>
              )}
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
                {modalMode === 'create' ? 'agendamento' : 'edição'} de visitas
                será implementado em breve.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
