<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/shared/composables/useApi'
import { useModal } from '@/shared/composables/useModal'
import { useTable } from '@/shared/composables/useTable'
import { plantService } from '@/api/services/plant.service'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import FormField from '@/shared/components/forms/FormField.vue'
import Loading from '@/shared/components/ui/Loading.vue'

const { loading, execute } = useApi()
const modal = useModal()
const table = useTable()

const editingPlant = ref(null)
const form = ref({
  nombre: '',
  compania: '',
  lineas: 0
})

onMounted(async () => {
  await loadPlants()
})

async function loadPlants() {
  const { data } = await execute(() => plantService.getAll())
  if (data) {
    table.setItems(data.data, data.total)
  }
}

function openCreateModal() {
  editingPlant.value = null
  form.value = { nombre: '', compania: '', lineas: 0 }
  modal.open()
}

function openEditModal(plant) {
  editingPlant.value = plant
  form.value = { ...plant }
  modal.open()
}

async function handleSave() {
  if (editingPlant.value) {
    await execute(() => plantService.update(editingPlant.value.id, form.value))
  } else {
    await execute(() => plantService.create(form.value))
  }
  modal.close()
  await loadPlants()
}

async function handleDelete(id) {
  if (confirm('¿Está seguro de eliminar esta planta?')) {
    await execute(() => plantService.delete(id))
    await loadPlants()
  }
}
</script>

<template>
  <div class="planta-view">
    <div class="view-header">
      <div>
        <h1 class="view-title">Gestión de Plantas</h1>
        <p class="view-subtitle">Administre las plantas del sistema</p>
      </div>
      <Button @click="openCreateModal">Nueva Planta</Button>
    </div>

    <Card>
      <Loading v-if="loading" />
      
      <div v-else-if="table.items.length > 0" class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Compañía</th>
              <th>Líneas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plant in table.items" :key="plant.id">
              <td>{{ plant.id }}</td>
              <td>{{ plant.nombre }}</td>
              <td>{{ plant.compania }}</td>
              <td>{{ plant.lineas }}</td>
              <td>
                <span :class="['status-badge', plant.activo ? 'status-active' : 'status-inactive']">
                  {{ plant.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon" @click="openEditModal(plant)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  <button class="btn-icon btn-icon-danger" @click="handleDelete(plant.id)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="empty-state">
        <p>No hay plantas registradas</p>
        <Button @click="openCreateModal" class="mt-4">Crear Primera Planta</Button>
      </div>
    </Card>

    <Modal v-model="modal.isOpen" :title="editingPlant ? 'Editar Planta' : 'Nueva Planta'">
      <form @submit.prevent="handleSave" class="form-grid">
        <FormField v-model="form.nombre" label="Nombre" required />
        <FormField v-model="form.compania" label="Compañía" required />
        <FormField v-model.number="form.lineas" label="Líneas" type="number" required />
      </form>

      <template #footer>
        <div class="modal-actions">
          <Button variant="ghost" @click="modal.close">Cancelar</Button>
          <Button @click="handleSave">Guardar</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.planta-view {
  @apply space-y-6;
}

.view-header {
  @apply flex items-start justify-between;
}

.view-title {
  @apply text-2xl font-bold text-gray-900;
}

.view-subtitle {
  @apply text-gray-600 mt-1;
}

.table-container {
  @apply overflow-x-auto;
}

.data-table {
  @apply w-full;
}

.data-table thead {
  @apply bg-gray-50 border-b border-gray-200;
}

.data-table th {
  @apply px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.data-table td {
  @apply px-4 py-4 whitespace-nowrap text-sm text-gray-900;
}

.data-table tbody tr {
  @apply border-b border-gray-200 hover:bg-gray-50 transition-colors;
}

.status-badge {
  @apply inline-flex px-2 py-1 text-xs font-semibold rounded-full;
}

.status-active {
  @apply bg-green-100 text-green-800;
}

.status-inactive {
  @apply bg-gray-100 text-gray-800;
}

.action-buttons {
  @apply flex items-center gap-2;
}

.btn-icon {
  @apply p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors;
}

.btn-icon-danger {
  @apply hover:bg-red-50 hover:text-red-600;
}

.empty-state {
  @apply text-center py-12;
}

.form-grid {
  @apply grid grid-cols-1 gap-4;
}

.modal-actions {
  @apply flex items-center justify-end gap-3;
}
</style>
