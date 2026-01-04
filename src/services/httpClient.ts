import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/config'

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Request interceptor (add auth tokens, etc.)
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization header if token exists
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (handle errors globally)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, 500, etc.)
    // if (error.response?.status === 401) {
    //   // Redirect to login or refresh token
    // }
    return Promise.reject(error)
  }
)

export const httpClient = {
  get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.get<T>(endpoint, config).then(res => res.data)
  },

  post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.post<T>(endpoint, data, config).then(res => res.data)
  },

  put<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.put<T>(endpoint, data, config).then(res => res.data)
  },

  patch<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.patch<T>(endpoint, data, config).then(res => res.data)
  },

  delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.delete<T>(endpoint, config).then(res => res.data)
  }
}

// Export the raw axios instance for advanced use cases
export { axiosInstance }
