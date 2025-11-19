<script setup>
import { ref, computed, onMounted } from 'vue'
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

const { isOpen, open: openModal, close: closeModal } = useModal()
const { loading, error, execute } = useApi()

const users = ref([])
const companies = ref([])
const selectedCompany = ref(null)
const selectedRows = ref([])
const isEditing = ref(false)
const showDeleteConfirm = ref(false)

const canEdit = computed(() => selectedRows.value.length === 1)
const canDelete = computed(() => selectedRows.value.length > 0)

const usuarioForm = ref({
  empresaId: null,
  usuario: '',
  contrasena: '',
  nombreApellidos: '',
  correoElectronico: '',
  documento: '',
  tipoDocumento: 'RUC',
  estado: true
})

const companyOptions = computed(() => 
  companies.value.map(c => ({ value: c.id, label: c.nombre }))
)

const toggleRowSelection = (item) => {
  selectedRows.value = [item]
}

const isRowSelected = (item) => {
  return selectedRows.value.some(row => row.id === item.id)
}

const loadData = async () => {
  await execute(async () => {
    const [companiesRes] = await Promise.all([
      companyService.getAll()
    ])
    companies.value = companiesRes.data
    
    // Mock users data
    users.value = [
      { 
        id: 1, 
        empresaId: 1, 
        empresa: 'Industrias San Miguel',
        cuenta: 1,
        cliente: 'Lizandro Cárdenas',
        correoElectronico: 'lizandro.cardenas@ism.global',
        usuario: 'Lizandro Cárdenas',
        documento: 'Lizandro Cárdenas',
        estado: true,
        clave: '🔑'
      },
      { 
        id: 2, 
        empresaId: 1, 
        empresa: 'Industrias San Miguel',
        cuenta: 2,
        cliente: 'Christian Cuadros',
        correoElectronico: 'christian.cuadros@ism.global',
        usuario: 'Christian Cuadros',
        documento: 'Christian Cuadros',
        estado: true,
        clave: '🔑'
      },
      { 
        id: 3, 
        empresaId: 1, 
        empresa: 'Industrias San Miguel',
        cuenta: 3,
        cliente: 'Alvaro Herrera',
        correoElectronico: 'alvaro.herrera@ism.global',
        usuario: 'alvaro.herrera',
        documento: '1292929',
        estado: true,
        clave: '🔑'
      },
      { 
        id: 4, 
        empresaId: 1, 
        empresa: 'Industrias San Miguel',
        cuenta: 4,
        cliente: 'Francisco Aranda',
        correoElectronico: 'francisco.aranda@ism.global',
        usuario: 'Francisco',
        documento: '234243234',
        estado: true,
        clave: '🔑'
      }
    ]
  })
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  openModal()
}

const openEditModal = () => {
  if (selectedRows.value.length === 1) {
    const item = selectedRows.value[0]
    isEditing.value = true
    usuarioForm.value = { ...item }
    openModal()
  }
}

const resetForm = () => {
  usuarioForm.value = { 
    empresaId: selectedCompany.value,
    usuario: '',
    contrasena: '',
    nombreApellidos: '',
    correoElectronico: '',
    documento: '',
    tipoDocumento: 'RUC',
    estado: true
  }
}

const handleSubmit = async () => {
  await execute(async () => {
    if (isEditing.value) {
      // Update logic
    } else {
      // Create logic
    }
    await loadData()
    closeModal()
  })
}

const confirmDelete = () => {
  if (selectedRows.value.length > 0) {
    showDeleteConfirm.value = true
  }
}

const handleDelete = async () => {
  await execute(async () => {
    for (const item of selectedRows.value) {
      // Delete logic
    }
    await loadData()
    showDeleteConfirm.value = false
    selectedRows.value = []
  })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="usuario-view">
    <div class="view-header">
      <div>
        <h1 class="view-title">USUARIOS</h1>
      </div>
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
      </div>

      <div class="filters-bar">
        <div class="filter-group">
          <label class="filter-label">Empresa</label>
          <SelectFilter 
            v-model="selectedCompany" 
            :options="companyOptions"
            placeholder="Seleccione una Empresa"
          />
        </div>
      </div>

      <Loading v-if="loading" />
      <Alert v-else-if="error" type="error" :message="error" />

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th class="checkbox-cell"></th>
              <th>N°</th>
              <th>Cuenta</th>
              <th>Cliente</th>
              <th>Correo electrónico</th>
              <th>Usuario</th>
              <th>Documento</th>
              <th>Estado</th>
              <th>Clave</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(user, index) in users" 
              :key="user.id"
              @click="toggleRowSelection(user)"
              :class="{ 'row-selected': isRowSelected(user) }"
            >
              <td class="checkbox-cell">
                <input 
                  type="checkbox" 
                  class="table-checkbox"
                  :checked="isRowSelected(user)"
                  @click.stop="toggleRowSelection(user)"
                />
              </td>
              <td>{{ index + 1 }}</td>
              <td class="table-name">{{ user.empresa }}</td>
              <td>{{ user.cliente }}</td>
              <td>{{ user.correoElectronico }}</td>
              <td>{{ user.usuario }}</td>
              <td>{{ user.documento }}</td>
              <td>
                <span :class="['badge', user.estado ? 'badge-active' : 'badge-inactive']">
                  {{ user.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>{{ user.clave }}</td>
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

    <Modal v-model="isOpen" @close="closeModal" :title="isEditing ? 'Editar Usuario' : 'Crear Usuario'" size="lg">
      <form @submit.prevent="handleSubmit" class="form-container">
        <div class="form-content">
          <div class="form-section">
            <h4 class="section-title">
              <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Información del Usuario
            </h4>
            <div class="form-grid-improved">
              <div class="form-field-wrapper col-span-2">
                <label class="field-label">Empresas</label>
                <select v-model="usuarioForm.empresaId" class="field-select" required>
                  <option value="">Seleccione una empresa</option>
                  <option v-for="company in companies" :key="company.id" :value="company.id">
                    {{ company.nombre }}
                  </option>
                </select>
              </div>
              <FormField v-model="usuarioForm.usuario" label="Usuario" required placeholder="Usuario" />
              <FormField v-model="usuarioForm.contrasena" label="Contraseña" type="password" required placeholder="Contraseña" />
              <FormField v-model="usuarioForm.nombreApellidos" label="Nombre(s) y apellidos" required placeholder="Nombres" class="col-span-2" />
              <FormField v-model="usuarioForm.correoElectronico" label="Correo electrónico" type="email" required placeholder="Correo electrónico" class="col-span-2" />
              <FormField v-model="usuarioForm.documento" label="Documento" required placeholder="Documento" />
              <div class="form-field-wrapper">
                <label class="field-label">Tipo de documento</label>
                <select v-model="usuarioForm.tipoDocumento" class="field-select">
                  <option value="RUC">RUC</option>
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
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
          ¿Está seguro que desea eliminar {{ selectedRows.length }} {{ selectedRows.length === 1 ? 'registro' : 'registros' }}?
        </p>
        <p class="delete-subtext">Esta acción no se puede deshacer.</p>
      </div>
      <template #footer>
        <div class="delete-actions">
          <Button @click="showDeleteConfirm = false" variant="secondary">Cancelar</Button>
          <Button @click="handleDelete" variant="danger" :loading="loading">Eliminar</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.usuario-view {
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
  gap: 0.5rem;
  padding: 1rem;
  background-color: #1e3a8a;
  border-radius: 0.5rem 0.5rem 0 0;
}

.filters-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
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
  gap: 1.5rem;
}

.form-section {
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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

.delete-confirm {
  text-align: center;
  padding: 1rem 0;
}

.delete-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto;
  color: #dc2626;
  margin-bottom: 1rem;
}

.delete-text {
  color: #111827;
  margin-bottom: 0.5rem;
}

.delete-subtext {
  font-size: 0.875rem;
  color: #6b7280;
}

.delete-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
</style>
