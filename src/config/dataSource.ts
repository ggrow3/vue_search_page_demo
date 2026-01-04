// Toggle between 'mock' and 'api' data sources
// Set to 'mock' for local development with mock data
// Set to 'api' for real API integration
export type DataSourceType = 'mock' | 'api'

// ============================================================
// TOGGLE DATA SOURCE HERE: Change 'mock' to 'api' to use real API
// ============================================================
export const DATA_SOURCE = 'mock' as DataSourceType

// API base URL (used when DATA_SOURCE is 'api')
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Helper to check current mode
export const isMockMode = (): boolean => DATA_SOURCE === 'mock'
export const isApiMode = (): boolean => DATA_SOURCE === 'api'
