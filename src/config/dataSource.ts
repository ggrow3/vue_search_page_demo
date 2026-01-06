// Toggle between 'mock' and 'api' data sources
// Set to 'mock' for local development with mock data
// Set to 'api' for real API integration
export type DataSourceType = 'mock' | 'api'

// ============================================================
// TOGGLE DATA SOURCE HERE: Change 'api' to 'mock' to use mock data
// ============================================================
export const DATA_SOURCE = 'api' as DataSourceType

// API base URL (used when DATA_SOURCE is 'api')
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Check URL query string for mode override
// Usage: ?mock or ?mock=true → mock mode
//        ?mock=false or ?api → API mode
const getQueryStringMode = (): DataSourceType | null => {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)

  if (params.has('api')) return 'api'
  if (params.has('mock')) {
    const value = params.get('mock')
    return value === 'false' ? 'api' : 'mock'
  }
  return null
}

// Helper to check current mode (query string overrides config)
export const isMockMode = (): boolean => (getQueryStringMode() ?? DATA_SOURCE) === 'mock'
export const isApiMode = (): boolean => (getQueryStringMode() ?? DATA_SOURCE) === 'api'
