import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { cookies } from 'next/headers'
import type { ApiResponse, ApiError } from '@/types'

// Configuração da API
const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    'http://localhost:3001/api/v1',
  timeout: 30000,
  defaultClientId:
    process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || 'clnt_01h3m5k8y7x9p2q3r4s5t6u7v8w9',
}

// Tipos para configuração de tenant/cliente
interface TenantConfig {
  clientId: string
  token?: string
}

// Armazenamento do tenant atual (client-side)
let currentTenant: TenantConfig | null = null

// Função para definir o tenant atual
export function setCurrentTenant(clientId: string, token?: string) {
  currentTenant = { clientId, token }

  // Salvar no localStorage se estiver no browser
  if (typeof window !== 'undefined') {
    localStorage.setItem('current_client_id', clientId)
    if (token) {
      localStorage.setItem('auth_token', token)
    }
  }
}

// Função para obter o tenant atual
export function getCurrentTenant(): TenantConfig | null {
  if (currentTenant) {
    return currentTenant
  }

  // Tentar recuperar do localStorage
  if (typeof window !== 'undefined') {
    const clientId = localStorage.getItem('current_client_id')
    const token = localStorage.getItem('auth_token')

    if (clientId) {
      currentTenant = { clientId, token: token || undefined }
      return currentTenant
    }
  }

  return null
}

// Função para obter headers padrão
function getDefaultHeaders(config?: {
  clientId?: string
  token?: string
}): Record<string, string> {
  const tenant = getCurrentTenant()
  const clientId =
    config?.clientId || tenant?.clientId || API_CONFIG.defaultClientId
  const token = config?.token || tenant?.token

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-client-id': clientId,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

// Função para obter headers em Server Actions
async function getServerHeaders(): Promise<Record<string, string>> {
  try {
    const { cookies: getCookies } = await import('next/headers')
    const cookieStore = getCookies()

    const token = cookieStore.get('auth_token')?.value
    const clientId =
      cookieStore.get('client_id')?.value || API_CONFIG.defaultClientId

    console.log('🔍 Debug Server Headers:')
    console.log('- Token presente:', !!token)
    console.log('- Client ID:', clientId)
    console.log(
      '- Token (primeiros 20 chars):',
      token ? token.substring(0, 20) + '...' : 'N/A'
    )

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-client-id': clientId,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    } else {
      console.warn('⚠️ Token não encontrado nos cookies!')
    }

    console.log('📤 Headers enviados:', Object.keys(headers))
    return headers
  } catch (error) {
    console.error('❌ Erro ao obter headers do servidor:', error)
    return {
      'Content-Type': 'application/json',
      'x-client-id': API_CONFIG.defaultClientId,
    }
  }
}

// Instância do axios configurada
export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
})

// Interceptor para requisições (adicionar headers obrigatórios)
api.interceptors.request.use(
  (config) => {
    // Aplicar headers padrão
    const defaultHeaders = getDefaultHeaders()
    Object.assign(config.headers, defaultHeaders)

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para respostas (tratamento de erros e refresh de token)
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Retornar os dados da resposta diretamente
    return response.data
  },
  async (error) => {
    const originalRequest = error.config

    // Se erro 401 e não é retry, tentar refresh do token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('refresh_token')
            : null

        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.baseURL}/auth/refresh`,
            {
              refresh_token: refreshToken,
            },
            {
              headers: getDefaultHeaders(),
            }
          )

          const { token, refresh_token } = response.data.data

          // Atualizar tokens
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token)
            localStorage.setItem('refresh_token', refresh_token)
          }

          // Atualizar tenant atual
          const tenant = getCurrentTenant()
          if (tenant) {
            setCurrentTenant(tenant.clientId, token)
          }

          // Repetir requisição original com novo token
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Erro ao renovar token:', refreshError)
      }

      // Se falhou o refresh, redirecionar para login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('current_client_id')
        window.location.href = '/login'
      }
    }

    // Formatar erro da API
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Erro interno do servidor',
      code: error.response?.status?.toString() || 'UNKNOWN_ERROR',
      details: error.response?.data,
    }

    return Promise.reject(apiError)
  }
)

// Funções auxiliares para chamadas da API (client-side)
export async function get<T>(
  url: string,
  config?: { clientId?: string; token?: string }
): Promise<ApiResponse<T>> {
  const headers = getDefaultHeaders(config)
  return api.get(url, { headers })
}

export async function post<T>(
  url: string,
  data?: any,
  config?: { clientId?: string; token?: string }
): Promise<ApiResponse<T>> {
  const headers = getDefaultHeaders(config)
  return api.post(url, data, { headers })
}

export async function put<T>(
  url: string,
  data?: any,
  config?: { clientId?: string; token?: string }
): Promise<ApiResponse<T>> {
  const headers = getDefaultHeaders(config)
  return api.put(url, data, { headers })
}

export async function del<T>(
  url: string,
  config?: { clientId?: string; token?: string }
): Promise<ApiResponse<T>> {
  const headers = getDefaultHeaders(config)
  return api.delete(url, { headers })
}

// Funções para Server Actions (usando fetch)
export async function serverFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = await getServerHeaders()

  console.log(`📡 Server Fetch para: ${API_CONFIG.baseURL}${url}`)
  console.log('📡 Headers enviados:', headers)
  console.log('📡 Body enviado:', options.body)

  const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })

  console.log('📡 Status da resposta:', response.status)
  console.log(
    '📡 Headers da resposta:',
    Object.fromEntries(response.headers.entries())
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error('📡 Erro na resposta:', error)
    throw {
      message: error.message || 'Erro interno do servidor',
      code: response.status.toString(),
      details: error,
    } as ApiError
  }

  const responseData = await response.json()
  console.log('📡 Dados recebidos:', JSON.stringify(responseData, null, 2))

  return responseData
}

export async function serverGet<T>(url: string): Promise<ApiResponse<T>> {
  return serverFetch<T>(url, { method: 'GET', cache: 'no-store' })
}

export async function serverPost<T>(
  url: string,
  data?: any
): Promise<ApiResponse<T>> {
  return serverFetch<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    cache: 'no-store',
  })
}

export async function serverPut<T>(
  url: string,
  data?: any
): Promise<ApiResponse<T>> {
  return serverFetch<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
    cache: 'no-store',
  })
}

export async function serverDelete<T>(url: string): Promise<ApiResponse<T>> {
  return serverFetch<T>(url, { method: 'DELETE', cache: 'no-store' })
}

// Função para upload de arquivos
export async function uploadFile(
  url: string,
  file: File,
  onProgress?: (progress: number) => void,
  config?: { clientId?: string; token?: string }
): Promise<ApiResponse<any>> {
  const formData = new FormData()
  formData.append('file', file)

  const tenant = getCurrentTenant()
  const clientId =
    config?.clientId || tenant?.clientId || API_CONFIG.defaultClientId
  const token = config?.token || tenant?.token

  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-client-id': clientId,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress(progress)
      }
    },
  })
}

// Função para limpar dados de autenticação
export function clearAuth() {
  currentTenant = null

  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('current_client_id')
  }
}

// Hook para verificar se há conexão com o backend
export async function checkBackendConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/health`, {
      method: 'GET',
      headers: { 'x-client-id': API_CONFIG.defaultClientId },
    })
    return response.ok
  } catch {
    return false
  }
}
