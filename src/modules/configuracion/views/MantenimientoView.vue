<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import Alert from '@/shared/components/ui/Alert.vue'
import { useModal } from '@/shared/composables/useModal'
import { useApi } from '@/shared/composables/useApi'

const { isOpen, open: openModal, close: closeModal } = useModal()
const { loading, error, execute } = useApi()

const mantenimientos = ref([])
const empresas = ref([])
const selectedRows = ref([])

const canEdit = computed(() => selectedRows.value.length === 1)

const editForm = ref({
  id: '',
  empresaId: '',
  nombre: '',
  estado: true
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

    // Mock mantenimientos
    mantenimientos.value = [
      { 
        id: 1,
        nombre: 'OPL/HourStopsCascada 5min "Time"',
        estado: false,
        empresaId: 1
      },
      { 
        id: 2,
        nombre: 'Calzado 1hr; OEE-Rated',
        estado: false,
        empresaId: 1
      },
      { 
        id: 3,
        nombre: 'GEJ Router B',
        estado: true,
        empresaId: 1
      },
      { 
        id: 4,
        nombre: 'SWT Relación B',
        estado: true,
        empresaId: 1
      },
      { 
        id: 5,
        nombre: 'GEJ Regulador Corrimiento',
        estado: false,
        empresaId: 1
      },
      { 
        id: 6,
        nombre: 'GEJ GG/Excel',
        estado: true,
        empresaId: 1
      },
      { 
        id: 7,
        nombre: 'SWT Usen',
        estado: true,
        empresaId: 1
      }
    ]
  })
}

const openEditModal = () => {
  if (selectedRows.value.length === 1) {
    const item = selectedRows.value[0]
    editForm.value = { ...item }
    openModal()
  }
}

const handleSubmit = async () => {
  await execute(async () => {
    // Update logic
    const mantenimiento = mantenimientos.value.find(m => m.id === editForm.value.id)
    if (mantenimiento) {
      Object.assign(mantenimiento, editForm.value)
    }
    await loadData()
    closeModal()
    selectedRows.value = []
  })
}

// Filtros
const empresaFiltro = ref(1)

const mantenimientosFiltrados = computed(() => {
  let filtered = mantenimientos.value

  if (empresaFiltro.value) {
    filtered = filtered.filter(m => m.empresaId === parseInt(empresaFiltro.value))
  }

  return filtered
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="mantenimiento-view">
    <div class="view-header">
      <div>
        <h1 class="view-title">MANTENIMIENTO</h1>
      </div>
    </div>

    <Card class="content-card">
      <div class="filters-bar">
        <div class="filter-item">
          <label class="filter-label">Empresa</label>
          <select v-model="empresaFiltro" class="field-select-filter">
            <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
              {{ empresa.nombre }}
            </option>
          </select>
        </div>
      </div>

      <Loading v-if="loading" />
      <Alert v-else-if="error" type="error" :message="error" />

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 60px;">N°</th>
              <th>Estado</th>
              <th>Nombre</th>
              <th style="width: 120px;">Desactivar</th>
              <th style="width: 120px;">Activar</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(mantenimiento, index) in mantenimientosFiltrados" 
              :key="mantenimiento.id"
              @click="toggleRowSelection(mantenimiento)"
              :class="{ 'row-selected': isRowSelected(mantenimiento) }"
            >
              <td>{{ index + 1 }}</td>
              <td>
                <div class="status-cell" :class="mantenimiento.estado ? 'status-active' : 'status-inactive'">
                  {{ mantenimiento.estado ? 'ON' : 'OFF' }}
                </div>
              </td>
              <td class="table-name">{{ mantenimiento.nombre }}</td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm"
                  @click.stop="() => {}"
                >
                  Desactivar
                </Button>
              </td>
              <td>
                <Button 
                  variant="primary" 
                  size="sm"
                  @click.stop="() => {}"
                >
                  Activar
                </Button>
              </td>
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

    <!-- Sidebar para configuración -->
    <div class="config-sidebar">
      <div class="sidebar-header">
        <button class="collapse-btn">−</button>
      </div>
      <div class="sidebar-content">
        <div class="config-item">
          <label class="config-label">Fecha</label>
          <input type="text" class="config-input" readonly />
        </div>
        <div class="config-item">
          <label class="config-label">Estado de archivo: "BU_CALZADO_1_MONTH" →</label>
          <button class="file-btn">No</button>
        </div>
        <div class="config-section">
          <h4 class="section-title">Parada</h4>
          <div class="config-item">
            <label class="config-label">Estado de la planta: "G"</label>
            <button class="file-btn">No</button>
          </div>
          <div class="config-item">
            <label class="config-label">Estado de la planta: "R"</label>
            <button class="file-btn">No</button>
          </div>
          <div class="config-item">
            <label class="config-label">Estado de la planta: "Y"</label>
            <button class="file-btn">No</button>
          </div>
          <div class="config-item">
            <label class="config-label">Estado de la planta: "G"</label>
            <button class="file-btn">No</button>
          </div>
          <div class="config-item">
            <label class="config-label">Estado de la planta: "R"</label>
            <button class="file-btn">No</button>
          </div>
          <div class="config-item">
            <label class="config-label">Estado de la planta: "Y"</label>
            <button class="file-btn">No</button>
          </div>
          <div class="config-item">
            <label class="config-label">Estado de la planta: "G"</label>
            <button class="file-btn">No</button>
          </div>
          <div class="config-item">
            <label class="config-label">Estado de la planta: "R"</label>
            <button class="file-btn">No</button>
          </div>
          <div class="config-item">
            <label class="config-label">Estado de la planta: "Y"</label>
            <button class="file-btn">No</button>
          </div>
          <div class="config-item">
            <label class="config-label">Estado de la planta: "Z"</label>
            <button class="file-btn">No</button>
          </div>
        </div>
        <div class="config-item">
          <label class="config-label">CAP en el archivo: "BU_CALZADO_1_MONTH" →</label>
          <input type="checkbox" class="config-checkbox" />
        </div>
        <div class="config-item">
          <label class="config-label">Estado de archivo: "BU_CALZADO_1_MONTH" →</label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mantenimiento-view {
  display: flex;
  gap: 1.5rem;
  position: relative;
}

.view-header {
  position: absolute;
  top: -3.5rem;
  left: 0;
}

.view-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
}

.content-card {
  flex: 1;
  border-radius: 0;
  border-top: none;
}

.filters-bar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #1e3a8a;
  border-radius: 0.5rem 0.5rem 0 0;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

.field-select-filter {
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  transition: all 0.2s;
  cursor: pointer;
  min-width: 250px;
}

.field-select-filter:hover {
  border-color: #9ca3af;
}

.field-select-filter:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  font-weight: 500;
  color: #111827;
}

.status-cell {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
  min-width: 60px;
}

.status-active {
  background-color: #86efac;
  color: #065f46;
}

.status-inactive {
  background-color: #fca5a5;
  color: #7f1d1d;
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

.config-sidebar {
  width: 400px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.sidebar-header {
  padding: 1rem;
  background-color: #1e3a8a;
  color: white;
  display: flex;
  justify-content: flex-end;
}

.collapse-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-content {
  padding: 1rem;
}

.config-item {
  margin-bottom: 1rem;
}

.config-label {
  display: block;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.config-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.file-btn {
  padding: 0.25rem 0.75rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.file-btn:hover {
  background-color: #f9fafb;
}

.config-section {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #dbeafe;
}

.config-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}
</style>
