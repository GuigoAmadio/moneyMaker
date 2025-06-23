'use client'

import Link from 'next/link'
import { ArrowRight, Clock, DollarSign, Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Service } from '@/types'
import Button from '@/components/ui/Button'

interface ServiceCardProps {
  service: Service
}

// Detectar categoria baseado no nome do serviço
const getServiceCategory = (name: string) => {
  const nameLower = name.toLowerCase()
  if (nameLower.includes('web') || nameLower.includes('site')) return 'web'
  if (nameLower.includes('mobile') || nameLower.includes('app')) return 'mobile'
  if (nameLower.includes('design') || nameLower.includes('ui')) return 'design'
  if (nameLower.includes('consultoria') || nameLower.includes('digital'))
    return 'consultoria'
  return 'web' // default
}

const categoryLabels = {
  web: 'Web',
  mobile: 'Mobile',
  design: 'Design',
  consultoria: 'Consultoria',
}

const categoryColors = {
  web: 'bg-secondary-100 text-secondary-800',
  mobile: 'bg-primary-100 text-primary-800',
  design: 'bg-purple-100 text-purple-800',
  consultoria: 'bg-orange-100 text-orange-800',
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const category = getServiceCategory(service.name)

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon & Category */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              categoryColors[category as keyof typeof categoryColors]
            }`}
          >
            {categoryLabels[category as keyof typeof categoryLabels]}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors group-hover:text-primary-600">
          {service.name}
        </h3>

        {/* Description */}
        <p className="mb-6 line-clamp-3 leading-relaxed text-gray-600">
          {service.description}
        </p>

        {/* Details */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-600">
            <DollarSign className="h-5 w-5" />
            <div>
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-2xl font-bold text-transparent">
                {formatCurrency(service.price)}
              </span>
              <p className="text-xs text-gray-500">A partir de</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {Math.floor(service.duration / 60)}h
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg transition-all duration-300 hover:from-primary-700 hover:to-secondary-700 group-hover:shadow-xl">
          <Link
            href="/contato"
            className="flex items-center justify-center gap-2"
          >
            Solicitar Orçamento
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      {/* Decorative gradient border */}
      <div
        className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20"
        style={{ padding: '1px' }}
      >
        <div className="h-full w-full rounded-2xl bg-white"></div>
      </div>
    </div>
  )
}
