<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import Alert from '@/shared/components/ui/Alert.vue'
import { useApi } from '@/shared/composables/useApi'

const { loading, error, execute } = useApi()

const companias = ref([
  { id: 1, nombre: 'Industrias San Miguel' }
])

const plantas = ref([
  { id: 1, companiaId: 1, nombre: 'ISM Arequipa' }
])

const lineasDisponibles = ref([
  { id: 1, nombre: 'LÍNEA 01' },
  { id: 2, nombre: 'LÍNEA 02' },
  { id: 3, nombre: 'LÍNEA 03' },
  { id: 4, nombre: 'LÍNEA 04' },
  { id: 5, nombre: 'LÍNEA 05' },
  { id: 6, nombre: 'LÍNEA 06' }
])

const rolesDisponibles = ref([
  'PLANT_ANALISTA',
  'PLANT_ADMIN',
  'OPERARIO',
  'ROOT'
])

const usuarios = ref([
  { id: 1, numero: 1, linea: 'LÍNEA 05', usuario: 'Jorge Valdivia', rol: 'PLANT_ANALISTA', fecha: '7/10/2022, 9:16:48' },
  { id: 2, numero: 2, linea: 'LÍNEA 05', usuario: 'Carlos Z', rol: 'PLANT_ADMIN', fecha: '31/1/2023, 10:39:33' },
  { id: 3, numero: 3, linea: 'LÍNEA 03', usuario: 'Linea 3', rol: 'OPERARIO', fecha: '15/2/2025, 8:44:54' },
  { id: 4, numero: 4, linea: 'LÍNEA 04', usuario: 'Linea 4', rol: 'OPERARIO', fecha: '9/3/2025, 6:11:06' },
  { id: 5, numero: 5, linea: 'LÍNEA 02', usuario: 'Linea 2', rol: 'OPERARIO', fecha: '31/3/2025, 8:09:30' },
  { id: 6, numero: 6, linea: 'LÍNEA 02', usuario: 'PROYECTOS MENTOR', rol: 'ROOT', fecha: '29/6/2025, 18:11:11' },
  { id: 7, numero: 7, linea: 'LÍNEA 02', usuario: 'Lizandro Cardenas', rol: 'PLANT_ADMIN', fecha: '4/9/2025, 7:59:41' },
  { id: 8, numero: 8, linea: 'LÍNEA 04', usuario: 'Desarrollo', rol: 'ROOT', fecha: '22/10/2025, 20:11:21' },
  { id: 9, numero: 9, linea: 'LÍNEA 05', usuario: 'Inspector Arequipa', rol: 'PLANT_ADMIN', fecha: '15/11/2025, 6:16:16' },
  { id: 10, numero: 10, linea: 'LÍNEA 05', usuario: 'Arequipa', rol: 'PLANT_ADMIN', fecha: '17/11/2025, 15:24:13' },
  { id: 11, numero: 11, linea: 'LÍNEA 05', usuario: 'Christian Cuadros', rol: 'PLANT_ADMIN', fecha: '18/11/2025, 8:12:07' }
])

const companiaSeleccionada = ref(1)
const plantaSeleccionada = ref(1)
const lineaFiltro = ref('')

const plantasFiltradas = computed(() => {
  if (!companiaSeleccionada.value) return []
  return plantas.value.filter(p => p.companiaId === parseInt(companiaSeleccionada.value))
})

const usuariosFiltrados = computed(() => {
  if (!lineaFiltro.value) return usuarios.value
  return usuarios.value.filter(u => u.linea === lineaFiltro.value)
})

const mostrarModalAgregar = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')

function eliminarUsuario(id) {
  const index = usuarios.value.findIndex(u => u.id === id)
  if (index !== -1) {
    usuarios.value.splice(index, 1)
  }
}

onMounted(() => {
  
})
</script>

<template>
  <div class="habilitar-linea-view">
    <div class="page-header">
      <h1 class="page-title">HABILITAR LÍNEA</h1>
    </div>

    <Alert v-if="saveSuccess" type="success" message="Cambios guardados correctamente" class="mb-4" />
    <Alert v-if="saveError" type="error" :message="saveError" class="mb-4" />

    <Card class="content-card">
      <div class="filtros-section">
        <div class="filter-item">
          <label class="filter-label">Compañía</label>
          <select v-model="companiaSeleccionada" class="filter-select">
            <option v-for="compania in companias" :key="compania.id" :value="compania.id">
              {{ compania.nombre }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label class="filter-label">Planta</label>
          <select v-model="plantaSeleccionada" class="filter-select">
            <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
              {{ planta.nombre }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label class="filter-label">Línea</label>
          <select v-model="lineaFiltro" class="filter-select">
            <option value="">Seleccione...</option>
            <option v-for="linea in lineasDisponibles" :key="linea.id" :value="linea.nombre">
              {{ linea.nombre }}
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
              <th>N°</th>
              <th>Línea</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Fecha</th>
              <th>Expulsar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
              <td>{{ usuario.numero }}</td>
              <td>{{ usuario.linea }}</td>
              <td>{{ usuario.usuario }}</td>
              <td>{{ usuario.rol }}</td>
              <td>{{ usuario.fecha }}</td>
              <td>
                <button class="btn-expulsar" @click="eliminarUsuario(usuario.id)">
                  x
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.habilitar-linea-view {
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
  font-size: 1.25rem;
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

.filtros-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
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

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.table-container {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin: 1.5rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table thead {
  background-color: #f9fafb;
}

.data-table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.data-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.btn-expulsar {
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.625rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-expulsar:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .filtros-section {
    grid-template-columns: 1fr;
  }
}
</style>
