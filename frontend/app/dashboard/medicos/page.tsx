'use client'

import { useState, useEffect } from 'react'
import { AnimatedDiv } from '@/components/animations/AnimatedDiv'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  getMedicosAction,
  deleteMedicoAction,
  toggleMedicoStatusAction,
} from '@/actions/medicos'
import type { Medico } from '@/types'

// Mock data para desenvolvimento
const mockMedicos: Medico[] = [
  {
    id: '1',
    nome: 'Dr. João Carlos Silva',
    crm: 'CRM/SP 123456',
    especialidade: 'Cardiologia',
    telefone: '(11) 99999-1111',
    email: 'joao.silva@clinica.com',
    horarioAtendimento: [
      'Segunda: 08:00-12:00',
      'Terça: 14:00-18:00',
      'Quinta: 08:00-12:00',
    ],
    valorConsulta: 250.0,
    ativo: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    nome: 'Dra. Ana Paula Costa',
    crm: 'CRM/SP 654321',
    especialidade: 'Endocrinologia',
    telefone: '(11) 99999-2222',
    email: 'ana.costa@clinica.com',
    horarioAtendimento: [
      'Segunda: 14:00-18:00',
      'Quarta: 08:00-12:00',
      'Sexta: 14:00-18:00',
    ],
    valorConsulta: 180.0,
    ativo: true,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
  },
  {
    id: '3',
    nome: 'Dr. Pedro Santos Lima',
    crm: 'CRM/SP 789123',
    especialidade: 'Obstetrícia',
    telefone: '(11) 99999-3333',
    email: 'pedro.lima@clinica.com',
    horarioAtendimento: [
      'Terça: 08:00-12:00',
      'Quinta: 14:00-18:00',
      'Sábado: 08:00-12:00',
    ],
    valorConsulta: 220.0,
    ativo: false,
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
  },
]

export default function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>(mockMedicos)
  const [filteredMedicos, setFilteredMedicos] = useState<Medico[]>(mockMedicos)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [especialidadeFilter, setEspecialidadeFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view')
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null)

  useEffect(() => {
    loadMedicos()
  }, [])

  useEffect(() => {
    filterMedicos()
  }, [searchTerm, especialidadeFilter, statusFilter, medicos])

  const loadMedicos = async () => {
    setLoading(true)
    try {
      const result = await getMedicosAction()
      if (result.success) {
        setMedicos(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar médicos:', error)
      // Usar mock data em caso de erro
      setMedicos(mockMedicos)
    } finally {
      setLoading(false)
    }
  }

  const filterMedicos = () => {
    let filtered = medicos

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (medico) =>
          medico.nome.toLowerCase().includes(term) ||
          medico.crm.toLowerCase().includes(term) ||
          medico.especialidade.toLowerCase().includes(term) ||
          medico.email?.toLowerCase().includes(term)
      )
    }

    if (especialidadeFilter) {
      filtered = filtered.filter(
        (medico) => medico.especialidade === especialidadeFilter
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((medico) =>
        statusFilter === 'ativo' ? medico.ativo : !medico.ativo
      )
    }

    setFilteredMedicos(filtered)
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const result = await toggleMedicoStatusAction(id)
      if (result.success) {
        setMedicos((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ativo: !m.ativo } : m))
        )
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este médico?')) return

    try {
      const result = await deleteMedicoAction(id)
      if (result.success) {
        setMedicos((prev) => prev.filter((m) => m.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir médico:', error)
    }
  }

  const handleView = (medico: Medico) => {
    setSelectedMedico(medico)
    setModalMode('view')
    setShowModal(true)
  }

  const handleEdit = (medico: Medico) => {
    setSelectedMedico(medico)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleCreate = () => {
    setSelectedMedico(null)
    setModalMode('create')
    setShowModal(true)
  }

  const especialidades = Array.from(
    new Set(medicos.map((m) => m.especialidade))
  )

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
          <h1 className="text-2xl font-bold text-gray-900">Médicos</h1>
          <p className="text-gray-600">Gerencie o corpo médico da clínica</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700"
        >
          + Novo Médico
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
              placeholder="Nome, CRM, especialidade..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Especialidade
            </label>
            <select
              value={especialidadeFilter}
              onChange={(e) => setEspecialidadeFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todas</option>
              {especialidades.map((especialidade) => (
                <option key={especialidade} value={especialidade}>
                  {especialidade}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('')
                setEspecialidadeFilter('')
                setStatusFilter('')
              }}
              variant="outline"
              className="w-full"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </AnimatedDiv>

      {/* Lista de Médicos */}
      {filteredMedicos.length === 0 ? (
        <AnimatedDiv className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">👩‍⚕️</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {searchTerm || especialidadeFilter || statusFilter
              ? 'Nenhum médico encontrado'
              : 'Nenhum médico cadastrado'}
          </h3>
          <p className="mb-6 text-gray-600">
            {searchTerm || especialidadeFilter || statusFilter
              ? 'Tente ajustar os filtros para encontrar médicos.'
              : 'Comece cadastrando seu primeiro médico.'}
          </p>
          {!searchTerm && !especialidadeFilter && !statusFilter && (
            <Button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-700"
            >
              + Cadastrar Primeiro Médico
            </Button>
          )}
        </AnimatedDiv>
      ) : (
        <div className="grid gap-4">
          {filteredMedicos.map((medico, index) => (
            <AnimatedDiv
              key={medico.id}
              delay={index * 0.1}
              className="rounded-lg border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <div className="mb-2 flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                          <span className="font-semibold text-green-600">
                            {medico.nome
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {medico.nome}
                          </h3>
                          <p className="text-sm text-gray-600">{medico.crm}</p>
                          <div className="mt-1">
                            {medico.ativo ? (
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
                        <span className="font-medium">Especialidade:</span>{' '}
                        {medico.especialidade}
                      </p>
                      <p className="mb-1 text-sm text-gray-600">
                        <span className="font-medium">Telefone:</span>{' '}
                        {medico.telefone}
                      </p>
                      {medico.email && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span>{' '}
                          {medico.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="mb-2 text-lg font-bold text-gray-900">
                        R$ {medico.valorConsulta.toFixed(2)}
                      </p>
                      <div className="text-sm text-gray-600">
                        <p className="mb-1 font-medium">Horários:</p>
                        {medico.horarioAtendimento
                          .slice(0, 2)
                          .map((horario, idx) => (
                            <p key={idx} className="text-xs">
                              {horario}
                            </p>
                          ))}
                        {medico.horarioAtendimento.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{medico.horarioAtendimento.length - 2} mais...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(medico)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(medico)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleToggleStatus(medico.id)}
                      className={
                        medico.ativo
                          ? 'bg-yellow-600 text-xs hover:bg-yellow-700'
                          : 'bg-green-600 text-xs hover:bg-green-700'
                      }
                    >
                      {medico.ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(medico.id)}
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
            ? 'Novo Médico'
            : modalMode === 'edit'
              ? 'Editar Médico'
              : 'Detalhes do Médico'
        }
        size="lg"
      >
        <div className="space-y-4">
          {modalMode === 'view' && selectedMedico && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">
                  Dados Profissionais
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Nome:</span>{' '}
                    {selectedMedico.nome}
                  </p>
                  <p>
                    <span className="font-medium">CRM:</span>{' '}
                    {selectedMedico.crm}
                  </p>
                  <p>
                    <span className="font-medium">Especialidade:</span>{' '}
                    {selectedMedico.especialidade}
                  </p>
                  <p>
                    <span className="font-medium">Valor Consulta:</span> R${' '}
                    {selectedMedico.valorConsulta.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        selectedMedico.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedMedico.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Contato</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Telefone:</span>{' '}
                    {selectedMedico.telefone}
                  </p>
                  {selectedMedico.email && (
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      {selectedMedico.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Horários de Atendimento
                </h4>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {selectedMedico.horarioAtendimento.map((horario, index) => (
                    <div key={index} className="rounded bg-gray-50 p-2 text-sm">
                      {horario}
                    </div>
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
                {modalMode === 'create' ? 'cadastro' : 'edição'} de médicos será
                implementado em breve.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
