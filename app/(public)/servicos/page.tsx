import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import ServiceCard from '@/components/cards/ServiceCard'

const services = [
  {
    id: '1',
    name: 'Desenvolvimento Web',
    description: 'Criamos sites modernos, responsivos e otimizados para conversão. Utilizamos as melhores tecnologias como React, Next.js, e TypeScript para garantir performance e escalabilidade.',
    price: 2500,
    duration: 40,
    category: 'web' as const,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Aplicativos Mobile',
    description: 'Desenvolvemos aplicativos nativos e híbridos para iOS e Android. Focamos na experiência do usuário e performance para garantir o sucesso do seu app.',
    price: 5000,
    duration: 80,
    category: 'mobile' as const,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Design UI/UX',
    description: 'Criamos interfaces intuitivas e atrativas que encantam os usuários. Nosso processo inclui pesquisa, prototipagem e testes de usabilidade.',
    price: 1800,
    duration: 30,
    category: 'design' as const,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'Consultoria Digital',
    description: 'Assessoria completa para transformação digital da sua empresa. Analisamos processos, identificamos oportunidades e criamos estratégias personalizadas.',
    price: 1500,
    duration: 20,
    category: 'consultoria' as const,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '5',
    name: 'E-commerce',
    description: 'Plataformas de vendas online completas e seguras. Integração com meios de pagamento, gestão de estoque e ferramentas de marketing.',
    price: 4000,
    duration: 60,
    category: 'web' as const,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '6',
    name: 'Sistemas Web',
    description: 'Desenvolvemos sistemas personalizados para automatizar e otimizar os processos da sua empresa. Dashboards, CRMs, ERPs e muito mais.',
    price: 6000,
    duration: 100,
    category: 'web' as const,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

const process = [
  {
    step: '01',
    title: 'Briefing e Análise',
    description: 'Entendemos suas necessidades e objetivos para criar a melhor solução.',
  },
  {
    step: '02',
    title: 'Planejamento',
    description: 'Definimos escopo, cronograma e tecnologias a serem utilizadas.',
  },
  {
    step: '03',
    title: 'Desenvolvimento',
    description: 'Colocamos a mão na massa com atualizações constantes do progresso.',
  },
  {
    step: '04',
    title: 'Testes e Entrega',
    description: 'Testamos tudo minuciosamente antes de entregar seu projeto.',
  },
  {
    step: '05',
    title: 'Suporte',
    description: 'Oferecemos suporte contínuo para garantir o sucesso do seu projeto.',
  },
]

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nossos Serviços
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Soluções digitais completas para impulsionar seu negócio
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nosso Processo
            </h2>
            <p className="text-xl text-gray-600">
              Um processo estruturado para garantir o sucesso do seu projeto
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {process.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vamos Conversar Sobre Seu Projeto?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Entre em contato conosco e receba uma proposta personalizada
          </p>
          <Button
            size="lg"
            className="bg-white text-primary-600 hover:bg-primary-50"
          >
            <Link href="/contato" className="flex items-center gap-2">
              Solicitar Orçamento
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
} 