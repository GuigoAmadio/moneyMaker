'use client'

import { useState, useEffect } from 'react'
import { AnimatedDiv } from '@/components/animations/AnimatedDiv'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  getConsultasAction,
  updateConsultaStatusAction,
  deleteConsultaAction,
} from '@/actions/consultas'
import type { Consulta } from '@/types'

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterTipo, setFilterTipo] = useState<string>('all')
  const [filterData, setFilterData] = useState<string>('')
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(
    null
  )
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'view' | 'create' | 'edit'>('view')

  // Carregar consultas do backend
  const loadConsultas = async () => {
    setLoading(true)
    try {
      const result = await getConsultasAction()
      if (result.success && result.data) {
        setConsultas(result.data as Consulta[])
      } else {
        console.error('Erro ao carregar consultas:', result.error)
        setConsultas([])
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error)
      setConsultas([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConsultas()
  }, [])

  // Filtrar consultas
  const filteredConsultas = consultas.filter((consulta) => {
    const matchesSearch =
      consulta.paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.medico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.medico.especialidade
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' || consulta.status === filterStatus
    const matchesTipo = filterTipo === 'all' || consulta.tipo === filterTipo

    let matchesData = true
    if (filterData) {
      const consultaDate = new Date(consulta.dataHora)
        .toISOString()
        .split('T')[0]
      matchesData = consultaDate === filterData
    }

    return matchesSearch && matchesStatus && matchesTipo && matchesData
  })

  const handleView = (consulta: Consulta) => {
    setSelectedConsulta(consulta)
    setModalType('view')
    setShowModal(true)
  }

  const handleEdit = (consulta: Consulta) => {
    setSelectedConsulta(consulta)
    setModalType('edit')
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta consulta?')) {
      try {
        const result = await deleteConsultaAction(id)
        if (result.success) {
          setConsultas(consultas.filter((consulta) => consulta.id !== id))
        } else {
          alert('Erro ao excluir consulta: ' + result.error)
        }
      } catch (error) {
        console.error('Erro ao excluir consulta:', error)
        alert('Erro ao excluir consulta')
      }
    }
  }

  const handleStatusChange = async (
    id: string,
    newStatus: Consulta['status']
  ) => {
    try {
      const result = await updateConsultaStatusAction(id, newStatus)
      if (result.success) {
        setConsultas(
          consultas.map((consulta) =>
            consulta.id === id ? { ...consulta, status: newStatus } : consulta
          )
        )
      } else {
        alert('Erro ao atualizar status: ' + result.error)
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status')
    }
  }

  const getStatusColor = (status: Consulta['status']) => {
    switch (status) {
      case 'Agendada':
        return 'bg-blue-100 text-blue-800'
      case 'Confirmada':
        return 'bg-green-100 text-green-800'
      case 'Em Andamento':
        return 'bg-yellow-100 text-yellow-800'
      case 'Finalizada':
        return 'bg-gray-100 text-gray-800'
      case 'Cancelada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTipoColor = (tipo: Consulta['tipoConsulta']) => {
    switch (tipo) {
      case 'Primeira Consulta':
        return 'bg-purple-100 text-purple-800'
      case 'Retorno':
        return 'bg-blue-100 text-blue-800'
      case 'Urgência':
        return 'bg-red-100 text-red-800'
      case 'Exame':
        return 'bg-orange-100 text-orange-800'
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
    const consultaDate = new Date(dateTime).toDateString()
    return today === consultaDate
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
          <p className="text-gray-600">Gerencie a agenda de consultas</p>
        </div>
        <Button
          onClick={() => {
            setSelectedConsulta(null)
            setModalType('create')
            setShowModal(true)
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          + Nova Consulta
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
              placeholder="Paciente ou médico..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos</option>
              <option value="Agendada">Agendada</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Finalizada">Finalizada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos</option>
              <option value="Primeira Consulta">Primeira Consulta</option>
              <option value="Retorno">Retorno</option>
              <option value="Urgência">Urgência</option>
              <option value="Exame">Exame</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              type="date"
              value={filterData}
              onChange={(e) => setFilterData(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('')
                setFilterStatus('all')
                setFilterTipo('all')
                setFilterData('')
              }}
              variant="outline"
              className="w-full"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </AnimatedDiv>

      {/* Lista de Consultas */}
      {filteredConsultas.length === 0 ? (
        <AnimatedDiv className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">📅</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {searchTerm || filterStatus || filterTipo || filterData
              ? 'Nenhuma consulta encontrada'
              : 'Nenhuma consulta agendada'}
          </h3>
          <p className="mb-6 text-gray-600">
            {searchTerm || filterStatus || filterTipo || filterData
              ? 'Tente ajustar os filtros para encontrar consultas.'
              : 'Comece agendando sua primeira consulta.'}
          </p>
          {!searchTerm && !filterStatus && !filterTipo && !filterData && (
            <Button
              onClick={() => {
                setSelectedConsulta(null)
                setModalType('create')
                setShowModal(true)
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              + Agendar Primeira Consulta
            </Button>
          )}
        </AnimatedDiv>
      ) : (
        <div className="grid gap-4">
          {filteredConsultas.map((consulta, index) => {
            const { date, time } = formatDateTime(consulta.dataHora)
            const todayConsulta = isToday(consulta.dataHora)

            return (
              <AnimatedDiv
                key={consulta.id}
                delay={index * 0.1}
                className={`rounded-lg border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md ${
                  todayConsulta ? 'ring-2 ring-green-200' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-4">
                      <div>
                        <div className="mb-2 flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <span className="text-sm font-semibold text-green-600">
                              {time}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {date}
                            </p>
                            {todayConsulta && (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                Hoje
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold text-gray-900">
                          {consulta.paciente.nome}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {consulta.paciente.telefone}
                        </p>
                        {consulta.paciente.email && (
                          <p className="text-xs text-gray-500">
                            {consulta.paciente.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="mb-1 font-medium text-gray-900">
                          {consulta.medico.nome}
                        </p>
                        <p className="text-sm text-gray-600">
                          {consulta.medico.especialidade}
                        </p>
                        <p className="text-xs text-gray-500">
                          {consulta.medico.crm}
                        </p>
                      </div>
                      <div>
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(consulta.status)}`}
                          >
                            {consulta.status}
                          </span>
                          <br />
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTipoColor(consulta.tipoConsulta)}`}
                          >
                            {consulta.tipoConsulta}
                          </span>
                          <br />
                          <span className="text-sm font-medium text-gray-900">
                            R$ {consulta.valor.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(consulta)}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(consulta)}
                      >
                        Editar
                      </Button>
                      {consulta.status === 'Agendada' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(consulta.id, 'Confirmada')
                          }
                          className="bg-green-600 text-xs hover:bg-green-700"
                        >
                          Confirmar
                        </Button>
                      )}
                      {consulta.status === 'Confirmada' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(consulta.id, 'Em Andamento')
                          }
                          className="bg-yellow-600 text-xs hover:bg-yellow-700"
                        >
                          Iniciar
                        </Button>
                      )}
                      {consulta.status === 'Em Andamento' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(consulta.id, 'Finalizada')
                          }
                          className="bg-gray-600 text-xs hover:bg-gray-700"
                        >
                          Finalizar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(consulta.id)}
                        className="border-red-300 text-xs text-red-600 hover:bg-red-50"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                  {consulta.observacoes && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Observações:</span>{' '}
                        {consulta.observacoes}
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
          modalType === 'create'
            ? 'Nova Consulta'
            : modalType === 'edit'
              ? 'Editar Consulta'
              : 'Detalhes da Consulta'
        }
        size="lg"
      >
        <div className="space-y-4">
          {modalType === 'view' && selectedConsulta && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Paciente</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Nome:</span>{' '}
                    {selectedConsulta.paciente.nome}
                  </p>
                  <p>
                    <span className="font-medium">Telefone:</span>{' '}
                    {selectedConsulta.paciente.telefone}
                  </p>
                  {selectedConsulta.paciente.email && (
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      {selectedConsulta.paciente.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Médico</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Nome:</span>{' '}
                    {selectedConsulta.medico.nome}
                  </p>
                  <p>
                    <span className="font-medium">Especialidade:</span>{' '}
                    {selectedConsulta.medico.especialidade}
                  </p>
                  <p>
                    <span className="font-medium">CRM:</span>{' '}
                    {selectedConsulta.medico.crm}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Consulta</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Data/Hora:</span>{' '}
                    {formatDateTime(selectedConsulta.dataHora).date} às{' '}
                    {formatDateTime(selectedConsulta.dataHora).time}
                  </p>
                  <p>
                    <span className="font-medium">Tipo:</span>{' '}
                    {selectedConsulta.tipoConsulta}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(selectedConsulta.status)}`}
                    >
                      {selectedConsulta.status}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Pagamento</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Valor:</span> R${' '}
                    {selectedConsulta.valor.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Forma:</span>{' '}
                    {selectedConsulta.formaPagamento}
                  </p>
                </div>
              </div>
              {selectedConsulta.observacoes && (
                <div className="md:col-span-2">
                  <h4 className="mb-3 font-semibold text-gray-900">
                    Observações
                  </h4>
                  <p className="text-sm text-gray-700">
                    {selectedConsulta.observacoes}
                  </p>
                </div>
              )}
            </div>
          )}

          {(modalType === 'create' || modalType === 'edit') && (
            <div className="py-8 text-center">
              <div className="mb-4 text-4xl text-gray-400">🚧</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Formulário em Desenvolvimento
              </h3>
              <p className="text-gray-600">
                O formulário para{' '}
                {modalType === 'create' ? 'agendamento' : 'edição'} de consultas
                será implementado em breve.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
