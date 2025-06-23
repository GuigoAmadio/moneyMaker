import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import ServiceCard from '@/components/cards/ServiceCard'

const services = [
  {
    id: '1',
    clientId: 'moneymaker',
    name: 'Desenvolvimento Web',
    description:
      'Criamos sites modernos, responsivos e otimizados para conversão. Utilizamos as melhores tecnologias como React, Next.js, e TypeScript para garantir performance e escalabilidade.',
    price: 2500,
    duration: 2400, // 40 horas em minutos
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    clientId: 'moneymaker',
    name: 'Aplicativos Mobile',
    description:
      'Desenvolvemos aplicativos nativos e híbridos para iOS e Android. Focamos na experiência do usuário e performance para garantir o sucesso do seu app.',
    price: 5000,
    duration: 4800, // 80 horas em minutos
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    clientId: 'moneymaker',
    name: 'Design UI/UX',
    description:
      'Criamos interfaces intuitivas e atrativas que encantam os usuários. Nosso processo inclui pesquisa, prototipagem e testes de usabilidade.',
    price: 1800,
    duration: 1800, // 30 horas em minutos
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    clientId: 'moneymaker',
    name: 'Consultoria Digital',
    description:
      'Assessoria completa para transformação digital da sua empresa. Analisamos processos, identificamos oportunidades e criamos estratégias personalizadas.',
    price: 1500,
    duration: 1200, // 20 horas em minutos
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '5',
    clientId: 'moneymaker',
    name: 'E-commerce',
    description:
      'Plataformas de vendas online completas e seguras. Integração com meios de pagamento, gestão de estoque e ferramentas de marketing.',
    price: 4000,
    duration: 3600, // 60 horas em minutos
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '6',
    clientId: 'moneymaker',
    name: 'Sistemas Web',
    description:
      'Desenvolvemos sistemas personalizados para automatizar e otimizar os processos da sua empresa. Dashboards, CRMs, ERPs e muito mais.',
    price: 6000,
    duration: 6000, // 100 horas em minutos
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

const process = [
  {
    step: '01',
    title: 'Briefing e Análise',
    description:
      'Entendemos suas necessidades e objetivos para criar a melhor solução.',
  },
  {
    step: '02',
    title: 'Planejamento',
    description:
      'Definimos escopo, cronograma e tecnologias a serem utilizadas.',
  },
  {
    step: '03',
    title: 'Desenvolvimento',
    description:
      'Colocamos a mão na massa com atualizações constantes do progresso.',
  },
  {
    step: '04',
    title: 'Testes e Entrega',
    description: 'Testamos tudo minuciosamente antes de entregar seu projeto.',
  },
  {
    step: '05',
    title: 'Suporte',
    description:
      'Oferecemos suporte contínuo para garantir o sucesso do seu projeto.',
  },
]

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Nossos Serviços
            </h1>
            <p className="mb-8 text-xl text-primary-100">
              Soluções digitais completas para impulsionar seu negócio
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Nosso Processo
            </h2>
            <p className="text-xl text-gray-600">
              Um processo estruturado para garantir o sucesso do seu projeto
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {process.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Vamos Conversar Sobre Seu Projeto?
          </h2>
          <p className="mb-8 text-xl text-primary-100">
            Entre em contato conosco e receba uma proposta personalizada
          </p>
          <Button
            size="lg"
            className="bg-white text-primary-600 hover:bg-primary-50"
          >
            <Link href="/contato" className="flex items-center gap-2">
              Solicitar Orçamento
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
