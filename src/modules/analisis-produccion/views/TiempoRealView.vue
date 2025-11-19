<template>
  <div class="dashboard-tv-fullscreen">
    <!-- Modal de Selección de Compañía -->
    <Teleport to="body">
      <div v-if="!companiaSeleccionada" class="modal-seleccion-fullscreen">
        <div class="modal-contenido">
          <h2>Seleccionar Compañía</h2>
          <div class="companias-grid">
            <button
              v-for="comp in companias"
              :key="comp.id"
              @click="seleccionarCompania(comp.id)"
              class="btn-compania"
            >
              {{ comp.nombre }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal de Selección de Planta -->
    <Teleport to="body">
      <div v-if="companiaSeleccionada && !plantaSeleccionada" class="modal-seleccion-fullscreen">
        <div class="modal-contenido">
          <div class="modal-back">
            <button @click="volverCompania" class="btn-back">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Volver
            </button>
          </div>
          <h2>Seleccionar Planta</h2>
          <p class="subtitle-modal">{{ getNombreCompania() }}</p>
          <div class="plantas-grid">
            <button
              v-for="planta in plantasFiltradas"
              :key="planta.id"
              @click="seleccionarPlanta(planta.id)"
              class="btn-planta"
            >
              {{ planta.nombre }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Dashboard Principal -->
    <div v-if="companiaSeleccionada && plantaSeleccionada" class="dashboard-content">
      
      <!-- Header con info y hora -->
      <header class="header-tv">
        <div class="header-left">
          <h1>{{ getNombreCompania() }}</h1>
          <p>{{ getNombrePlanta() }}</p>
        </div>
        <div class="header-center">
          <div class="fecha">{{ fechaActual }}</div>
          <div class="hora">{{ horaActual }}</div>
        </div>
        <div class="header-right">
          <div class="turno">Turno: <span>{{ turnoActual }}</span></div>
          <div class="live-indicator">
            <span class="dot"></span>
            EN VIVO
          </div>
        </div>
      </header>

      <!-- Grid Principal -->
      <main v-if="datosLinea" class="grid-dashboard">
        
        <!-- Fila 1: OEE Principal + Componentes + Estado -->
        <section class="fila-principal">
          
          <!-- OEE Circular Grande -->
          <div class="oee-hero">
            <svg viewBox="0 0 300 300" class="oee-svg">
              <defs>
                <linearGradient id="oeeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" :stop-color="getColorOEE(datosLinea.oee)" stop-opacity="0.8"/>
                  <stop offset="100%" :stop-color="getColorOEE(datosLinea.oee)"/>
                </linearGradient>
              </defs>
              <circle cx="150" cy="150" r="130" fill="none" stroke="#1e293b" stroke-width="12" opacity="0.15"/>
              <circle 
                cx="150" 
                cy="150" 
                r="130" 
                fill="none" 
                stroke="url(#oeeGrad)" 
                stroke-width="12"
                :stroke-dasharray="`${(datosLinea.oee / 100) * 816.81} 816.81`"
                transform="rotate(-90 150 150)"
                stroke-linecap="round"
                class="oee-circle"
              />
            </svg>
            <div class="oee-content">
              <div class="oee-valor">{{ datosLinea.oee.toFixed(1) }}<span>%</span></div>
              <div class="oee-label">OEE</div>
              <div :class="['oee-badge', getClaseOEE(datosLinea.oee)]">
                {{ getEstadoOEE(datosLinea.oee) }}
              </div>
            </div>
          </div>

          <!-- Componentes OEE -->
          <div class="componentes-grid">
            <div class="componente disponibilidad">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              <div class="comp-info">
                <div class="comp-label">DISPONIBILIDAD</div>
                <div class="comp-valor">{{ datosLinea.disponibilidad.toFixed(1) }}%</div>
                <div class="comp-barra">
                  <div class="barra-fill" :style="{ width: datosLinea.disponibilidad + '%', background: '#3b82f6' }"></div>
                </div>
              </div>
            </div>

            <div class="componente rendimiento">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
              </svg>
              <div class="comp-info">
                <div class="comp-label">RENDIMIENTO</div>
                <div class="comp-valor">{{ datosLinea.rendimiento.toFixed(1) }}%</div>
                <div class="comp-barra">
                  <div class="barra-fill" :style="{ width: datosLinea.rendimiento + '%', background: '#8b5cf6' }"></div>
                </div>
              </div>
            </div>

            <div class="componente calidad">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="comp-info">
                <div class="comp-label">CALIDAD</div>
                <div class="comp-valor">{{ datosLinea.calidad.toFixed(1) }}%</div>
                <div class="comp-barra">
                  <div class="barra-fill" :style="{ width: datosLinea.calidad + '%', background: '#10b981' }"></div>
                </div>
              </div>
            </div>

            <!-- Velocidad Actual -->
            <div class="componente velocidad">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <div class="comp-info">
                <div class="comp-label">VELOCIDAD ACTUAL</div>
                <div class="comp-valor">{{ datosLinea.velocidadActual }}</div>
                <div class="comp-meta">Teórica: {{ datosLinea.velocidadTeorica }}</div>
              </div>
            </div>

            <!-- Defectos -->
            <div class="componente defectos">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div class="comp-info">
                <div class="comp-label">DEFECTOS</div>
                <div class="comp-valor">{{ datosLinea.defectosTurno }}</div>
                <div class="comp-meta">Tasa: {{ ((datosLinea.defectosTurno / datosLinea.produccionTurno) * 100).toFixed(2) }}%</div>
              </div>
            </div>

            <!-- Paradas -->
            <div class="componente paradas">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6" fill="currentColor"/>
              </svg>
              <div class="comp-info">
                <div class="comp-label">PARADAS</div>
                <div class="comp-valor">{{ datosLinea.paradasTurno }}</div>
                <div class="comp-meta">Tiempo: {{ datosLinea.tiempoParadas }}</div>
              </div>
            </div>
          </div>

          <!-- Estado y Producto -->
          <div class="info-panel">
            <div class="estado-card">
              <div :class="['estado-badge', datosLinea.estado.toLowerCase()]">
                <span class="pulse-dot"></span>
                {{ datosLinea.estado.toUpperCase() }}
              </div>
              <div class="tiempo-estado">{{ datosLinea.tiempoEstado }}</div>
              <div v-if="datosLinea.motivoParada && datosLinea.estado !== 'Produciendo'" class="motivo">
                ⚠️ {{ datosLinea.motivoParada }}
              </div>
            </div>
            <div class="producto-card">
              <div class="producto-label">PRODUCTO ACTUAL</div>
              <div class="producto-nombre">{{ datosLinea.productoActual }}</div>
              <div class="producto-sku">{{ datosLinea.skuActual }}</div>
            </div>
          </div>
        </section>

        <!-- Gráfico de Tendencia -->
        <section class="fila-grafico">
          <div class="grafico-canvas">
            <svg viewBox="0 0 1600 450" class="grafico-svg">
              <!-- Grid -->
              <g class="grid">
                <line v-for="i in 5" :key="'h'+i" x1="100" :y1="50 + (i-1)*75" x2="1550" :y2="50 + (i-1)*75" 
                  stroke="#334155" stroke-width="1" stroke-dasharray="5,5" opacity="0.3"/>
                <line v-for="i in 7" :key="'v'+i" :x1="100 + (i-1)*242" y1="50" :x2="100 + (i-1)*242" y2="350" 
                  stroke="#334155" stroke-width="1" stroke-dasharray="5,5" opacity="0.3"/>
              </g>

              <!-- Labels Y -->
              <g class="labels-y">
                <text v-for="(val, i) in [100, 75, 50, 25, 0]" :key="'y'+i" 
                  x="85" :y="55 + i*75" text-anchor="end" fill="#cbd5e1" font-size="16" font-weight="600">
                  {{ val }}%
                </text>
              </g>

              <!-- Labels X -->
              <g class="labels-x">
                <template v-for="(punto, idx) in datosTendencia" :key="'x'+idx">
                  <text v-if="idx % 16 === 0"
                    :x="100 + idx*15.15" y="380" text-anchor="middle" fill="#cbd5e1" font-size="15" font-weight="600">
                    {{ punto.tiempo }}
                  </text>
                </template>
              </g>

              <!-- Línea OEE -->
              <path :d="generarPathMetrica('oee')" stroke="#3b82f6" stroke-width="3" 
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="linea-animada"/>

              <!-- Línea Disponibilidad -->
              <path :d="generarPathMetrica('disponibilidad')" stroke="#f97316" stroke-width="3" 
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="linea-animada"/>

              <!-- Línea Rendimiento -->
              <path :d="generarPathMetrica('rendimiento')" stroke="#22c55e" stroke-width="3" 
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="linea-animada"/>

              <!-- Línea Calidad -->
              <path :d="generarPathMetrica('calidad')" stroke="#ef4444" stroke-width="3" 
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="linea-animada"/>

              <!-- Línea Meta 100% -->
              <line x1="100" y1="50" x2="1550" y2="50" 
                stroke="#f59e0b" stroke-width="2" stroke-dasharray="10,5" opacity="0.6"/>
            </svg>
          </div>

          <div class="grafico-leyenda">
            <div class="leyenda-item">
              <span class="linea-color" style="background: #3b82f6"></span>
              <span>OEE: {{ datosLinea.oee.toFixed(1) }}%</span>
            </div>
            <div class="leyenda-item">
              <span class="linea-color" style="background: #f97316"></span>
              <span>Disponibilidad: {{ datosLinea.disponibilidad.toFixed(1) }}%</span>
            </div>
            <div class="leyenda-item">
              <span class="linea-color" style="background: #22c55e"></span>
              <span>Rendimiento: {{ datosLinea.rendimiento.toFixed(1) }}%</span>
            </div>
            <div class="leyenda-item">
              <span class="linea-color" style="background: #ef4444"></span>
              <span>Calidad: {{ datosLinea.calidad.toFixed(1) }}%</span>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- Tooltip -->
    <Teleport to="body">
      <div v-if="tooltipVisible" class="tooltip" :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }">
        <div class="tooltip-time">{{ tooltipData.tiempo }}</div>
        <div class="tooltip-val">{{ tooltipData.valor }}</div>
        <div class="tooltip-label">unidades</div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Datos
const companias = ref([
  { id: 1, nombre: 'Industrias San Miguel' },
  { id: 2, nombre: 'Indagua' },
  { id: 3, nombre: 'Demo' },
  { id: 4, nombre: 'Agrícola Cerro Prieto' }
])

const plantas = ref([
  { id: 1, nombre: 'ISM Arequipa', companiaId: 1 },
  { id: 2, nombre: 'Planta Lima', companiaId: 2 },
  { id: 3, nombre: 'Planta Demo', companiaId: 3 },
  { id: 4, nombre: 'Planta ACP', companiaId: 4 }
])

const lineasDisponibles = ref([
  { id: 1, nombre: 'LÍNEA 03', plantaId: 1, estado: 'Produciendo', url: '/analisis-produccion/tiempo-real?c=1&plant=1&line=3' },
  { id: 2, nombre: 'LÍNEA 05', plantaId: 1, estado: 'Produciendo', url: '/analisis-produccion/tiempo-real?c=1&plant=1&line=5' },
  { id: 3, nombre: 'LÍNEA 06', plantaId: 1, estado: 'Microparada', url: '/analisis-produccion/tiempo-real?c=1&plant=1&line=6' },
  { id: 4, nombre: 'LÍNEA 04', plantaId: 1, estado: 'Parada', url: '/analisis-produccion/tiempo-real?c=1&plant=1&line=4' },
  { id: 5, nombre: 'LÍNEA 02', plantaId: 1, estado: 'Produciendo', url: '/analisis-produccion/tiempo-real?c=1&plant=1&line=2' },
  { id: 6, nombre: 'LÍNEA 01', plantaId: 1, estado: 'Produciendo', url: '/analisis-produccion/tiempo-real?c=1&plant=1&line=1' }
])

const companiaSeleccionada = ref(null)
const plantaSeleccionada = ref(null)
const lineaSeleccionada = ref(null)
const datosLinea = ref(null)
const datosTendencia = ref([])
const horaActual = ref('')
const fechaActual = ref('')
const turnoActual = ref('B')
const intervalo = ref(null)

const tooltipVisible = ref(false)
const tooltipX = ref(0)
const tooltipY = ref(0)
const tooltipData = ref({})

// Computed
const plantasFiltradas = computed(() => {
  return plantas.value.filter(p => p.companiaId === companiaSeleccionada.value)
})

// Lifecycle
onMounted(() => {
  actualizarFechaHora()
  setInterval(actualizarFechaHora, 1000)
  
  const compId = route.query.c
  const plantId = route.query.plant
  const lineId = route.query.line
  
  if (compId && plantId && lineId) {
    companiaSeleccionada.value = parseInt(compId)
    plantaSeleccionada.value = parseInt(plantId)
    lineaSeleccionada.value = parseInt(lineId)
    iniciarMonitoreo()
  }
})

onUnmounted(() => {
  if (intervalo.value) clearInterval(intervalo.value)
})

// Funciones
function seleccionarCompania(id) {
  companiaSeleccionada.value = id
  // NO seleccionar planta automáticamente, esperar a que usuario elija
}

function seleccionarPlanta(id) {
  plantaSeleccionada.value = id
  lineaSeleccionada.value = lineasDisponibles.value.find(l => l.plantaId === id)?.id || null
  if (lineaSeleccionada.value) {
    iniciarMonitoreo()
  }
}

function volverCompania() {
  companiaSeleccionada.value = null
  plantaSeleccionada.value = null
  lineaSeleccionada.value = null
  if (intervalo.value) clearInterval(intervalo.value)
}

function seleccionarLinea(id) {
  lineaSeleccionada.value = id
  const linea = lineasDisponibles.value.find(l => l.id === id)
  if (linea) router.replace(linea.url)
  generarDatos()
}

function getNombreCompania() {
  return companias.value.find(c => c.id === companiaSeleccionada.value)?.nombre || ''
}

function getNombrePlanta() {
  return plantas.value.find(p => p.id === plantaSeleccionada.value)?.nombre || ''
}

function iniciarMonitoreo() {
  generarDatos()
  generarTendencia()
  // Actualizar cada 5 minutos (300000ms)
  intervalo.value = setInterval(() => {
    actualizarDatos()
  }, 300000)
}

function actualizarFechaHora() {
  const now = new Date()
  horaActual.value = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  fechaActual.value = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function generarDatos() {
  const estados = ['Produciendo', 'Produciendo', 'Produciendo', 'Parada', 'Microparada']
  const estado = estados[Math.floor(Math.random() * estados.length)]
  
  const disponibilidad = 75 + Math.random() * 20
  const rendimiento = 80 + Math.random() * 15
  const calidad = 92 + Math.random() * 7
  const oee = (disponibilidad * rendimiento * calidad) / 10000

  datosLinea.value = {
    estado,
    tiempoEstado: estado === 'Produciendo' ? '2h 15min' : '15min',
    motivoParada: estado === 'Parada' ? 'Cambio de producto' : null,
    productoActual: 'KR FRESA 350 ML REDAZ 609',
    skuActual: 'KR-350-FR-001',
    oee,
    disponibilidad,
    rendimiento,
    calidad,
    produccionTurno: Math.floor(Math.random() * 5000) + 15000,
    metaTurno: 20000,
    velocidadActual: '450 u/min',
    velocidadTeorica: '500 u/min',
    defectosTurno: Math.floor(Math.random() * 50) + 10,
    paradasTurno: Math.floor(Math.random() * 5) + 2,
    tiempoParadaTurno: Math.floor(Math.random() * 30) + 15,
    metaMinuto: 500 / 60
  }
}

function generarTendencia() {
  const datos = []
  const now = new Date()
  
  // 8 horas = 480 minutos, punto cada 5 minutos = 96 puntos
  for (let i = 96; i >= 0; i--) {
    const tiempo = new Date(now.getTime() - i * 5 * 60000)
    datos.push({
      tiempo: tiempo.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      oee: Math.floor(Math.random() * 20) + 65,
      disponibilidad: Math.floor(Math.random() * 15) + 75,
      rendimiento: Math.floor(Math.random() * 15) + 75,
      calidad: Math.floor(Math.random() * 5) + 95
    })
  }
  
  datosTendencia.value = datos
}

function actualizarDatos() {
  if (datosLinea.value) {
    datosLinea.value.oee = Math.max(0, Math.min(100, datosLinea.value.oee + (Math.random() - 0.5) * 2))
    datosLinea.value.disponibilidad = Math.max(0, Math.min(100, datosLinea.value.disponibilidad + (Math.random() - 0.5)))
    datosLinea.value.rendimiento = Math.max(0, Math.min(100, datosLinea.value.rendimiento + (Math.random() - 0.5)))
    datosLinea.value.calidad = Math.max(0, Math.min(100, datosLinea.value.calidad + (Math.random() - 0.5) * 0.5))
    datosLinea.value.produccionTurno += Math.floor(Math.random() * 50)
  }
  
  const now = new Date()
  
  datosTendencia.value.push({
    tiempo: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    oee: datosLinea.value.oee,
    disponibilidad: datosLinea.value.disponibilidad,
    rendimiento: datosLinea.value.rendimiento,
    calidad: datosLinea.value.calidad
  })
  
  // Mantener solo 96 puntos (8 horas con datos cada 5 minutos)
  if (datosTendencia.value.length > 96) datosTendencia.value.shift()
  
  lineasDisponibles.value.forEach(linea => {
    if (Math.random() < 0.1) {
      const estados = ['Produciendo', 'Microparada', 'Parada']
      linea.estado = estados[Math.floor(Math.random() * estados.length)]
    }
  })
}

function generarPathLinea() {
  if (!datosTendencia.value.length) return ''
  const puntos = datosTendencia.value.map((p, i) => {
    const x = 100 + i * 24.2
    const y = 320 - (p.oee / 100 * 250)
    return `${x},${y}`
  })
  return `M ${puntos.join(' L ')}`
}

function generarPathMetrica(metrica) {
  if (!datosTendencia.value.length) return ''
  const puntos = datosTendencia.value.map((p, i) => {
    const x = 100 + i * 15.15  // 1450px / 96 puntos = 15.15px
    const y = 350 - (p[metrica] / 100 * 300)  // 300px de altura (0-100%)
    return `${x},${y}`
  })
  return `M ${puntos.join(' L ')}`
}

function generarPathArea() {
  if (!datosTendencia.value.length) return ''
  const path = generarPathLinea()
  const ultimoX = 100 + (datosTendencia.value.length - 1) * 24.2
  return `${path} L ${ultimoX},320 L 100,320 Z`
}

function getColorOEE(oee) {
  if (oee >= 85) return '#22c55e'
  if (oee >= 70) return '#f59e0b'
  return '#ef4444'
}

function getClaseOEE(oee) {
  if (oee >= 85) return 'excelente'
  if (oee >= 70) return 'aceptable'
  return 'critico'
}

function getEstadoOEE(oee) {
  if (oee >= 85) return 'EXCELENTE'
  if (oee >= 70) return 'ACEPTABLE'
  return 'CRÍTICO'
}

function mostrarTooltip(event, punto) {
  tooltipVisible.value = true
  tooltipX.value = event.clientX
  tooltipY.value = event.clientY
  tooltipData.value = punto
}

function ocultarTooltip() {
  tooltipVisible.value = false
}
</script>

<style scoped>
/* Base - Fullscreen que cubre TODO */
.dashboard-tv-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #0f172a 50%, #1e293b 100%);
  overflow: auto;
  z-index: 9998;
}

/* Modal - Cubre TODO incluyendo sidebar */
.modal-seleccion-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(12px);
}

.modal-contenido {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  max-width: 800px;
  width: 90%;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
}

.modal-contenido h2 {
  text-align: center;
  font-size: 2rem;
  color: #001f54;
  font-weight: 800;
  margin-bottom: 2rem;
}

.companias-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.btn-compania {
  background: linear-gradient(135deg, #001f54, #002a70);
  color: white;
  border: none;
  padding: 2rem;
  border-radius: 14px;
  font-size: 1.35rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 12px rgba(0, 31, 84, 0.3);
}

.btn-compania:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 31, 84, 0.4);
}

/* Modal Back Button */
.modal-back {
  margin-bottom: 1.5rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 2px solid #001f54;
  color: #001f54;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-back:hover {
  background: #001f54;
  color: white;
  transform: translateX(-4px);
}

.subtitle-modal {
  text-align: center;
  font-size: 1.25rem;
  color: #64748b;
  margin: -1rem 0 2rem 0;
  font-weight: 600;
}

/* Grid de Plantas */
.plantas-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.btn-planta {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 2rem;
  border-radius: 14px;
  font-size: 1.35rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 12px rgba(16, 185, 129, 0.3);
}

.btn-planta:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 24px rgba(16, 185, 129, 0.4);
}

/* Dashboard Content */
.dashboard-content {
  padding: 1.5rem;
}

/* Header */
.header-tv {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.header-left h1 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #f1f5f9;
  text-transform: uppercase;
  margin: 0 0 0.3rem 0;
}

.header-left p {
  font-size: 0.95rem;
  color: #94a3b8;
  margin: 0;
}

.header-center {
  text-align: center;
}

.fecha {
  font-size: 0.85rem;
  color: #cbd5e1;
  text-transform: capitalize;
}

.hora {
  font-size: 1.75rem;
  font-weight: 800;
  color: #f1f5f9;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}

.header-right {
  text-align: right;
}

.turno {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 0.3rem;
}

.turno span {
  font-weight: 800;
  color: #3b82f6;
  font-size: 1.35rem;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: #10b981;
  font-weight: 700;
}

.live-indicator .dot {
  width: 12px;
  height: 12px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

/* Selector Líneas - Oculto en vista TV (filtrado por URL) */
.selector-lineas {
  display: none;
}

.linea-btn {
  background: rgba(30, 41, 59, 0.6);
  border: 2px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s;
}

.linea-btn:hover {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-4px);
}

.linea-btn.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15));
  border-color: #3b82f6;
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
}

.linea-nombre {
  font-size: 1.25rem;
  font-weight: 800;
  color: #f1f5f9;
  margin-bottom: 0.5rem;
}

.linea-estado {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
}

.linea-estado.produciendo {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.linea-estado.parada {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.linea-estado.microparada {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

/* Grid Dashboard */
.grid-dashboard {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Fila Principal */
.fila-principal {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 0.75rem;
}

/* OEE Hero */
.oee-hero {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
  border-radius: 12px;
  padding: 0.75rem;
  position: relative;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.oee-svg {
  width: 100%;
  height: auto;
}

.oee-circle {
  transition: stroke-dasharray 1s ease;
  filter: drop-shadow(0 0 10px currentColor);
}

.oee-content {
  position: absolute;
  text-align: center;
}

.oee-valor {
  font-size: 2.75rem;
  font-weight: 900;
  color: #f1f5f9;
  line-height: 1;
}

.oee-valor span {
  font-size: 1.5rem;
  opacity: 0.8;
}

.oee-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #94a3b8;
  margin: 0.2rem 0 0.4rem;
  letter-spacing: 1.5px;
}

.oee-badge {
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 1px;
}

.oee-badge.excelente {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.oee-badge.aceptable {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.oee-badge.critico {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* Componentes */
.componentes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.componente {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8));
  border-radius: 10px;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.componente svg {
  color: currentColor;
}

.componente.disponibilidad {
  color: #3b82f6;
}

.componente.rendimiento {
  color: #8b5cf6;
}

.componente.calidad {
  color: #10b981;
}

.componente.velocidad {
  color: #3b82f6;
}

.componente.defectos {
  color: #f59e0b;
}

.componente.paradas {
  color: #ef4444;
}

.comp-info {
  text-align: center;
  width: 100%;
}

.comp-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #cbd5e1;
  margin-bottom: 0.25rem;
}

.comp-valor {
  font-size: 1.5rem;
  font-weight: 900;
  color: #f1f5f9;
  margin-bottom: 0.5rem;
}

.comp-meta {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.comp-barra {
  width: 100%;
  height: 10px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 5px;
  overflow: hidden;
}

.barra-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 1s ease;
  box-shadow: 0 0 12px currentColor;
}

/* Info Panel */
.info-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.estado-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
  border-radius: 10px;
  padding: 0.75rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.estado-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
}

.estado-badge.produciendo {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
  color: #22c55e;
  border: 2px solid rgba(34, 197, 94, 0.4);
}

.estado-badge.parada {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
  color: #ef4444;
  border: 2px solid rgba(239, 68, 68, 0.4);
}

.estado-badge.microparada {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
  color: #f59e0b;
  border: 2px solid rgba(245, 158, 11, 0.4);
}

.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

.tiempo-estado {
  font-size: 1.1rem;
  color: #cbd5e1;
  font-weight: 600;
}

.motivo {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  color: #fca5a5;
  font-weight: 600;
}

.producto-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
  border-radius: 16px;
  padding: 1.75rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.producto-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
}

.producto-nombre {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 0.5rem;
}

.producto-sku {
  font-size: 0.95rem;
  color: #94a3b8;
  font-family: 'Courier New', monospace;
}

/* Fila Métricas */
.fila-metricas {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.metrica {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
  border-radius: 10px;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.metrica svg {
  flex-shrink: 0;
}

.metrica.produccion svg {
  color: #22c55e;
}

.metrica.velocidad svg {
  color: #3b82f6;
}

.metrica.defectos svg {
  color: #f59e0b;
}

.metrica.paradas svg {
  color: #ef4444;
}

.metrica-info {
  flex: 1;
}

.metrica-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
}

.metrica-valor {
  font-size: 1.65rem;
  font-weight: 900;
  color: #f1f5f9;
  margin-bottom: 0.3rem;
}

.metrica-meta {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.progreso-bar {
  width: 100%;
  height: 6px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.75rem;
}

.progreso {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #22c55e);
  border-radius: 3px;
  transition: width 1s ease;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.metrica-pct {
  font-size: 0.95rem;
  color: #10b981;
  font-weight: 700;
  margin-top: 0.5rem;
}

/* Fila Gráfico */
.fila-grafico {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
  border-radius: 12px;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.grafico-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.grafico-header h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #f1f5f9;
  margin: 0 0 0.3rem 0;
}

.grafico-header p {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 800;
  color: #ef4444;
  letter-spacing: 1px;
}

.dot-anim {
  width: 10px;
  height: 10px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.grafico-canvas {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
  padding: 0.75rem 0.5rem;
  margin-bottom: 0;
  height: 380px;
}

.grafico-svg {
  width: 100%;
  height: auto;
}

.linea-animada {
  animation: draw 2s ease-out;
}

@keyframes draw {
  from {
    stroke-dasharray: 5000;
    stroke-dashoffset: 5000;
  }
  to {
    stroke-dasharray: 5000;
    stroke-dashoffset: 0;
  }
}

.punto {
  cursor: pointer;
  transition: all 0.2s;
}

.punto:hover {
  r: 7;
  filter: drop-shadow(0 0 8px currentColor);
}

.grafico-leyenda {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.leyenda-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #cbd5e1;
}

.linea-color {
  width: 40px;
  height: 4px;
  border-radius: 2px;
}

.linea-meta-dash {
  width: 40px;
  height: 3px;
  background: #f59e0b;
  position: relative;
}

.linea-meta-dash::before,
.linea-meta-dash::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 3px;
  background: #f59e0b;
}

.linea-meta-dash::before {
  left: -12px;
}

.linea-meta-dash::after {
  right: -12px;
}

.area-color {
  width: 40px;
  height: 12px;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.05));
  border-radius: 2px;
}

/* Tooltip */
.tooltip {
  position: fixed;
  background: rgba(15, 23, 42, 0.98);
  border: 2px solid rgba(59, 130, 246, 0.5);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  pointer-events: none;
  z-index: 10000;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  transform: translate(-50%, -120%);
}

.tooltip-time {
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.tooltip-val {
  font-size: 1.75rem;
  font-weight: 900;
  color: #f1f5f9;
  margin-bottom: 0.25rem;
}

.tooltip-label {
  font-size: 0.8rem;
  color: #64748b;
}

/* Responsive */
@media (max-width: 1600px) {
  .fila-principal {
    grid-template-columns: 320px 1fr 280px;
  }
}

@media (max-width: 1200px) {
  .fila-principal {
    grid-template-columns: 1fr;
  }
  
  .fila-metricas {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header-tv {
    grid-template-columns: 1fr;
  }
  
  .selector-lineas {
    grid-template-columns: 1fr;
  }
  
  .componentes-grid {
    grid-template-columns: 1fr;
  }
  
  .fila-metricas {
    grid-template-columns: 1fr;
  }
}
</style>
