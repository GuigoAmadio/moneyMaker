'use client'

import { User, Bell, Lock, Palette, Save } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { DevUserInfo } from '@/components/ui/DevModeIndicator'
import AnimatedDiv from '@/components/animations/AnimatedDiv'

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('perfil')

  const tabs = [
    { id: 'perfil', name: 'Perfil', icon: User },
    { id: 'notificacoes', name: 'Notificações', icon: Bell },
    { id: 'seguranca', name: 'Segurança', icon: Lock },
    { id: 'aparencia', name: 'Aparência', icon: Palette },
  ]

  return (
    <div className="space-y-6">
      <DevUserInfo />

      <AnimatedDiv animation="fadeIn">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">
              Gerencie suas preferências e configurações
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg hover:from-primary-700 hover:to-secondary-700">
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </AnimatedDiv>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <AnimatedDiv animation="slideLeft" delay={0.1}>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </AnimatedDiv>

        <div className="lg:col-span-3">
          {activeTab === 'perfil' && (
            <AnimatedDiv animation="slideRight" delay={0.2}>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-600">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Informações do Perfil
                    </h2>
                    <p className="text-gray-600">
                      Atualize suas informações pessoais
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      defaultValue="Desenvolvedor"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="dev@moneymaker.com.br"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </AnimatedDiv>
          )}

          {activeTab === 'notificacoes' && (
            <AnimatedDiv animation="slideRight" delay={0.2}>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  Preferências de Notificação
                </h2>
                <div className="space-y-4">
                  {[
                    'Novos Clientes',
                    'Agendamentos',
                    'Pagamentos',
                    'Relatórios',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                    >
                      <span className="font-medium text-gray-900">{item}</span>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          defaultChecked
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedDiv>
          )}

          {activeTab === 'seguranca' && (
            <AnimatedDiv animation="slideRight" delay={0.2}>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  Segurança
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </AnimatedDiv>
          )}

          {activeTab === 'aparencia' && (
            <AnimatedDiv animation="slideRight" delay={0.2}>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  Aparência
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="mb-4 block text-sm font-medium text-gray-700">
                      Tema
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          className="sr-only"
                          defaultChecked
                        />
                        <div className="rounded-xl border-2 border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
                          <div className="text-center text-sm font-medium text-gray-900">
                            Claro
                          </div>
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          className="sr-only"
                        />
                        <div className="rounded-xl border-2 border-gray-700 bg-gray-900 p-4 transition-shadow hover:shadow-md">
                          <div className="text-center text-sm font-medium text-white">
                            Escuro
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedDiv>
          )}
        </div>
      </div>
    </div>
  )
}
