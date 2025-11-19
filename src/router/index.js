import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/modules/auth/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/shared/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/modules/dashboard/views/DashboardView.vue'),
          meta: { title: 'Dashboard' }
        },
        {
          path: 'configuracion',
          name: 'Configuracion',
          redirect: '/configuracion/empresa',
          children: [
            {
              path: 'empresa',
              name: 'Empresa',
              component: () => import('@/modules/configuracion/views/EmpresaView.vue'),
              meta: { title: 'Empresa' }
            },
            {
              path: 'usuario',
              name: 'Usuario',
              component: () => import('@/modules/configuracion/views/UsuarioView.vue'),
              meta: { title: 'Usuario' }
            },
            {
              path: 'roles',
              name: 'Roles',
              component: () => import('@/modules/configuracion/views/RolesView.vue'),
              meta: { title: 'Roles' }
            },
            {
              path: 'archivos',
              name: 'Archivos',
              component: () => import('@/modules/configuracion/views/ArchivosView.vue'),
              meta: { title: 'Archivos' }
            },
            {
              path: 'mantenimiento',
              name: 'Mantenimiento',
              component: () => import('@/modules/configuracion/views/MantenimientoView.vue'),
              meta: { title: 'Mantenimiento' }
            },
            {
              path: 'variables',
              name: 'Variables',
              component: () => import('@/modules/configuracion/views/VariablesView.vue'),
              meta: { title: 'Variables' }
            },
            {
              path: 'arbol-paradas',
              name: 'ArbolParadas',
              component: () => import('@/modules/configuracion/views/ArbolParadasView.vue'),
              meta: { title: 'Árbol de Paradas' }
            },
            {
              path: 'gestion-paradas',
              name: 'GestionParadas',
              component: () => import('@/modules/configuracion/views/GestionParadasView.vue'),
              meta: { title: 'Gestión de Paradas' }
            },
            {
              path: 'categoria-paradas',
              name: 'CategoriaParadas',
              component: () => import('@/modules/configuracion/views/CategoriaParadasView.vue'),
              meta: { title: 'Categoría de Paradas' }
            }
          ]
        },
        {
          path: 'administracion',
          name: 'Administracion',
          redirect: '/administracion/tipo-documento',
          children: [
            {
              path: 'tipo-documento',
              name: 'TipoDocumento',
              component: () => import('@/modules/administracion/views/TipoDocumentoView.vue'),
              meta: { title: 'Tipo de Documento' }
            },
            {
              path: 'calendarizacion',
              name: 'Calendarizacion',
              component: () => import('@/modules/administracion/views/CalendarizacionView.vue'),
              meta: { title: 'Calendarización' }
            },
            {
              path: 'turnos',
              name: 'Turnos',
              component: () => import('@/modules/administracion/views/TurnosView.vue'),
              meta: { title: 'Turnos' }
            },
            {
              path: 'productos',
              name: 'Productos',
              component: () => import('@/modules/administracion/views/ProductosView.vue'),
              meta: { title: 'Productos' }
            },
            {
              path: 'habilitar-linea',
              name: 'HabilitarLinea',
              component: () => import('@/modules/administracion/views/HabilitarLineaView.vue'),
              meta: { title: 'Habilitar Línea' }
            }
          ]
        },
        {
          path: 'analisis',
          name: 'Analisis',
          redirect: '/analisis/general',
          children: [
            {
              path: 'general',
              name: 'AnalisisGeneral',
              component: () => import('@/modules/analisis/views/GeneralView.vue'),
              meta: { title: 'Análisis General' }
            },
            {
              path: 'energia',
              name: 'AnalisisEnergia',
              component: () => import('@/modules/analisis/views/EnergiaView.vue'),
              meta: { title: 'Análisis Energía' }
            },
            {
              path: 'produccion',
              name: 'AnalisisProduccion',
              component: () => import('@/modules/analisis/views/ProduccionView.vue'),
              meta: { title: 'Análisis Producción' }
            }
          ]
        },
        {
          path: 'vista-rapida',
          name: 'VistaRapida',
          redirect: '/vista-rapida/factor-calificacion',
          children: [
            {
              path: 'factor-calificacion',
              name: 'FactorCalificacion',
              component: () => import('@/modules/vista-rapida/views/FactorCalificacionView.vue'),
              meta: { title: 'Factor de Calificación' }
            },
            {
              path: 'oee-turno',
              name: 'OeeTurno',
              component: () => import('@/modules/vista-rapida/views/OeeTurnoView.vue'),
              meta: { title: 'OEE por Turno' }
            }
          ]
        },
        {
          path: 'analisis-avanzado',
          name: 'AnalisisAvanzado',
          redirect: '/analisis-avanzado/generador-consultas',
          children: [
            {
              path: 'generador-consultas',
              name: 'GeneradorConsultas',
              component: () => import('@/modules/analisis-avanzado/views/GeneradorConsultasView.vue'),
              meta: { title: 'Generador de Consultas - R' }
            },
            {
              path: 'kwhl',
              name: 'Kwhl',
              component: () => import('@/modules/analisis-avanzado/views/KwhlView.vue'),
              meta: { title: 'KWHL' }
            }
          ]
        },
        {
          path: 'analisis-energia',
          name: 'AnalisisEnergia',
          redirect: '/analisis-energia/consumo-electrico-tarifario',
          children: [
            {
              path: 'consumo-electrico-tarifario',
              name: 'ConsumoElectricoTarifario',
              component: () => import('@/modules/analisis-energia/views/ConsumoElectricoTarifarioView.vue'),
              meta: { title: 'Consumo Eléctrico Tarifario' }
            },
            {
              path: 'factor-calificacion',
              name: 'FactorCalificacionEnergia',
              component: () => import('@/modules/analisis-energia/views/FactorCalificacionView.vue'),
              meta: { title: 'Factor de Calificación' }
            }
          ]
        },
        {
          path: 'analisis-produccion',
          name: 'AnalisisProduccion',
          redirect: '/analisis-produccion/linea-tiempo',
          children: [
            {
              path: 'linea-tiempo',
              name: 'LineaTiempo',
              component: () => import('@/modules/analisis-produccion/views/LineaTiempoView.vue'),
              meta: { title: 'Línea de Tiempo' }
            },
            {
              path: 'historia-linea',
              name: 'HistoriaLinea',
              component: () => import('@/modules/analisis-produccion/views/HistoriaLineaView.vue'),
              meta: { title: 'Historia de Línea' }
            },
            {
              path: 'grafica-oee',
              name: 'GraficaOEE',
              component: () => import('@/modules/analisis-produccion/views/GraficaOEEView.vue'),
              meta: { title: 'Gráfica de OEE' }
            },
            {
              path: 'grafica-pareto',
              name: 'GraficaPareto',
              component: () => import('@/modules/analisis-produccion/views/GraficaParetoView.vue'),
              meta: { title: 'Gráfica de Pareto' }
            },
            {
              path: 'tiempo-real',
              name: 'TiempoReal',
              component: () => import('@/modules/analisis-produccion/views/TiempoRealView.vue'),
              meta: { title: 'Tiempo Real' }
            }
          ]
        },
        {
          path: 'reportes',
          name: 'Reportes',
          component: () => import('@/modules/reportes/views/ReportesView.vue'),
          meta: { title: 'Reportes' }
        },
        {
          path: 'alarmas',
          name: 'Alarmas',
          component: () => import('@/modules/alarmas/views/AlarmasView.vue'),
          meta: { title: 'Alarmas' }
        },
        {
          path: 'datos-recibidos',
          name: 'DatosRecibidos',
          component: () => import('@/modules/datos-recibidos/views/DatosRecibidosView.vue'),
          meta: { title: 'Datos Recibidos' }
        },
        {
          path: 'compromisos',
          name: 'Compromisos',
          component: () => import('@/modules/compromisos/views/CompromisosView.vue'),
          meta: { title: 'Compromisos' }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
