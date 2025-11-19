<template>
  <div class="grafica-oee">
    <!-- Encabezado -->
    <div class="titulo-principal">
      GRÁFICA DE OEE
    </div>

    <!-- Formulario de Filtros - 3 Columnas -->
    <div class="formulario-grid-nuevo">
      <!-- FECHAS + TIPO GRÁFICO + TIPO CONSULTA -->
      <div class="seccion-box-nuevo">
        <h3 class="subtitulo-seccion-nuevo">FECHAS</h3>
        <div class="campo-grupo-nuevo">
          <label>Inicio</label>
          <input 
            type="datetime-local" 
            v-model="fechaInicioInput"
            class="campo-entrada-nuevo"
          />
        </div>
        <div class="campo-grupo-nuevo">
          <label>Fin</label>
          <input 
            type="datetime-local" 
            v-model="fechaFinInput"
            class="campo-entrada-nuevo"
          />
        </div>

        <h3 class="subtitulo-seccion-nuevo">Tipo de Grafico</h3>
        <div class="campo-grupo-nuevo campo-grupo-botones">
          <button 
            @click="tipoGrafica = 'barras'" 
            :class="['btn-tipo-grafico', { active: tipoGrafica === 'barras' }]"
          >
            Barras
          </button>
          <button 
            @click="tipoGrafica = 'lineal'" 
            :class="['btn-tipo-grafico', { active: tipoGrafica === 'lineal' }]"
          >
            Lineal
          </button>
        </div>

        <h3 class="subtitulo-seccion-nuevo">Tipo de Consulta</h3>
        <div class="campo-grupo-nuevo">
          <select v-model="tipoConsulta" class="campo-entrada-nuevo">
            <option value="lote">Por Lote</option>
            <option value="turno">Por turno</option>
            <option value="consulta">Por Consulta</option>
            <option value="consultaAcumulativa">Por consulta acumulativa</option>
            <option value="turnoAcumulativo">Por turno acumulativo</option>
            <option value="turnoVariablesBase">Por turno con variables base</option>
            <option value="loteAcumulativa">Por lote acumulativa</option>
          </select>
        </div>
      </div>

      <!-- DISPOSITIVO -->
      <div class="seccion-box-nuevo">
        <h3 class="subtitulo-seccion-nuevo">Dispositivo</h3>
        
        <h4 class="subseccion-label">Compañía</h4>
        <div class="campo-grupo-nuevo">
          <select v-model="companiaSeleccionada" class="campo-entrada-nuevo">
            <option v-for="comp in companias" :key="comp.id" :value="comp.id">
              {{ comp.nombre }}
            </option>
          </select>
        </div>

        <h4 class="subseccion-label">Planta</h4>
        <div class="campo-grupo-nuevo">
          <select v-model="plantaSeleccionada" class="campo-entrada-nuevo">
            <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
              {{ planta.nombre }}
            </option>
          </select>
        </div>

        <h4 class="subseccion-label">Línea</h4>
        <div class="campo-grupo-nuevo">
          <select v-model="lineaSeleccionada" class="campo-entrada-nuevo">
            <option v-for="linea in lineasFiltradas" :key="linea.id" :value="linea.id">
              {{ linea.nombre }}
            </option>
          </select>
        </div>

        <h4 class="subseccion-label">Locación</h4>
        <div class="campo-grupo-nuevo">
          <select v-model="locacionSeleccionada" class="campo-entrada-nuevo">
            <option v-for="locacion in locaciones" :key="locacion.id" :value="locacion.id">
              {{ locacion.nombre }}
            </option>
          </select>
        </div>

        <h4 class="subseccion-label">Dispositivo</h4>
        <div class="campo-grupo-nuevo">
          <select v-model="dispositivoSeleccionado" class="campo-entrada-nuevo">
            <option v-for="dispositivo in dispositivos" :key="dispositivo.id" :value="dispositivo.id">
              {{ dispositivo.nombre }}
            </option>
          </select>
        </div>
      </div>

      <!-- VARIABLES DE TIPO TIEMPO ACUMULATIVAS -->
      <div class="seccion-box-nuevo">
        <h3 class="subtitulo-seccion-nuevo">Variables de tipo Tiempo acumulativas</h3>
        
        <h4 class="subseccion-label">Tiempo disponible</h4>
        <div class="campo-grupo-nuevo">
          <select v-model="variableTiempoDisponible" class="campo-entrada-nuevo">
            <option v-for="variable in variablesTiempoDisponible" :key="variable.id" :value="variable.id">
              {{ variable.nombre }}
            </option>
          </select>
        </div>

        <h4 class="subseccion-label">Tiempo Parada Obligatoria</h4>
        <div class="campo-grupo-nuevo">
          <select v-model="variableParadaObligatoria" class="campo-entrada-nuevo">
            <option v-for="variable in variablesParadaObligatoria" :key="variable.id" :value="variable.id">
              {{ variable.nombre }}
            </option>
          </select>
        </div>

        <h4 class="subseccion-label">Tiempo Parada no Obligatoria</h4>
        <div class="campo-grupo-nuevo">
          <select v-model="variableParadaNoObligatoria" class="campo-entrada-nuevo">
            <option v-for="variable in variablesParadaNoObligatoria" :key="variable.id" :value="variable.id">
              {{ variable.nombre }}
            </option>
          </select>
        </div>

        <h4 class="subseccion-label">Tiempo de Microparadas</h4>
        <div class="campo-grupo-nuevo">
          <select v-model="variableMicroparadas" class="campo-entrada-nuevo">
            <option v-for="variable in variablesMicroparadas" :key="variable.id" :value="variable.id">
              {{ variable.nombre }}
            </option>
          </select>
        </div>

        <h4 class="subseccion-label">Producción en unidades</h4>
        <div class="campo-grupo-nuevo">
          <select v-model="variableProduccionUnidades" class="campo-entrada-nuevo">
            <option v-for="variable in variablesProduccionUnidades" :key="variable.id" :value="variable.id">
              {{ variable.nombre }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Botón Buscar -->
    <div class="seccion-buscar">
      <button @click="buscar" class="btn-buscar-principal">
        BUSCAR
      </button>
    </div>

    <!-- Visualización OEE -->
    <div v-if="datosOEE.length > 0" class="contenedor-visualizacion">
      <!-- Indicador OEE Principal -->
      <div class="indicador-oee-principal">
        <div class="indicador-content">
          <div class="indicador-label">OEE Global</div>
          <div class="indicador-valor" :style="{ color: getColorOEE(oeeGlobal) }">
            {{ oeeGlobal.toFixed(1) }}%
          </div>
          <div class="indicador-estado" :class="getClaseOEE(oeeGlobal)">
            {{ getEstadoOEE(oeeGlobal) }}
          </div>
        </div>
        <div class="indicador-visual">
          <svg viewBox="0 0 200 200" class="grafico-circular">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" stroke-width="20"/>
            <circle 
              cx="100" 
              cy="100" 
              r="80" 
              fill="none" 
              :stroke="getColorOEE(oeeGlobal)" 
              stroke-width="20"
              :stroke-dasharray="`${(oeeGlobal / 100) * 502.4} 502.4`"
              transform="rotate(-90 100 100)"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>

      <!-- Componentes OEE -->
      <div class="cards-componentes">
        <div class="card-componente disponibilidad">
          <div class="componente-header">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Disponibilidad</span>
          </div>
          <div class="componente-valor">{{ disponibilidadGlobal.toFixed(1) }}%</div>
          <div class="componente-barra">
            <div class="barra-progreso" :style="{ width: disponibilidadGlobal + '%', background: '#3b82f6' }"></div>
          </div>
          <div class="componente-formula">
            Tiempo Operativo / Tiempo Planificado
          </div>
        </div>

        <div class="card-componente rendimiento">
          <div class="componente-header">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Rendimiento</span>
          </div>
          <div class="componente-valor">{{ rendimientoGlobal.toFixed(1) }}%</div>
          <div class="componente-barra">
            <div class="barra-progreso" :style="{ width: rendimientoGlobal + '%', background: '#8b5cf6' }"></div>
          </div>
          <div class="componente-formula">
            Producción Real / Producción Teórica
          </div>
        </div>

        <div class="card-componente calidad">
          <div class="componente-header">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Calidad</span>
          </div>
          <div class="componente-valor">{{ calidadGlobal.toFixed(1) }}%</div>
          <div class="componente-barra">
            <div class="barra-progreso" :style="{ width: calidadGlobal + '%', background: '#10b981' }"></div>
          </div>
          <div class="componente-formula">
            Unidades Buenas / Total Producido
          </div>
        </div>
      </div>

      <!-- Gráfica Principal -->
      <div class="grafico-principal">
        <div class="grafico-header">
          <h3>Análisis Detallado OEE</h3>
          <button @click="exportarExcel" class="btn-exportar">
            Exportar Excel
          </button>
        </div>

        <!-- Gráfica de Barras -->
        <div v-if="tipoGrafica === 'barras'" class="grafico-container">
          <svg viewBox="0 0 1200 400" preserveAspectRatio="none">
            <!-- Grid -->
            <g v-for="i in 5" :key="'grid-' + i">
              <line
                :x1="80"
                :y1="50 + (i - 1) * 70"
                :x2="1150"
                :y2="50 + (i - 1) * 70"
                stroke="#e5e7eb"
                stroke-width="1"
              />
              <text
                :x="60"
                :y="50 + (i - 1) * 70 + 5"
                text-anchor="end"
                fill="#6b7280"
                font-size="12"
              >
                {{ 100 - (i - 1) * 25 }}%
              </text>
            </g>

            <!-- Barras -->
            <g v-for="(dato, index) in datosOEE" :key="'barra-' + index">
              <rect
                :x="80 + (index * (1070 / datosOEE.length)) + 10"
                :y="330 - (dato.oee * 2.8)"
                :width="(1070 / datosOEE.length) - 30"
                :height="dato.oee * 2.8"
                :fill="getColorOEE(dato.oee)"
                class="barra-oee"
                @mouseenter="mostrarTooltip($event, dato)"
                @mouseleave="ocultarTooltip"
              />
              <text
                :x="80 + (index * (1070 / datosOEE.length)) + (1070 / datosOEE.length) / 2"
                y="355"
                text-anchor="middle"
                fill="#6b7280"
                font-size="11"
              >
                {{ dato.label }}
              </text>
            </g>

            <!-- Eje X -->
            <line x1="80" y1="330" x2="1150" y2="330" stroke="#9ca3af" stroke-width="2"/>
          </svg>
        </div>

        <!-- Gráfica de Líneas -->
        <div v-else-if="tipoGrafica === 'lineas'" class="grafico-container">
          <svg viewBox="0 0 1200 400" preserveAspectRatio="none">
            <!-- Grid -->
            <g v-for="i in 5" :key="'grid-' + i">
              <line
                :x1="80"
                :y1="50 + (i - 1) * 70"
                :x2="1150"
                :y2="50 + (i - 1) * 70"
                stroke="#e5e7eb"
                stroke-width="1"
              />
              <text
                :x="60"
                :y="50 + (i - 1) * 70 + 5"
                text-anchor="end"
                fill="#6b7280"
                font-size="12"
              >
                {{ 100 - (i - 1) * 25 }}%
              </text>
            </g>

            <!-- Líneas -->
            <path :d="generarPath('oee')" stroke="#3b82f6" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path :d="generarPath('disponibilidad')" stroke="#8b5cf6" stroke-width="2" fill="none" stroke-dasharray="5,5"/>
            <path :d="generarPath('rendimiento')" stroke="#f59e0b" stroke-width="2" fill="none" stroke-dasharray="5,5"/>
            <path :d="generarPath('calidad')" stroke="#10b981" stroke-width="2" fill="none" stroke-dasharray="5,5"/>

            <!-- Puntos -->
            <g v-for="(dato, index) in datosOEE" :key="'punto-' + index">
              <circle
                :cx="80 + (index * (1070 / (datosOEE.length - 1)))"
                :cy="330 - (dato.oee * 2.8)"
                r="6"
                fill="#3b82f6"
                class="punto-grafico"
                @mouseenter="mostrarTooltip($event, dato)"
                @mouseleave="ocultarTooltip"
              />
            </g>

            <!-- Etiquetas -->
            <g v-for="(dato, index) in datosOEE" :key="'label-' + index">
              <text
                v-if="index % Math.ceil(datosOEE.length / 8) === 0"
                :x="80 + (index * (1070 / (datosOEE.length - 1)))"
                y="355"
                text-anchor="middle"
                fill="#6b7280"
                font-size="11"
              >
                {{ dato.label }}
              </text>
            </g>

            <!-- Eje X -->
            <line x1="80" y1="330" x2="1150" y2="330" stroke="#9ca3af" stroke-width="2"/>
          </svg>

          <!-- Leyenda -->
          <div class="grafico-leyenda">
            <span class="leyenda-item"><span class="leyenda-linea oee"></span> OEE</span>
            <span class="leyenda-item"><span class="leyenda-linea disponibilidad"></span> Disponibilidad</span>
            <span class="leyenda-item"><span class="leyenda-linea rendimiento"></span> Rendimiento</span>
            <span class="leyenda-item"><span class="leyenda-linea calidad"></span> Calidad</span>
          </div>
        </div>

        <!-- Gráfica Radar -->
        <div v-else class="grafico-radar-container">
          <svg viewBox="0 0 400 400">
            <!-- Círculos concéntricos -->
            <circle cx="200" cy="200" r="150" fill="none" stroke="#e5e7eb" stroke-width="1"/>
            <circle cx="200" cy="200" r="120" fill="none" stroke="#e5e7eb" stroke-width="1"/>
            <circle cx="200" cy="200" r="90" fill="none" stroke="#e5e7eb" stroke-width="1"/>
            <circle cx="200" cy="200" r="60" fill="none" stroke="#e5e7eb" stroke-width="1"/>
            <circle cx="200" cy="200" r="30" fill="none" stroke="#e5e7eb" stroke-width="1"/>

            <!-- Ejes -->
            <line x1="200" y1="200" x2="200" y2="50" stroke="#d1d5db" stroke-width="1"/>
            <line x1="200" y1="200" x2="320" y2="125" stroke="#d1d5db" stroke-width="1"/>
            <line x1="200" y1="200" x2="320" y2="275" stroke="#d1d5db" stroke-width="1"/>
            <line x1="200" y1="200" x2="80" y2="275" stroke="#d1d5db" stroke-width="1"/>
            <line x1="200" y1="200" x2="80" y2="125" stroke="#d1d5db" stroke-width="1"/>

            <!-- Polígono de datos -->
            <polygon
              :points="calcularPuntosRadar()"
              fill="#3b82f6"
              fill-opacity="0.3"
              stroke="#3b82f6"
              stroke-width="2"
            />

            <!-- Etiquetas -->
            <text x="200" y="35" text-anchor="middle" fill="#374151" font-weight="bold">OEE</text>
            <text x="335" y="120" text-anchor="start" fill="#374151" font-weight="bold">Disponibilidad</text>
            <text x="335" y="285" text-anchor="start" fill="#374151" font-weight="bold">Rendimiento</text>
            <text x="65" y="285" text-anchor="end" fill="#374151" font-weight="bold">Calidad</text>
            <text x="65" y="120" text-anchor="end" fill="#374151" font-weight="bold">Eficiencia</text>
          </svg>
        </div>
      </div>

      <!-- Tabla de Datos -->
      <div class="tabla-container">
        <table class="tabla-datos">
          <thead>
            <tr>
              <th>Período</th>
              <th>OEE (%)</th>
              <th>Disponibilidad (%)</th>
              <th>Rendimiento (%)</th>
              <th>Calidad (%)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dato in datosOEE" :key="dato.id">
              <td>{{ dato.label }}</td>
              <td>
                <span :class="['badge-oee', getClaseOEE(dato.oee)]">
                  {{ dato.oee.toFixed(1) }}%
                </span>
              </td>
              <td>{{ dato.disponibilidad.toFixed(1) }}%</td>
              <td>{{ dato.rendimiento.toFixed(1) }}%</td>
              <td>{{ dato.calidad.toFixed(1) }}%</td>
              <td>
                <span :class="['badge-estado', getClaseOEE(dato.oee)]">
                  {{ getEstadoOEE(dato.oee) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="tooltipVisible"
        class="tooltip-oee"
        :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
      >
        <div class="tooltip-titulo">{{ tooltipData.label }}</div>
        <div class="tooltip-linea">
          <strong>OEE:</strong> {{ tooltipData.oee?.toFixed(1) }}%
        </div>
        <div class="tooltip-linea">
          <strong>Disponibilidad:</strong> {{ tooltipData.disponibilidad?.toFixed(1) }}%
        </div>
        <div class="tooltip-linea">
          <strong>Rendimiento:</strong> {{ tooltipData.rendimiento?.toFixed(1) }}%
        </div>
        <div class="tooltip-linea">
          <strong>Calidad:</strong> {{ tooltipData.calidad?.toFixed(1) }}%
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Datos maestros
const companias = ref([
  { id: 1, nombre: 'Mentor Monitor S.A.' },
  { id: 2, nombre: 'Industrial Tech' }
])

const plantas = ref([
  { id: 1, nombre: 'Planta Norte', companiaId: 1 },
  { id: 2, nombre: 'Planta Sur', companiaId: 1 },
  { id: 3, nombre: 'Planta Central', companiaId: 2 }
])

const lineas = ref([
  { id: 1, nombre: 'Línea 1', plantaId: 1 },
  { id: 2, nombre: 'Línea 2', plantaId: 1 },
  { id: 3, nombre: 'Línea 3', plantaId: 2 }
])

const locaciones = ref([
  { id: 1, nombre: 'Linea 05 Locacion' },
  { id: 2, nombre: 'Zona A' },
  { id: 3, nombre: 'Zona B' }
])

const dispositivos = ref([
  { id: 1, nombre: 'Linea 05 Produccion' },
  { id: 2, nombre: 'Sensor Principal' },
  { id: 3, nombre: 'Medidor Central' }
])

// Variables de tipo tiempo acumulativas
const variablesTiempoDisponible = ref([
  { id: 1, nombre: 'T_Disponible (PLC-L5-Tiempo Disponible Mentor)' }
])

const variablesParadaObligatoria = ref([
  { id: 1, nombre: 'LS-T-PP Refrigerio (L5-Tiempo-Parada-Refrigerio)' }
])

const variablesParadaNoObligatoria = ref([
  { id: 1, nombre: 'LS-T-PNP General (L5-Tiempo-Parada No Programada)' }
])

const variablesMicroparadas = ref([
  { id: 1, nombre: 'LS-T-Microparadas (L5-Tiempo-Microparadas)' }
])

const variablesProduccionUnidades = ref([
  { id: 1, nombre: 'C_Unit_P (PLC-Ls-Conteo unidades producidas)' },
  { id: 2, nombre: 'Produccion Total' },
  { id: 3, nombre: 'Unidades Totales' }
])

// Selecciones
const companiaSeleccionada = ref(1)
const plantaSeleccionada = ref(1)
const lineaSeleccionada = ref(1)
const locacionSeleccionada = ref(1)
const dispositivoSeleccionado = ref(1)
const tipoGrafica = ref('barras')
const tipoConsulta = ref('lote')

// Variables seleccionadas
const variableTiempoDisponible = ref(1)
const variableParadaObligatoria = ref(1)
const variableParadaNoObligatoria = ref(1)
const variableMicroparadas = ref(1)
const variableProduccionUnidades = ref(1)

// Fechas
const fechaInicio = ref('2025/11/01 00:00')
const fechaFin = ref('2025/11/19 23:59')

const fechaInicioInput = computed({
  get: () => fechaInicio.value.replace(' ', 'T').replace(/\//g, '-'),
  set: (val) => fechaInicio.value = val.replace('T', ' ').replace(/-/g, '/')
})

const fechaFinInput = computed({
  get: () => fechaFin.value.replace(' ', 'T').replace(/\//g, '-'),
  set: (val) => fechaFin.value = val.replace('T', ' ').replace(/-/g, '/')
})

// Filtros
const plantasFiltradas = computed(() => {
  return plantas.value.filter(p => p.companiaId === companiaSeleccionada.value)
})

const lineasFiltradas = computed(() => {
  return lineas.value.filter(l => l.plantaId === plantaSeleccionada.value)
})

// Datos
const datosOEE = ref([])

// Tooltip
const tooltipVisible = ref(false)
const tooltipX = ref(0)
const tooltipY = ref(0)
const tooltipData = ref({})

// Valores globales
const oeeGlobal = computed(() => {
  const suma = datosOEE.value.reduce((acc, d) => acc + d.oee, 0)
  return suma / datosOEE.value.length || 0
})

const disponibilidadGlobal = computed(() => {
  const suma = datosOEE.value.reduce((acc, d) => acc + d.disponibilidad, 0)
  return suma / datosOEE.value.length || 0
})

const rendimientoGlobal = computed(() => {
  const suma = datosOEE.value.reduce((acc, d) => acc + d.rendimiento, 0)
  return suma / datosOEE.value.length || 0
})

const calidadGlobal = computed(() => {
  const suma = datosOEE.value.reduce((acc, d) => acc + d.calidad, 0)
  return suma / datosOEE.value.length || 0
})

function buscar() {
  generarDatosOEE()
}

function generarDatosOEE() {
  const datos = []
  const numDias = 19

  for (let i = 0; i < numDias; i++) {
    const disponibilidad = 75 + Math.random() * 20
    const rendimiento = 80 + Math.random() * 15
    const calidad = 92 + Math.random() * 7
    const oee = (disponibilidad * rendimiento * calidad) / 10000

    datos.push({
      id: i + 1,
      label: `${i + 1}/11`,
      oee: oee,
      disponibilidad: disponibilidad,
      rendimiento: rendimiento,
      calidad: calidad
    })
  }

  datosOEE.value = datos
}

function generarPath(metrica) {
  if (datosOEE.value.length === 0) return ''
  
  const puntos = datosOEE.value.map((punto, index) => {
    const x = 80 + (index * (1070 / (datosOEE.value.length - 1)))
    const y = 330 - (punto[metrica] * 2.8)
    return `${x},${y}`
  })
  
  return `M ${puntos.join(' L ')}`
}

function calcularPuntosRadar() {
  const promedio = {
    oee: oeeGlobal.value,
    disponibilidad: disponibilidadGlobal.value,
    rendimiento: rendimientoGlobal.value,
    calidad: calidadGlobal.value,
    eficiencia: (oeeGlobal.value + disponibilidadGlobal.value) / 2
  }

  const valores = [
    promedio.oee,
    promedio.disponibilidad,
    promedio.rendimiento,
    promedio.calidad,
    promedio.eficiencia
  ]

  const angulos = [0, 72, 144, 216, 288]
  const puntos = valores.map((valor, i) => {
    const radio = (valor / 100) * 150
    const angulo = (angulos[i] - 90) * (Math.PI / 180)
    const x = 200 + radio * Math.cos(angulo)
    const y = 200 + radio * Math.sin(angulo)
    return `${x},${y}`
  })

  return puntos.join(' ')
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

function mostrarTooltip(event, dato) {
  tooltipData.value = dato
  tooltipX.value = event.clientX + 10
  tooltipY.value = event.clientY + 10
  tooltipVisible.value = true
}

function ocultarTooltip() {
  tooltipVisible.value = false
}

function exportarExcel() {
  if (datosOEE.value.length === 0) {
    alert('No hay datos para exportar')
    return
  }

  const compania = companias.value.find(c => c.id === companiaSeleccionada.value)?.nombre || 'Empresa'
  const fechaReporte = new Date().toISOString().split('T')[0]

  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#001f54" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Gráfica OEE">
  <Table>
   <Row>
    <Cell ss:StyleID="header"><Data ss:Type="String">Período</Data></Cell>
    <Cell ss:StyleID="header"><Data ss:Type="String">OEE (%)</Data></Cell>
    <Cell ss:StyleID="header"><Data ss:Type="String">Disponibilidad (%)</Data></Cell>
    <Cell ss:StyleID="header"><Data ss:Type="String">Rendimiento (%)</Data></Cell>
    <Cell ss:StyleID="header"><Data ss:Type="String">Calidad (%)</Data></Cell>
    <Cell ss:StyleID="header"><Data ss:Type="String">Estado</Data></Cell>
   </Row>`

  datosOEE.value.forEach(dato => {
    xml += `
   <Row>
    <Cell><Data ss:Type="String">${dato.label}</Data></Cell>
    <Cell><Data ss:Type="Number">${dato.oee.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="Number">${dato.disponibilidad.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="Number">${dato.rendimiento.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="Number">${dato.calidad.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="String">${getEstadoOEE(dato.oee)}</Data></Cell>
   </Row>`
  })

  xml += `
  </Table>
 </Worksheet>
</Workbook>`

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Grafica_OEE_${fechaReporte}.xls`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  generarDatosOEE()
})
</script>

<style scoped>
.grafica-oee {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.titulo-principal {
  background: #001f54;
  color: white;
  padding: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  border-radius: 8px;
  letter-spacing: 1px;
}

/* Nuevos estilos del formulario */
.formulario-grid-nuevo {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.seccion-box-nuevo {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
}

.subtitulo-seccion-nuevo {
  background: #001f54;
  color: white;
  padding: 0.625rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.subseccion-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #475569;
  margin: 0.75rem 0 0.375rem 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.campo-grupo-nuevo {
  margin-bottom: 1rem;
}

.campo-grupo-nuevo label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.campo-entrada-nuevo {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.campo-entrada-nuevo:focus {
  outline: none;
  border-color: #001f54;
  box-shadow: 0 0 0 3px rgba(0, 31, 84, 0.1);
}

.campo-grupo-botones {
  display: flex;
  gap: 0.5rem;
}

.btn-tipo-grafico {
  flex: 1;
  padding: 0.625rem;
  background: white;
  border: 1.5px solid #cbd5e1;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-tipo-grafico:hover {
  border-color: #001f54;
  color: #001f54;
}

.btn-tipo-grafico.active {
  background: #001f54;
  border-color: #001f54;
  color: white;
}

.seccion-buscar {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn-buscar-principal {
  background: #001f54;
  color: white;
  border: none;
  padding: 0.875rem 3rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 31, 84, 0.2);
  letter-spacing: 0.5px;
}

.btn-buscar-principal:hover {
  background: #001238;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 31, 84, 0.3);
}

/* Estilos existentes */
.subtitulo-seccion {
  background: #001f54;
  color: white;
  padding: 0.75rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  border-radius: 4px;
}

.formulario-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.seccion-box {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
}

.campo-grupo {
  margin-bottom: 1rem;
}

.campo-grupo label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.campo-entrada {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-buscar {
  width: 100%;
  padding: 0.75rem;
  background: #4a4a4a;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.btn-buscar:hover {
  background: #333;
}

.contenedor-visualizacion {
  margin-top: 2rem;
}

.indicador-oee-principal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.indicador-content {
  flex: 1;
}

.indicador-label {
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.indicador-valor {
  font-size: 4rem;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.indicador-estado {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  display: inline-block;
}

.indicador-estado.excelente {
  background: #dcfce7;
  color: #166534;
}

.indicador-estado.aceptable {
  background: #fef3c7;
  color: #92400e;
}

.indicador-estado.critico {
  background: #fee2e2;
  color: #991b1b;
}

.indicador-visual {
  width: 200px;
  height: 200px;
}

.grafico-circular {
  width: 100%;
  height: 100%;
}

.cards-componentes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card-componente {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.componente-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #374151;
  font-weight: 600;
}

.componente-header svg {
  color: #3b82f6;
}

.componente-valor {
  font-size: 2rem;
  font-weight: bold;
  color: #001f54;
  margin-bottom: 0.75rem;
}

.componente-barra {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.barra-progreso {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.componente-formula {
  font-size: 0.75rem;
  color: #9ca3af;
  font-style: italic;
}

.grafico-principal {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.grafico-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.grafico-header h3 {
  font-size: 1.25rem;
  color: #001f54;
  margin: 0;
}

.btn-exportar {
  padding: 0.5rem 1.5rem;
  background: #001f54;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.btn-exportar:hover {
  background: #002a75;
}

.grafico-container {
  margin: 2rem 0;
}

.grafico-container svg {
  width: 100%;
  height: auto;
}

.barra-oee {
  cursor: pointer;
  transition: opacity 0.2s;
}

.barra-oee:hover {
  opacity: 0.8;
}

.punto-grafico {
  cursor: pointer;
  transition: r 0.2s;
}

.punto-grafico:hover {
  r: 8;
}

.grafico-leyenda {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.leyenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.leyenda-linea {
  width: 40px;
  height: 3px;
  display: block;
}

.leyenda-linea.oee {
  background: #3b82f6;
}

.leyenda-linea.disponibilidad {
  background: #8b5cf6;
}

.leyenda-linea.rendimiento {
  background: #f59e0b;
}

.leyenda-linea.calidad {
  background: #10b981;
}

.grafico-radar-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.grafico-radar-container svg {
  max-width: 400px;
  height: auto;
}

.tabla-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.tabla-datos {
  width: 100%;
  border-collapse: collapse;
}

.tabla-datos thead {
  background: #001f54;
  color: white;
}

.tabla-datos th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

.tabla-datos td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
}

.tabla-datos tbody tr:hover {
  background: #f9fafb;
}

.badge-oee, .badge-estado {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-oee.excelente, .badge-estado.excelente {
  background: #dcfce7;
  color: #166534;
}

.badge-oee.aceptable, .badge-estado.aceptable {
  background: #fef3c7;
  color: #92400e;
}

.badge-oee.critico, .badge-estado.critico {
  background: #fee2e2;
  color: #991b1b;
}

.tooltip-oee {
  position: fixed;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  pointer-events: none;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 300px;
}

.tooltip-titulo {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.5rem;
}

.tooltip-linea {
  margin: 0.25rem 0;
}

@media (max-width: 1024px) {
  .formulario-grid {
    grid-template-columns: 1fr;
  }

  .cards-componentes {
    grid-template-columns: 1fr;
  }
}
</style>
