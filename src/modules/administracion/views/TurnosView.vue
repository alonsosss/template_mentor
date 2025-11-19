<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Alert from '@/shared/components/ui/Alert.vue'
import { useApi } from '@/shared/composables/useApi'

const { loading, error, execute } = useApi()

const tabActiva = ref('PATRON - SEMANAL')

const empresas = ref([
  { id: 1, nombre: 'Industrias San Miguel' }
])

const plantas = ref([
  { id: 1, empresaId: 1, nombre: 'ISM Arequipa' }
])

const lineas = ref([
  { id: 1, nombre: 'LÍNEA 05' }
])

const empresaSeleccionada = ref(1)
const plantaSeleccionada = ref(1)
const lineaSeleccionada = ref(1)

const plantasFiltradas = computed(() => {
  if (!empresaSeleccionada.value) return []
  return plantas.value.filter(p => p.empresaId === parseInt(empresaSeleccionada.value))
})

const turnos = ref([
  { id: 1, nombre: 'C', linea: 'LÍNEA 05', patron: 'Patron AGP 3 Turnos', turnoPatron: 2, color: '#ff7f0e' },
  { id: 2, nombre: 'B', linea: 'LÍNEA 05', patron: 'Patron AGP 3 Turnos', turnoPatron: 3, color: '#2ca02c' },
  { id: 3, nombre: 'A', linea: 'LÍNEA 05', patron: 'Patron AGP 3 Turnos', turnoPatron: 1, color: '#1f77b4' }
])

const turnoPatronOptions = ref([
  { id: 1, nombre: 'Turno patrón 1' }
])

const turnoSiguienteSemana = ref('')
const editarSemana = ref(false)

const mostrarModalEditar = ref(false)
const diaSeleccionado = ref(0)
const horaSeleccionada = ref(0)
const minutoSeleccionado = ref(0)
const turnoSeleccionadoEditar = ref('')
const fechaInicioEditar = ref('')
const fechaFinEditar = ref('')

const currentPage = ref(1)
const itemsPerPage = 10

const turnosPaginados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return turnos.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(turnos.value.length / itemsPerPage))

const semanas = ref([
  {
    numero: 47,
    inicio: '2025/11/17',
    fin: '2025/11/23',
    horarios: {}
  }
])

const semanaActual = ref(0)

function generateDefaultSchedule() {
  const schedule = {}
  const dias = 7
  const horas = 24
  
  for (let dia = 0; dia < dias; dia++) {
    schedule[dia] = {}
    for (let hora = 0; hora < horas; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const key = `${hora}-${minuto}`
        if (hora < 6) {
          schedule[dia][key] = 1
        } else if (hora < 18) {
          schedule[dia][key] = 2
        } else {
          schedule[dia][key] = 3
        }
      }
    }
  }
  return schedule
}

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

function obtenerColorCelda(dia, hora, minuto) {
  const semana = semanas.value[semanaActual.value]
  if (!semana || !semana.horarios) return 'transparent'
  
  const key = `${hora}-${minuto}`
  const turnoId = semana.horarios[dia]?.[key]
  const turno = turnos.value.find(t => t.turnoPatron === turnoId)
  
  return turno ? turno.color : 'transparent'
}

function clickCelda(dia, hora, minuto) {
  if (!editarSemana.value) return
  
  diaSeleccionado.value = dia
  horaSeleccionada.value = hora
  minutoSeleccionado.value = minuto
  
  const semana = semanas.value[semanaActual.value]
  const key = `${hora}-${minuto}`
  const turnoId = semana.horarios[dia]?.[key]
  const turno = turnos.value.find(t => t.turnoPatron === turnoId)
  
  turnoSeleccionadoEditar.value = turno ? turno.nombre : ''
  
  const fecha = new Date(semana.inicio)
  fecha.setDate(fecha.getDate() + dia)
  const fechaStr = fecha.toISOString().split('T')[0]
  
  fechaInicioEditar.value = `${fechaStr} ${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`
  fechaFinEditar.value = `${fechaStr} ${String(hora).padStart(2, '0')}:${String(minuto + 30).padStart(2, '0')}`
  
  mostrarModalEditar.value = true
}

function eliminarBloque() {
  const semana = semanas.value[semanaActual.value]
  const key = `${horaSeleccionada.value}-${minutoSeleccionado.value}`
  
  if (semana.horarios[diaSeleccionado.value]) {
    delete semana.horarios[diaSeleccionado.value][key]
  }
  
  mostrarModalEditar.value = false
}

function actualizarBloque() {
  if (!turnoSeleccionadoEditar.value) return
  
  const turno = turnos.value.find(t => t.nombre === turnoSeleccionadoEditar.value)
  if (!turno) return
  
  const semana = semanas.value[semanaActual.value]
  const key = `${horaSeleccionada.value}-${minutoSeleccionado.value}`
  
  if (!semana.horarios[diaSeleccionado.value]) {
    semana.horarios[diaSeleccionado.value] = {}
  }
  
  semana.horarios[diaSeleccionado.value][key] = turno.turnoPatron
  
  mostrarModalEditar.value = false
}

function cancelarEdicion() {
  mostrarModalEditar.value = false
}

function calcularSiguienteSemana() {
  console.log('Calcular siguiente semana')
}

function guardarConfiguracion() {
  console.log('Guardar configuración')
}

function agregarLinea() {
  console.log('Agregar línea')
}

function anteriorSemana() {
  if (semanaActual.value > 0) {
    semanaActual.value--
  }
}

function siguienteSemana() {
  if (semanaActual.value < semanas.value.length - 1) {
    semanaActual.value++
  }
}

const saveSuccess = ref(false)
const saveError = ref('')

onMounted(() => {
  semanas.value[0].horarios = generateDefaultSchedule()
})
</script>

<template>
  <div class="turnos-view">
    <div class="page-header">
      <h1 class="page-title">CONFIGURACIÓN DE TURNOS - {{ tabActiva }}</h1>
    </div>

    <Alert v-if="saveSuccess" type="success" message="Configuración guardada correctamente" class="mb-4" />
    <Alert v-if="saveError" type="error" :message="saveError" class="mb-4" />

    <Card class="content-card">
      <div class="tabs-header">
        <button 
          :class="['tab-button', { 'tab-active': tabActiva === 'PATRON - SEMANAL' }]"
          @click="tabActiva = 'PATRON - SEMANAL'"
        >
          PATRON - SEMANAL
        </button>
        <button 
          :class="['tab-button', { 'tab-active': tabActiva === 'TURNO - SEMANAL' }]"
          @click="tabActiva = 'TURNO - SEMANAL'"
        >
          TURNO - SEMANAL
        </button>
      </div>

      <div v-if="tabActiva === 'TURNO - SEMANAL'" class="tab-content">
        <div class="action-section">
          <Button variant="primary" size="sm" @click="calcularSiguienteSemana">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            CALCULAR SIGUIENTE SEMANA DE ESTA PLANTA
          </Button>
          <Button variant="secondary" size="sm" @click="guardarConfiguracion">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            GUARDAR
          </Button>
          <Button variant="primary" size="sm" @click="agregarLinea">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            AGREGAR
          </Button>
        </div>

        <div class="filtros-row">
          <div class="filter-item">
            <label class="filter-label">Empresas</label>
            <select v-model="empresaSeleccionada" class="filter-select">
              <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
                {{ empresa.nombre }}
              </option>
            </select>
          </div>

          <div class="filter-item">
            <label class="filter-label">Planta</label>
            <select v-model="plantaSeleccionada" class="filter-select" :disabled="!empresaSeleccionada">
              <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
                {{ planta.nombre }}
              </option>
            </select>
          </div>

          <div class="filter-item">
            <label class="filter-label">Líneas</label>
            <select v-model="lineaSeleccionada" class="filter-select">
              <option v-for="linea in lineas" :key="linea.id" :value="linea.id">
                {{ linea.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="turnos-table-container">
          <table class="turnos-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Nombre ⬇️</th>
                <th>Línea</th>
                <th>Patrón</th>
                <th>Turno patrón</th>
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(turno, index) in turnosPaginados" :key="turno.id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>{{ turno.nombre }}</td>
                <td>{{ turno.linea }}</td>
                <td>{{ turno.patron }}</td>
                <td>{{ turno.turnoPatron }}</td>
                <td>
                  <div class="color-badge" :style="{ backgroundColor: turno.color }">
                    {{ turno.color }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="pagination">
            <button 
              class="pagination-button" 
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              PREVIOUS
            </button>
            <span class="pagination-info">{{ currentPage }}</span>
            <button 
              class="pagination-button"
              :disabled="currentPage >= totalPages"
              @click="currentPage++"
            >
              NEXT
            </button>
          </div>
        </div>

        <div class="turno-siguiente-section">
          <label class="section-label">Turno que inicia la siguiente semana de esta línea</label>
          <div class="turno-siguiente-row">
            <select v-model="turnoSiguienteSemana" class="filter-select" style="max-width: 300px;">
              <option value="">Seleccione turno patrón</option>
              <option v-for="turno in turnoPatronOptions" :key="turno.id" :value="turno.id">
                {{ turno.nombre }}
              </option>
            </select>
            <Button variant="primary" size="sm" @click="guardarConfiguracion">GUARDAR</Button>
          </div>
        </div>

        <div class="editar-semana-section">
          <label class="section-label">Editar semana</label>
          <div class="editar-semana-buttons">
            <button 
              :class="['toggle-button', { active: editarSemana }]"
              @click="editarSemana = true"
            >
              SI
            </button>
            <button 
              :class="['toggle-button', { active: !editarSemana }]"
              @click="editarSemana = false"
            >
              NO
            </button>
          </div>
        </div>

        <div class="semana-navigation">
          <button class="nav-arrow" @click="anteriorSemana" :disabled="semanaActual === 0">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <div class="semana-info">
            <span class="semana-text">SEMANA {{ semanas[semanaActual].numero }} : NOVIEMBRE {{ semanas[semanaActual].inicio.split('/')[2] }} - NOVIEMBRE {{ semanas[semanaActual].fin.split('/')[2] }}</span>
          </div>
          <button class="nav-arrow" @click="siguienteSemana" :disabled="semanaActual === semanas.length - 1">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>

        <div class="calendar-container">
          <div class="calendar-grid">
            <div class="calendar-header-corner">D/H</div>
            <div v-for="(dia, index) in diasSemana" :key="dia" class="calendar-header-dia">
              <div class="dia-nombre">{{ dia }}</div>
              <div class="dia-fecha">{{ semanas[semanaActual].inicio.split('/')[2] }} - {{ parseInt(semanas[semanaActual].inicio.split('/')[2]) + index }}</div>
              <div class="dia-rango">15 - 30 - 45 - 60</div>
            </div>

            <template v-for="hora in 24" :key="hora">
              <div class="calendar-hora">{{ hora - 1 }}-hrs</div>
              <template v-for="diaIndex in 7" :key="`${diaIndex}-${hora}`">
                <div class="calendar-dia-column">
                  <div
                    class="calendar-cell"
                    :class="{ 'editable': editarSemana }"
                    :style="{ backgroundColor: obtenerColorCelda(diaIndex - 1, hora - 1, 0) }"
                    @click="clickCelda(diaIndex - 1, hora - 1, 0)"
                  ></div>
                  <div
                    class="calendar-cell"
                    :class="{ 'editable': editarSemana }"
                    :style="{ backgroundColor: obtenerColorCelda(diaIndex - 1, hora - 1, 30) }"
                    @click="clickCelda(diaIndex - 1, hora - 1, 30)"
                  ></div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>

      <div v-else class="tab-content">
        <div class="action-section">
          <Button variant="primary" size="sm">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            AGREGAR PATRÓN
          </Button>
        </div>

        <div class="filtros-row" style="grid-template-columns: repeat(4, 1fr);">
          <div class="filter-item">
            <label class="filter-label">Empresas</label>
            <select v-model="empresaSeleccionada" class="filter-select">
              <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
                {{ empresa.nombre }}
              </option>
            </select>
          </div>

          <div class="filter-item">
            <label class="filter-label">Plantas</label>
            <select v-model="plantaSeleccionada" class="filter-select" :disabled="!empresaSeleccionada">
              <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
                {{ planta.nombre }}
              </option>
            </select>
          </div>

          <div class="filter-item">
            <label class="filter-label">Patrón</label>
            <select class="filter-select">
              <option value="">patron historico</option>
            </select>
          </div>

          <div class="filter-item">
            <label class="filter-label">Lista turnos genéricos</label>
            <select class="filter-select">
              <option value="">3 turnos</option>
            </select>
          </div>
        </div>

        <div class="turno-config-section">
          <label class="config-label">Turno-patrón:</label>
          <div class="turnos-buttons">
            <button class="turno-button" style="background-color: white; border: 2px solid #d1d5db; color: #374151;">
              Borrar
            </button>
            <button class="turno-button" style="background-color: #3b82f6;">
              <input type="checkbox" class="turno-checkbox" />
              TURNO1
            </button>
            <button class="turno-button" style="background-color: #f97316;">
              <input type="checkbox" class="turno-checkbox" />
              TURNO2
            </button>
            <button class="turno-button" style="background-color: #22c55e;">
              <input type="checkbox" class="turno-checkbox" />
              TURNO3
            </button>
          </div>
        </div>

        <div class="calendar-container">
          <div class="calendar-grid">
            <div class="calendar-header-corner">D/H</div>
            <div v-for="dia in diasSemana" :key="dia" class="calendar-header-dia">
              <div class="dia-nombre">{{ dia }}</div>
              <div class="dia-rango">30 - 60</div>
            </div>

            <template v-for="hora in 24" :key="hora">
              <div class="calendar-hora">{{ hora - 1 }}-hrs</div>
              <template v-for="diaIndex in 7" :key="`${diaIndex}-${hora}`">
                <div class="calendar-dia-column">
                  <div
                    class="calendar-cell"
                    :style="{ backgroundColor: obtenerColorCelda(diaIndex - 1, hora - 1, 0) }"
                  ></div>
                  <div
                    class="calendar-cell"
                    :style="{ backgroundColor: obtenerColorCelda(diaIndex - 1, hora - 1, 30) }"
                  ></div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </Card>

    <teleport to="body">
      <div v-if="mostrarModalEditar" class="modal-overlay" @click="cancelarEdicion">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">EDITAR - DÍA {{ diaSeleccionado + 1 }}</h2>
          </div>

          <div class="modal-body">
            <div class="modal-info">
              <div class="info-row">
                <span class="info-label">HORA DE INICIO:</span>
                <span class="info-value">{{ fechaInicioEditar }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">HORA DE FIN:</span>
                <span class="info-value">{{ fechaFinEditar }}</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Turno</label>
              <select v-model="turnoSeleccionadoEditar" class="form-select">
                <option value="">Seleccione turno</option>
                <option v-for="turno in turnos" :key="turno.id" :value="turno.nombre">
                  {{ turno.nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Inicio</label>
              <input v-model="fechaInicioEditar" type="text" class="form-input" readonly />
            </div>

            <div class="form-group">
              <label class="form-label">Fin</label>
              <input v-model="fechaFinEditar" type="text" class="form-input" readonly />
            </div>
          </div>

          <div class="modal-footer">
            <Button variant="danger" size="sm" @click="eliminarBloque">ELIMINAR</Button>
            <Button variant="primary" size="sm" @click="actualizarBloque">ACTUALIZAR</Button>
            <Button variant="secondary" size="sm" @click="cancelarEdicion">CANCELAR</Button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
.turnos-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
}

.page-header {
  background-color: #1e3a8a;
  padding: 1rem 2rem;
  border-radius: 0;
}

.page-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.content-card {
  border-radius: 0;
  border: 1px solid #e5e7eb;
}

.tabs-header {
  display: flex;
  background-color: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
}

.tab-button {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #374151;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  background-color: #e5e7eb;
}

.tab-active {
  background-color: white;
  color: #1e3a8a;
  border-bottom: 3px solid #1e3a8a;
}

.tab-content {
  padding: 1.5rem;
}

.action-section {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #1e3a8a;
  flex-wrap: wrap;
}

.filtros-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.filter-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  color: #374151;
  cursor: pointer;
}

.filter-select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.turnos-table-container {
  margin-bottom: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.turnos-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.turnos-table thead {
  background-color: #f9fafb;
}

.turnos-table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.turnos-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
}

.color-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.pagination-button {
  padding: 0.5rem 1rem;
  background-color: #e5e7eb;
  border: none;
  border-radius: 0.25rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.75rem;
  color: #374151;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #d1d5db;
}

.pagination-info {
  font-weight: 600;
  color: #374151;
}

.turno-siguiente-section {
  margin-bottom: 1.5rem;
}

.section-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.turno-siguiente-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.editar-semana-section {
  margin-bottom: 1.5rem;
}

.editar-semana-buttons {
  display: flex;
  gap: 0.5rem;
}

.toggle-button {
  padding: 0.5rem 2rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: white;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-button.active {
  background-color: #1e3a8a;
  color: white;
  border-color: #1e3a8a;
}

.semana-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #1e3a8a;
  color: white;
  margin-bottom: 1rem;
}

.nav-arrow {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.semana-info {
  flex: 1;
  text-align: center;
}

.semana-text {
  font-weight: 700;
  font-size: 0.875rem;
}

.calendar-container {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  background-color: white;
}

.calendar-grid {
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  min-width: 1200px;
}

.calendar-header-corner {
  background-color: white;
  color: #374151;
  font-weight: 700;
  padding: 0.75rem;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.calendar-header-dia {
  background-color: white;
  color: #374151;
  font-weight: 600;
  padding: 0.75rem;
  text-align: center;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
  font-size: 0.7rem;
}

.dia-nombre {
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.dia-fecha {
  color: #6b7280;
  font-size: 0.7rem;
  margin-bottom: 0.25rem;
}

.dia-rango {
  color: #6b7280;
  font-size: 0.65rem;
}

.calendar-header-dia:last-child {
  border-right: none;
}

.calendar-hora {
  background-color: #f9fafb;
  font-weight: 600;
  padding: 0.5rem;
  text-align: center;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #374151;
}

.calendar-dia-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
}

.calendar-cell {
  min-height: 30px;
  border-right: 1px solid #e5e7eb;
  transition: all 0.1s;
}

.calendar-cell:last-child {
  border-right: none;
}

.calendar-cell.editable {
  cursor: pointer;
}

.calendar-cell.editable:hover {
  opacity: 0.7;
  outline: 2px solid #1f2937;
  outline-offset: -2px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

@media (max-width: 1200px) {
  .filtros-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .filtros-row {
    grid-template-columns: 1fr;
  }
  
  .action-section {
    flex-direction: column;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  background-color: #1e3a8a;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem 0.5rem 0 0;
}

.modal-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.modal-body {
  padding: 1.5rem;
}

.modal-info {
  background-color: #1e3a8a;
  color: white;
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  font-size: 0.875rem;
}

.info-value {
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-select,
.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  color: #374151;
}

.form-input:read-only {
  background-color: #f3f4f6;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
