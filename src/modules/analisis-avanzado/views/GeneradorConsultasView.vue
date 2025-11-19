<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import { useApi } from '@/shared/composables/useApi'

const { loading, error, execute } = useApi()

const companias = ref([
  { id: 1, nombre: 'Industrias San Miguel' }
])

const plantas = ref([
  { id: 1, companiaId: 1, nombre: 'Historico Embotelladora San Miguel' }
])

const lineas = ref([
  { id: 1, nombre: 'Línea 1' },
  { id: 2, nombre: 'Línea 2' },
  { id: 3, nombre: 'Línea 3' }
])

const ubicaciones = ref([
  { id: 1, nombre: 'Toda la Línea' }
])

const dispositivos = ref([
  { id: 1, nombre: 'Medidor de Energía - Circutor' }
])

const variables = ref([
  { id: 1, nombre: 'I1 (Corriente Fase 1)' },
  { id: 2, nombre: 'I2 (Corriente Fase 2)' },
  { id: 3, nombre: 'I3 (Corriente Fase 3)' },
  { id: 4, nombre: 'V1 (Voltaje Fase 1)' },
  { id: 5, nombre: 'V2 (Voltaje Fase 2)' },
  { id: 6, nombre: 'V3 (Voltaje Fase 3)' },
  { id: 7, nombre: 'P (Potencia Activa)' },
  { id: 8, nombre: 'Q (Potencia Reactiva)' },
  { id: 9, nombre: 'S (Potencia Aparente)' },
  { id: 10, nombre: 'FP (Factor de Potencia)' },
  { id: 11, nombre: 'Frecuencia (Hz)' },
  { id: 12, nombre: 'Energía Activa (kWh)' }
])

const agrupamientos = ref([
  { id: 1, nombre: '5 minutos', valor: '5min' },
  { id: 2, nombre: '15 minutos', valor: '15min' },
  { id: 3, nombre: '30 minutos', valor: '30min' },
  { id: 4, nombre: '1 hora', valor: '1h' }
])

const companiaSeleccionada = ref(1)
const plantaSeleccionada = ref(1)
const lineaSeleccionada = ref(1)
const ubicacionSeleccionada = ref(1)
const dispositivoSeleccionado = ref(1)
const variableSeleccionada = ref(1)
const agrupamientoSeleccionado = ref('5min')

const fechaInicio = ref('2025/11/14 00:00')
const fechaFin = ref('2025/11/19 05:55')

const fechaInicioInput = computed({
  get: () => {
    const [fecha, hora] = fechaInicio.value.split(' ')
    const [year, month, day] = fecha.split('/')
    return `${year}-${month}-${day}T${hora}`
  },
  set: (value) => {
    if (value) {
      const date = new Date(value)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      fechaInicio.value = `${year}/${month}/${day} ${hours}:${minutes}`
    }
  }
})

const fechaFinInput = computed({
  get: () => {
    const [fecha, hora] = fechaFin.value.split(' ')
    const [year, month, day] = fecha.split('/')
    return `${year}-${month}-${day}T${hora}`
  },
  set: (value) => {
    if (value) {
      const date = new Date(value)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      fechaFin.value = `${year}/${month}/${day} ${hours}:${minutes}`
    }
  }
})

const plantasFiltradas = computed(() => {
  if (!companiaSeleccionada.value) return []
  return plantas.value.filter(p => p.companiaId === parseInt(companiaSeleccionada.value))
})

const variablesAgregadas = ref([])

const datosGrafico = ref({})
const tooltipVisible = ref(false)
const tooltipData = ref({ x: 0, y: 0, fecha: '', valor: 0, variable: '' })
const mostrarTabla = ref(false)

const coloresVariables = {
  1: '#3b82f6', // I1 - Azul
  2: '#ef4444', // I2 - Rojo
  3: '#22c55e', // I3 - Verde
  4: '#f59e0b', // V1 - Naranja
  5: '#8b5cf6', // V2 - Púrpura
  6: '#ec4899', // V3 - Rosa
  7: '#14b8a6', // P - Teal
  8: '#f97316', // Q - Naranja oscuro
  9: '#06b6d4', // S - Cyan
  10: '#84cc16', // FP - Lima
  11: '#6366f1', // Frecuencia - Índigo
  12: '#a855f7'  // Energía - Violeta
}

function toggleVariable(variable) {
  const index = variablesAgregadas.value.findIndex(v => v.id === variable.id)
  if (index > -1) {
    variablesAgregadas.value.splice(index, 1)
  } else {
    variablesAgregadas.value.push({ ...variable })
  }
  
  if (variablesAgregadas.value.length > 0) {
    generarDatosGrafico()
  } else {
    datosGrafico.value = {}
  }
}

function agregarVariable() {
  const variable = variables.value.find(v => v.id === variableSeleccionada.value)
  if (variable && !variablesAgregadas.value.find(v => v.id === variable.id)) {
    variablesAgregadas.value.push({ ...variable })
    generarDatosGrafico()
  }
}

function generarDatosGrafico() {
  const datos = {}
  
  const fechaInicial = new Date(fechaInicio.value.replace(/\//g, '-').replace(' ', 'T') + ':00')
  const fechaFinal = new Date(fechaFin.value.replace(/\//g, '-').replace(' ', 'T') + ':00')
  
  const diferenciaMs = fechaFinal - fechaInicial
  const cantidadPuntos = 50
  const intervaloMs = diferenciaMs / (cantidadPuntos - 1)
  
  variablesAgregadas.value.forEach(variable => {
    datos[variable.id] = []
    
    for (let i = 0; i < cantidadPuntos; i++) {
      const fecha = new Date(fechaInicial.getTime() + (i * intervaloMs))
      
      let valor = 0
      
      switch(variable.id) {
        case 1: case 2: case 3:
          valor = 25000 + Math.sin(i / 5) * 15000 + Math.random() * 5000
          break
          
        case 4: case 5: case 6:
          valor = 220 + Math.sin(i / 10) * 20 + Math.random() * 5
          break
          
        case 7:
          valor = 15000 + Math.sin(i / 8) * 5000 + Math.random() * 1000
          break
          
        case 8:
          valor = 8000 + Math.cos(i / 6) * 3000 + Math.random() * 500
          break
          
        case 9:
          valor = 18000 + Math.sin(i / 8) * 6000 + Math.random() * 1200
          break
          
        case 10:
          valor = 0.85 + Math.sin(i / 10) * 0.1 + Math.random() * 0.03
          break
          
        case 11:
          valor = 60 + Math.sin(i / 15) * 0.3 + Math.random() * 0.05
          break
          
        case 12:
          valor = i * 50 + Math.random() * 20
          break
      }
      
      datos[variable.id].push({
        fecha: fecha.toISOString(),
        valor: Math.round(valor * 100) / 100,
        timestamp: fecha.getTime(),
        variableId: variable.id,
        variableNombre: variable.nombre
      })
    }
  })
  
  datosGrafico.value = datos
}

function mostrarTooltip(event, punto, variable) {
  const svg = event.currentTarget.closest('svg')
  const rect = svg.getBoundingClientRect()
  
  tooltipData.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    fecha: formatearFechaTooltip(punto.fecha),
    valor: punto.valor,
    variable: variable.nombre
  }
  
  tooltipVisible.value = true
}

function ocultarTooltip() {
  tooltipVisible.value = false
}

function formatearFechaTooltip(fecha) {
  const date = new Date(fecha)
  const dia = String(date.getDate()).padStart(2, '0')
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  const anio = date.getFullYear()
  const hora = String(date.getHours()).padStart(2, '0')
  const minutos = String(date.getMinutes()).padStart(2, '0')
  return `${dia}/${mes}/${anio} ${hora}:${minutos}`
}

function eliminarVariable(id) {
  const index = variablesAgregadas.value.findIndex(v => v.id === id)
  if (index > -1) {
    variablesAgregadas.value.splice(index, 1)
    if (variablesAgregadas.value.length === 0) {
      datosGrafico.value = []
    }
  }
}

function formatearFecha(fecha) {
  const date = new Date(fecha)
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  const dia = String(date.getDate()).padStart(2, '0')
  const hora = String(date.getHours()).padStart(2, '0')
  const minutos = String(date.getMinutes()).padStart(2, '0')
  return `${mes}/${dia} ${hora}:${minutos}`
}

function generarPathLinea() {
  if (datosGrafico.value.length === 0) return ''
  
  let path = ''
  datosGrafico.value.forEach((punto, index) => {
    const x = (index / (datosGrafico.value.length - 1)) * 1200
    const y = 300 - ((punto.valor / 70000) * 300)
    
    if (index === 0) {
      path += `M ${x} ${y}`
    } else {
      path += ` L ${x} ${y}`
    }
  })
  
  return path
}

function generarPathLineaVariable(variableId) {
  const datos = datosGrafico.value[variableId]
  if (!datos || datos.length === 0) return ''
  
  const maxValor = Math.max(...Object.values(datosGrafico.value).flat().map(d => d.valor))
  
  let path = ''
  datos.forEach((punto, index) => {
    const x = (index / (datos.length - 1)) * 1200
    const y = 300 - ((punto.valor / maxValor) * 280)
    
    if (index === 0) {
      path += `M ${x} ${y}`
    } else {
      path += ` L ${x} ${y}`
    }
  })
  
  return path
}

function generarPathArea() {
  return ''
}

function buscar() {
  console.log('Buscar datos')
  console.log('Variables agregadas:', variablesAgregadas.value)
  console.log('Datos grafico:', datosGrafico.value)
}

function copiarDatos() {
  const datosTabla = generarDatosTabla()
  let texto = 'Fecha'
  
  variablesAgregadas.value.forEach(variable => {
    texto += `\t${variable.nombre}`
  })
  texto += '\n'
  
  datosTabla.forEach(fila => {
    texto += fila.fecha
    variablesAgregadas.value.forEach(variable => {
      texto += `\t${fila[variable.id] || ''}`
    })
    texto += '\n'
  })
  
  navigator.clipboard.writeText(texto)
  alert('Datos copiados al portapapeles')
}

function exportarExcel() {
  const datosTabla = generarDatosTabla()
  
  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">'
  html += '<head><meta charset="utf-8"><style>table { border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f2f2f2; font-weight: bold; }</style></head>'
  html += '<body><table>'
  
  html += '<thead><tr><th>Fecha</th>'
  variablesAgregadas.value.forEach(variable => {
    html += `<th>${variable.nombre}</th>`
  })
  html += '</tr></thead><tbody>'
  
  datosTabla.forEach(fila => {
    html += '<tr>'
    html += `<td>${fila.fecha}</td>`
    variablesAgregadas.value.forEach(variable => {
      html += `<td>${fila[variable.id] || ''}</td>`
    })
    html += '</tr>'
  })
  
  html += '</tbody></table></body></html>'
  
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `variables_${new Date().getTime()}.xls`
  link.click()
}

function generarDatosTabla() {
  if (Object.keys(datosGrafico.value).length === 0) return []
  
  const primeraVariable = Object.keys(datosGrafico.value)[0]
  const datos = datosGrafico.value[primeraVariable]
  
  return datos.map((punto, index) => {
    const fila = {
      fecha: formatearFechaTabla(punto.fecha)
    }
    
    variablesAgregadas.value.forEach(variable => {
      const datosVar = datosGrafico.value[variable.id]
      if (datosVar && datosVar[index]) {
        fila[variable.id] = datosVar[index].valor
      }
    })
    
    return fila
  })
}

function formatearFechaTabla(fecha) {
  const date = new Date(fecha)
  const dia = String(date.getDate()).padStart(2, '0')
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  const anio = date.getFullYear()
  const hora = String(date.getHours()).padStart(2, '0')
  const minutos = String(date.getMinutes()).padStart(2, '0')
  return `${dia}/${mes}/${anio} ${hora}:${minutos}`
}

onMounted(() => {
  
})
</script>

<template>
  <div class="generador-consultas-view">
    <div class="page-header">
      <h1 class="page-title">GENERADOR DE CONSULTAS - R</h1>
    </div>

    <Card class="content-card">
      <div class="form-section">
        <h3 class="section-title">Seleccione las variables:</h3>

        <div class="form-layout">
          <div class="form-box">
            <h4 class="box-title">FECHAS</h4>
            <div class="form-group">
              <label class="form-label">Inicio</label>
              <input type="datetime-local" v-model="fechaInicioInput" class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Fin</label>
              <input type="datetime-local" v-model="fechaFinInput" class="form-control" />
            </div>
          </div>

          <div class="form-box">
            <h4 class="box-title">AGRUPAMIENTO</h4>
            <div class="form-group">
              <select v-model="agrupamientoSeleccionado" class="form-control">
                <option v-for="agrupamiento in agrupamientos" :key="agrupamiento.id" :value="agrupamiento.valor">
                  {{ agrupamiento.nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-box">
            <h4 class="box-title">Compañía</h4>
            <div class="form-group">
              <select v-model="companiaSeleccionada" class="form-control">
                <option v-for="compania in companias" :key="compania.id" :value="compania.id">
                  {{ compania.nombre }}
                </option>
              </select>
            </div>

            <h4 class="box-title">Planta</h4>
            <div class="form-group">
              <select v-model="plantaSeleccionada" class="form-control">
                <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
                  {{ planta.nombre }}
                </option>
              </select>
            </div>

            <h4 class="box-title">Línea</h4>
            <div class="form-group">
              <select v-model="lineaSeleccionada" class="form-control">
                <option v-for="linea in lineas" :key="linea.id" :value="linea.id">
                  {{ linea.nombre }}
                </option>
              </select>
            </div>

            <h4 class="box-title">Locación</h4>
            <div class="form-group">
              <select v-model="ubicacionSeleccionada" class="form-control">
                <option v-for="ubicacion in ubicaciones" :key="ubicacion.id" :value="ubicacion.id">
                  {{ ubicacion.nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-box">
            <h4 class="box-title">Dispositivo</h4>
            <div class="form-group">
              <select v-model="dispositivoSeleccionado" class="form-control">
                <option v-for="dispositivo in dispositivos" :key="dispositivo.id" :value="dispositivo.id">
                  {{ dispositivo.nombre }}
                </option>
              </select>
            </div>

            <h4 class="box-title">Variable</h4>
            <div class="variable-list">
              <label v-for="variable in variables" :key="variable.id" class="variable-checkbox">
                <input 
                  type="checkbox" 
                  :value="variable.id"
                  :checked="variablesAgregadas.some(v => v.id === variable.id)"
                  @change="toggleVariable(variable)"
                />
                <span>{{ variable.nombre }}</span>
              </label>
            </div>
          </div>
        </div>

        <div v-if="variablesAgregadas.length > 0" class="variables-agregadas">
          <div class="variable-tag" v-for="variable in variablesAgregadas" :key="variable.id">
            <span class="variable-icon">✕</span>
            <span class="variable-name">{{ variable.nombre }}</span>
            <button class="remove-variable" @click="eliminarVariable(variable.id)">×</button>
          </div>
        </div>

        <div class="buscar-section">
          <Button variant="primary" size="md" @click="buscar">
            BUSCAR
          </Button>
        </div>

        <div v-if="Object.keys(datosGrafico).length > 0" class="grafico-container">
          <div class="grafico-header">
            <h4 class="grafico-titulo">Variables Seleccionadas</h4>
          </div>
          
          <div class="grafico-principal">
            <svg viewBox="0 0 1200 300" class="grafico-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient v-for="variable in variablesAgregadas" :key="'gradient-' + variable.id" 
                                :id="'gradientArea-' + variable.id" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" :style="`stop-color:${coloresVariables[variable.id]};stop-opacity:0.2`" />
                  <stop offset="100%" :style="`stop-color:${coloresVariables[variable.id]};stop-opacity:0.05`" />
                </linearGradient>
              </defs>
              
              <g>
                <line v-for="i in 6" :key="'h-line-' + i" 
                      :x1="0" :y1="i * 50" :x2="1200" :y2="i * 50" 
                      stroke="#e5e7eb" stroke-width="1" />
              </g>
              
              <g v-for="variable in variablesAgregadas" :key="'linea-' + variable.id">
                <path v-if="datosGrafico[variable.id] && datosGrafico[variable.id].length > 0"
                      :d="generarPathLineaVariable(variable.id)" 
                      fill="none" 
                      :stroke="coloresVariables[variable.id]" 
                      stroke-width="2.5" />
              </g>
              
              <g v-for="variable in variablesAgregadas" :key="'puntos-' + variable.id">
                <circle v-for="(punto, index) in (datosGrafico[variable.id] || [])" 
                        v-show="index % 2 === 0"
                        :key="'punto-' + variable.id + '-' + index"
                        :cx="(index / ((datosGrafico[variable.id] || []).length - 1)) * 1200" 
                        :cy="300 - ((punto.valor / Math.max(1, ...Object.values(datosGrafico).flat().map(d => d.valor))) * 280)"
                        r="5" 
                        :fill="coloresVariables[variable.id]"
                        class="punto-interactivo"
                        @mouseenter="mostrarTooltip($event, punto, variable)"
                        @mouseleave="ocultarTooltip" />
              </g>
            </svg>
            
            <div v-if="tooltipVisible" class="tooltip-grafico" 
                 :style="{ left: tooltipData.x + 'px', top: tooltipData.y + 'px' }">
              <div class="tooltip-content">
                <div class="tooltip-variable">{{ tooltipData.variable }}</div>
                <div class="tooltip-fecha">{{ tooltipData.fecha }}</div>
                <div class="tooltip-valor">Valor: <strong>{{ tooltipData.valor.toLocaleString() }}</strong></div>
              </div>
            </div>
          </div>

          <div class="grafico-leyenda">
            <div class="leyenda-items">
              <div v-for="variable in variablesAgregadas" :key="'leyenda-' + variable.id" class="leyenda-item">
                <span class="leyenda-color" :style="{ background: coloresVariables[variable.id] }"></span>
                <span class="leyenda-texto">{{ variable.nombre }}</span>
              </div>
            </div>
            <div class="leyenda-acciones">
              <label class="mostrar-data">
                <input type="checkbox" v-model="mostrarTabla" />
                <span>MOSTRAR DATA</span>
              </label>
              <div class="botones-accion">
                <Button variant="secondary" size="sm" @click="copiarDatos">
                  COPIAR DATA
                </Button>
                <Button variant="success" size="sm" @click="exportarExcel">
                  EXPORTAR EXCEL
                </Button>
              </div>
            </div>
          </div>

          <div v-if="mostrarTabla" class="tabla-datos">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th v-for="variable in variablesAgregadas" :key="'th-' + variable.id">
                    {{ variable.nombre }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(fila, index) in generarDatosTabla()" :key="'fila-' + index">
                  <td>{{ fila.fecha }}</td>
                  <td v-for="variable in variablesAgregadas" :key="'td-' + variable.id + '-' + index">
                    {{ fila[variable.id] ? fila[variable.id].toLocaleString() : '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.generador-consultas-view {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-bottom: 2rem;
}

.page-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 1rem 2rem;
  border-radius: 0;
  box-shadow: 0 4px 16px rgba(30, 58, 138, 0.25);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  pointer-events: none;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
}

.content-card {
  border-radius: 0;
  border: none;
  border-top: 3px solid #3b82f6;
  padding: 1.5rem 2rem;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0;
  padding: 0.65rem 1rem;
  border-left: 4px solid #3b82f6;
  background: linear-gradient(to right, #eff6ff 0%, #ffffff 100%);
  box-shadow: 0 1px 4px rgba(59, 130, 246, 0.08);
}

.form-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.form-box {
  background: #fafafa;
  border: 1px solid #d1d5db;
  border-radius: 0.625rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.25s ease;
}

.form-box:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
  border-color: #9ca3af;
  transform: translateY(-2px);
}

.box-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  text-transform: capitalize;
  letter-spacing: 0.02em;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  text-transform: capitalize;
  letter-spacing: 0.01em;
  margin-bottom: 0.125rem;
}

.form-control {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  background-color: #ffffff;
  color: #1f2937;
  transition: all 0.2s ease;
  font-weight: 400;
}

.form-control:hover {
  border-color: #9ca3af;
}

.form-control:focus {
  outline: none;
  border-color: #6b7280;
  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
}

.form-group-inline {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.form-group-inline .form-control {
  flex: 1;
}

.buscar-section {
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  background: transparent;
  margin-top: 1rem;
}

.buscar-section:hover {
  transform: none;
}

@media (max-width: 1200px) {
  .form-layout {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.875rem;
  }

  .content-card {
    padding: 1.25rem 1.75rem;
  }
}

@media (max-width: 768px) {
  .form-layout {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .content-card {
    padding: 1rem 1.25rem;
  }

  .page-header {
    padding: 0.875rem 1.25rem;
  }

  .page-title {
    font-size: 1.1rem;
  }

  .form-box {
    padding: 0.875rem;
  }
}

.variables-agregadas {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

.variable-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #6b7280;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
}

.variable-icon {
  font-size: 0.75rem;
  opacity: 0.8;
}

.variable-name {
  flex: 1;
}

.remove-variable {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.25rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.remove-variable:hover {
  opacity: 1;
}

.grafico-container {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.grafico-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.grafico-titulo {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.grafico-principal {
  width: 100%;
  height: 300px;
  margin-bottom: 1rem;
  position: relative;
}

.grafico-svg {
  width: 100%;
  height: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: #fafafa;
}

.punto-interactivo {
  cursor: pointer;
  transition: r 0.2s;
}

.punto-interactivo:hover {
  r: 7;
}

.tooltip-grafico {
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -100%);
  margin-top: -10px;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -90%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -100%);
  }
}

.tooltip-content {
  background: rgba(30, 41, 59, 0.95);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  backdrop-filter: blur(10px);
}

.tooltip-variable {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  color: #60a5fa;
}

.tooltip-fecha {
  font-size: 0.8125rem;
  color: #cbd5e1;
  margin-bottom: 0.5rem;
}

.tooltip-valor {
  font-size: 0.875rem;
  color: white;
}

.tooltip-valor strong {
  font-weight: 700;
  color: #fbbf24;
}

.grafico-leyenda {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  gap: 1rem;
}

.leyenda-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex: 1;
}

.leyenda-acciones {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.botones-accion {
  display: flex;
  gap: 0.5rem;
}

.leyenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.leyenda-color {
  width: 20px;
  height: 3px;
  border-radius: 2px;
}

.leyenda-texto {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
}

.mostrar-data {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  white-space: nowrap;
}

.mostrar-data input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.tabla-datos {
  margin-top: 1.5rem;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.data-table thead {
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.data-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.data-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.data-table td {
  padding: 0.75rem 1rem;
  color: #4b5563;
}

.variable-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 250px;
  overflow-y: auto;
  padding: 0.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
}

.variable-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  font-size: 0.8125rem;
  color: #374151;
}

.variable-checkbox:hover {
  background-color: #f3f4f6;
}

.variable-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
}

.variable-checkbox span {
  flex: 1;
}
</style>
