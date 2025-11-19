<template>
  <div class="grafica-pareto">
    <!-- Encabezado -->
    <div class="titulo-principal">
      GRÁFICA DE PARETO
    </div>

    <!-- Mensaje de selección -->
    <div class="mensaje-seleccion">
      Seleccione las variables:
    </div>

    <!-- Formulario de Filtros - 3 Columnas -->
    <div class="formulario-grid-nuevo">
      <!-- FECHAS -->
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
      </div>

      <!-- VARIABLE DE AGRUPAMIENTO Y CONSULTA -->
      <div class="seccion-box-nuevo">
        <h3 class="subtitulo-seccion-nuevo">Variable de Agrupamiento</h3>
        <div class="campo-grupo-nuevo">
          <select v-model="variableAgrupamiento" class="campo-entrada-nuevo">
            <option v-for="variable in variablesAgrupamiento" :key="variable.id" :value="variable.id">
              {{ variable.nombre }}
            </option>
          </select>
        </div>

        <h3 class="subtitulo-seccion-nuevo">Variable de datos</h3>
        <div class="campo-grupo-nuevo">
          <select v-model="variableDatos" class="campo-entrada-nuevo">
            <option v-for="variable in variablesDatos" :key="variable.id" :value="variable.id">
              {{ variable.nombre }}
            </option>
          </select>
        </div>

        <h4 class="subseccion-label">CONSULTA</h4>
        <div class="campo-grupo-nuevo">
          <select v-model="tipoConsulta" class="campo-entrada-nuevo">
            <option value="paradas">Paradas Programadas</option>
            <option value="tipo">(Por consulta)</option>
          </select>
        </div>

        <h4 class="subseccion-label">Tipo</h4>
        <div class="campo-grupo-nuevo">
          <select v-model="tipoParada" class="campo-entrada-nuevo">
            <option value="consulta">(Por consulta)</option>
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

    <!-- Gráfica de Pareto -->
    <div v-if="datosPareto.length > 0" class="contenedor-pareto">
      <div class="pareto-header">
        <h3>Análisis de Pareto - {{ getTituloAnalisis() }}</h3>
        <button @click="exportarExcel" class="btn-exportar">
          Exportar Excel
        </button>
      </div>

      <!-- Principio 80/20 -->
      <div class="principio-8020">
        <div class="card-principio">
          <div class="principio-titulo">Principio 80/20</div>
          <div class="principio-descripcion">
            El <strong>{{ porcentaje8020 }}%</strong> de las causas representan el <strong>80%</strong> del impacto total
          </div>
          <div class="principio-causas">
            <strong>Causas vitales ({{ causasVitales.length }}):</strong>
            {{ causasVitales.map(c => c.categoria).join(', ') }}
          </div>
        </div>
      </div>

      <!-- Gráfico Pareto -->
      <div class="grafico-container">
        <svg viewBox="0 0 1200 500" preserveAspectRatio="none">
          <!-- Grid -->
          <g v-for="i in 5" :key="'grid-' + i">
            <line
              :x1="100"
              :y1="50 + (i - 1) * 80"
              :x2="1150"
              :y2="50 + (i - 1) * 80"
              stroke="#e5e7eb"
              stroke-width="1"
            />
            <text
              :x="80"
              :y="50 + (i - 1) * 80 + 5"
              text-anchor="end"
              fill="#6b7280"
              font-size="12"
            >
              {{ (100 - (i - 1) * 25) }}
            </text>
          </g>

          <!-- Barras -->
          <g v-for="(dato, index) in datosPareto" :key="'barra-' + index">
            <rect
              :x="100 + (index * (1050 / datosPareto.length)) + 10"
              :y="370 - (dato.valor / valorMaximo * 320)"
              :width="(1050 / datosPareto.length) - 30"
              :height="dato.valor / valorMaximo * 320"
              fill="#3b82f6"
              class="barra-pareto"
              @mouseenter="mostrarTooltip($event, dato)"
              @mouseleave="ocultarTooltip"
            />
            <text
              :x="100 + (index * (1050 / datosPareto.length)) + (1050 / datosPareto.length) / 2"
              y="460"
              text-anchor="end"
              fill="#374151"
              font-size="11"
              transform="rotate(-45 100 460)"
            >
              {{ dato.categoria }}
            </text>
          </g>

          <!-- Línea acumulativa -->
          <path
            :d="generarPathAcumulado()"
            stroke="#ef4444"
            stroke-width="3"
            fill="none"
            stroke-linecap="round"
          />

          <!-- Puntos acumulados -->
          <g v-for="(dato, index) in datosPareto" :key="'punto-' + index">
            <circle
              :cx="100 + (index * (1050 / datosPareto.length)) + (1050 / datosPareto.length) / 2"
              :cy="370 - (dato.porcentajeAcumulado * 3.2)"
              r="5"
              fill="#ef4444"
              class="punto-acumulado"
            />
            <text
              :x="100 + (index * (1050 / datosPareto.length)) + (1050 / datosPareto.length) / 2"
              :y="370 - (dato.porcentajeAcumulado * 3.2) - 10"
              text-anchor="middle"
              fill="#ef4444"
              font-size="11"
              font-weight="bold"
            >
              {{ dato.porcentajeAcumulado.toFixed(0) }}%
            </text>
          </g>

          <!-- Línea 80% -->
          <line x1="100" y1="114" x2="1150" y2="114" stroke="#22c55e" stroke-width="2" stroke-dasharray="5,5"/>
          <text x="1160" y="118" fill="#22c55e" font-size="12" font-weight="bold">80%</text>

          <!-- Eje X -->
          <line x1="100" y1="370" x2="1150" y2="370" stroke="#9ca3af" stroke-width="2"/>

          <!-- Eje Y derecho (porcentaje) -->
          <g v-for="i in 5" :key="'grid-right-' + i">
            <text
              x="1170"
              :y="50 + (i - 1) * 80 + 5"
              text-anchor="start"
              fill="#ef4444"
              font-size="12"
              font-weight="bold"
            >
              {{ (100 - (i - 1) * 25) }}%
            </text>
          </g>
        </svg>

        <!-- Leyenda -->
        <div class="grafico-leyenda">
          <span class="leyenda-item">
            <span class="leyenda-cuadro" style="background: #3b82f6"></span> Frecuencia
          </span>
          <span class="leyenda-item">
            <span class="leyenda-linea" style="background: #ef4444"></span> % Acumulado
          </span>
          <span class="leyenda-item">
            <span class="leyenda-linea-punteada"></span> Regla 80/20
          </span>
        </div>
      </div>

      <!-- Tabla de Datos -->
      <div class="tabla-container">
        <table class="tabla-datos">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Frecuencia</th>
              <th>Porcentaje</th>
              <th>% Acumulado</th>
              <th>Clasificación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dato in datosPareto" :key="dato.id">
              <td>{{ dato.categoria }}</td>
              <td>{{ dato.valor.toLocaleString() }}</td>
              <td>{{ dato.porcentaje.toFixed(1) }}%</td>
              <td>
                <div class="celda-acumulado">
                  <span>{{ dato.porcentajeAcumulado.toFixed(1) }}%</span>
                  <div class="barra-acumulado">
                    <div 
                      class="barra-progreso-acumulado" 
                      :style="{ width: dato.porcentajeAcumulado + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['badge-clasificacion', dato.clasificacion.toLowerCase()]">
                  {{ dato.clasificacion }}
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td><strong>TOTAL</strong></td>
              <td><strong>{{ totalFrecuencia.toLocaleString() }}</strong></td>
              <td><strong>100%</strong></td>
              <td><strong>-</strong></td>
              <td><strong>-</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="tooltipVisible"
        class="tooltip-pareto"
        :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
      >
        <div class="tooltip-titulo">{{ tooltipData.categoria }}</div>
        <div class="tooltip-linea">
          <strong>Frecuencia:</strong> {{ tooltipData.valor?.toLocaleString() }}
        </div>
        <div class="tooltip-linea">
          <strong>Porcentaje:</strong> {{ tooltipData.porcentaje?.toFixed(1) }}%
        </div>
        <div class="tooltip-linea">
          <strong>% Acumulado:</strong> {{ tooltipData.porcentajeAcumulado?.toFixed(1) }}%
        </div>
        <div class="tooltip-linea">
          <strong>Clasificación:</strong> {{ tooltipData.clasificacion }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Datos maestros
const companias = ref([
  { id: 1, nombre: 'Industrias San Miguel' },
  { id: 2, nombre: 'Industrial Tech' }
])

const plantas = ref([
  { id: 1, nombre: 'ISM Arequipa', companiaId: 1 },
  { id: 2, nombre: 'Planta Sur', companiaId: 1 },
  { id: 3, nombre: 'Planta Central', companiaId: 2 }
])

const lineas = ref([
  { id: 1, nombre: 'LINEA 05', plantaId: 1 },
  { id: 2, nombre: 'Línea 2', plantaId: 1 },
  { id: 3, nombre: 'Línea 3', plantaId: 2 }
])

const locaciones = ref([
  { id: 1, nombre: 'Linea 05 Locacion' },
  { id: 2, nombre: 'Zona A' },
  { id: 3, nombre: 'Zona B' }
])

const variablesAgrupamiento = ref([
  { id: 1, nombre: '→ Tipo PP (PLC-L5-Tipo de Parada Programada)' },
  { id: 2, nombre: 'Tipo Parada General' },
  { id: 3, nombre: 'Categoría Producto' }
])

const variablesDatos = ref([
  { id: 1, nombre: '→ Tipo PNP (PLC-L5-Tipo de Parada No Programada)' },
  { id: 2, nombre: 'Tiempo Total Parada' },
  { id: 3, nombre: 'Frecuencia Eventos' }
])

// Selecciones
const companiaSeleccionada = ref(1)
const plantaSeleccionada = ref(1)
const lineaSeleccionada = ref(1)
const locacionSeleccionada = ref(1)
const variableAgrupamiento = ref(1)
const variableDatos = ref(1)
const tipoConsulta = ref('paradas')
const tipoParada = ref('consulta')

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
const datosPareto = ref([])

// Tooltip
const tooltipVisible = ref(false)
const tooltipX = ref(0)
const tooltipY = ref(0)
const tooltipData = ref({})

// Computados
const valorMaximo = computed(() => {
  return Math.max(...datosPareto.value.map(d => d.valor))
})

const totalFrecuencia = computed(() => {
  return datosPareto.value.reduce((sum, d) => sum + d.valor, 0)
})

const causasVitales = computed(() => {
  return datosPareto.value.filter(d => d.porcentajeAcumulado <= 80)
})

const porcentaje8020 = computed(() => {
  return ((causasVitales.value.length / datosPareto.value.length) * 100).toFixed(0)
})

function buscar() {
  generarDatosPareto()
}

function generarDatosPareto() {
  const categorias = {
    'paradas': [
      'Falta de Material', 'Mantenimiento Correctivo', 'Cambio de Producto',
      'Avería Mecánica', 'Falla Eléctrica', 'Ajuste de Línea',
      'Falta de Personal', 'Parada Programada', 'Otros'
    ],
    'defectos': [
      'Defecto Dimensional', 'Defecto Visual', 'Contaminación',
      'Defecto de Empaque', 'Peso Incorrecto', 'Etiquetado Incorrecto',
      'Daño en Transporte', 'Otros'
    ],
    'productos': [
      'Producto A', 'Producto B', 'Producto C', 'Producto D',
      'Producto E', 'Producto F', 'Producto G', 'Producto H'
    ]
  }

  const categoriasSeleccionadas = categorias['paradas']
  const valores = categoriasSeleccionadas.map(() => Math.floor(Math.random() * 500) + 50)
  
  // Ordenar de mayor a menor
  const datosOrdenados = categoriasSeleccionadas.map((cat, i) => ({
    categoria: cat,
    valor: valores[i]
  })).sort((a, b) => b.valor - a.valor)

  // Calcular porcentajes y acumulados
  const total = datosOrdenados.reduce((sum, d) => sum + d.valor, 0)
  let acumulado = 0

  const datos = datosOrdenados.map((dato, index) => {
    const porcentaje = (dato.valor / total) * 100
    acumulado += porcentaje
    
    let clasificacion = 'C'
    if (acumulado <= 80) clasificacion = 'A'
    else if (acumulado <= 95) clasificacion = 'B'

    return {
      id: index + 1,
      categoria: dato.categoria,
      valor: dato.valor,
      porcentaje: porcentaje,
      porcentajeAcumulado: acumulado,
      clasificacion: clasificacion
    }
  })

  datosPareto.value = datos
}

function generarPathAcumulado() {
  if (datosPareto.value.length === 0) return ''
  
  const puntos = datosPareto.value.map((dato, index) => {
    const x = 100 + (index * (1050 / datosPareto.value.length)) + (1050 / datosPareto.value.length) / 2
    const y = 370 - (dato.porcentajeAcumulado * 3.2)
    return `${x},${y}`
  })
  
  return `M ${puntos.join(' L ')}`
}

function getTituloAnalisis() {
  return 'Paradas Programadas'
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
  if (datosPareto.value.length === 0) {
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
 <Worksheet ss:Name="Gráfica Pareto">
  <Table>
   <Row>
    <Cell ss:StyleID="header"><Data ss:Type="String">Categoría</Data></Cell>
    <Cell ss:StyleID="header"><Data ss:Type="String">Frecuencia</Data></Cell>
    <Cell ss:StyleID="header"><Data ss:Type="String">Porcentaje</Data></Cell>
    <Cell ss:StyleID="header"><Data ss:Type="String">% Acumulado</Data></Cell>
    <Cell ss:StyleID="header"><Data ss:Type="String">Clasificación</Data></Cell>
   </Row>`

  datosPareto.value.forEach(dato => {
    xml += `
   <Row>
    <Cell><Data ss:Type="String">${dato.categoria}</Data></Cell>
    <Cell><Data ss:Type="Number">${dato.valor}</Data></Cell>
    <Cell><Data ss:Type="Number">${dato.porcentaje.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="Number">${dato.porcentajeAcumulado.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="String">${dato.clasificacion}</Data></Cell>
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
  link.download = `Grafica_Pareto_${fechaReporte}.xls`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  generarDatosPareto()
})
</script>

<style scoped>
.grafica-pareto {
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

/* Nuevos estilos */
.mensaje-seleccion {
  background: white;
  border-left: 4px solid #001f54;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #001f54;
  border-radius: 4px;
}

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

/* Estilos antiguos */
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

.contenedor-pareto {
  margin-top: 2rem;
}

.pareto-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #001f54;
  color: white;
  border-radius: 8px;
}

.pareto-header h3 {
  font-size: 1.25rem;
  margin: 0;
}

.btn-exportar {
  padding: 0.5rem 1.5rem;
  background: white;
  color: #001f54;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.btn-exportar:hover {
  background: #f3f4f6;
}

.principio-8020 {
  margin-bottom: 2rem;
}

.card-principio {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.principio-titulo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.principio-descripcion {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.principio-causas {
  font-size: 0.95rem;
  opacity: 0.9;
}

.grafico-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.grafico-container svg {
  width: 100%;
  height: auto;
}

.barra-pareto {
  cursor: pointer;
  transition: opacity 0.2s;
}

.barra-pareto:hover {
  opacity: 0.8;
}

.punto-acumulado {
  cursor: pointer;
}

.grafico-leyenda {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
}

.leyenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.leyenda-cuadro {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.leyenda-linea {
  width: 40px;
  height: 3px;
  display: block;
}

.leyenda-linea-punteada {
  width: 40px;
  height: 2px;
  background: repeating-linear-gradient(
    to right,
    #22c55e 0,
    #22c55e 5px,
    transparent 5px,
    transparent 10px
  );
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

.tabla-datos tfoot {
  background: #f9fafb;
  font-weight: bold;
}

.tabla-datos tbody tr:hover {
  background: #f9fafb;
}

.celda-acumulado {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.barra-acumulado {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.barra-progreso-acumulado {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #ef4444);
  transition: width 0.3s ease;
}

.badge-clasificacion {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-clasificacion.a {
  background: #fee2e2;
  color: #991b1b;
}

.badge-clasificacion.b {
  background: #fef3c7;
  color: #92400e;
}

.badge-clasificacion.c {
  background: #dcfce7;
  color: #166534;
}

.tooltip-pareto {
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
}
</style>
