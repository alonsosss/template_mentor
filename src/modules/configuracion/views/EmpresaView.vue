<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import FormField from '@/shared/components/forms/FormField.vue'
import SelectFilter from '@/shared/components/forms/SelectFilter.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import Alert from '@/shared/components/ui/Alert.vue'
import companyService from '@/api/services/company.service'
import { useModal } from '@/shared/composables/useModal'
import { useApi } from '@/shared/composables/useApi'

const activeTab = ref('empresa')
const { isOpen, open: openModal, close: closeModal } = useModal()
const { loading, error, execute } = useApi()

const companies = ref([])
const plants = ref([])
const lines = ref([])
const locations = ref([])
const devices = ref([])

const selectedCompany = ref(null)
const selectedPlant = ref(null)
const selectedLine = ref(null)
const selectedLocation = ref(null)

const selectedRows = ref([])
const isEditing = ref(false)
const showDeleteConfirm = ref(false)
const itemToDelete = ref(null)

const canEdit = computed(() => selectedRows.value.length === 1)
const canDelete = computed(() => selectedRows.value.length > 0)

const toggleRowSelection = (item) => {
  selectedRows.value = [item]
}

const isRowSelected = (item) => {
  return selectedRows.value.some(row => row.id === item.id)
}

watch(activeTab, () => {
  selectedRows.value = []
})

const empresaForm = ref({
  nombreComercial: '',
  descripcion: '',
  denominacion: '',
  documento: '',
  correoElectronico: '',
  tipoDocumento: 'RUC',
  telefono: '',
  telefono1: '',
  sitioWeb: '',
  representante: '',
  telefonoRepresentante: '',
  logo: '',
  direccion: '',
  estado: true
})

const plantaForm = ref({
  empresaId: null,
  nombre: '',
  descripcion: '',
  zonaHoraria: '',
  creado: '',
  modificado: ''
})

const lineaForm = ref({
  empresaId: null,
  plantaId: null,
  nombre: '',
  descripcion: '',
  tipo: 'Defecto',
  codigoAlertas: '',
  subtipo: 'PLC',
  creado: '',
  estado: true
})

const locacionForm = ref({
  empresaId: null,
  plantaId: null,
  lineaId: null,
  nombre: '',
  descripcion: '',
  creado: '',
  modificado: ''
})

const dispositivoForm = ref({
  empresaId: null,
  plantaId: null,
  lineaId: null,
  locacionId: null,
  nombre: '',
  creado: '',
  modificado: ''
})

const companyOptions = computed(() => 
  companies.value.map(c => ({ value: c.id, label: c.nombre }))
)

const plantOptions = computed(() => 
  plants.value
    .filter(p => !selectedCompany.value || p.empresaId === selectedCompany.value)
    .map(p => ({ value: p.id, label: p.nombre }))
)

const lineOptions = computed(() => 
  lines.value
    .filter(l => !selectedPlant.value || l.plantaId === selectedPlant.value)
    .map(l => ({ value: l.id, label: l.nombre }))
)

const locationOptions = computed(() => 
  locations.value
    .filter(loc => !selectedLine.value || loc.lineaId === selectedLine.value)
    .map(loc => ({ value: loc.id, label: loc.nombre }))
)

const filteredData = computed(() => {
  switch(activeTab.value) {
    case 'empresa':
      return companies.value
    case 'planta':
      return plants.value.filter(p => !selectedCompany.value || p.empresaId === selectedCompany.value)
    case 'linea':
      return lines.value.filter(l => 
        (!selectedCompany.value || l.empresaId === selectedCompany.value) &&
        (!selectedPlant.value || l.plantaId === selectedPlant.value)
      )
    case 'locacion':
      return locations.value.filter(loc => 
        (!selectedCompany.value || loc.empresaId === selectedCompany.value) &&
        (!selectedPlant.value || loc.plantaId === selectedPlant.value) &&
        (!selectedLine.value || loc.lineaId === selectedLine.value)
      )
    case 'dispositivo':
      return devices.value.filter(d => 
        (!selectedCompany.value || d.empresaId === selectedCompany.value) &&
        (!selectedPlant.value || d.plantaId === selectedPlant.value) &&
        (!selectedLine.value || d.lineaId === selectedLine.value)
      )
    default:
      return []
  }
})

watch(selectedCompany, () => {
  selectedPlant.value = null
  selectedLine.value = null
  selectedLocation.value = null
})

watch(selectedPlant, () => {
  selectedLine.value = null
  selectedLocation.value = null
})

watch(selectedLine, () => {
  selectedLocation.value = null
})

const loadData = async () => {
  await execute(async () => {
    const [companiesRes] = await Promise.all([
      companyService.getAll()
    ])
    companies.value = companiesRes.data
    
    plants.value = [
      { id: 1, empresaId: 1, nombre: 'Histórico Embotelladora San Miguel', informacion: 'Arequipa, Parque de Camarones', zonaHoraria: 'America/Lima', creado: '19 de agosto de 2016, 18:02:22', modificado: '27 de diciembre de 2019, 16:13:36' },
      { id: 2, empresaId: 1, nombre: 'Histórico del ISM Brasil', informacion: 'Bahía, Brasil, Histórica', zonaHoraria: 'America/Lima', creado: '26 de septiembre de 2016, 21:46:57', modificado: '27 de diciembre de 2019, 16:19:44' },
      { id: 3, empresaId: 2, nombre: 'ISM Brasil Bahía', informacion: 'ISM Brasil Bahía', zonaHoraria: 'America/Bahia', creado: '26 de mayo de 2018, 19:07:16', modificado: '' },
      { id: 4, empresaId: 2, nombre: 'ISM Arequipa', informacion: 'Arequipa, Parque de camarones', zonaHoraria: 'America/Lima', creado: '12 de diciembre de 2019, 16:04:27', modificado: '' }
    ]
    
    lines.value = [
      { id: 1, empresaId: 1, plantaId: 1, nombre: 'Línea 1', informacion: 'Slpm@gmail.com', creado: '7 de octubre de 2016, 17:14:06', codigoAlertas: 'Se necesita configuración', estado: true },
      { id: 2, empresaId: 1, plantaId: 1, nombre: 'Línea 2', informacion: '', creado: '7 de octubre de 2016, 17:14:06', codigoAlertas: 'Se necesita configuración', estado: true },
      { id: 3, empresaId: 1, plantaId: 1, nombre: 'Línea 3', informacion: '', creado: '7 de octubre de 2016, 17:14:06', codigoAlertas: 'Se necesita configuración', estado: true },
      { id: 4, empresaId: 1, plantaId: 1, nombre: 'Línea 4', informacion: '', creado: '7 de octubre de 2016, 17:14:06', codigoAlertas: 'Se necesita configuración', estado: true },
      { id: 5, empresaId: 1, plantaId: 1, nombre: 'Línea 5', informacion: '', creado: '7 de octubre de 2016, 17:14:06', codigoAlertas: 'Se necesita configuración', estado: true },
      { id: 6, empresaId: 1, plantaId: 1, nombre: 'Suministro 221125', informacion: '', creado: '7 de octubre de 2016, 17:14:06', codigoAlertas: '', estado: true }
    ]
    
    locations.value = [
      { id: 1, empresaId: 1, plantaId: 1, lineaId: 1, nombre: 'Toda la Línea', creado: '7 de octubre de 2016, 17:14:06', modificado: '' }
    ]
    
    devices.value = [
      { id: 1, empresaId: 1, plantaId: 1, lineaId: 1, locacionId: 1, nombre: 'Medidor de Energía - Circutor', creado: '7 de octubre de 2016, 17:14:06', modificado: '' },
      { id: 2, empresaId: 1, plantaId: 1, lineaId: 1, locacionId: 1, nombre: 'PLC MODICON M221', creado: '7 de octubre de 2016, 17:14:06', modificado: '' }
    ]
  })
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  openModal()
}

const openEditModal = (item) => {
  if (!item && selectedRows.value.length === 1) {
    item = selectedRows.value[0]
  }
  if (!item) return
  
  isEditing.value = true
  if (activeTab.value === 'empresa') {
    empresaForm.value = { ...item }
  } else if (activeTab.value === 'planta') {
    plantaForm.value = { ...item }
  } else if (activeTab.value === 'linea') {
    lineaForm.value = { ...item }
  } else if (activeTab.value === 'locacion') {
    locacionForm.value = { ...item }
  } else if (activeTab.value === 'dispositivo') {
    dispositivoForm.value = { ...item }
  }
  openModal()
}

const resetForm = () => {
  empresaForm.value = { 
    nombreComercial: '', 
    descripcion: '', 
    denominacion: '', 
    documento: '', 
    correoElectronico: '', 
    tipoDocumento: 'RUC', 
    telefono: '', 
    telefono1: '', 
    sitioWeb: '', 
    representante: '', 
    telefonoRepresentante: '', 
    logo: '', 
    direccion: '', 
    estado: true 
  }
  plantaForm.value = { empresaId: selectedCompany.value, nombre: '', descripcion: '', zonaHoraria: 'America/Lima', creado: '', modificado: '' }
  lineaForm.value = { empresaId: selectedCompany.value, plantaId: selectedPlant.value, nombre: '', descripcion: '', tipo: 'Defecto', codigoAlertas: '', subtipo: 'PLC', creado: '', estado: true }
  locacionForm.value = { empresaId: selectedCompany.value, plantaId: selectedPlant.value, lineaId: selectedLine.value, nombre: '', descripcion: '', creado: '', modificado: '' }
  dispositivoForm.value = { empresaId: selectedCompany.value, plantaId: selectedPlant.value, lineaId: selectedLine.value, locacionId: selectedLocation.value, nombre: '', creado: '', modificado: '' }
}

const handleSubmit = async () => {
  await execute(async () => {
    if (activeTab.value === 'empresa') {
      if (isEditing.value) {
        await companyService.update(empresaForm.value.id, empresaForm.value)
      } else {
        await companyService.create(empresaForm.value)
      }
    } else if (activeTab.value === 'planta') {
      if (isEditing.value) {
        plantaForm.value.modificado = new Date().toISOString()
      } else {
        plantaForm.value.creado = new Date().toLocaleString('es-ES', { 
          year: 'numeric', month: 'long', day: 'numeric', 
          hour: '2-digit', minute: '2-digit', second: '2-digit' 
        })
      }
    } else if (activeTab.value === 'linea') {
      if (!isEditing.value) {
        lineaForm.value.creado = new Date().toLocaleString('es-ES', { 
          year: 'numeric', month: 'long', day: 'numeric', 
          hour: '2-digit', minute: '2-digit', second: '2-digit' 
        })
      }
    } else if (activeTab.value === 'locacion') {
      if (isEditing.value) {
        locacionForm.value.modificado = new Date().toLocaleString('es-ES', { 
          year: 'numeric', month: 'long', day: 'numeric', 
          hour: '2-digit', minute: '2-digit', second: '2-digit' 
        })
      } else {
        locacionForm.value.creado = new Date().toLocaleString('es-ES', { 
          year: 'numeric', month: 'long', day: 'numeric', 
          hour: '2-digit', minute: '2-digit', second: '2-digit' 
        })
      }
    } else if (activeTab.value === 'dispositivo') {
      if (isEditing.value) {
        dispositivoForm.value.modificado = new Date().toLocaleString('es-ES', { 
          year: 'numeric', month: 'long', day: 'numeric', 
          hour: '2-digit', minute: '2-digit', second: '2-digit' 
        })
      } else {
        dispositivoForm.value.creado = new Date().toLocaleString('es-ES', { 
          year: 'numeric', month: 'long', day: 'numeric', 
          hour: '2-digit', minute: '2-digit', second: '2-digit' 
        })
      }
    }
    await loadData()
    closeModal()
  })
}

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      empresaForm.value.logo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const confirmDelete = (item) => {
  if (!item && selectedRows.value.length > 0) {
    showDeleteConfirm.value = true
    return
  }
  if (!item) return
  
  selectedRows.value = [item]
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  await execute(async () => {
    if (activeTab.value === 'empresa') {
      for (const item of selectedRows.value) {
        await companyService.delete(item.id)
      }
    }
    await loadData()
    selectedRows.value = []
    showDeleteConfirm.value = false
  })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="empresa-view">
    <div class="tabs-container">
      <button 
        @click="activeTab = 'empresa'" 
        :class="['tab', { active: activeTab === 'empresa' }]"
      >
        EMPRESA
      </button>
      <button 
        @click="activeTab = 'planta'" 
        :class="['tab', { active: activeTab === 'planta' }]"
      >
        PLANTA
      </button>
      <button 
        @click="activeTab = 'linea'" 
        :class="['tab', { active: activeTab === 'linea' }]"
      >
        LÍNEA
      </button>
      <button 
        @click="activeTab = 'locacion'" 
        :class="['tab', { active: activeTab === 'locacion' }]"
      >
        LOCACIÓN
      </button>
      <button 
        @click="activeTab = 'dispositivo'" 
        :class="['tab', { active: activeTab === 'dispositivo' }]"
      >
        DISPOSITIVO
      </button>
    </div>

    <Card class="content-card">
      <div class="action-bar">
        <Button @click="openCreateModal" variant="primary" size="sm">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          AGREGAR
        </Button>
        <Button 
          v-if="activeTab === 'empresa' || activeTab === 'planta' || activeTab === 'linea' || activeTab === 'locacion'" 
          @click="openEditModal()"
          :disabled="!canEdit"
          variant="secondary" 
          size="sm"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          EDITAR
        </Button>
        <Button 
          v-if="activeTab === 'empresa' || activeTab === 'planta' || activeTab === 'linea' || activeTab === 'locacion'" 
          @click="confirmDelete()"
          :disabled="!canDelete"
          variant="danger" 
          size="sm"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          ELIMINAR
        </Button>
        <Button v-if="activeTab === 'planta'" variant="secondary" size="sm">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          ASIGNAR TABLAS
        </Button>
      </div>

      <div v-if="activeTab !== 'empresa'" class="filters-bar">
        <div class="filter-group">
          <label class="filter-label">Empresa</label>
          <SelectFilter 
            v-model="selectedCompany" 
            :options="companyOptions"
            placeholder="Seleccione una Empresa"
          />
        </div>
        <div v-if="activeTab !== 'planta'" class="filter-group">
          <label class="filter-label">Planta</label>
          <SelectFilter 
            v-model="selectedPlant" 
            :options="plantOptions"
            placeholder="Seleccione una Planta"
          />
        </div>
        <div v-if="activeTab === 'locacion' || activeTab === 'dispositivo'" class="filter-group">
          <label class="filter-label">Línea</label>
          <SelectFilter 
            v-model="selectedLine" 
            :options="lineOptions"
            placeholder="Seleccione una Línea"
          />
        </div>
        <div v-if="activeTab === 'dispositivo'" class="filter-group">
          <label class="filter-label">Locación</label>
          <SelectFilter 
            v-model="selectedLocation" 
            :options="locationOptions"
            placeholder="Toda la Línea"
          />
        </div>
      </div>

      <Loading v-if="loading" />
      <Alert v-else-if="error" type="error" :message="error" />

      <div v-else class="table-container">
        <table v-if="activeTab === 'empresa'" class="data-table">
          <thead>
            <tr>
              <th class="checkbox-cell"></th>
              <th>N°</th>
              <th>Nombre</th>
              <th>Denominación</th>
              <th>Dirección</th>
              <th>Documento</th>
              <th>Correo electrónico</th>
              <th>Teléf 1</th>
              <th>Teléf 2</th>
              <th>Representante</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in filteredData" 
              :key="item.id"
              @click="toggleRowSelection(item)"
              :class="{ 'row-selected': isRowSelected(item) }"
            >
              <td class="checkbox-cell">
                <input 
                  type="checkbox" 
                  class="table-checkbox"
                  :checked="isRowSelected(item)"
                  @click.stop="toggleRowSelection(item)"
                />
              </td>
              <td>{{ index + 1 }}</td>
              <td class="table-name">{{ item.nombre }}</td>
              <td>{{ item.denominacion || item.ruc }}</td>
              <td>{{ item.direccion }}</td>
              <td>{{ item.documento || item.ruc }}</td>
              <td>{{ item.correo || item.email }}</td>
              <td>{{ item.telefono1 || item.telefono }}</td>
              <td>{{ item.telefono2 || '-' }}</td>
              <td>{{ item.representante || item.responsable }}</td>
              <td>
                <span :class="['badge', item.estado ? 'badge-active' : 'badge-inactive']">
                  {{ item.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <table v-else-if="activeTab === 'planta'" class="data-table">
          <thead>
            <tr>
              <th class="checkbox-cell"></th>
              <th>N°</th>
              <th>Nombre</th>
              <th>Información</th>
              <th>Zona Horaria</th>
              <th>Creado</th>
              <th>Modificado</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in filteredData" 
              :key="item.id"
              @click="toggleRowSelection(item)"
              :class="{ 'row-selected': isRowSelected(item) }"
            >
              <td class="checkbox-cell">
                <input 
                  type="checkbox" 
                  class="table-checkbox"
                  :checked="isRowSelected(item)"
                  @click.stop="toggleRowSelection(item)"
                />
              </td>
              <td>{{ index + 1 }}</td>
              <td class="table-name">{{ item.nombre }}</td>
              <td>{{ item.informacion }}</td>
              <td>{{ item.zonaHoraria }}</td>
              <td>{{ item.creado }}</td>
              <td>{{ item.modificado || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <table v-else-if="activeTab === 'linea'" class="data-table">
          <thead>
            <tr>
              <th class="checkbox-cell"></th>
              <th>N°</th>
              <th>Nombre</th>
              <th>Información</th>
              <th>Creado</th>
              <th>Código de alertas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in filteredData" 
              :key="item.id"
              @click="toggleRowSelection(item)"
              :class="{ 'row-selected': isRowSelected(item) }"
            >
              <td class="checkbox-cell">
                <input 
                  type="checkbox" 
                  class="table-checkbox"
                  :checked="isRowSelected(item)"
                  @click.stop="toggleRowSelection(item)"
                />
              </td>
              <td>{{ index + 1 }}</td>
              <td class="table-name">{{ item.nombre }}</td>
              <td>{{ item.informacion }}</td>
              <td>{{ item.creado }}</td>
              <td>{{ item.codigoAlertas }}</td>
              <td>
                <span :class="['badge', item.estado ? 'badge-active' : 'badge-inactive']">
                  {{ item.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <table v-else-if="activeTab === 'locacion'" class="data-table">
          <thead>
            <tr>
              <th class="checkbox-cell"></th>
              <th>N°</th>
              <th>Nombre</th>
              <th>Creado</th>
              <th>Modificado</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in filteredData" 
              :key="item.id"
              @click="toggleRowSelection(item)"
              :class="{ 'row-selected': isRowSelected(item) }"
            >
              <td class="checkbox-cell">
                <input 
                  type="checkbox" 
                  class="table-checkbox"
                  :checked="isRowSelected(item)"
                  @click.stop="toggleRowSelection(item)"
                />
              </td>
              <td>{{ index + 1 }}</td>
              <td class="table-name">{{ item.nombre }}</td>
              <td>{{ item.creado }}</td>
              <td>{{ item.modificado || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <table v-else-if="activeTab === 'dispositivo'" class="data-table">
          <thead>
            <tr>
              <th class="checkbox-cell"></th>
              <th>N°</th>
              <th>Nombre</th>
              <th>Creado</th>
              <th>Modificado</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in filteredData" 
              :key="item.id"
              @click="toggleRowSelection(item)"
              :class="{ 'row-selected': isRowSelected(item) }"
            >
              <td class="checkbox-cell">
                <input 
                  type="checkbox" 
                  class="table-checkbox"
                  :checked="isRowSelected(item)"
                  @click.stop="toggleRowSelection(item)"
                />
              </td>
              <td>{{ index + 1 }}</td>
              <td class="table-name">{{ item.nombre }}</td>
              <td>{{ item.creado }}</td>
              <td>{{ item.modificado || '-' }}</td>
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

    <Modal v-model="isOpen" @close="closeModal" :title="isEditing ? 'Editar' : 'Agregar'" size="xl">
      <form @submit.prevent="handleSubmit" class="form-container">
        <div v-if="activeTab === 'empresa'" class="form-content">
          <div class="form-section">
            <h4 class="section-title">
              <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              Información de la Empresa
            </h4>
            <div class="form-grid-improved">
              <FormField v-model="empresaForm.nombreComercial" label="Nombre Comercial" required />
              <FormField v-model="empresaForm.descripcion" label="Descripción" />
              <FormField v-model="empresaForm.denominacion" label="Denominación" />
              <FormField v-model="empresaForm.documento" label="Documento" required />
              <FormField v-model="empresaForm.correoElectronico" label="Correo electrónico de la empresa" type="email" required class="col-span-2" />
              <div class="form-field-wrapper">
                <label class="field-label">Tipo de documento</label>
                <select v-model="empresaForm.tipoDocumento" class="field-select">
                  <option value="RUC">RUC</option>
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4 class="section-title">
              <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Contacto
            </h4>
            <div class="form-grid-improved">
              <FormField v-model="empresaForm.telefono" label="Teléfono" required />
              <FormField v-model="empresaForm.telefono1" label="Teléfono 1" />
              <FormField v-model="empresaForm.sitioWeb" label="Sitio web" class="col-span-2" />
              <FormField v-model="empresaForm.representante" label="Representante" />
              <FormField v-model="empresaForm.telefonoRepresentante" label="Teléfono - Representante" />
            </div>
          </div>

          <div class="form-section">
            <h4 class="section-title">
              <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Logo
            </h4>
            <div class="logo-upload-container">
              <div class="logo-preview">
                <img v-if="empresaForm.logo" :src="empresaForm.logo" alt="Logo" class="logo-image" />
                <div v-else class="logo-placeholder">
                  <svg class="logo-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p class="logo-placeholder-text">Formato imagen 200px x 200px</p>
                </div>
              </div>
              <div class="logo-upload-actions">
                <input type="file" id="logoUpload" accept="image/*" class="hidden-input" @change="handleLogoUpload" />
                <label for="logoUpload" class="upload-button">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  Seleccionar archivo
                </label>
                <button v-if="empresaForm.logo" type="button" class="clear-button" @click="empresaForm.logo = ''">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Ningún archivo
                </button>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4 class="section-title">
              <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Dirección empresa
            </h4>
            <div class="form-grid-improved">
              <FormField v-model="empresaForm.direccion" label="Dirección" class="col-span-2" required />
            </div>
          </div>

          <div class="form-section-inline">
            <div class="status-toggle">
              <label class="toggle-label">
                <input v-model="empresaForm.estado" type="checkbox" class="toggle-input" />
                <span class="toggle-slider"></span>
                <span class="toggle-text">Activo</span>
              </label>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'planta'" class="form-content">
          <div class="form-section">
            <h4 class="section-title">
              <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              Información de la Planta
            </h4>
            <div class="form-grid-improved">
              <div class="form-field-wrapper col-span-2">
                <label class="field-label">Empresas</label>
                <select v-model="plantaForm.empresaId" class="field-select" required>
                  <option value="">Seleccione una empresa</option>
                  <option v-for="company in companies" :key="company.id" :value="company.id">
                    {{ company.nombre }}
                  </option>
                </select>
              </div>
              <FormField v-model="plantaForm.nombre" label="Nombre" required placeholder="INFORMACION" class="col-span-2" />
              <FormField v-model="plantaForm.descripcion" label="Descripción" placeholder="Información" class="col-span-2" />
              <div class="form-field-wrapper col-span-2">
                <label class="field-label">Zona Horaria</label>
                <select v-model="plantaForm.zonaHoraria" class="field-select" required>
                  <option value="America/Lima">America/Lima</option>
                  <option value="America/Bogota">America/Bogota</option>
                  <option value="America/Mexico_City">America/Mexico_City</option>
                  <option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires</option>
                  <option value="America/Santiago">America/Santiago</option>
                  <option value="America/Caracas">America/Caracas</option>
                  <option value="America/Sao_Paulo">America/Sao_Paulo</option>
                  <option value="America/Bahia">America/Bahia</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'linea'" class="form-content">
          <div class="form-section">
            <h4 class="section-title">
              <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
              </svg>
              Información de la Línea
            </h4>
            <div class="form-grid-improved">
              <div class="form-field-wrapper">
                <label class="field-label">Empresas</label>
                <select v-model="lineaForm.empresaId" class="field-select" required>
                  <option value="">Seleccione una empresa</option>
                  <option v-for="company in companies" :key="company.id" :value="company.id">
                    {{ company.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-field-wrapper">
                <label class="field-label">Plantas</label>
                <select v-model="lineaForm.plantaId" class="field-select" required>
                  <option value="">Seleccione una planta</option>
                  <option v-for="plant in plants" :key="plant.id" :value="plant.id">
                    {{ plant.nombre }}
                  </option>
                </select>
              </div>
              <FormField v-model="lineaForm.nombre" label="Nombre" required placeholder="INFORMACION" class="col-span-2" />
              <FormField v-model="lineaForm.descripcion" label="Descripción" placeholder="Descripción" class="col-span-2" />
              <div class="form-field-wrapper">
                <label class="field-label">Tipo</label>
                <select v-model="lineaForm.tipo" class="field-select" required>
                  <option value="Defecto">Defecto</option>
                  <option value="Suministro">Suministro</option>
                  <option value="Producción">Producción</option>
                  <option value="Energía">Energía</option>
                </select>
              </div>
              <FormField v-model="lineaForm.codigoAlertas" label="Código de alertas" placeholder="Código de alertas">
                <template #label>
                  <div class="flex items-center gap-2">
                    <span>Código de alertas</span>
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </template>
              </FormField>
              <div class="form-field-wrapper col-span-2">
                <label class="field-label">Subtipo</label>
                <select v-model="lineaForm.subtipo" class="field-select" required>
                  <option value="PLC">PLC</option>
                  <option value="SCADA">SCADA</option>
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'locacion'" class="form-content">
          <div class="form-section">
            <h4 class="section-title">
              <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Información de la Locación
            </h4>
            <div class="form-grid-improved">
              <div class="form-field-wrapper">
                <label class="field-label">Empresas</label>
                <select v-model="locacionForm.empresaId" class="field-select" required>
                  <option value="">Seleccione una empresa</option>
                  <option v-for="company in companies" :key="company.id" :value="company.id">
                    {{ company.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-field-wrapper">
                <label class="field-label">Plantas</label>
                <select v-model="locacionForm.plantaId" class="field-select" required>
                  <option value="">Seleccione una planta</option>
                  <option v-for="plant in plants" :key="plant.id" :value="plant.id">
                    {{ plant.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-field-wrapper col-span-2">
                <label class="field-label">Lineas</label>
                <select v-model="locacionForm.lineaId" class="field-select" required>
                  <option value="">Seleccione una línea</option>
                  <option v-for="line in lines" :key="line.id" :value="line.id">
                    {{ line.nombre }}
                  </option>
                </select>
              </div>
              <FormField v-model="locacionForm.nombre" label="Nombre" required placeholder="INFORMACION" class="col-span-2" />
              <FormField v-model="locacionForm.descripcion" label="Descripción" placeholder="Descripción" class="col-span-2" />
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'dispositivo'" class="form-content">
          <div class="form-section">
            <h4 class="section-title">
              <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
              </svg>
              Información del Dispositivo
            </h4>
            <div class="form-grid-improved">
              <div class="form-field-wrapper">
                <label class="field-label">Empresas</label>
                <select v-model="dispositivoForm.empresaId" class="field-select" required>
                  <option value="">Seleccione una empresa</option>
                  <option v-for="company in companies" :key="company.id" :value="company.id">
                    {{ company.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-field-wrapper">
                <label class="field-label">Plantas</label>
                <select v-model="dispositivoForm.plantaId" class="field-select" required>
                  <option value="">Seleccione una planta</option>
                  <option v-for="plant in plants" :key="plant.id" :value="plant.id">
                    {{ plant.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-field-wrapper">
                <label class="field-label">Lineas</label>
                <select v-model="dispositivoForm.lineaId" class="field-select" required>
                  <option value="">Seleccione una línea</option>
                  <option v-for="line in lines" :key="line.id" :value="line.id">
                    {{ line.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-field-wrapper">
                <label class="field-label">Locaciones</label>
                <select v-model="dispositivoForm.locacionId" class="field-select" required>
                  <option value="">Seleccione una locación</option>
                  <option v-for="location in locations" :key="location.id" :value="location.id">
                    {{ location.nombre }}
                  </option>
                </select>
              </div>
              <FormField v-model="dispositivoForm.nombre" label="Nombre" required placeholder="INFORMACION" class="col-span-2" />
            </div>
          </div>
        </div>

        <div class="form-footer">
          <Button type="button" @click="closeModal" variant="secondary" size="md">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" :loading="loading">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </Button>
        </div>
      </form>
    </Modal>

    <Modal v-model="showDeleteConfirm" @close="showDeleteConfirm = false" title="Confirmar Eliminación" size="sm">
      <div class="delete-confirm">
        <svg class="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <p class="delete-text">
          ¿Está seguro de eliminar 
          <strong>{{ selectedRows.length }} {{ selectedRows.length === 1 ? 'registro' : 'registros' }}</strong>?
        </p>
        <p class="delete-warning">Esta acción no se puede deshacer.</p>
      </div>
      <div class="form-actions">
        <Button @click="showDeleteConfirm = false" variant="secondary">Cancelar</Button>
        <Button @click="handleDelete" variant="danger" :loading="loading">Eliminar</Button>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.empresa-view {
  @apply space-y-0;
}

.tabs-container {
  @apply flex border-b border-gray-200 bg-white;
}

.tab {
  @apply px-6 py-3 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 transition-colors;
}

.tab.active {
  @apply text-blue-700 border-blue-700;
}

.content-card {
  @apply rounded-t-none border-t-0;
}

.action-bar {
  @apply flex gap-2 p-4 bg-blue-900 rounded-t-lg;
}

.filters-bar {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white border-b border-gray-200;
}

.filter-group {
  @apply space-y-1;
}

.filter-label {
  @apply block text-sm font-medium text-gray-700;
}

.table-container {
  @apply overflow-x-auto;
}

.data-table {
  @apply w-full text-sm;
}

.data-table thead {
  @apply bg-gray-100;
}

.data-table th {
  @apply px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200;
}

.data-table tbody tr {
  @apply transition-colors duration-150 cursor-pointer;
}

.data-table tbody tr:hover {
  @apply bg-blue-50;
}

.data-table tbody tr:nth-child(even) {
  @apply bg-gray-50;
}

.data-table tbody tr:nth-child(even):hover {
  @apply bg-blue-50;
}

.data-table tbody tr.row-selected {
  @apply bg-blue-100 border-l-4 border-blue-600;
}

.data-table td {
  @apply px-4 py-3 text-gray-900 border-b border-gray-200;
}

.data-table td.table-name {
  font-weight: 600;
  color: #111827;
}

.checkbox-cell {
  @apply w-12 text-center;
}

.table-checkbox {
  @apply w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer;
}

.badge {
  @apply px-3 py-1 rounded-full text-xs font-semibold inline-block;
}

.badge-active {
  @apply bg-green-100 text-green-800;
}

.badge-inactive {
  @apply bg-gray-100 text-gray-600;
}

.pagination {
  @apply flex items-center justify-center gap-4 p-4 bg-gray-50 border-t border-gray-200;
}

.pagination-btn {
  @apply px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50;
}

.pagination-info {
  @apply text-sm font-medium text-gray-700;
}


.form-container {
  padding: 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-section-inline {
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #dbeafe;
}

.section-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #3b82f6;
}

.form-grid-improved {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.form-grid-improved .col-span-2 {
  grid-column: span 2;
}

.status-toggle {
  display: flex;
  justify-content: flex-start;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #bfdbfe;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  background-color: #cbd5e1;
  border-radius: 24px;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-slider {
  background-color: #3b82f6;
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(24px);
}

.toggle-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #1e293b;
}

.form-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  margin-top: 1rem;
  border-top: 2px solid #e5e7eb;
}

.form-footer button {
  min-width: 120px;
}

.form-field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.field-select {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
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

.logo-upload-container {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.logo-preview {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #94a3b8;
}

.logo-placeholder-icon {
  width: 3rem;
  height: 3rem;
}

.logo-placeholder-text {
  font-size: 0.75rem;
  text-align: center;
  padding: 0 1rem;
}

.logo-upload-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
}

.hidden-input {
  display: none;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #3b82f6;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-button:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
}

.clear-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #dc2626;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-button:hover {
  background-color: #fecaca;
  border-color: #fca5a5;
}

.form-grid {
  @apply grid grid-cols-2 gap-4;
}

.checkbox-field {
  @apply col-span-2;
}

.checkbox-label {
  @apply flex items-center gap-3 cursor-pointer;
}

.checkbox-input {
  @apply w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500;
}

.checkbox-text {
  @apply text-sm font-medium text-gray-700;
}

.form-actions {
  @apply flex gap-3 justify-end pt-4 border-t border-gray-200;
}

.delete-confirm {
  @apply text-center py-4;
}

.delete-icon {
  @apply w-16 h-16 mx-auto text-red-500 mb-4;
}

.delete-text {
  @apply text-gray-900 mb-2;
}

.delete-warning {
  @apply text-sm text-gray-500;
}
</style>