<template>
  <div class="datos-recibidos-view">
    <div class="page-header">
      <h1>Datos Recibidos</h1>
      <p>Monitoreo y validación de datos en tiempo real desde las líneas de producción</p>
    </div>

    <!-- Estados de Conexión -->
    <div class="conexiones-grid">
      <div v-for="linea in lineas" :key="linea.id" class="conexion-card" :class="`estado-${linea.estado}`">
        <div class="conexion-header">
          <div class="linea-info">
            <h3>{{ linea.nombre }}</h3>
            <p>{{ linea.planta }}</p>
          </div>
          <div class="estado-indicador" :class="`estado-${linea.estado}`">
            <div class="pulse"></div>
          </div>
        </div>

        <div class="conexion-stats">
          <div class="stat">
            <span class="stat-label">Última actualización</span>
            <span class="stat-value">{{ linea.ultimaActualizacion }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Frecuencia</span>
            <span class="stat-value">{{ linea.frecuencia }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Registros/hora</span>
            <span class="stat-value">{{ linea.registrosHora }}</span>
          </div>
        </div>

        <div class="conexion-acciones">
          <button @click="verDetalles(linea.id)" class="btn-small btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Ver Detalles
          </button>
        </div>
      </div>
    </div>

    <!-- Datos en Tiempo Real -->
    <div class="datos-tiempo-real">
      <div class="section-header">
        <h2>Datos en Tiempo Real</h2>
        <div class="header-actions">
          <button @click="pausarActualizacion" class="btn btn-secondary">
            <svg v-if="!pausado" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 3l14 9-14 9V3z"/>
            </svg>
            {{ pausado ? 'Reanudar' : 'Pausar' }}
          </button>
          <button @click="exportarDatos" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Exportar
          </button>
        </div>
      </div>

      <div class="filtros-rapidos">
        <button @click="filtroLinea = null" :class="['filtro-btn', { active: !filtroLinea }]">Todas las líneas</button>
        <button v-for="linea in lineas" :key="linea.id" @click="filtroLinea = linea.id" :class="['filtro-btn', { active: filtroLinea === linea.id }]">
          {{ linea.nombre }}
        </button>
      </div>

      <div class="tabla-wrapper">
        <table class="tabla-datos">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Línea</th>
              <th>OEE</th>
              <th>Disponibilidad</th>
              <th>Rendimiento</th>
              <th>Calidad</th>
              <th>Velocidad</th>
              <th>Producción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dato in datosFiltrados" :key="dato.id" :class="{ 'fila-nueva': dato.nuevo }">
              <td><span class="timestamp">{{ dato.timestamp }}</span></td>
              <td><strong>{{ dato.linea }}</strong></td>
              <td><span :class="['badge', `badge-${getColorOEE(dato.oee)}`]">{{ dato.oee }}%</span></td>
              <td>{{ dato.disponibilidad }}%</td>
              <td>{{ dato.rendimiento }}%</td>
              <td>{{ dato.calidad }}%</td>
              <td>{{ dato.velocidad }} u/min</td>
              <td>{{ dato.produccion }} unidades</td>
              <td><span :class="['badge-estado', `estado-${dato.estado}`]">{{ dato.estadoTexto }}</span></td>
              <td>
                <button @click="verDetalleDato(dato.id)" class="btn-icon" title="Ver detalle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Estadísticas de Recepción -->
    <div class="estadisticas-section">
      <h2>Estadísticas de Recepción de Datos</h2>
      <div class="estadisticas-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: #dbeafe; color: #1e40af;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Datos Recibidos Hoy</p>
            <p class="stat-number">12,847</p>
            <p class="stat-change positive">+8.3% vs ayer</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #dcfce7; color: #166534;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Tasa de Éxito</p>
            <p class="stat-number">99.2%</p>
            <p class="stat-change positive">+0.5% vs ayer</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #fef3c7; color: #92400e;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Latencia Promedio</p>
            <p class="stat-number">2.4 seg</p>
            <p class="stat-change negative">+0.3 seg vs ayer</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #fee2e2; color: #991b1b;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Errores Hoy</p>
            <p class="stat-number">23</p>
            <p class="stat-change positive">-12 vs ayer</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const pausado = ref(false)
const filtroLinea = ref(null)

const lineas = ref([
  { id: 1, nombre: 'Línea 01', planta: 'ISM Arequipa', estado: 'online', ultimaActualizacion: 'Hace 2 seg', frecuencia: 'Cada 5 seg', registrosHora: '720' },
  { id: 2, nombre: 'Línea 02', planta: 'ISM Arequipa', estado: 'online', ultimaActualizacion: 'Hace 3 seg', frecuencia: 'Cada 5 seg', registrosHora: '720' },
  { id: 3, nombre: 'Línea 03', planta: 'ISM Lima', estado: 'online', ultimaActualizacion: 'Hace 1 seg', frecuencia: 'Cada 5 seg', registrosHora: '720' },
  { id: 4, nombre: 'Línea 04', planta: 'ISM Lima', estado: 'warning', ultimaActualizacion: 'Hace 45 seg', frecuencia: 'Cada 5 seg', registrosHora: '650' },
  { id: 5, nombre: 'Línea 05', planta: 'Indagua', estado: 'online', ultimaActualizacion: 'Hace 4 seg', frecuencia: 'Cada 5 seg', registrosHora: '720' },
  { id: 6, nombre: 'Línea 06', planta: 'ACP Ica', estado: 'offline', ultimaActualizacion: 'Hace 15 min', frecuencia: 'Cada 5 seg', registrosHora: '0' }
])

const datosRecientes = ref([
  { id: 1, timestamp: '19/11/2025 14:35:42', linea: 'Línea 01', oee: 82, disponibilidad: 90, rendimiento: 92, calidad: 99, velocidad: 450, produccion: 2250, estado: 'produciendo', estadoTexto: 'Produciendo', nuevo: true },
  { id: 2, timestamp: '19/11/2025 14:35:41', linea: 'Línea 02', oee: 78, disponibilidad: 88, rendimiento: 90, calidad: 98, velocidad: 420, produccion: 2100, estado: 'produciendo', estadoTexto: 'Produciendo', nuevo: true },
  { id: 3, timestamp: '19/11/2025 14:35:40', linea: 'Línea 03', oee: 85, disponibilidad: 92, rendimiento: 93, calidad: 99, velocidad: 480, produccion: 2400, estado: 'produciendo', estadoTexto: 'Produciendo', nuevo: false },
  { id: 4, timestamp: '19/11/2025 14:35:25', linea: 'Línea 04', oee: 45, disponibilidad: 50, rendimiento: 90, calidad: 100, velocidad: 0, produccion: 0, estado: 'microparada', estadoTexto: 'Microparada', nuevo: false },
  { id: 5, timestamp: '19/11/2025 14:35:38', linea: 'Línea 05', oee: 88, disponibilidad: 95, rendimiento: 93, calidad: 99, velocidad: 500, produccion: 2500, estado: 'produciendo', estadoTexto: 'Produciendo', nuevo: false },
  { id: 6, timestamp: '19/11/2025 14:20:15', linea: 'Línea 06', oee: 0, disponibilidad: 0, rendimiento: 0, calidad: 0, velocidad: 0, produccion: 0, estado: 'parada', estadoTexto: 'Parada', nuevo: false }
])

const datosFiltrados = computed(() => {
  if (!filtroLinea.value) return datosRecientes.value
  const lineaNombre = lineas.value.find(l => l.id === filtroLinea.value)?.nombre
  return datosRecientes.value.filter(d => d.linea === lineaNombre)
})

function getColorOEE(oee) {
  if (oee >= 85) return 'success'
  if (oee >= 70) return 'warning'
  return 'danger'
}

function pausarActualizacion() {
  pausado.value = !pausado.value
  // TODO: Conectar con backend
  console.log('Pausar/Reanudar actualización')
}

function exportarDatos() {
  // TODO: Conectar con backend
  console.log('Exportando datos')
  alert('Función lista para conectar con backend')
}

function verDetalles(id) {
  // TODO: Conectar con backend
  console.log('Ver detalles línea:', id)
  alert('Función lista para conectar con backend')
}

function verDetalleDato(id) {
  // TODO: Conectar con backend
  console.log('Ver detalle dato:', id)
  alert('Función lista para conectar con backend')
}
</script>

<style scoped>
.datos-recibidos-view {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #64748b;
  font-size: 1rem;
}

.conexiones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.conexion-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 2px solid #e2e8f0;
  transition: all 0.3s;
}

.conexion-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.conexion-card.estado-online {
  border-left: 4px solid #22c55e;
}

.conexion-card.estado-warning {
  border-left: 4px solid #f59e0b;
}

.conexion-card.estado-offline {
  border-left: 4px solid #ef4444;
}

.conexion-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.linea-info h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.linea-info p {
  font-size: 0.875rem;
  color: #64748b;
}

.estado-indicador {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.estado-indicador.estado-online {
  background: #22c55e;
}

.estado-indicador.estado-warning {
  background: #f59e0b;
}

.estado-indicador.estado-offline {
  background: #ef4444;
}

.pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.estado-online .pulse {
  background: #22c55e;
}

.estado-warning .pulse {
  background: #f59e0b;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.conexion-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.stat-label {
  color: #64748b;
}

.stat-value {
  color: #1e293b;
  font-weight: 600;
}

.conexion-acciones {
  display: flex;
  gap: 0.5rem;
}

.datos-tiempo-real {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.filtros-rapidos {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filtro-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  background: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.filtro-btn:hover {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #3b82f6;
}

.filtro-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-small {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  width: 100%;
  justify-content: center;
}

.tabla-wrapper {
  background: white;
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tabla-datos {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.tabla-datos thead {
  background: #f8fafc;
}

.tabla-datos th {
  padding: 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.tabla-datos td {
  padding: 1rem;
  border-top: 1px solid #f1f5f9;
  font-size: 0.875rem;
  color: #334155;
}

.tabla-datos tr.fila-nueva {
  background: #f0f9ff;
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    background: #dbeafe;
  }
  to {
    background: #f0f9ff;
  }
}

.timestamp {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #64748b;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

.badge-estado {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-estado.estado-produciendo {
  background: #dcfce7;
  color: #166534;
}

.badge-estado.estado-microparada {
  background: #fef3c7;
  color: #92400e;
}

.badge-estado.estado-parada {
  background: #fee2e2;
  color: #991b1b;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f8fafc;
  color: #3b82f6;
  border-color: #3b82f6;
}

.estadisticas-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.estadisticas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-change.positive {
  color: #22c55e;
}

.stat-change.negative {
  color: #ef4444;
}

@media (max-width: 768px) {
  .conexiones-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
  }

  .btn {
    flex: 1;
  }
}
</style>
