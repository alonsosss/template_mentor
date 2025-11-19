<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import FormField from '@/shared/components/forms/FormField.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import Alert from '@/shared/components/ui/Alert.vue'
import { useModal } from '@/shared/composables/useModal'
import { useApi } from '@/shared/composables/useApi'

const { isOpen, open: openModal, close: closeModal } = useModal()
const { loading, error, execute } = useApi()

const usuarios = ref([])
const empresas = ref([])
const plantas = ref([])
const rolesDisponibles = ref([])
const selectedRows = ref([])

const canEdit = computed(() => selectedRows.value.length === 1)

const editForm = ref({
  empresaId: '',
  usuarioId: '',
  rolId: '',
  plantaId: ''
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
      { id: 1, nombre: 'Industrias San Miguel' },
      { id: 2, nombre: 'Corporación ABC' }
    ]

    // Mock plantas
    plantas.value = [
      { id: 1, nombre: 'ISM Arequipa', empresaId: 1 },
      { id: 2, nombre: 'ISM Lima', empresaId: 1 },
      { id: 3, nombre: 'Sin Planta', empresaId: 1 }
    ]

    // Mock roles disponibles
    rolesDisponibles.value = [
      { id: 1, nombre: 'PLANT_ADMIN', descripcion: 'Administrador de Planta' },
      { id: 2, nombre: 'PLANT_ANALISTA', descripcion: 'Analista de Planta' },
      { id: 3, nombre: 'ROOT', descripcion: 'Root' },
      { id: 4, nombre: 'OPERARIO', descripcion: 'Operario' },
      { id: 5, nombre: 'CORP_ANALISTA', descripcion: 'Analista Corporativo' },
      { id: 6, nombre: 'CORP_COPORATIVO', descripcion: 'Corporativo' },
      { id: 7, nombre: 'NO ASIGNADO', descripcion: 'Sin rol asignado' }
    ]

    // Mock usuarios con roles asignados
    usuarios.value = [
      { 
        id: 1, 
        nombre: 'Lizandro Cárdenas',
        nombreCompleto: 'Lizandro Cárdenas',
        correoElectronico: 'lizandro.cardenas@ism.global',
        rol: 'PLANT_ADMIN',
        planta: 'ISM Arequipa',
        empresaId: 1,
        plantaId: 1,
        rolId: 1
      },
      { 
        id: 2, 
        nombre: 'Christian Cuadros',
        nombreCompleto: 'Christian Cuadros',
        correoElectronico: 'christian.cuadros@ism.global',
        rol: 'PLANT_ADMIN',
        planta: 'ISM Arequipa',
        empresaId: 1,
        plantaId: 1,
        rolId: 1
      },
      { 
        id: 3, 
        nombre: 'Álvaro',
        nombreCompleto: 'alvaro.herrera',
        correoElectronico: 'alvaro.herrera@ism.global',
        rol: 'PLANT_ANALISTA',
        planta: 'ISM Arequipa',
        empresaId: 1,
        plantaId: 1,
        rolId: 2
      },
      { 
        id: 4, 
        nombre: 'Francisco Aranda',
        nombreCompleto: 'Francisco',
        correoElectronico: 'francisco.aranda@ism.global',
        rol: 'PLANT_ADMIN',
        planta: 'ISM Arequipa',
        empresaId: 1,
        plantaId: 1,
        rolId: 1
      },
      { 
        id: 5, 
        nombre: 'JORGE MILLONES',
        nombreCompleto: 'jorge.millones@ism.global',
        correoElectronico: 'jorge.millones@ism.global',
        rol: 'NO ASIGNADO',
        planta: 'Sin Planta',
        empresaId: 1,
        plantaId: 3,
        rolId: 7
      }
    ]
  })
}

const openEditModal = () => {
  if (selectedRows.value.length === 1) {
    const item = selectedRows.value[0]
    editForm.value = {
      empresaId: item.empresaId,
      usuarioId: item.id,
      rolId: item.rolId,
      plantaId: item.plantaId
    }
    openModal()
  }
}

const resetForm = () => {
  editForm.value = { 
    empresaId: '',
    usuarioId: '',
    rolId: '',
    plantaId: ''
  }
}

const handleSubmit = async () => {
  await execute(async () => {
    // Update user role assignment
    const user = usuarios.value.find(u => u.id === editForm.value.usuarioId)
    if (user) {
      const rol = rolesDisponibles.value.find(r => r.id === editForm.value.rolId)
      const planta = plantas.value.find(p => p.id === editForm.value.plantaId)
      
      user.rolId = editForm.value.rolId
      user.plantaId = editForm.value.plantaId
      user.rol = rol ? rol.nombre : 'NO ASIGNADO'
      user.planta = planta ? planta.nombre : 'Sin Planta'
    }
    
    await loadData()
    closeModal()
    selectedRows.value = []
  })
}

// Filtros
const empresaFiltro = ref('')
const plantaFiltro = ref('')

const usuariosFiltrados = computed(() => {
  let filtered = usuarios.value

  if (empresaFiltro.value) {
    filtered = filtered.filter(u => u.empresaId === parseInt(empresaFiltro.value))
  }

  if (plantaFiltro.value) {
    filtered = filtered.filter(u => u.plantaId === parseInt(plantaFiltro.value))
  }

  return filtered
})

const plantasFiltradas = computed(() => {
  if (!empresaFiltro.value) {
    return plantas.value
  }
  return plantas.value.filter(p => p.empresaId === parseInt(empresaFiltro.value))
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="roles-view">
    <div class="view-header">
      <div>
        <h1 class="view-title">ROLES</h1>
      </div>
    </div>

    <Card class="content-card">
      <div class="action-bar">
        <div class="filter-group">
          <div class="filter-item">
            <label class="filter-label">Empresa</label>
            <select v-model="empresaFiltro" class="field-select-filter">
              <option value="">Industrias San Miguel</option>
              <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
                {{ empresa.nombre }}
              </option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">Planta</label>
            <select v-model="plantaFiltro" class="field-select-filter">
              <option value="">Todas las plantas</option>
              <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
                {{ planta.nombre }}
              </option>
            </select>
          </div>
        </div>
        <Button 
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
      </div>

      <Loading v-if="loading" />
      <Alert v-else-if="error" type="error" :message="error" />

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th class="checkbox-cell"></th>
              <th>N°</th>
              <th>Nombre</th>
              <th>Nombre Usuario</th>
              <th>Correo electrónico</th>
              <th>Role</th>
              <th>Planta</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(usuario, index) in usuariosFiltrados" 
              :key="usuario.id"
              @click="toggleRowSelection(usuario)"
              :class="{ 'row-selected': isRowSelected(usuario) }"
            >
              <td class="checkbox-cell">
                <input 
                  type="checkbox" 
                  class="table-checkbox"
                  :checked="isRowSelected(usuario)"
                  @click.stop="toggleRowSelection(usuario)"
                />
              </td>
              <td>{{ index + 1 }}</td>
              <td class="table-name">{{ usuario.nombre }}</td>
              <td>{{ usuario.nombreCompleto }}</td>
              <td>{{ usuario.correoElectronico }}</td>
              <td>{{ usuario.rol }}</td>
              <td>{{ usuario.planta }}</td>
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

    <Modal v-model="isOpen" @close="closeModal" title="EDITAR" size="md">
      <form @submit.prevent="handleSubmit" class="form-container">
        <div class="form-content">
          <div class="form-row">
            <label class="form-label">Empresa</label>
            <select v-model="editForm.empresaId" class="field-select" required>
              <option value="" disabled>Seleccione empresa</option>
              <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
                {{ empresa.nombre }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <label class="form-label">Usuario</label>
            <select v-model="editForm.usuarioId" class="field-select" required disabled>
              <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                {{ usuario.nombre }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <label class="form-label">roles</label>
            <select v-model="editForm.rolId" class="field-select" required>
              <option value="" disabled>Seleccione rol</option>
              <option v-for="rol in rolesDisponibles" :key="rol.id" :value="rol.id">
                {{ rol.nombre }}
              </option>
            </select>
          </div>

          <div class="info-message">
            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>EL ROL NO ASIGNADO, NO PERMITE AL USUARIO ACCEDER A LA PLATAFORMA</span>
          </div>

          <div class="form-row">
            <label class="form-label">Planta</label>
            <select v-model="editForm.plantaId" class="field-select" required>
              <option value="" disabled>Seleccione planta</option>
              <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
                {{ planta.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-footer">
          <Button type="submit" variant="primary" size="md" :loading="loading">
            GUARDAR
          </Button>
          <Button type="button" @click="closeModal" variant="secondary" size="md">
            CANCELAR
          </Button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<style scoped>
.roles-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.view-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
}

.content-card {
  border-radius: 0;
  border-top: none;
}

.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
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
  min-width: 200px;
}

.field-select-filter:hover {
  border-color: #9ca3af;
}

.field-select-filter:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-select {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
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

.field-select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
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

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.badge-active {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-inactive {
  background-color: #f3f4f6;
  color: #6b7280;
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
  gap: 1.25rem;
  padding: 1.5rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.info-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background-color: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  color: #92400e;
  font-weight: 500;
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #f59e0b;
  flex-shrink: 0;
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
