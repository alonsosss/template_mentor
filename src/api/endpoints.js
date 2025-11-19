export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
export const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me'
  },
  USERS: '/usuarios',
  COMPANIES: '/empresas',
  PLANTS: '/plantas',
  LINES: '/lineas',
  DEVICES: '/dispositivos',
  VARIABLES: '/variables',
  ROLES: '/roles',
  ANALYSIS: {
    GENERAL: '/analisis/general',
    ENERGY: '/analisis/energia',
    PRODUCTION: '/analisis/produccion',
    PARETO: '/analisis/pareto'
  },
  REPORTS: '/reportes',
  ALARMS: '/alarmas',
  PRODUCTION: '/produccion',
  DATA: '/datos-recibidos',
  COMMITMENTS: '/compromisos',
  EXCEL: {
    IMPORT: '/excel/import',
    EXPORT: '/excel/export'
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    REPORTS: '/dashboard/reportes',
    CHARTS: '/dashboard/graficos'
  }
}
