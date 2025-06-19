import axios from 'axios'
import type { ApiResponse, ApiError } from '@/types'

// Instância do axios configurada
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para requisições (adicionar token de auth)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para respostas (tratamento de erros)
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Erro interno do servidor',
      code: error.response?.status?.toString() || 'UNKNOWN_ERROR',
      details: error.response?.data,
    }

    // Redirecionar para login se token expirado
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }

    return Promise.reject(apiError)
  }
)

// Funções auxiliares para chamadas da API
export async function get<T>(url: string): Promise<ApiResponse<T>> {
  return api.get(url)
}

export async function post<T>(
  url: string,
  data?: any
): Promise<ApiResponse<T>> {
  return api.post(url, data)
}

export async function put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
  return api.put(url, data)
}

export async function del<T>(url: string): Promise<ApiResponse<T>> {
  return api.delete(url)
}

// Função para upload de arquivos
export async function uploadFile(
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<any>> {
  const formData = new FormData()
  formData.append('file', file)

  return api.post(url, formData, {
    headers: {
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