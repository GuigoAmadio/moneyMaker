import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, Target, Shield } from 'lucide-react'
import Button from '@/components/ui/Button'
import ServiceCard from '@/components/cards/ServiceCard'
import AnimatedDiv, {
  AnimatedContainer,
} from '@/components/animations/AnimatedDiv'

const services = [
  {
    id: '1',
    name: 'Desenvolvimento Web',
    description:
      'Criamos sites modernos e responsivos com as melhores tecnologias do mercado.',
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
    description:
      'Desenvolvemos aplicativos nativos e híbridos para iOS e Android.',
    price: 5000,
    duration: 80,
    category: 'mobile' as const,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Consultoria Digital',
    description:
      'Assessoria completa para transformação digital da sua empresa.',
    price: 1500,
    duration: 20,
    category: 'consultoria' as const,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

const benefits = [
  'Equipe especializada e experiente',
  'Tecnologias modernas e atualizadas',
  'Suporte contínuo após entrega',
  'Preços competitivos',
  'Prazos cumpridos rigorosamente',
  'Comunicação transparente',
]

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative mx-auto px-4 py-32">
          <div className="mx-auto max-w-5xl text-center">
            <AnimatedDiv animationType="fadeIn" delay={0.2}>
              <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
                Transforme Suas Ideias em{' '}
                <span className="bg-gradient-to-r from-secondary-400 to-secondary-200 bg-clip-text text-transparent">
                  Realidade Digital
                </span>
              </h1>
            </AnimatedDiv>

            <AnimatedDiv animationType="slideUp" delay={0.4}>
              <p className="mb-12 text-xl text-primary-100 md:text-2xl">
                Especialistas em desenvolvimento web, mobile e consultoria
                digital. Ajudamos sua empresa a crescer no mundo digital com
                soluções inovadoras e personalizadas.
              </p>
            </AnimatedDiv>

            <AnimatedDiv animationType="scale" delay={0.6}>
              <div className="flex flex-col justify-center gap-6 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-primary-50 hover:shadow-2xl"
                >
                  <Link href="/contato" className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Começar Projeto
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white bg-transparent text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-primary-600"
                >
                  <Link href="/servicos" className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Ver Serviços
                  </Link>
                </Button>
              </div>
            </AnimatedDiv>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-secondary-500/20 blur-3xl"></div>
        <div className="absolute right-0 top-1/4 h-48 w-48 rounded-full bg-primary-400/20 blur-3xl"></div>
      </section>

      {/* Services Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="container mx-auto px-4">
          <AnimatedDiv animationType="fadeIn">
            <div className="mb-20 text-center">
              <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
                Nossos <span className="text-primary-600">Serviços</span>
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                Oferecemos soluções completas e inovadoras para transformar sua
                presença digital e impulsionar seu negócio
              </p>
            </div>
          </AnimatedDiv>

          <AnimatedContainer animationType="slideUp">
            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <AnimatedDiv
                  key={service.id}
                  animationType="scale"
                  delay={index * 0.1}
                  whileHover={true}
                >
                  <ServiceCard service={service} />
                </AnimatedDiv>
              ))}
            </div>
          </AnimatedContainer>

          <AnimatedDiv animationType="slideUp" delay={0.4}>
            <div className="mt-16 text-center">
              <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <Link href="/servicos" className="flex items-center gap-2">
                  Ver Todos os Serviços
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimatedDiv>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50"></div>
        <div className="container relative mx-auto px-4">
          <AnimatedDiv animationType="fadeIn">
            <div className="mb-20 text-center">
              <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
                Por Que Escolher a{' '}
                <span className="text-secondary-600">MoneyMaker</span>?
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                Somos especialistas em transformar ideias em soluções digitais
                de sucesso com qualidade e inovação
              </p>
            </div>
          </AnimatedDiv>

          <div className="mx-auto max-w-6xl">
            <AnimatedContainer animationType="slideLeft">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {benefits.map((benefit, index) => (
                  <AnimatedDiv
                    key={index}
                    animationType="scale"
                    delay={index * 0.1}
                    className="group"
                  >
                    <div className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-600">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-lg font-semibold text-gray-900">
                          {benefit}
                        </span>
                      </div>
                    </div>
                  </AnimatedDiv>
                ))}
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 py-24 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative mx-auto px-4 text-center">
          <AnimatedDiv animationType="slideUp">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Pronto para <span className="text-secondary-200">Começar</span>{' '}
              Seu Projeto?
            </h2>
          </AnimatedDiv>

          <AnimatedDiv animationType="fadeIn" delay={0.2}>
            <p className="mb-10 text-xl text-primary-100 md:text-2xl">
              Entre em contato conosco e vamos transformar suas ideias em
              realidade digital de forma rápida e eficiente
            </p>
          </AnimatedDiv>

          <AnimatedDiv animationType="bounce" delay={0.4}>
            <Button
              size="lg"
              className="hover:shadow-3xl bg-white text-primary-600 shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-primary-50"
            >
              <Link href="/contato" className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Falar Conosco
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </AnimatedDiv>
        </div>

        {/* Decorative elements */}
        <div className="absolute -left-20 top-1/2 h-40 w-40 rounded-full bg-secondary-400/20 blur-3xl"></div>
        <div className="absolute -right-20 bottom-0 h-32 w-32 rounded-full bg-primary-400/20 blur-3xl"></div>
      </section>
    </div>
  )
}
