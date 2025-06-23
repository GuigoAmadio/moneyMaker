'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  DollarSign,
  Calendar,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import AnimatedDiv from '@/components/animations/AnimatedDiv'
import {
  getLeadsAction,
  deleteLeadAction,
  updateLeadStatusAction,
} from '@/actions/leads'
import type { Lead } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterInteresse, setFilterInteresse] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'view' | 'create' | 'edit'>('view')

  // Carregar leads do backend
  const loadLeads = async () => {
    setLoading(true)
    try {
      const result = await getLeadsAction()
      if (result.success && result.data) {
        setLeads(result.data as Lead[])
      } else {
        console.error('Erro ao carregar leads:', result.error)
        setLeads([])
      }
    } catch (error) {
      console.error('Erro ao carregar leads:', error)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  // Filtrar leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm)

    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus
    const matchesInteresse =
      filterInteresse === 'all' || lead.interesse === filterInteresse

    return matchesSearch && matchesStatus && matchesInteresse
  })

  const handleView = (lead: Lead) => {
    setSelectedLead(lead)
    setModalType('view')
    setShowModal(true)
  }

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead)
    setModalType('edit')
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lead?')) {
      try {
        const result = await deleteLeadAction(id)
        if (result.success) {
          setLeads(leads.filter((lead) => lead.id !== id))
        } else {
          alert('Erro ao excluir lead: ' + result.error)
        }
      } catch (error) {
        console.error('Erro ao excluir lead:', error)
        alert('Erro ao excluir lead')
      }
    }
  }

  const handleCreate = () => {
    setSelectedLead(null)
    setModalType('create')
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Novo':
        return 'bg-blue-100 text-blue-800'
      case 'Contactado':
        return 'bg-yellow-100 text-yellow-800'
      case 'Agendado':
        return 'bg-purple-100 text-purple-800'
      case 'Convertido':
        return 'bg-green-100 text-green-800'
      case 'Perdido':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getInteresseColor = (interesse: string) => {
    switch (interesse) {
      case 'Compra':
        return 'bg-green-100 text-green-800'
      case 'Aluguel':
        return 'bg-blue-100 text-blue-800'
      case 'Venda':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedDiv animation="fadeIn">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600">Gerencie seus leads e oportunidades</p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
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
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtro por status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os status</option>
              <option value="Novo">Novo</option>
              <option value="Contactado">Contactado</option>
              <option value="Agendado">Agendado</option>
              <option value="Convertido">Convertido</option>
              <option value="Perdido">Perdido</option>
            </select>

            {/* Filtro por interesse */}
            <select
              value={filterInteresse}
              onChange={(e) => setFilterInteresse(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os interesses</option>
              <option value="Compra">Compra</option>
              <option value="Aluguel">Aluguel</option>
              <option value="Venda">Venda</option>
            </select>

            {/* Stats rápidas */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">{filteredLeads.length}</span> leads
              encontrados
            </div>
          </div>
        </div>
      </AnimatedDiv>

      {/* Lista de Leads */}
      <AnimatedDiv animation="slideUp" delay={0.2}>
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Interesse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Orçamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredLeads.map((lead, index) => (
                  <AnimatedDiv
                    key={lead.id}
                    animation="fadeIn"
                    delay={0.3 + index * 0.05}
                    className="hover:bg-gray-50"
                  >
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {lead.nome}
                            </div>
                            <div className="text-sm text-gray-500">
                              Fonte: {lead.fonte}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Mail className="mr-1 h-4 w-4" />
                            {lead.email}
                          </div>
                          <div className="mt-1 flex items-center">
                            <Phone className="mr-1 h-4 w-4" />
                            {lead.telefone}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getInteresseColor(lead.interesse)}`}
                        >
                          {lead.interesse}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <DollarSign className="mr-1 h-4 w-4 text-green-600" />
                          {formatCurrency(lead.orcamento)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(lead.status)}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(lead)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(lead)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(lead.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </AnimatedDiv>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedDiv>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredLeads.length === 0 && (
        <div className="py-8 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum lead encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' || filterInteresse !== 'all'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando seu primeiro lead.'}
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalType === 'create'
            ? 'Novo Lead'
            : modalType === 'edit'
              ? 'Editar Lead'
              : 'Detalhes do Lead'
        }
        size="lg"
      >
        <div className="space-y-4">
          {modalType === 'view' && selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <p className="text-sm text-gray-900">{selectedLead.nome}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(selectedLead.status)}`}
                  >
                    {selectedLead.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedLead.telefone}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Interesse
                  </label>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getInteresseColor(selectedLead.interesse)}`}
                  >
                    {selectedLead.interesse}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Orçamento
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatCurrency(selectedLead.orcamento)}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Observações
                </label>
                <p className="text-sm text-gray-900">
                  {selectedLead.observacoes || 'Nenhuma observação'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fonte
                </label>
                <p className="text-sm text-gray-900">{selectedLead.fonte}</p>
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
                <Button className="bg-blue-600 hover:bg-blue-700">
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
