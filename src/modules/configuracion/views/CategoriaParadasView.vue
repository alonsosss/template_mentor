<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import Alert from '@/shared/components/ui/Alert.vue'
import { useApi } from '@/shared/composables/useApi'

const { loading, error, execute } = useApi()

// ============================================
// 📦 DATA MOCK - Categorías de Paradas
// ============================================
// TODO: Reemplazar con llamada a API: GET /api/categorias-paradas?lineaId={id}
const categorias = ref([
  {
    id: 1,
    descripcion: 'CATEGORIA_GENERAL',
    tipo: 'categoria', // 'categoria' o 'subcategoria'
    icon: 'plus',
    lineaId: 1,
    orden: 1
  },
  {
    id: 2,
    descripcion: 'CATEGORÍA DE PARADA',
    tipo: 'categoria',
    icon: 'plus',
    lineaId: 1,
    orden: 2
  },
  {
    id: 3,
    descripcion: 'DESCRIPCION_DE_PARADA',
    tipo: 'categoria',
    icon: 'plus',
    lineaId: 1,
    orden: 3
  },
  {
    id: 4,
    descripcion: 'MAQUINA',
    tipo: 'subcategoria',
    icon: 'document',
    lineaId: 1,
    orden: 4
  },
  {
    id: 5,
    descripcion: 'PARTE_DE_MAQUINA',
    tipo: 'subcategoria',
    icon: 'document',
    lineaId: 1,
    orden: 5
  },
  {
    id: 6,
    descripcion: 'AREA_RESPONSABLE',
    tipo: 'subcategoria',
    icon: 'document',
    lineaId: 1,
    orden: 6
  }
])

// ============================================
// 🎛️ ESTADO DE LA VISTA
// ============================================
const empresas = ref([])
const plantas = ref([])
const lineas = ref([])

const empresaFiltro = ref(1)
const plantaFiltro = ref(1)
const lineaFiltro = ref(1)

const mostrarModalAgregar = ref(false)
const mostrarModalEditar = ref(false)
const mostrarModalEliminar = ref(false)

const categoriaSeleccionada = ref(null)
const nuevaCategoria = ref({
  descripcion: '',
  tipo: 'categoria',
  icon: 'plus'
})

const saveSuccess = ref(false)
const deleteSuccess = ref(false)
const saveError = ref('')

// ============================================
// 📊 COMPUTED
// ============================================
const plantasFiltradas = computed(() => {
  if (!empresaFiltro.value) return plantas.value
  return plantas.value.filter(p => p.empresaId === parseInt(empresaFiltro.value))
})

const lineasFiltradas = computed(() => {
  if (!plantaFiltro.value) return lineas.value
  return lineas.value.filter(l => l.plantaId === parseInt(plantaFiltro.value))
})

const categoriasFiltradas = computed(() => {
  if (!lineaFiltro.value) return categorias.value
  return categorias.value.filter(c => c.lineaId === parseInt(lineaFiltro.value))
})

// ============================================
// 🔧 FUNCIONES - Cargar datos
// ============================================
const loadData = async () => {
  await execute(async () => {
    // TODO: Reemplazar con llamadas a API
    empresas.value = [
      { id: 1, nombre: 'Industrias San Miguel' }
    ]

    plantas.value = [
      { id: 1, nombre: 'Histórico Embotelladora San Miguel', empresaId: 1 }
    ]

    lineas.value = [
      { id: 1, nombre: 'Línea 1', plantaId: 1 }
    ]
  })
}

// ============================================
// 🔧 FUNCIONES - Modales
// ============================================
const abrirModalAgregar = () => {
  nuevaCategoria.value = {
    descripcion: '',
    tipo: 'categoria',
    icon: 'plus'
  }
  mostrarModalAgregar.value = true
}

const cerrarModalAgregar = () => {
  mostrarModalAgregar.value = false
  nuevaCategoria.value = {
    descripcion: '',
    tipo: 'categoria',
    icon: 'plus'
  }
}

const abrirModalEditar = (categoria) => {
  categoriaSeleccionada.value = { ...categoria }
  mostrarModalEditar.value = true
}

const cerrarModalEditar = () => {
  mostrarModalEditar.value = false
  categoriaSeleccionada.value = null
}

const abrirModalEliminar = (categoria) => {
  categoriaSeleccionada.value = categoria
  mostrarModalEliminar.value = true
}

const cerrarModalEliminar = () => {
  mostrarModalEliminar.value = false
  categoriaSeleccionada.value = null
}

// ============================================
// 🔧 FUNCIONES - CRUD
// ============================================
const agregarCategoria = async () => {
  try {
    // TODO: Llamada a API
    // await axios.post('/api/categorias-paradas', {
    //   ...nuevaCategoria.value,
    //   lineaId: lineaFiltro.value
    // })

    // Agregar localmente (mock)
    const nuevaId = Math.max(...categorias.value.map(c => c.id)) + 1
    categorias.value.push({
      id: nuevaId,
      ...nuevaCategoria.value,
      lineaId: parseInt(lineaFiltro.value),
      orden: categorias.value.length + 1
    })

    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)

    cerrarModalAgregar()
  } catch (err) {
    saveError.value = err.message || 'Error al agregar categoría'
    setTimeout(() => {
      saveError.value = ''
    }, 3000)
  }
}

const editarCategoria = async () => {
  try {
    // TODO: Llamada a API
    // await axios.put(`/api/categorias-paradas/${categoriaSeleccionada.value.id}`, categoriaSeleccionada.value)

    // Actualizar localmente (mock)
    const index = categorias.value.findIndex(c => c.id === categoriaSeleccionada.value.id)
    if (index !== -1) {
      categorias.value[index] = { ...categoriaSeleccionada.value }
    }

    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)

    cerrarModalEditar()
  } catch (err) {
    saveError.value = err.message || 'Error al editar categoría'
    setTimeout(() => {
      saveError.value = ''
    }, 3000)
  }
}

const eliminarCategoria = async () => {
  try {
    // TODO: Llamada a API
    // await axios.delete(`/api/categorias-paradas/${categoriaSeleccionada.value.id}`)

    // Eliminar localmente (mock)
    categorias.value = categorias.value.filter(c => c.id !== categoriaSeleccionada.value.id)

    deleteSuccess.value = true
    setTimeout(() => {
      deleteSuccess.value = false
    }, 3000)

    cerrarModalEliminar()
  } catch (err) {
    saveError.value = err.message || 'Error al eliminar categoría'
    setTimeout(() => {
      saveError.value = ''
    }, 3000)
  }
}

const agregarSubcategoria = (categoria) => {
  // TODO: Implementar lógica para agregar subcategoría
  console.log('Agregar subcategoría a:', categoria)
}

// ============================================
// 🚀 LIFECYCLE
// ============================================
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="categoria-paradas-view">
    <!-- Filtros -->
    <div class="filters-section">
      <div class="filter-row">
        <div class="filter-item">
          <label class="filter-label">Compañía</label>
          <select v-model="empresaFiltro" class="filter-select">
            <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
              {{ empresa.nombre }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-label">Planta</label>
          <select v-model="plantaFiltro" class="filter-select">
            <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
              {{ planta.nombre }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-label">Línea</label>
          <select v-model="lineaFiltro" class="filter-select">
            <option v-for="linea in lineasFiltradas" :key="linea.id" :value="linea.id">
              {{ linea.nombre }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Alertas -->
    <Alert v-if="saveSuccess" type="success" message="✓ Cambios guardados correctamente" class="mb-4" />
    <Alert v-if="deleteSuccess" type="success" message="✓ Categoría eliminada correctamente" class="mb-4" />
    <Alert v-if="saveError" type="error" :message="saveError" class="mb-4" />

    <!-- Contenido Principal -->
    <Card class="content-card">
      <div class="action-bar">
        <Button variant="primary" size="sm" @click="abrirModalAgregar">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          AGREGAR
        </Button>
      </div>

      <Loading v-if="loading" />
      <Alert v-else-if="error" type="error" :message="error" />

      <div v-else class="table-container">
        <table class="categorias-table">
          <thead>
            <tr>
              <th>Descripcion</th>
              <th style="width: 150px;">Añadir</th>
              <th style="width: 150px;">Editar</th>
              <th style="width: 150px;">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="categoria in categoriasFiltradas" :key="categoria.id">
              <td>
                <div class="categoria-cell">
                  <svg v-if="categoria.icon === 'plus'" class="icon-plus" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  <svg v-else class="icon-document" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span class="categoria-text">{{ categoria.descripcion }}</span>
                </div>
              </td>
              <td>
                <Button variant="primary" size="sm" @click="agregarSubcategoria(categoria)">
                  AÑADIR
                </Button>
              </td>
              <td>
                <Button variant="secondary" size="sm" @click="abrirModalEditar(categoria)">
                  EDITAR
                </Button>
              </td>
              <td>
                <Button variant="danger" size="sm" @click="abrirModalEliminar(categoria)">
                  ELIMINAR
                </Button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="categoriasFiltradas.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p class="empty-text">No hay categorías configuradas para esta línea</p>
        </div>
      </div>
    </Card>

    <!-- Modal AGREGAR -->
    <Transition name="modal">
      <div v-if="mostrarModalAgregar" class="modal-overlay" @click="cerrarModalAgregar">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Agregar Categoría</h3>
            <button @click="cerrarModalAgregar" class="modal-close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Descripción *</label>
              <input 
                v-model="nuevaCategoria.descripcion" 
                type="text" 
                class="form-input"
                placeholder="Ej: CATEGORIA_GENERAL"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Tipo *</label>
              <select v-model="nuevaCategoria.tipo" class="form-input">
                <option value="categoria">Categoría Principal</option>
                <option value="subcategoria">Subcategoría</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Icono *</label>
              <select v-model="nuevaCategoria.icon" class="form-input">
                <option value="plus">Plus (+)</option>
                <option value="document">Documento (📄)</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <Button variant="secondary" size="sm" @click="cerrarModalAgregar">
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              @click="agregarCategoria"
              :disabled="!nuevaCategoria.descripcion"
            >
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal EDITAR -->
    <Transition name="modal">
      <div v-if="mostrarModalEditar" class="modal-overlay" @click="cerrarModalEditar">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Editar Categoría</h3>
            <button @click="cerrarModalEditar" class="modal-close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Descripción *</label>
              <input 
                v-model="categoriaSeleccionada.descripcion" 
                type="text" 
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Tipo *</label>
              <select v-model="categoriaSeleccionada.tipo" class="form-input">
                <option value="categoria">Categoría Principal</option>
                <option value="subcategoria">Subcategoría</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Icono *</label>
              <select v-model="categoriaSeleccionada.icon" class="form-input">
                <option value="plus">Plus (+)</option>
                <option value="document">Documento (📄)</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <Button variant="secondary" size="sm" @click="cerrarModalEditar">
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              @click="editarCategoria"
              :disabled="!categoriaSeleccionada?.descripcion"
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal ELIMINAR -->
    <Transition name="modal">
      <div v-if="mostrarModalEliminar" class="modal-overlay" @click="cerrarModalEliminar">
        <div class="modal-content modal-sm" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Confirmar Eliminación</h3>
            <button @click="cerrarModalEliminar" class="modal-close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="confirm-message">
              <svg class="confirm-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <p class="confirm-text">
                ¿Está seguro que desea eliminar la categoría 
                <strong>{{ categoriaSeleccionada?.descripcion }}</strong>?
              </p>
              <p class="confirm-warning">Esta acción no se puede deshacer.</p>
            </div>
          </div>

          <div class="modal-footer">
            <Button variant="secondary" size="sm" @click="cerrarModalEliminar">
              Cancelar
            </Button>
            <Button variant="danger" size="sm" @click="eliminarCategoria">
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.categoria-paradas-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ============================================
   FILTROS
   ============================================ */
.filters-section {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.filter-select {
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  transition: all 0.2s;
  cursor: pointer;
}

.filter-select:hover {
  border-color: #9ca3af;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* ============================================
   CONTENIDO
   ============================================ */
.content-card {
  border-radius: 0;
  border-top: none;
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

.categorias-table {
  width: 100%;
  font-size: 0.875rem;
  border-collapse: collapse;
}

.categorias-table thead {
  background-color: #f3f4f6;
}

.categorias-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e5e7eb;
}

.categorias-table td {
  padding: 1rem;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

.categorias-table tbody tr:hover {
  background-color: #f9fafb;
}

.categoria-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-plus {
  width: 1.5rem;
  height: 1.5rem;
  color: #3b82f6;
  flex-shrink: 0;
}

.icon-document {
  width: 1.5rem;
  height: 1.5rem;
  color: #6b7280;
  flex-shrink: 0;
}

.categoria-text {
  font-weight: 500;
  color: #111827;
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

/* ============================================
   MODALES
   ============================================ */
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
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.modal-sm {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  color: #6b7280;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  transition: all 0.2s;
}

.form-input:hover {
  border-color: #9ca3af;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.confirm-message {
  text-align: center;
}

.confirm-icon {
  width: 3rem;
  height: 3rem;
  color: #f59e0b;
  margin: 0 auto 1rem;
}

.confirm-text {
  font-size: 1rem;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.confirm-warning {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* ============================================
   TRANSICIONES
   ============================================ */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .filter-row {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }
}
</style>
