# Arquitectura del Proyecto Mentor Monitor

## Stack Tecnológico

### Frontend
- **Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Charts**: Apache ECharts + vue-echarts
- **Styling**: TailwindCSS
- **Utilities**: VueUse

### Backend (Integración)
- **Framework**: Spring Boot (Java)
- **Comunicación**: REST API + JSON
- **Autenticación**: JWT (Bearer Token)
- **CORS**: Configurado para desarrollo local

## Estructura del Proyecto

```
mentor-monitor/
│
├── docs/                                   # Documentación técnica
│   ├── BACKEND_INTEGRATION.md              # Guía de integración para backend
│   ├── api-contracts/                      # Contratos de API (Request/Response)
│   │   ├── auth.json
│   │   ├── usuarios.json
│   │   ├── plantas.json
│   │   ├── lineas.json
│   │   ├── dispositivos.json
│   │   ├── variables.json
│   │   ├── analisis.json
│   │   └── reportes.json
│   └── postman/                            # Colección Postman
│       └── mentor-monitor.postman.json
│
├── public/
│   ├── favicon.ico
│   └── assets/
│       └── icons/                          # SVG icons del sistema
│
├── src/
│   │
│   ├── modules/                            # Módulos principales por funcionalidad
│   │   │
│   │   ├── dashboard/
│   │   │   ├── views/
│   │   │   │   └── DashboardView.vue
│   │   │   ├── components/
│   │   │   │   ├── ReportCard.vue
│   │   │   │   ├── StatsWidget.vue
│   │   │   │   └── QuickAccessGrid.vue
│   │   │   └── composables/
│   │   │       └── useDashboardData.js
│   │   │
│   │   ├── configuracion/                  # Módulo de configuración completo
│   │   │   ├── views/
│   │   │   │   ├── ConfigLayout.vue        # Layout padre con subrutas
│   │   │   │   ├── EmpresaView.vue
│   │   │   │   ├── UsuarioView.vue
│   │   │   │   ├── PlantaView.vue
│   │   │   │   ├── LineaView.vue
│   │   │   │   ├── RolesView.vue
│   │   │   │   ├── ArchivosView.vue
│   │   │   │   ├── MantenimientoView.vue
│   │   │   │   ├── VariablesView.vue
│   │   │   │   ├── ArbolParadasView.vue
│   │   │   │   └── CategoriaParadasView.vue
│   │   │   ├── components/
│   │   │   │   ├── UserForm.vue
│   │   │   │   ├── UserTable.vue
│   │   │   │   ├── PlantForm.vue
│   │   │   │   ├── ExcelUploader.vue
│   │   │   │   └── VariableSelector.vue
│   │   │   └── api/
│   │   │       └── configuracion.service.js
│   │   │
│   │   ├── administracion/                 # Módulo de administración
│   │   │   ├── views/
│   │   │   │   └── AdminLayout.vue
│   │   │   └── components/
│   │   │       └── AdminPanel.vue
│   │   │
│   │   ├── vista-rapida/                   # Vista rápida / Consultas rápidas
│   │   │   ├── views/
│   │   │   │   └── VistaRapidaView.vue
│   │   │   └── components/
│   │   │       ├── QuickQueryCard.vue
│   │   │       └── PresetFilters.vue
│   │   │
│   │   ├── analisis/                       # Módulo de análisis con submódulos
│   │   │   ├── views/
│   │   │   │   ├── AnalisisLayout.vue
│   │   │   │   ├── GeneralView.vue
│   │   │   │   ├── EnergiaView.vue
│   │   │   │   ├── ProduccionView.vue
│   │   │   │   └── ParetoView.vue
│   │   │   ├── components/
│   │   │   │   ├── FilterPanel.vue         # Panel de filtros reutilizable
│   │   │   │   ├── DataExport.vue          # Exportar a Excel/PDF
│   │   │   │   ├── VariableSelector.vue    # Selector de variables
│   │   │   │   ├── TimeSeriesChart.vue
│   │   │   │   └── ComparisonChart.vue
│   │   │   └── composables/
│   │   │       ├── useAnalisisFilters.js
│   │   │       └── useChartData.js
│   │   │
│   │   ├── reportes/                       # Módulo de reportes
│   │   │   ├── views/
│   │   │   │   └── ReportesView.vue
│   │   │   └── components/
│   │   │       ├── ReportBuilder.vue
│   │   │       ├── ReportTable.vue
│   │   │       └── ReportExporter.vue
│   │   │
│   │   ├── alarmas/                        # Sistema de alarmas
│   │   │   ├── views/
│   │   │   │   └── AlarmasView.vue
│   │   │   └── components/
│   │   │       ├── AlarmList.vue
│   │   │       ├── AlarmCard.vue
│   │   │       └── AlarmNotification.vue
│   │   │
│   │   ├── produccion/                     # Módulo de producción
│   │   │   ├── views/
│   │   │   │   └── ProduccionView.vue
│   │   │   └── components/
│   │   │       ├── ProductionChart.vue
│   │   │       └── ProductionTable.vue
│   │   │
│   │   ├── datos-recibidos/                # Datos recibidos
│   │   │   ├── views/
│   │   │   │   └── DatosRecibidosView.vue
│   │   │   └── components/
│   │   │       └── DataGrid.vue
│   │   │
│   │   └── compromisos/                    # Módulo de compromisos
│   │       ├── views/
│   │       │   └── CompromisosView.vue
│   │       └── components/
│   │           └── CompromisoCard.vue
│   │
│   ├── shared/                             # Código compartido globalmente
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── charts/                     # Componentes de gráficos
│   │   │   │   ├── BaseChart.vue           # Wrapper base de ECharts
│   │   │   │   ├── LineChart.vue           # Gráfico de líneas
│   │   │   │   ├── BarChart.vue            # Gráfico de barras
│   │   │   │   ├── HeatmapChart.vue        # Mapa de calor
│   │   │   │   ├── ParetoChart.vue         # Gráfico de Pareto
│   │   │   │   └── GaugeChart.vue          # Medidor/gauge
│   │   │   │
│   │   │   ├── forms/                      # Componentes de formularios
│   │   │   │   ├── DateRangePicker.vue     # Selector de rango de fechas
│   │   │   │   ├── SelectFilter.vue        # Select con filtrado
│   │   │   │   ├── SearchInput.vue         # Input de búsqueda
│   │   │   │   ├── MultiSelect.vue         # Selector múltiple
│   │   │   │   └── FormField.vue           # Campo de formulario genérico
│   │   │   │
│   │   │   ├── tables/                     # Componentes de tablas
│   │   │   │   ├── DataTable.vue           # Tabla de datos con ordenamiento
│   │   │   │   ├── Pagination.vue          # Paginación
│   │   │   │   └── TableActions.vue        # Acciones de tabla
│   │   │   │
│   │   │   ├── ui/                         # Componentes UI base
│   │   │   │   ├── Button.vue
│   │   │   │   ├── Card.vue
│   │   │   │   ├── Modal.vue
│   │   │   │   ├── Loading.vue
│   │   │   │   ├── Alert.vue
│   │   │   │   ├── Tooltip.vue
│   │   │   │   ├── Badge.vue
│   │   │   │   └── Dropdown.vue
│   │   │   │
│   │   │   └── layout/                     # Componentes de layout
│   │   │       ├── AppLayout.vue           # Layout principal
│   │   │       ├── AppSidebar.vue          # Sidebar con navegación
│   │   │       ├── AppHeader.vue           # Header con usuario
│   │   │       ├── Breadcrumb.vue          # Migas de pan
│   │   │       └── PageHeader.vue          # Header de página
│   │   │
│   │   ├── composables/                    # Composables reutilizables
│   │   │   ├── useApi.js                   # Hook para peticiones HTTP
│   │   │   ├── useAuth.js                  # Hook de autenticación
│   │   │   ├── usePermissions.js           # Hook de permisos/roles
│   │   │   ├── useToast.js                 # Hook de notificaciones
│   │   │   ├── useExcelExport.js           # Hook para exportar Excel
│   │   │   ├── useDateRange.js             # Hook para manejo de fechas
│   │   │   ├── useModal.js                 # Hook para modales
│   │   │   └── useTable.js                 # Hook para tablas
│   │   │
│   │   └── utils/                          # Utilidades
│   │       ├── formatters.js               # Formateo de datos/fechas/números
│   │       ├── validators.js               # Validaciones
│   │       ├── constants.js                # Constantes globales
│   │       ├── chartOptions.js             # Opciones base de ECharts
│   │       └── excel.js                    # Utilidades Excel
│   │
│   ├── api/                                # Capa de comunicación con backend
│   │   │
│   │   ├── client.js                       # Instancia de Axios configurada
│   │   │                                   # - Interceptores request/response
│   │   │                                   # - Manejo de errores global
│   │   │                                   # - Inyección de tokens JWT
│   │   │
│   │   ├── endpoints.js                    # URLs centralizadas de API
│   │   │                                   # Todas las rutas del backend
│   │   │
│   │   ├── services/                       # Servicios por dominio
│   │   │   ├── auth.service.js             # POST /api/auth/login
│   │   │   │                               # POST /api/auth/logout
│   │   │   │                               # POST /api/auth/refresh
│   │   │   │
│   │   │   ├── user.service.js             # CRUD usuarios
│   │   │   │                               # GET /api/usuarios
│   │   │   │                               # POST /api/usuarios
│   │   │   │                               # PUT /api/usuarios/{id}
│   │   │   │                               # DELETE /api/usuarios/{id}
│   │   │   │
│   │   │   ├── plant.service.js            # CRUD plantas
│   │   │   ├── line.service.js             # CRUD líneas
│   │   │   ├── device.service.js           # CRUD dispositivos
│   │   │   ├── variable.service.js         # CRUD variables
│   │   │   ├── analysis.service.js         # Consultas de análisis
│   │   │   ├── report.service.js           # Generación de reportes
│   │   │   ├── alarm.service.js            # Sistema de alarmas
│   │   │   └── excel.service.js            # Import/Export Excel
│   │   │
│   │   └── mocks/                          # Mock data para desarrollo
│   │       ├── index.js                    # Activar/desactivar mocks
│   │       ├── auth.mock.js
│   │       ├── usuarios.mock.js
│   │       ├── plantas.mock.js
│   │       ├── lineas.mock.js
│   │       ├── analisis.mock.js
│   │       └── dashboard.mock.js
│   │
│   ├── stores/                             # Pinia stores (estado global)
│   │   ├── auth.js                         # Usuario, tokens, sesión
│   │   ├── config.js                       # Empresas, plantas, líneas
│   │   ├── filters.js                      # Filtros compartidos entre vistas
│   │   ├── ui.js                           # Estado UI (sidebar, modales)
│   │   └── notifications.js                # Sistema de notificaciones
│   │
│   ├── router/                             # Vue Router
│   │   ├── index.js                        # Configuración principal
│   │   ├── guards.js                       # Guards de navegación (auth, permisos)
│   │   └── modules/                        # Rutas por módulo
│   │       ├── dashboard.routes.js
│   │       ├── configuracion.routes.js
│   │       ├── analisis.routes.js
│   │       ├── reportes.routes.js
│   │       └── auth.routes.js
│   │
│   ├── types/                              # Definiciones de tipos (JSDoc/TypeScript)
│   │   └── api.types.js                    # Interfaces de API
│   │
│   ├── assets/                             # Assets estáticos
│   │   ├── icons/                          # SVG icons
│   │   │   ├── home.svg
│   │   │   ├── settings.svg
│   │   │   ├── chart.svg
│   │   │   └── ...
│   │   └── images/
│   │       ├── logo.svg
│   │       └── logo-sm.svg
│   │
│   ├── styles/                             # Estilos globales
│   │   ├── main.css                        # Imports de Tailwind
│   │   ├── variables.css                   # Variables CSS personalizadas
│   │   └── transitions.css                 # Transiciones Vue
│   │
│   ├── App.vue                             # Componente raíz
│   └── main.js                             # Entry point
│
├── .env.example                            # Variables de entorno ejemplo
├── .env.development                        # Config desarrollo (git ignored)
├── .env.production                         # Config producción (git ignored)
│
├── .gitignore
├── package.json
├── vite.config.js                          # Configuración Vite
├── tailwind.config.js                      # Configuración Tailwind
├── postcss.config.js                       # PostCSS
├── jsconfig.json                           # Alias de rutas
└── README.md                               # Documentación general
```

## Flujo de Datos

```
[Usuario] 
    ↓ Interacción
[Componente Vue]
    ↓ Usa composable
[useApi / Custom Hook]
    ↓ Llama servicio
[Service (auth.service.js)]
    ↓ Usa cliente HTTP
[Axios Client]
    ↓ Interceptor añade JWT
[HTTP Request]
    ↓
[Spring Boot API]
    ↓ Procesa y responde
[HTTP Response]
    ↓ Interceptor maneja errores
[Axios Client]
    ↓ Transforma datos
[Service]
    ↓ Actualiza estado
[Pinia Store / Componente]
    ↓ Renderiza
[Usuario ve resultado]
```

## Principios de Diseño

### 1. Separación de Responsabilidades
- **Componentes**: Solo presentación y eventos
- **Composables**: Lógica reutilizable
- **Services**: Comunicación con API
- **Stores**: Estado global
- **Utils**: Funciones puras

### 2. Modularidad
- Cada módulo es independiente
- Lazy loading por ruta
- Importaciones relativas dentro del módulo
- Componentes compartidos en `/shared`

### 3. Configurabilidad
- URLs del backend en `.env`
- Temas configurables con CSS variables
- Opciones de ECharts centralizadas
- Mock data activable/desactivable

### 4. Escalabilidad
- Estructura preparada para crecer
- Fácil agregar nuevos módulos
- Sistema de plugins extensible
- Code splitting automático

### 5. Mantenibilidad
- Código organizado por dominio
- Naming conventions consistentes
- Documentación en código
- Tipos definidos para contratos API

## Sistema de Rutas

### Estructura de URLs

```
/                                   # Redirect a /dashboard
/login                              # Página de login
/dashboard                          # Dashboard principal

/configuracion                      # Layout de configuración
  /empresa                          # Gestión de empresas
  /usuario                          # Gestión de usuarios
  /planta                           # Gestión de plantas
  /linea                            # Gestión de líneas
  /roles                            # Gestión de roles
  /archivos                         # Gestión de archivos
  /mantenimiento                    # Mantenimiento
  /variables                        # Variables del sistema
  /arbol-paradas                    # Árbol de paradas
  /categoria-paradas                # Categorías de paradas

/administracion                     # Panel de administración

/vista-rapida                       # Consultas rápidas

/analisis                           # Layout de análisis
  /general                          # Análisis general
  /energia                          # Análisis energía
  /produccion                       # Análisis producción
  /pareto                           # Gráficos de Pareto

/reportes                           # Generación de reportes

/alarmas                            # Sistema de alarmas

/produccion                         # Módulo de producción

/datos-recibidos                    # Datos recibidos

/compromisos                        # Gestión de compromisos

/cambiar-contrasena                 # Cambio de contraseña

/perfil                             # Perfil de usuario
```

### Protección de Rutas

```javascript
// Middleware de autenticación
beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else if (to.meta.roles && !hasRole(to.meta.roles)) {
    next('/unauthorized')
  } else {
    next()
  }
})
```

## Sistema de Autenticación

### Flow JWT

```
1. Usuario ingresa credenciales
   ↓
2. POST /api/auth/login { username, password }
   ↓
3. Backend valida y retorna { token, refreshToken, user }
   ↓
4. Frontend almacena en localStorage/sessionStorage
   ↓
5. Axios interceptor añade: Authorization: Bearer {token}
   ↓
6. Cada request incluye el token automáticamente
   ↓
7. Si token expira → POST /api/auth/refresh
   ↓
8. Obtiene nuevo token y reintenta request original
```

## Sistema de Componentes de Gráficos

### BaseChart.vue
Wrapper de ECharts con funcionalidades:
- Auto-resize responsive
- Loading state
- Error handling
- Temas personalizables
- Export a imagen

### Componentes Específicos
Cada tipo de gráfico hereda de BaseChart:
- **LineChart**: Series temporales
- **BarChart**: Comparaciones
- **HeatmapChart**: Matriz de calor (tiempos)
- **ParetoChart**: Análisis 80/20
- **GaugeChart**: Medidores KPI

### Uso
```vue
<LineChart
  :data="chartData"
  :options="customOptions"
  height="400px"
  @chart-click="handleClick"
/>
```

## Sistema de Filtros Compartidos

### Patrón de Filtros Globales

Múltiples vistas comparten filtros:
- Rango de fechas
- Compañía
- Planta
- Línea
- Dispositivo
- Variable

Store centralizado:
```javascript
// stores/filters.js
export const useFiltersStore = defineStore('filters', {
  state: () => ({
    dateRange: { start: null, end: null },
    selectedCompany: null,
    selectedPlant: null,
    selectedLine: null
  })
})
```

## Gestión de Excel

### Import
```javascript
// Usuario sube archivo
// Frontend envía FormData
// POST /api/excel/import
// Backend procesa y retorna resultado
```

### Export
```javascript
// Usuario solicita export
// Frontend llama servicio
// GET /api/reportes/export?format=xlsx
// Backend genera archivo
// Frontend descarga blob
```

## Sistema de Notificaciones

### Toast Notifications
```javascript
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()

toast.success('Planta creada exitosamente')
toast.error('Error al guardar')
toast.warning('Datos incompletos')
toast.info('Procesando...')
```

### Alarmas en Tiempo Real
Opción futura: WebSockets para notificaciones push

## Consideraciones de Rendimiento

### 1. Lazy Loading
- Rutas cargadas bajo demanda
- Componentes grandes con `defineAsyncComponent`
- Imágenes con lazy loading

### 2. Virtual Scrolling
- Para tablas con miles de registros
- Lista virtualizada de alarmas

### 3. Debouncing
- Búsquedas con debounce
- Filtros con throttle

### 4. Caching
- Respuestas API cacheadas
- Store persiste en localStorage

### 5. Code Splitting
- Bundle por módulo
- Vendor chunk separado
- CSS extractado

## Convenciones de Código

### Naming
- **Componentes**: PascalCase (UserForm.vue)
- **Composables**: camelCase con prefijo use (useAuth.js)
- **Servicios**: camelCase con sufijo service (auth.service.js)
- **Stores**: camelCase (auth.js)
- **Constantes**: UPPER_SNAKE_CASE

### Estructura de Componentes
```vue
<script setup>
// 1. Imports
// 2. Props
// 3. Emits
// 4. Composables
// 5. Reactive state
// 6. Computed
// 7. Methods
// 8. Lifecycle hooks
// 9. Watchers
</script>

<template>
  <!-- HTML -->
</template>

<style scoped>
  /* Estilos */
</style>
```

### Commits
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Documentación
- `style:` Formateo
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Mantenimiento

## Testing (Recomendado)

### Unit Tests
- Vitest para composables
- Vue Test Utils para componentes

### E2E Tests
- Playwright/Cypress para flujos completos

### API Tests
- Postman/Newman para backend

## Deployment

### Build
```bash
npm run build
# Genera /dist con archivos optimizados
```

### Variables de Entorno
```bash
# .env.production
VITE_API_BASE_URL=https://api.mentormonitor.com
VITE_APP_VERSION=1.0.0
```

### Hosting
- **Frontend**: Netlify/Vercel/Nginx
- **Backend**: Spring Boot en servidor/cloud

## Próximos Pasos

1. Generación del scaffold completo
2. Configuración de dependencias
3. Implementación del layout base
4. Sistema de autenticación
5. Primer módulo funcional (Dashboard)
6. Documentación de integración backend
7. Contratos de API en JSON
8. Sistema de mocks para desarrollo

## Contacto y Soporte

Este template está diseñado para facilitar:
- Desarrollo independiente frontend/backend
- Escalabilidad del sistema
- Mantenimiento a largo plazo
- Integración de nuevos desarrolladores

El programador backend encontrará toda la información necesaria en:
- `docs/BACKEND_INTEGRATION.md`
- `docs/api-contracts/`
- `.env.example`
- Comentarios en servicios de API
