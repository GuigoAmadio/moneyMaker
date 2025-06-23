import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { cookies } from 'next/headers'
import type { ApiResponse, ApiError } from '@/types'

// Configuração da API otimizada
const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    'http://localhost:3001/api/v1', // Corrigido para porta 3001 do backend NestJS
  timeout: 5000, // Reduzido para 5 segundos
  defaultClientId:
    process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || 'clnt_imobiliaria_prime', // Usando o ID real do seed
}

// Cache simples para requisições
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 30000 // 30 segundos

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

// Função para obter headers padrão (otimizada)
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

// Função para obter headers em Server Actions (sem logs desnecessários)
async function getServerHeaders(): Promise<Record<string, string>> {
  try {
    const { cookies: getCookies } = await import('next/headers')
    const cookieStore = getCookies()

    const token = cookieStore.get('auth_token')?.value
    const clientId =
      cookieStore.get('client_id')?.value || API_CONFIG.defaultClientId

    // Logs apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Debug Server Headers:', { hasToken: !!token, clientId })
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-client-id': clientId,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Erro ao obter headers do servidor:', error)
    }
    return {
      'Content-Type': 'application/json',
      'x-client-id': API_CONFIG.defaultClientId,
    }
  }
}

// Instância do axios configurada e otimizada
export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
})

// Interceptor para requisições otimizado
api.interceptors.request.use(
  (config) => {
    const defaultHeaders = getDefaultHeaders()
    Object.assign(config.headers, defaultHeaders)
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para respostas otimizado
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error) => {
    // Tratamento de erro simplificado para melhor performance
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Erro interno do servidor',
      code: error.response?.status?.toString() || 'UNKNOWN_ERROR',
      details: error.response?.data,
    }

    return Promise.reject(apiError)
  }
)

// Função para verificar cache
function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

// Função para definir cache
function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// Funções de API otimizadas com cache
export async function get<T>(
  url: string,
  config?: { clientId?: string; token?: string; useCache?: boolean }
): Promise<ApiResponse<T>> {
  const cacheKey = `GET:${url}:${JSON.stringify(config)}`

  // Verificar cache se habilitado
  if (config?.useCache !== false) {
    const cached = getCachedData<ApiResponse<T>>(cacheKey)
    if (cached) return cached
  }

  const data = (await api.get<T>(url, {
    headers: getDefaultHeaders(config),
  })) as T

  const response: ApiResponse<T> = {
    success: true,
    data,
    message: 'Success',
  }

  // Salvar no cache
  if (config?.useCache !== false) {
    setCachedData(cacheKey, response)
  }

  return response
}

export async function post<T>(
  url: string,
  data?: any,
  config?: { clientId?: string; token?: string }
): Promise<ApiResponse<T>> {
  const responseData = (await api.post<T>(url, data, {
    headers: getDefaultHeaders(config),
  })) as T

  return {
    success: true,
    data: responseData,
    message: 'Success',
  }
}

export async function put<T>(
  url: string,
  data?: any,
  config?: { clientId?: string; token?: string }
): Promise<ApiResponse<T>> {
  const responseData = (await api.put<T>(url, data, {
    headers: getDefaultHeaders(config),
  })) as T

  return {
    success: true,
    data: responseData,
    message: 'Success',
  }
}

export async function del<T>(
  url: string,
  config?: { clientId?: string; token?: string }
): Promise<ApiResponse<T>> {
  const responseData = (await api.delete<T>(url, {
    headers: getDefaultHeaders(config),
  })) as T

  return {
    success: true,
    data: responseData,
    message: 'Success',
  }
}

// Server Actions otimizadas
export async function serverFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = await getServerHeaders()

  const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export async function serverGet<T>(url: string): Promise<ApiResponse<T>> {
  return serverFetch<T>(url, { method: 'GET' })
}

export async function serverPost<T>(
  url: string,
  data?: any
): Promise<ApiResponse<T>> {
  return serverFetch<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

export async function serverPut<T>(
  url: string,
  data?: any
): Promise<ApiResponse<T>> {
  return serverFetch<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

export async function serverDelete<T>(url: string): Promise<ApiResponse<T>> {
  return serverFetch<T>(url, { method: 'DELETE' })
}

// Upload de arquivo otimizado
export async function uploadFile(
  url: string,
  file: File,
  onProgress?: (progress: number) => void,
  config?: { clientId?: string; token?: string }
): Promise<ApiResponse<any>> {
  const formData = new FormData()
  formData.append('file', file)

  return api.post(url, formData, {
    headers: {
      ...getDefaultHeaders(config),
      'Content-Type': 'multipart/form-data',
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

// Função para limpar cache
export function clearCache(): void {
  cache.clear()
}

// Função para limpar autenticação
export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('current_client_id')
  }
  currentTenant = null
  clearCache()
}

// Função para verificar conexão com backend
export async function checkBackendConnection(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const response = await fetch(
      `${API_CONFIG.baseURL.replace('/api/v1', '')}/health`,
      {
        method: 'GET',
        signal: controller.signal,
      }
    )

    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    return false
  }
}
