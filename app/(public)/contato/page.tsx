'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'
import { contactSchema, type ContactInput } from '@/lib/validations'
import { sendContactAction } from '@/actions/contact'
import Button from '@/components/ui/Button'
import AnimatedDiv, {
  AnimatedContainer,
} from '@/components/animations/AnimatedDiv'

const services = [
  'Desenvolvimento Web',
  'Aplicativos Mobile',
  'Design UI/UX',
  'Consultoria Digital',
  'E-commerce',
  'Sistemas Web',
  'Outro',
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const result = await sendContactAction(data)

      if (result.success) {
        setSubmitMessage(result.message)
        reset()
      } else {
        setSubmitMessage(result.message)
      }
    } catch (error) {
      setSubmitMessage('Erro interno. Tente novamente mais tarde.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      description: 'contato@moneymaker.com.br',
      color: 'bg-primary-100 text-primary-600',
    },
    {
      icon: Phone,
      title: 'Telefone',
      description: '(11) 99999-9999',
      color: 'bg-secondary-100 text-secondary-600',
    },
    {
      icon: MapPin,
      title: 'Localização',
      description: 'São Paulo, SP',
      color: 'bg-green-100 text-green-600',
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 py-20 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative mx-auto px-4">
          <AnimatedDiv animationType="fadeIn" delay={0.2}>
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">
                Entre em <span className="text-secondary-300">Contato</span>
              </h1>
              <p className="mb-8 text-xl text-primary-100">
                Vamos conversar sobre seu próximo projeto digital
              </p>
            </div>
          </AnimatedDiv>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-secondary-500/20 blur-3xl"></div>
        <div className="absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-primary-400/20 blur-3xl"></div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <AnimatedDiv animationType="slideLeft" delay={0.2}>
              <div>
                <h2 className="mb-6 text-3xl font-bold text-gray-900">
                  Fale <span className="text-primary-600">Conosco</span>
                </h2>
                <p className="mb-8 text-lg text-gray-600">
                  Estamos prontos para ajudar você a transformar suas ideias em
                  realidade digital. Entre em contato e vamos conversar sobre
                  seu projeto.
                </p>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <AnimatedDiv
                      key={info.title}
                      animationType="scale"
                      delay={0.3 + index * 0.1}
                      whileHover={true}
                    >
                      <div className="group flex items-center gap-4 rounded-lg p-4 transition-all duration-300 hover:bg-gray-50">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-lg ${info.color} transition-transform duration-300 group-hover:scale-110`}
                        >
                          <info.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {info.title}
                          </h3>
                          <p className="text-gray-600">{info.description}</p>
                        </div>
                      </div>
                    </AnimatedDiv>
                  ))}
                </div>

                <AnimatedDiv animationType="slideUp" delay={0.6}>
                  <div className="mt-8 rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Por que nos escolher?
                      </h3>
                    </div>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Resposta rápida em até 24h</li>
                      <li>• Orçamento gratuito e detalhado</li>
                      <li>• Acompanhamento personalizado</li>
                      <li>• Tecnologias modernas e atualizadas</li>
                    </ul>
                  </div>
                </AnimatedDiv>
              </div>
            </AnimatedDiv>

            {/* Contact Form */}
            <AnimatedDiv animationType="slideRight" delay={0.3}>
              <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-xl">
                <h3 className="mb-6 text-2xl font-bold text-gray-900">
                  Solicite um{' '}
                  <span className="text-secondary-600">Orçamento</span>
                </h3>

                {submitMessage && (
                  <AnimatedDiv animationType="slideDown">
                    <div
                      className={`mb-6 rounded-lg p-4 ${
                        submitMessage.includes('sucesso')
                          ? 'border border-green-200 bg-green-50 text-green-800'
                          : 'border border-red-200 bg-red-50 text-red-800'
                      }`}
                    >
                      {submitMessage}
                    </div>
                  </AnimatedDiv>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <AnimatedDiv animationType="slideUp" delay={0.4}>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Nome *
                        </label>
                        <input
                          type="text"
                          {...register('name')}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          placeholder="Seu nome completo"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    </AnimatedDiv>

                    <AnimatedDiv animationType="slideUp" delay={0.5}>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <input
                          type="email"
                          {...register('email')}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          placeholder="seu@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </AnimatedDiv>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <AnimatedDiv animationType="slideUp" delay={0.6}>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          {...register('phone')}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          placeholder="(11) 99999-9999"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </AnimatedDiv>

                    <AnimatedDiv animationType="slideUp" delay={0.7}>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Empresa
                        </label>
                        <input
                          type="text"
                          {...register('company')}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          placeholder="Nome da sua empresa"
                        />
                      </div>
                    </AnimatedDiv>
                  </div>

                  <AnimatedDiv animationType="slideUp" delay={0.8}>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Serviço de Interesse *
                      </label>
                      <select
                        {...register('service')}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                      >
                        <option value="">Selecione um serviço</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                      {errors.service && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.service.message}
                        </p>
                      )}
                    </div>
                  </AnimatedDiv>

                  <AnimatedDiv animationType="slideUp" delay={0.9}>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Mensagem *
                      </label>
                      <textarea
                        {...register('message')}
                        rows={5}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                        placeholder="Conte-nos mais sobre seu projeto..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                  </AnimatedDiv>

                  <AnimatedDiv animationType="scale" delay={1.0}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Enviando...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Send className="h-5 w-5" />
                          Enviar Mensagem
                        </div>
                      )}
                    </Button>
                  </AnimatedDiv>
                </form>
              </div>
            </AnimatedDiv>
          </div>
        </div>
      </section>
    </div>
  )
}
