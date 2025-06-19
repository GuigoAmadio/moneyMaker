'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { isAuthenticationEnabled } from '@/lib/auth-config'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Contato', href: '/contato' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const authEnabled = isAuthenticationEnabled()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-xl font-bold text-transparent">
              MoneyMaker
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600',
                  isActive(item.href) ? 'text-primary-600' : 'text-gray-600'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center space-x-4 md:flex">
            {authEnabled && (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}
            {!authEnabled && (
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="border border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                >
                  🚀 Dashboard (Dev)
                </Button>
              </Link>
            )}
            <Link href="/contato">
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg hover:from-primary-700 hover:to-secondary-700"
              >
                Começar Projeto
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="space-y-2 pt-2">
                {authEnabled && (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      Login
                    </Button>
                  </Link>
                )}
                {!authEnabled && (
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start border border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                    >
                      🚀 Dashboard (Dev)
                    </Button>
                  </Link>
                )}
                <Link href="/contato" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg hover:from-primary-700 hover:to-secondary-700"
                  >
                    Começar Projeto
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
