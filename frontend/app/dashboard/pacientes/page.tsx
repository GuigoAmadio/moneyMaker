'use client'

import { useState, useEffect } from 'react'
import AnimatedDiv from '@/components/animations/AnimatedDiv'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import {
  getPacientesAction,
  deletePacienteAction,
  type CreatePacienteInput,
} from '@/actions/pacientes'
import type { Paciente } from '@/types'

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sexoFilter, setSexoFilter] = useState<string>('')
  const [convenioFilter, setConvenioFilter] = useState<string>('')

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view')
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(
    null
  )

  useEffect(() => {
    loadPacientes()
  }, [])

  useEffect(() => {
    filterPacientes()
  }, [searchTerm, sexoFilter, convenioFilter, pacientes])

  const loadPacientes = async () => {
    setLoading(true)
    try {
      const result = await getPacientesAction()
      if (result.success && result.data) {
        setPacientes(result.data as Paciente[])
      } else {
        console.error('Erro ao carregar pacientes:', result.error)
        setPacientes([])
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error)
      setPacientes([])
    } finally {
      setLoading(false)
    }
  }

  const filterPacientes = () => {
    let filtered = pacientes

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (paciente) =>
          paciente.nome.toLowerCase().includes(term) ||
          paciente.cpf.includes(term) ||
          paciente.telefone.includes(term) ||
          paciente.email?.toLowerCase().includes(term)
      )
    }

    if (sexoFilter) {
      filtered = filtered.filter((paciente) => paciente.sexo === sexoFilter)
    }

    if (convenioFilter) {
      if (convenioFilter === 'particular') {
        filtered = filtered.filter((paciente) => !paciente.convenio)
      } else {
        filtered = filtered.filter(
          (paciente) => paciente.convenio === convenioFilter
        )
      }
    }

    setFilteredPacientes(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este paciente?')) return

    try {
      const result = await deletePacienteAction(id)
      if (result.success) {
        setPacientes((prev) => prev.filter((p) => p.id !== id))
      } else {
        alert('Erro ao excluir paciente: ' + result.error)
      }
    } catch (error) {
      console.error('Erro ao excluir paciente:', error)
      alert('Erro ao excluir paciente')
    }
  }

  const handleView = (paciente: Paciente) => {
    setSelectedPaciente(paciente)
    setModalMode('view')
    setShowModal(true)
  }

  const handleEdit = (paciente: Paciente) => {
    setSelectedPaciente(paciente)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleCreate = () => {
    setSelectedPaciente(null)
    setModalMode('create')
    setShowModal(true)
  }

  const getIdade = (dataNascimento: string) => {
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mesAtual = hoje.getMonth()
    const mesNascimento = nascimento.getMonth()
    if (
      mesAtual < mesNascimento ||
      (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
    ) {
      idade--
    }
    return idade
  }

  const convenios = Array.from(
    new Set(pacientes.filter((p) => p.convenio).map((p) => p.convenio))
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
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600">Gerencie os pacientes da clínica</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700"
        >
          + Novo Paciente
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
              placeholder="Nome, CPF, telefone ou email..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Sexo
            </label>
            <select
              value={sexoFilter}
              onChange={(e) => setSexoFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Convênio
            </label>
            <select
              value={convenioFilter}
              onChange={(e) => setConvenioFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos</option>
              <option value="particular">Particular</option>
              {convenios.map((convenio) => (
                <option key={convenio} value={convenio}>
                  {convenio}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('')
                setSexoFilter('')
                setConvenioFilter('')
              }}
              variant="outline"
              className="w-full"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </AnimatedDiv>

      {/* Lista de Pacientes */}
      {filteredPacientes.length === 0 ? (
        <AnimatedDiv className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">👥</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {searchTerm || sexoFilter || convenioFilter
              ? 'Nenhum paciente encontrado'
              : 'Nenhum paciente cadastrado'}
          </h3>
          <p className="mb-6 text-gray-600">
            {searchTerm || sexoFilter || convenioFilter
              ? 'Tente ajustar os filtros para encontrar pacientes.'
              : 'Comece cadastrando seu primeiro paciente.'}
          </p>
          {!searchTerm && !sexoFilter && !convenioFilter && (
            <Button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-700"
            >
              + Cadastrar Primeiro Paciente
            </Button>
          )}
        </AnimatedDiv>
      ) : (
        <div className="grid gap-4">
          {filteredPacientes.map((paciente, index) => (
            <AnimatedDiv
              key={paciente.id}
              delay={index * 0.1}
              className="rounded-lg border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <div className="mb-2 flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <span className="font-semibold text-green-600">
                            {paciente.nome
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {paciente.nome}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {getIdade(paciente.dataNascimento)} anos •{' '}
                            {paciente.sexo}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-gray-600">
                        <span className="font-medium">CPF:</span> {paciente.cpf}
                      </p>
                      <p className="mb-1 text-sm text-gray-600">
                        <span className="font-medium">Telefone:</span>{' '}
                        {paciente.telefone}
                      </p>
                      {paciente.email && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span>{' '}
                          {paciente.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="mb-2">
                        {paciente.convenio ? (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {paciente.convenio}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            Particular
                          </span>
                        )}
                      </div>
                      {paciente.observacoes && (
                        <p
                          className="truncate text-sm text-gray-600"
                          title={paciente.observacoes}
                        >
                          <span className="font-medium">Obs:</span>{' '}
                          {paciente.observacoes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(paciente)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(paciente)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(paciente.id)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
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
            ? 'Novo Paciente'
            : modalMode === 'edit'
              ? 'Editar Paciente'
              : 'Detalhes do Paciente'
        }
        size="lg"
      >
        <div className="space-y-4">
          {modalMode === 'view' && selectedPaciente && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">
                  Dados Pessoais
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Nome:</span>{' '}
                    {selectedPaciente.nome}
                  </p>
                  <p>
                    <span className="font-medium">CPF:</span>{' '}
                    {selectedPaciente.cpf}
                  </p>
                  <p>
                    <span className="font-medium">RG:</span>{' '}
                    {selectedPaciente.rg}
                  </p>
                  <p>
                    <span className="font-medium">Data de Nascimento:</span>{' '}
                    {new Date(
                      selectedPaciente.dataNascimento
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Sexo:</span>{' '}
                    {selectedPaciente.sexo}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Contato</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Telefone:</span>{' '}
                    {selectedPaciente.telefone}
                  </p>
                  {selectedPaciente.email && (
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      {selectedPaciente.email}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Endereço:</span>{' '}
                    {selectedPaciente.endereco}
                  </p>
                  <p>
                    <span className="font-medium">Bairro:</span>{' '}
                    {selectedPaciente.bairro}
                  </p>
                  <p>
                    <span className="font-medium">Cidade/UF:</span>{' '}
                    {selectedPaciente.cidade}/{selectedPaciente.estado}
                  </p>
                  <p>
                    <span className="font-medium">CEP:</span>{' '}
                    {selectedPaciente.cep}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Convênio</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Plano:</span>{' '}
                    {selectedPaciente.convenio || 'Particular'}
                  </p>
                  {selectedPaciente.numeroCarterinha && (
                    <p>
                      <span className="font-medium">Nº Carteirinha:</span>{' '}
                      {selectedPaciente.numeroCarterinha}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Emergência</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Contato:</span>{' '}
                    {selectedPaciente.contatoEmergencia}
                  </p>
                  <p>
                    <span className="font-medium">Telefone:</span>{' '}
                    {selectedPaciente.telefoneEmergencia}
                  </p>
                </div>
              </div>
              {selectedPaciente.observacoes && (
                <div className="md:col-span-2">
                  <h4 className="mb-3 font-semibold text-gray-900">
                    Observações
                  </h4>
                  <p className="text-sm text-gray-700">
                    {selectedPaciente.observacoes}
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
                {modalMode === 'create' ? 'criação' : 'edição'} de pacientes
                será implementado em breve.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
