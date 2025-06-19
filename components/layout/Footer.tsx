import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Contato', href: '/contato' },
]

const services = [
  { name: 'Desenvolvimento Web', href: '/servicos' },
  { name: 'Aplicativos Mobile', href: '/servicos' },
  { name: 'Design UI/UX', href: '/servicos' },
  { name: 'Consultoria Digital', href: '/servicos' },
]

const contact = [
  {
    icon: Mail,
    label: 'contato@moneymaker.com.br',
    href: 'mailto:contato@moneymaker.com.br',
  },
  {
    icon: Phone,
    label: '(11) 99999-9999',
    href: 'tel:+5511999999999',
  },
  {
    icon: MapPin,
    label: 'São Paulo, SP',
    href: '#',
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">MoneyMaker</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Especialistas em desenvolvimento web, mobile e consultoria digital.
              Transformamos suas ideias em realidade digital.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              {contact.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} MoneyMaker. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
} 