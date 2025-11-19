<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import Alert from '@/shared/components/ui/Alert.vue'
import { useModal } from '@/shared/composables/useModal'
import { useApi } from '@/shared/composables/useApi'

const { isOpen: isCreateOpen, open: openCreateModal, close: closeCreateModal } = useModal()
const { isOpen: isEditOpen, open: openEditModal, close: closeEditModal } = useModal()
const { loading, error, execute } = useApi()

const variables = ref([])
const empresas = ref([])
const plantas = ref([])
const lineas = ref([])
const locaciones = ref([])
const dispositivos = ref([])
const selectedRows = ref([])
const activeTab = ref('continuas')

const canEdit = computed(() => selectedRows.value.length === 1)

const createForm = ref({
  empresaId: '',
  plantaId: '',
  lineaId: '',
  locacionId: '',
  dispositivoId: '',
  nombre: '',
  nombreCorto: '',
  archivo: '',
  columnaArchivo: '',
  unidad: '',
  tipo: 'ENERGIA',
  variableRelacionada: '',
  color: '#000000',
  visibleConsulta: 'Activado',
  estado: 'Activado',
  leyenda: []
})

const editForm = ref({
  id: '',
  empresaId: '',
  plantaId: '',
  lineaId: '',
  locacionId: '',
  dispositivoId: '',
  nombre: '',
  nombreCorto: '',
  archivo: '',
  columnaArchivo: '',
  unidad: '',
  tipo: 'ENERGIA',
  variableRelacionada: '',
  color: '#000000',
  visibleConsulta: 'Activado',
  estado: 'Activado',
  leyenda: []
})

const toggleRowSelection = (item) => {
  selectedRows.value = [item]
}

const isRowSelected = (item) => {
  return selectedRows.value.some(row => row.id === item.id)
}

const loadData = async () => {
  await execute(async () => {
    // Mock empresas
    empresas.value = [
      { id: 1, nombre: 'Industrias San Miguel' }
    ]

    // Mock plantas
    plantas.value = [
      { id: 1, nombre: 'Histórico Embotelladora San Miguel', empresaId: 1 }
    ]

    // Mock lineas
    lineas.value = [
      { id: 1, nombre: 'Línea 1', plantaId: 1 }
    ]

    // Mock locaciones
    locaciones.value = [
      { id: 1, nombre: 'Toda la Línea', lineaId: 1 }
    ]

    // Mock dispositivos
    dispositivos.value = [
      { id: 1, nombre: 'Medidor de Energía - Circutor', locacionId: 1 }
    ]

    // Mock variables según la pestaña activa
    if (activeTab.value === 'continuas') {
      variables.value = [
        { 
          id: 1,
          nombre: 'Corriente Fase 1',
          nombreCorto: 'I1',
          archivo: 'MEL1 - ACTUAL A',
          estado: 'Activado',
          unidad: 'Amperios',
          creado: '7 de octubre de 2016, 22:14:06',
          modificado: '22 de agosto de 2020, 22:52:55',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1,
          tipo: 'ENERGIA',
          columnaArchivo: 'MEL1 - ACTUAL A'
        },
        { 
          id: 2,
          nombre: 'Corriente Fase 2',
          nombreCorto: 'Yo2',
          archivo: 'MEL1 - Corriente B',
          estado: 'Activado',
          unidad: 'Amperios',
          creado: '7 de octubre de 2016, 22:14:06',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1,
          tipo: 'ENERGIA',
          columnaArchivo: 'MEL1 - Corriente B'
        },
        { 
          id: 3,
          nombre: 'Corriente Fase 3',
          nombreCorto: 'Yo3',
          archivo: 'MEL1 - Corriente C',
          estado: 'Activado',
          unidad: 'Amperios',
          creado: '7 de octubre de 2016, 22:14:06',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1,
          tipo: 'ENERGIA',
          columnaArchivo: 'MEL1 - Corriente C'
        },
        { 
          id: 4,
          nombre: 'Voltaje Fase A-B',
          nombreCorto: 'DÍA',
          archivo: 'MEL1 - Voltaje AB',
          estado: 'Activado',
          unidad: 'Voltios',
          creado: '7 de octubre de 2016, 22:14:06',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1,
          tipo: 'ENERGIA',
          columnaArchivo: 'MEL1 - Voltaje AB'
        },
        { 
          id: 5,
          nombre: 'Voltaje Fase B-C',
          nombreCorto: 'VBC',
          archivo: 'MEL1 - Tensión BC',
          estado: 'Activado',
          unidad: 'Voltios',
          creado: '7 de octubre de 2016, 22:14:06',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1,
          tipo: 'ENERGIA',
          columnaArchivo: 'MEL1 - Tensión BC'
        },
        { 
          id: 6,
          nombre: 'Voltaje Fase C-A',
          nombreCorto: 'VCA',
          archivo: 'MEL1 - Voltaje CA',
          estado: 'Activado',
          unidad: 'Voltios',
          creado: '7 de octubre de 2016, 22:14:06',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1,
          tipo: 'ENERGIA',
          columnaArchivo: 'MEL1 - Voltaje CA'
        },
        { 
          id: 7,
          nombre: 'Potencia Activa',
          nombreCorto: 'PACTIVA',
          archivo: 'MEL1 - Potencia real total (kW)',
          estado: 'Activado',
          unidad: 'EN',
          creado: '7 de octubre de 2016, 22:14:06',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1,
          tipo: 'ENERGIA',
          columnaArchivo: 'MEL1 - Potencia real total (kW)'
        },
        { 
          id: 8,
          nombre: 'Potencia Reactiva',
          nombreCorto: 'PREACTIVO',
          archivo: 'MEL1 - Potencia reactiva total (kVAR)',
          estado: 'No almacenado',
          unidad: 'NUESTRO',
          creado: '7 de octubre de 2016, 22:14:06',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1,
          tipo: 'ENERGIA',
          columnaArchivo: 'MEL1 - Potencia reactiva total (kVAR)'
        },
        { 
          id: 9,
          nombre: 'Potencia Aparente',
          nombreCorto: 'PADRES',
          archivo: 'MEL1 - Potencia aparente total (kVA)',
          estado: 'Activado',
          unidad: 'Y',
          creado: '7 de octubre de 2016, 22:14:06',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1,
          tipo: 'ENERGIA',
          columnaArchivo: 'MEL1 - Potencia aparente total (kVA)'
        },
        { 
          id: 10,
          nombre: 'Factor de Potencia',
          nombreCorto: 'PF',
          archivo: 'MEL1 - Factor de potencia total',
          estado: 'No almacenado',
          unidad: '',
          creado: '7 de octubre de 2016, 22:14:06',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1,
          tipo: 'ENERGIA',
          columnaArchivo: 'MEL1 - Factor de potencia total'
        }
      ]
    } else if (activeTab.value === 'constantes') {
      variables.value = [
        { 
          id: 1,
          nombre: 'Conversion a Kw Energia Activa',
          nombreCorto: 'C-KEA',
          estado: 'Activado',
          unidad: 'unidad',
          valor: '1',
          creado: '29 de diciembre de 2016, 13:33:00',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1
        },
        { 
          id: 2,
          nombre: 'Conversion a Kw Energia Reactiva',
          nombreCorto: 'C - KER',
          estado: 'Activado',
          unidad: 'unidad',
          valor: '1',
          creado: '29 de diciembre de 2016, 13:38:08',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1
        }
      ]
    } else if (activeTab.value === 'proporciones') {
      variables.value = [
        { 
          id: 1,
          nombre: 'Energía real 1',
          nombreCorto: 'EReal 1',
          estado: 'Activado',
          unidad: 'kWh',
          tipo: 'Ahora.',
          var1: 'Energía Activa',
          operacion: '-',
          var2: 'Energía Activa',
          creado: '',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1
        },
        { 
          id: 2,
          nombre: 'Energía real (kWh)',
          nombreCorto: 'EReal (kWh)',
          estado: 'Activado',
          unidad: 'kWh',
          tipo: 'Operación.',
          var1: 'Energía real 1',
          operacion: '/',
          var2: 'Conversion a Kw Energia Activa',
          creado: '',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1
        },
        { 
          id: 3,
          nombre: 'Vatios de energía reactiva (AHORA)',
          nombreCorto: 'EReactiva Watts (AHORA)',
          estado: 'Activado',
          unidad: 'izquierda',
          tipo: 'Ahora.',
          var1: 'Energía Reactiva',
          operacion: '-',
          var2: 'Energía Reactiva',
          creado: '',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1
        },
        { 
          id: 4,
          nombre: 'Energía reactiva (AHORA)',
          nombreCorto: 'ER (AHORA)',
          estado: 'Activado',
          unidad: 'izquierda',
          tipo: 'Operación.',
          var1: 'Vatios de energía reactiva (AHORA)',
          operacion: '/',
          var2: 'Conversion a Kw Energia Reactiva',
          creado: '',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1
        },
        { 
          id: 5,
          nombre: 'kW/l',
          nombreCorto: 'kWh/l Línea 1',
          estado: 'Activado',
          unidad: 'kWh/l',
          tipo: 'Operación.',
          var1: 'Energía real (kWh)',
          operacion: '/',
          var2: 'Produccion en Litros',
          creado: '',
          modificado: '',
          empresaId: 1,
          plantaId: 1,
          lineaId: 1,
          locacionId: 1,
          dispositivoId: 1
        }
      ]
    }
  })
}

const openCreate = () => {
  resetCreateForm()
  openCreateModal()
}

const openEdit = () => {
  if (selectedRows.value.length === 1) {
    const item = selectedRows.value[0]
    editForm.value = { ...item }
    openEditModal()
  }
}

const resetCreateForm = () => {
  createForm.value = {
    empresaId: '',
    plantaId: '',
    lineaId: '',
    locacionId: '',
    dispositivoId: '',
    nombre: '',
    nombreCorto: '',
    archivo: '',
    columnaArchivo: '',
    unidad: '',
    tipo: 'ENERGIA',
    variableRelacionada: '',
    color: '#000000',
    visibleConsulta: 'Activado',
    estado: 'Activado',
    leyenda: []
  }
}

const handleCreate = async () => {
  await execute(async () => {
    // Create logic
    await loadData()
    closeCreateModal()
  })
}

const handleEdit = async () => {
  await execute(async () => {
    // Update logic
    const variable = variables.value.find(v => v.id === editForm.value.id)
    if (variable) {
      Object.assign(variable, editForm.value)
    }
    await loadData()
    closeEditModal()
    selectedRows.value = []
  })
}

const addLeyenda = () => {
  // Add legend logic
}

// Watch activeTab to reload data
watch(activeTab, () => {
  selectedRows.value = []
  loadData()
})

// Filtros
const empresaFiltro = ref(1)
const plantaFiltro = ref(1)
const lineaFiltro = ref(1)
const locacionFiltro = ref(1)
const dispositivoFiltro = ref(1)

const variablesFiltradas = computed(() => {
  let filtered = variables.value

  if (empresaFiltro.value) {
    filtered = filtered.filter(v => v.empresaId === parseInt(empresaFiltro.value))
  }
  if (plantaFiltro.value) {
    filtered = filtered.filter(v => v.plantaId === parseInt(plantaFiltro.value))
  }
  if (lineaFiltro.value) {
    filtered = filtered.filter(v => v.lineaId === parseInt(lineaFiltro.value))
  }
  if (locacionFiltro.value) {
    filtered = filtered.filter(v => v.locacionId === parseInt(locacionFiltro.value))
  }
  if (dispositivoFiltro.value) {
    filtered = filtered.filter(v => v.dispositivoId === parseInt(dispositivoFiltro.value))
  }

  return filtered
})

const plantasFiltradas = computed(() => {
  if (!empresaFiltro.value) return plantas.value
  return plantas.value.filter(p => p.empresaId === parseInt(empresaFiltro.value))
})

const lineasFiltradas = computed(() => {
  if (!plantaFiltro.value) return lineas.value
  return lineas.value.filter(l => l.plantaId === parseInt(plantaFiltro.value))
})

const locacionesFiltradas = computed(() => {
  if (!lineaFiltro.value) return locaciones.value
  return locaciones.value.filter(l => l.lineaId === parseInt(lineaFiltro.value))
})

const dispositivosFiltrados = computed(() => {
  if (!locacionFiltro.value) return dispositivos.value
  return dispositivos.value.filter(d => d.locacionId === parseInt(locacionFiltro.value))
})

// Watch para cascada en formulario crear
watch(() => createForm.value.empresaId, () => {
  createForm.value.plantaId = ''
  createForm.value.lineaId = ''
  createForm.value.locacionId = ''
  createForm.value.dispositivoId = ''
})

watch(() => createForm.value.plantaId, () => {
  createForm.value.lineaId = ''
  createForm.value.locacionId = ''
  createForm.value.dispositivoId = ''
})

watch(() => createForm.value.lineaId, () => {
  createForm.value.locacionId = ''
  createForm.value.dispositivoId = ''
})

watch(() => createForm.value.locacionId, () => {
  createForm.value.dispositivoId = ''
})

// Watch para cascada en formulario editar
watch(() => editForm.value.empresaId, () => {
  editForm.value.plantaId = ''
  editForm.value.lineaId = ''
  editForm.value.locacionId = ''
  editForm.value.dispositivoId = ''
})

watch(() => editForm.value.plantaId, () => {
  editForm.value.lineaId = ''
  editForm.value.locacionId = ''
  editForm.value.dispositivoId = ''
})

watch(() => editForm.value.lineaId, () => {
  editForm.value.locacionId = ''
  editForm.value.dispositivoId = ''
})

watch(() => editForm.value.locacionId, () => {
  editForm.value.dispositivoId = ''
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="variables-view">
    <div class="filters-section">
      <div class="filter-row">
        <div class="filter-item">
          <label class="filter-label">Compañía</label>
          <select v-model="empresaFiltro" class="field-select">
            <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
              {{ empresa.nombre }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-label">Planta</label>
          <select v-model="plantaFiltro" class="field-select">
            <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
              {{ planta.nombre }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-label">Línea</label>
          <select v-model="lineaFiltro" class="field-select">
            <option v-for="linea in lineasFiltradas" :key="linea.id" :value="linea.id">
              {{ linea.nombre }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-label">Locación</label>
          <select v-model="locacionFiltro" class="field-select">
            <option v-for="locacion in locacionesFiltradas" :key="locacion.id" :value="locacion.id">
              {{ locacion.nombre }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-label">Dispositivo</label>
          <select v-model="dispositivoFiltro" class="field-select">
            <option v-for="dispositivo in dispositivosFiltrados" :key="dispositivo.id" :value="dispositivo.id">
              {{ dispositivo.nombre }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <Card class="content-card">
      <div class="tabs-header">
        <button 
          :class="['tab-btn', { active: activeTab === 'continuas' }]"
          @click="activeTab = 'continuas'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          VARIABLES CONTINUAS
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'constantes' }]"
          @click="activeTab = 'constantes'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
          </svg>
          VARIABLES CONSTANTES
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'proporciones' }]"
          @click="activeTab = 'proporciones'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          PROPORCIONES
        </button>
      </div>

      <div class="action-bar">
        <Button @click="openCreate" variant="primary" size="sm">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          AGREGAR
        </Button>
        <Button 
          @click="openEdit"
          :disabled="!canEdit"
          variant="secondary" 
          size="sm"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          EDITAR
        </Button>
      </div>

      <Loading v-if="loading" />
      <Alert v-else-if="error" type="error" :message="error" />

      <div v-else class="table-container">
        <!-- Tabla Variables Continuas -->
        <table v-if="activeTab === 'continuas'" class="data-table">
          <thead>
            <tr>
              <th class="checkbox-cell"></th>
              <th>N°</th>
              <th>Nombre</th>
              <th>Nombre Corto</th>
              <th>Archivo/Nombre</th>
              <th>Estado</th>
              <th>Unidad</th>
              <th>↑Creado</th>
              <th>Modificado</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(variable, index) in variablesFiltradas" 
              :key="variable.id"
              @click="toggleRowSelection(variable)"
              :class="{ 'row-selected': isRowSelected(variable) }"
            >
              <td class="checkbox-cell">
                <input 
                  type="checkbox" 
                  class="table-checkbox"
                  :checked="isRowSelected(variable)"
                  @click.stop="toggleRowSelection(variable)"
                />
              </td>
              <td>{{ index + 1 }}</td>
              <td class="table-name">{{ variable.nombre }}</td>
              <td>{{ variable.nombreCorto }}</td>
              <td>{{ variable.archivo }}</td>
              <td>{{ variable.estado }}</td>
              <td>{{ variable.unidad }}</td>
              <td>{{ variable.creado }}</td>
              <td>{{ variable.modificado }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Tabla Variables Constantes -->
        <table v-else-if="activeTab === 'constantes'" class="data-table">
          <thead>
            <tr>
              <th class="checkbox-cell"></th>
              <th>N°</th>
              <th>Nombre</th>
              <th>Nombre Corto</th>
              <th>Estado</th>
              <th>Unidad</th>
              <th>Valor</th>
              <th>↑Creado</th>
              <th>Modificado</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(variable, index) in variablesFiltradas" 
              :key="variable.id"
              @click="toggleRowSelection(variable)"
              :class="{ 'row-selected': isRowSelected(variable) }"
            >
              <td class="checkbox-cell">
                <input 
                  type="checkbox" 
                  class="table-checkbox"
                  :checked="isRowSelected(variable)"
                  @click.stop="toggleRowSelection(variable)"
                />
              </td>
              <td>{{ index + 1 }}</td>
              <td class="table-name">{{ variable.nombre }}</td>
              <td>{{ variable.nombreCorto }}</td>
              <td>{{ variable.estado }}</td>
              <td>{{ variable.unidad }}</td>
              <td>{{ variable.valor }}</td>
              <td>{{ variable.creado }}</td>
              <td>{{ variable.modificado }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Tabla Proporciones -->
        <table v-else-if="activeTab === 'proporciones'" class="data-table">
          <thead>
            <tr>
              <th class="checkbox-cell"></th>
              <th>N°</th>
              <th>Nombre</th>
              <th>Nombre Corto</th>
              <th>Estado</th>
              <th>Unidad</th>
              <th>Tipo</th>
              <th>Var1</th>
              <th>Operación.</th>
              <th>Var2</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(variable, index) in variablesFiltradas" 
              :key="variable.id"
              @click="toggleRowSelection(variable)"
              :class="{ 'row-selected': isRowSelected(variable) }"
            >
              <td class="checkbox-cell">
                <input 
                  type="checkbox" 
                  class="table-checkbox"
                  :checked="isRowSelected(variable)"
                  @click.stop="toggleRowSelection(variable)"
                />
              </td>
              <td>{{ index + 1 }}</td>
              <td class="table-name">{{ variable.nombre }}</td>
              <td>{{ variable.nombreCorto }}</td>
              <td>{{ variable.estado }}</td>
              <td>{{ variable.unidad }}</td>
              <td>{{ variable.tipo }}</td>
              <td>{{ variable.var1 }}</td>
              <td>{{ variable.operacion }}</td>
              <td>{{ variable.var2 }}</td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button class="pagination-btn">ANTERIOR</button>
          <span class="pagination-info">1</span>
          <button class="pagination-btn">PRÓXIMO</button>
        </div>
      </div>
    </Card>

    <!-- Modal Crear -->
    <Modal v-model="isCreateOpen" @close="closeCreateModal" title="AGREGAR NUEVA VARIABLE CONTINUA" size="lg">
      <form @submit.prevent="handleCreate" class="form-container">
        <div class="form-content">
          <div class="form-grid">
            <div class="form-row">
              <label class="form-label">Compañía</label>
              <select v-model="createForm.empresaId" class="field-input" required>
                <option value="" disabled>Seleccione</option>
                <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
                  {{ empresa.nombre }}
                </option>
              </select>
              <span class="field-hint">Debe completar este campo</span>
            </div>

            <div class="form-row">
              <label class="form-label">Planta</label>
              <select v-model="createForm.plantaId" class="field-input" required>
                <option value="" disabled>Seleccione</option>
                <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
                  {{ planta.nombre }}
                </option>
              </select>
              <span class="field-hint">Debe completar este campo</span>
            </div>

            <div class="form-row">
              <label class="form-label">Línea</label>
              <select v-model="createForm.lineaId" class="field-input" required>
                <option value="" disabled>Seleccione</option>
                <option v-for="linea in lineasFiltradas" :key="linea.id" :value="linea.id">
                  {{ linea.nombre }}
                </option>
              </select>
              <span class="field-hint">Debe completar este campo</span>
            </div>

            <div class="form-row">
              <label class="form-label">Locación</label>
              <select v-model="createForm.locacionId" class="field-input" required>
                <option value="" disabled>Seleccione</option>
                <option v-for="locacion in locacionesFiltradas" :key="locacion.id" :value="locacion.id">
                  {{ locacion.nombre }}
                </option>
              </select>
              <span class="field-hint">Debe completar este campo</span>
            </div>

            <div class="form-row">
              <label class="form-label">Dispositivo</label>
              <select v-model="createForm.dispositivoId" class="field-input" required>
                <option value="" disabled>Seleccione</option>
                <option v-for="dispositivo in dispositivosFiltrados" :key="dispositivo.id" :value="dispositivo.id">
                  {{ dispositivo.nombre }}
                </option>
              </select>
              <span class="field-hint">Debe completar este campo</span>
            </div>

            <div class="form-row">
              <label class="form-label">Nombre</label>
              <input 
                v-model="createForm.nombre" 
                type="text" 
                class="field-input" 
                placeholder="Nombre de varible continua"
                required
              />
              <span class="field-hint">Debe completar este campo</span>
            </div>

            <div class="form-row">
              <label class="form-label">Nombre Corto</label>
              <input 
                v-model="createForm.nombreCorto" 
                type="text" 
                class="field-input" 
                placeholder="Nombre corto de la varible continua"
                required
              />
              <span class="field-hint">Debe completar este campo</span>
            </div>

            <div class="form-row">
              <label class="form-label">Archivo</label>
              <select v-model="createForm.archivo" class="field-input" required>
                <option value="" disabled>Seleccione</option>
                <option value="energiasKR">energiasKR</option>
              </select>
              <span class="field-hint">Debe completar este campo</span>
            </div>

            <div class="form-row">
              <label class="form-label">Columna en Archivo</label>
              <input 
                v-model="createForm.columnaArchivo" 
                type="text" 
                class="field-input" 
                placeholder="Nombre de Columna"
                required
              />
              <span class="field-hint">Debe completar este campo</span>
            </div>

            <div class="form-row">
              <label class="form-label">Unidad</label>
              <input 
                v-model="createForm.unidad" 
                type="text" 
                class="field-input" 
                placeholder="Unidad de la varible continua"
                required
              />
              <span class="field-hint">Debe completar este campo</span>
            </div>

            <div class="form-row">
              <label class="form-label">Tipo</label>
              <select v-model="createForm.tipo" class="field-input" required>
                <option value="ENERGIA">ENERGIA</option>
                <option value="PRODUCCION">PRODUCCION</option>
                <option value="OTRO">OTRO</option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label">Variable relacionada</label>
              <select v-model="createForm.variableRelacionada" class="field-input">
                <option value="">Seleccione...</option>
              </select>
              <span class="field-hint">Debe completar este campo</span>
            </div>

            <div class="form-row">
              <label class="form-label">Color</label>
              <input 
                v-model="createForm.color" 
                type="text" 
                class="field-input"
              />
            </div>
          </div>

          <div class="form-section">
            <label class="section-label">Visible en consulta</label>
            <div class="button-group">
              <button 
                type="button"
                :class="['option-btn', { active: createForm.visibleConsulta === 'Activado' }]"
                @click="createForm.visibleConsulta = 'Activado'"
              >
                Activado
              </button>
              <button 
                type="button"
                :class="['option-btn', { active: createForm.visibleConsulta === 'Deshabilitado' }]"
                @click="createForm.visibleConsulta = 'Deshabilitado'"
              >
                Deshabilitado
              </button>
            </div>
          </div>

          <div class="form-section">
            <label class="section-label">Estado</label>
            <div class="button-group">
              <button 
                type="button"
                :class="['option-btn', { active: createForm.estado === 'Activado' }]"
                @click="createForm.estado = 'Activado'"
              >
                Activado
              </button>
              <button 
                type="button"
                :class="['option-btn', { active: createForm.estado === 'No almacenado' }]"
                @click="createForm.estado = 'No almacenado'"
              >
                No almacenado
              </button>
              <button 
                type="button"
                :class="['option-btn', { active: createForm.estado === 'Deshabilitado' }]"
                @click="createForm.estado = 'Deshabilitado'"
              >
                Deshabilitado
              </button>
            </div>
          </div>

          <div class="form-section">
            <div class="section-header">
              <label class="section-label">LEYENDA</label>
              <button type="button" class="add-btn" @click="addLeyenda">+</button>
            </div>
          </div>
        </div>

        <div class="form-footer">
          <Button type="submit" variant="primary" size="md" :loading="loading">
            GUARDAR
          </Button>
          <Button type="button" @click="closeCreateModal" variant="secondary" size="md">
            CANCELAR
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Modal Editar -->
    <Modal v-model="isEditOpen" @close="closeEditModal" title="EDITAR VARIABLE CONTINUA" size="lg">
      <form @submit.prevent="handleEdit" class="form-container">
        <div class="form-content">
          <div class="form-grid">
            <div class="form-row">
              <label class="form-label">Compañía</label>
              <select v-model="editForm.empresaId" class="field-input" required>
                <option value="" disabled>Seleccione</option>
                <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
                  {{ empresa.nombre }}
                </option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label">Planta</label>
              <select v-model="editForm.plantaId" class="field-input" required>
                <option value="" disabled>Seleccione</option>
                <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
                  {{ planta.nombre }}
                </option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label">Línea</label>
              <select v-model="editForm.lineaId" class="field-input" required>
                <option value="" disabled>Seleccione</option>
                <option v-for="linea in lineasFiltradas" :key="linea.id" :value="linea.id">
                  {{ linea.nombre }}
                </option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label">Locación</label>
              <select v-model="editForm.locacionId" class="field-input" required>
                <option value="" disabled>Seleccione</option>
                <option v-for="locacion in locacionesFiltradas" :key="locacion.id" :value="locacion.id">
                  {{ locacion.nombre }}
                </option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label">Dispositivo</label>
              <select v-model="editForm.dispositivoId" class="field-input" required>
                <option value="" disabled>Seleccione</option>
                <option v-for="dispositivo in dispositivosFiltrados" :key="dispositivo.id" :value="dispositivo.id">
                  {{ dispositivo.nombre }}
                </option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label">Nombre</label>
              <input 
                v-model="editForm.nombre" 
                type="text" 
                class="field-input" 
                required
              />
            </div>

            <div class="form-row">
              <label class="form-label">Nombre Corto</label>
              <input 
                v-model="editForm.nombreCorto" 
                type="text" 
                class="field-input" 
                required
              />
            </div>

            <div class="form-row">
              <label class="form-label">Archivo</label>
              <select v-model="editForm.archivo" class="field-input" required>
                <option value="">Seleccione</option>
                <option value="MEL1">MEL1</option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label">Columna en Archivo</label>
              <input 
                v-model="editForm.columnaArchivo" 
                type="text" 
                class="field-input" 
                required
              />
            </div>

            <div class="form-row">
              <label class="form-label">Unidad</label>
              <input 
                v-model="editForm.unidad" 
                type="text" 
                class="field-input" 
                required
              />
            </div>

            <div class="form-row">
              <label class="form-label">Tipo</label>
              <select v-model="editForm.tipo" class="field-input" required>
                <option value="ENERGIA">ENERGIA</option>
                <option value="PRODUCCION">PRODUCCION</option>
                <option value="OTRO">OTRO</option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label">Variable relacionada</label>
              <select v-model="editForm.variableRelacionada" class="field-input">
                <option value="">ninguno</option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label">Color</label>
              <input 
                v-model="editForm.color" 
                type="text" 
                class="field-input"
              />
            </div>
          </div>

          <div class="form-section">
            <label class="section-label">Visible en consulta</label>
            <div class="button-group">
              <button 
                type="button"
                :class="['option-btn', { active: editForm.visibleConsulta === 'Activado' }]"
                @click="editForm.visibleConsulta = 'Activado'"
              >
                Activado
              </button>
              <button 
                type="button"
                :class="['option-btn', { active: editForm.visibleConsulta === 'Deshabilitado' }]"
                @click="editForm.visibleConsulta = 'Deshabilitado'"
              >
                Deshabilitado
              </button>
            </div>
          </div>

          <div class="form-section">
            <label class="section-label">Estado</label>
            <div class="button-group">
              <button 
                type="button"
                :class="['option-btn', { active: editForm.estado === 'Activado' }]"
                @click="editForm.estado = 'Activado'"
              >
                Activado
              </button>
              <button 
                type="button"
                :class="['option-btn', { active: editForm.estado === 'No almacenado' }]"
                @click="editForm.estado = 'No almacenado'"
              >
                No almacenado
              </button>
              <button 
                type="button"
                :class="['option-btn', { active: editForm.estado === 'Deshabilitado' }]"
                @click="editForm.estado = 'Deshabilitado'"
              >
                Deshabilitado
              </button>
            </div>
          </div>

          <div class="form-section">
            <div class="section-header">
              <label class="section-label">LEYENDA</label>
              <button type="button" class="add-btn" @click="addLeyenda">+</button>
            </div>
          </div>
        </div>

        <div class="form-footer">
          <Button type="submit" variant="primary" size="md" :loading="loading">
            GUARDAR
          </Button>
          <Button type="button" @click="closeEditModal" variant="secondary" size="md">
            CANCELAR
          </Button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<style scoped>
.variables-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filters-section {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.field-select {
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  transition: all 0.2s;
  cursor: pointer;
}

.field-select:hover {
  border-color: #9ca3af;
}

.field-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.content-card {
  border-radius: 0;
  border-top: none;
}

.tabs-header {
  display: flex;
  border-bottom: 2px solid #e5e7eb;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #1e40af;
  background-color: #f0f9ff;
}

.tab-btn.active {
  color: #1e40af;
  border-bottom-color: #1e40af;
  background-color: #f0f9ff;
}

.action-bar {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #1e3a8a;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  font-size: 0.875rem;
}

.data-table thead {
  background-color: #f3f4f6;
}

.data-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.data-table tbody tr {
  transition: all 0.15s;
  cursor: pointer;
}

.data-table tbody tr:hover {
  background-color: #eff6ff;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f9fafb;
}

.data-table tbody tr:nth-child(even):hover {
  background-color: #eff6ff;
}

.data-table tbody tr.row-selected {
  background-color: #dbeafe;
  border-left: 4px solid #2563eb;
}

.data-table td {
  padding: 0.75rem 1rem;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td.table-name {
  font-weight: 600;
  color: #111827;
}

.checkbox-cell {
  width: 3rem;
  text-align: center;
}

.table-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  color: #2563eb;
  border-color: #d1d5db;
  border-radius: 0.25rem;
  cursor: pointer;
}

.table-checkbox:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
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

.pagination-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-btn:hover {
  background-color: #f9fafb;
}

.pagination-info {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-container {
  padding: 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.field-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  transition: all 0.2s;
}

.field-input:hover {
  border-color: #9ca3af;
}

.field-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-hint {
  font-size: 0.75rem;
  color: #d97706;
  background-color: #fef3c7;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.form-section {
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
}

.section-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.option-btn {
  padding: 0.5rem 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: #f3f4f6;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover {
  background-color: #e5e7eb;
}

.option-btn.active {
  background-color: #dbeafe;
  border-color: #3b82f6;
  color: #1e40af;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.add-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 2px solid #1e40af;
  border-radius: 0.375rem;
  font-size: 1.5rem;
  color: #1e40af;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background-color: #1e40af;
  color: white;
}

.form-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.form-footer button {
  min-width: 120px;
}
</style>
