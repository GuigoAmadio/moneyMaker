'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { loginAction } from '@/actions/auth'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const result = await loginAction(data)
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        setSubmitMessage(result.message)
      }
    } catch (error) {
      setSubmitMessage('Erro interno. Tente novamente mais tarde.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">MoneyMaker</span>
        </Link>

        <h2 className="text-center text-3xl font-bold text-gray-900">
          Acesse sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Faça login para acessar o painel administrativo
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {submitMessage && (
            <div className="mb-6 p-4 rounded-md bg-red-50 text-red-800 border border-red-200">
              {submitMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                ← Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
