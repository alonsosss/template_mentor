<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Alert from '@/shared/components/ui/Alert.vue'
import { useApi } from '@/shared/composables/useApi'

const { loading, error, execute } = useApi()

const tabActiva = ref('CREAR TABLA DE PRODUCTOS')

const empresas = ref([
  { id: 1, nombre: 'Industrias San Miguel' }
])

const plantas = ref([
  { id: 1, empresaId: 1, nombre: 'ISM Arequipa' }
])

const empresaSeleccionada = ref(1)
const plantaSeleccionada = ref(1)

const plantasFiltradas = computed(() => {
  if (!empresaSeleccionada.value) return []
  return plantas.value.filter(p => p.empresaId === parseInt(empresaSeleccionada.value))
})

const productos = ref([
  { id: 1, numero: 1, linea: 'LÍNEA 05', nombreTabla: 'product_1_11_38' },
  { id: 2, numero: 2, linea: 'LÍNEA 06', nombreTabla: 'product_1_11_39' },
  { id: 3, numero: 3, linea: 'LÍNEA 04', nombreTabla: 'product_1_11_72' },
  { id: 4, numero: 4, linea: 'LÍNEA 03', nombreTabla: 'product_1_11_73' },
  { id: 5, numero: 5, linea: 'LÍNEA 02', nombreTabla: 'product_1_11_74' },
  { id: 6, numero: 6, linea: 'LÍNEA 01', nombreTabla: 'product_1_11_75' }
])

const productosDetallados = ref([
  { id: 1, numero: 1, sku: '1810', descripcion: 'KOLA REAL NEGRA 1000 ML REDAZ 60 %', material: 'PET', destino: 'Nacional', marca: 'Kola Real', sabor: 'Negra', tamano: '1000 ml' },
  { id: 2, numero: 2, sku: '1909', descripcion: 'KR FRESA 1000 ML - REDAZ 60 %', material: 'PET', destino: 'Nacional', marca: 'Kola Real', sabor: 'Fresa', tamano: '1000 ml' },
  { id: 3, numero: 3, sku: '1910', descripcion: 'KR PIÑA 1000 ML - REDAZ 60 %', material: 'PET', destino: 'Nacional', marca: 'Kola Real', sabor: 'Piña', tamano: '1000 ml' },
  { id: 4, numero: 4, sku: '1941', descripcion: 'SABOR DE ORO 1000 ML - REDAZ 60%', material: 'PET', destino: 'Nacional', marca: 'Oro', sabor: 'Sabor de Oro', tamano: '1000 ml' },
  { id: 5, numero: 5, sku: '1811', descripcion: 'KOLA REAL NEGRA 2000 ML REDAZ 60 %', material: 'PET', destino: 'Nacional', marca: 'Kola Real', sabor: 'Negra', tamano: '2000 ml' },
  { id: 6, numero: 6, sku: '1914', descripcion: 'KR FRESA 2000 ML - REDAZ 60 %', material: 'PET', destino: 'Nacional', marca: 'Kola Real', sabor: 'Fresa', tamano: '2000 ml' },
  { id: 7, numero: 7, sku: '1900', descripcion: 'KR NARANJA 2000 ML - REDAZ 60 %', material: 'PET', destino: 'Nacional', marca: 'Kola Real', sabor: 'Naranja', tamano: '2000 ml' },
  { id: 8, numero: 8, sku: '1920', descripcion: 'KR PIÑA 2000 ML - REDAZ 60 %', material: 'PET', destino: 'Nacional', marca: 'Kola Real', sabor: 'Piña', tamano: '2000 ml' },
  { id: 9, numero: 9, sku: '1930', descripcion: 'KR LIMON 2000 ML - REDAZ 60 %', material: 'PET', destino: 'Nacional', marca: 'Kola Real', sabor: 'Lima Limón', tamano: '2000 ml' },
  { id: 10, numero: 10, sku: '1940', descripcion: 'SABOR DE ORO 2000 ML - REDAZ 60%', material: 'PET', destino: 'Nacional', marca: 'Oro', sabor: 'Sabor de Oro', tamano: '2000 ml' }
])

const caracteristicas = ref([
  { 
    id: 1, 
    numero: 1, 
    nombre: 'LÍNEA 05', 
    caracteristicas: 'PLC-L5-Destino PLC-L5-Marca PLC-L5-Sabor PLC-L5-Tamano' 
  },
  { 
    id: 2, 
    numero: 2, 
    nombre: 'LÍNEA 06', 
    caracteristicas: 'Destino Marca Sabor Tamano' 
  },
  { 
    id: 3, 
    numero: 3, 
    nombre: 'LÍNEA 03', 
    caracteristicas: 'PLC-L3-Material PLC-L3-Destino PLC-L3-Marca PLC-L3-Sabor PLC-L3-Tamaño' 
  },
  { 
    id: 4, 
    numero: 4, 
    nombre: 'LÍNEA 04', 
    caracteristicas: 'PLC-L4-Material PLC-L4-Destino PLC-L4-Marca PLC-L4-Sabor PLC-L4-Tamaño' 
  },
  { 
    id: 5, 
    numero: 5, 
    nombre: 'LÍNEA 02', 
    caracteristicas: 'PLC-L2-Material PLC-L2-Destino PLC-L2-Marca PLC-L2-Sabor PLC-L2-Tamaño' 
  },
  { 
    id: 6, 
    numero: 6, 
    nombre: 'LÍNEA 01', 
    caracteristicas: 'PLC-L1-Material PLC-L1-Destino PLC-L1-Marca PLC-L1-Sabor PLC-L1-Tamaño' 
  }
])

const lineasDisponibles = ref([
  { id: 1, nombre: 'LÍNEA 01' },
  { id: 2, nombre: 'LÍNEA 02' },
  { id: 3, nombre: 'LÍNEA 03' },
  { id: 4, nombre: 'LÍNEA 04' },
  { id: 5, nombre: 'LÍNEA 05' },
  { id: 6, nombre: 'LÍNEA 06' }
])

const variablesDisponibles = ref([
  'PLC-L3-Conteo Unitario Principal',
  'PLC-L3-Tiempo de Microparada',
  'PLC-L3-Tiempo de Parada No Asignada',
  'PLC-L3-Tempo Disponible',
  'PLC-L3-Tiempo de Espera',
  'PLC-L3-Material',
  'PLC-L3-Destino',
  'PLC-L3-Marca',
  'PLC-L3-Sabor',
  'PLC-L3-Tamaño',
  'PLC-L3-Refrigerio',
  'PLC-L3-Capacitacion Obligatoria',
  'PLC-L3-Mantenimiento Planificado',
  'PLC-L3-Tiempo de Parada Programada',
  'PLC-L3-Tiempo de Parada No Programada',
  'PLC-L3-Tipo de Parada Programada',
  'PLC-L3-Tipo de Parada No Programada'
])

const mostrarModalEditar = ref(false)
const lineaSeleccionadaModal = ref('')
const variablesSeleccionadas = ref([])

const mostrarModalAgregar = ref(false)
const mostrarModalEditarProducto = ref(false)
const productoDefecto = ref('')

const formularioProducto = ref({
  linea: 'LÍNEA 03',
  sku: '',
  descripcion: '',
  material: '',
  destino: '',
  marca: '',
  sabor: '',
  tamano: ''
})

const productoEditando = ref(null)

const materialesDisponibles = ref(['PET', 'Vidrio', 'Aluminio'])
const destinosDisponibles = ref(['Nacional', 'Exportación'])
const marcasDisponibles = ref(['Kola Real', 'Oro', 'cielo'])
const saboresDisponibles = ref(['Negra', 'Fresa', 'Piña', 'Naranja', 'Lima Limón', 'Sabor de Oro', 'Citrus'])
const tamanosDisponibles = ref(['200 ml', '500 ml', '1000 ml', '2000 ml', '3000 ml'])

const currentPage = ref(1)
const currentPageProductos = ref(1)
const itemsPerPage = 10

const productosPaginados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return productos.value.slice(start, end)
})

const caracteristicasPaginadas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return caracteristicas.value.slice(start, end)
})

const productosDetalladosPaginados = computed(() => {
  const start = (currentPageProductos.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return productosDetallados.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(productos.value.length / itemsPerPage))
const totalPagesProductos = computed(() => Math.ceil(productosDetallados.value.length / itemsPerPage))

const saveSuccess = ref(false)
const saveError = ref('')

function crearTablaProductos() {
  console.log('Crear tabla productos')
}

function abrirModalEditar(linea) {
  lineaSeleccionadaModal.value = linea.nombre
  const caracteristica = caracteristicas.value.find(c => c.nombre === linea.nombre)
  if (caracteristica) {
    variablesSeleccionadas.value = caracteristica.caracteristicas.split(' ')
  }
  mostrarModalEditar.value = true
}

function guardarCaracteristicas() {
  const caracteristica = caracteristicas.value.find(c => c.nombre === lineaSeleccionadaModal.value)
  if (caracteristica) {
    caracteristica.caracteristicas = variablesSeleccionadas.value.join(' ')
  }
  cerrarModal()
}

function cerrarModal() {
  mostrarModalEditar.value = false
  lineaSeleccionadaModal.value = ''
  variablesSeleccionadas.value = []
}

function abrirModalAgregar() {
  formularioProducto.value = {
    linea: 'LÍNEA 03',
    sku: '',
    descripcion: '',
    material: '',
    destino: '',
    marca: '',
    sabor: '',
    tamano: ''
  }
  mostrarModalAgregar.value = true
}

function abrirModalEditarProducto(producto) {
  productoEditando.value = { ...producto }
  formularioProducto.value = {
    linea: 'LÍNEA 03',
    sku: producto.sku,
    descripcion: producto.descripcion,
    material: producto.material,
    destino: producto.destino,
    marca: producto.marca,
    sabor: producto.sabor,
    tamano: producto.tamano
  }
  mostrarModalEditarProducto.value = true
}

function guardarProducto() {
  if (!formularioProducto.value.sku || !formularioProducto.value.descripcion) {
    return
  }
  
  const nuevoProducto = {
    id: productosDetallados.value.length + 1,
    numero: productosDetallados.value.length + 1,
    ...formularioProducto.value
  }
  
  productosDetallados.value.push(nuevoProducto)
  cerrarModalAgregar()
}

function actualizarProducto() {
  if (!formularioProducto.value.sku || !formularioProducto.value.descripcion) {
    return
  }
  
  const index = productosDetallados.value.findIndex(p => p.id === productoEditando.value.id)
  if (index !== -1) {
    productosDetallados.value[index] = {
      ...productosDetallados.value[index],
      ...formularioProducto.value
    }
  }
  
  cerrarModalEditarProducto()
}

function cerrarModalAgregar() {
  mostrarModalAgregar.value = false
  formularioProducto.value = {
    linea: 'LÍNEA 03',
    sku: '',
    descripcion: '',
    material: '',
    destino: '',
    marca: '',
    sabor: '',
    tamano: ''
  }
}

function cerrarModalEditarProducto() {
  mostrarModalEditarProducto.value = false
  productoEditando.value = null
  formularioProducto.value = {
    linea: 'LÍNEA 03',
    sku: '',
    descripcion: '',
    material: '',
    destino: '',
    marca: '',
    sabor: '',
    tamano: ''
  }
}

onMounted(() => {
  
})
</script>

<template>
  <div class="productos-view">
    <div class="page-header">
      <h1 class="page-title">PRODUCTOS</h1>
    </div>

    <Alert v-if="saveSuccess" type="success" message="Cambios guardados correctamente" class="mb-4" />
    <Alert v-if="saveError" type="error" :message="saveError" class="mb-4" />

    <Card class="content-card">
      <div class="tabs-header">
        <button 
          :class="['tab-button', { 'tab-active': tabActiva === 'CREAR TABLA DE PRODUCTOS' }]"
          @click="tabActiva = 'CREAR TABLA DE PRODUCTOS'"
        >
          CREAR TABLA DE PRODUCTOS
        </button>
        <button 
          :class="['tab-button', { 'tab-active': tabActiva === 'CARACTERISTICAS PRODUCTOS POR LINEA' }]"
          @click="tabActiva = 'CARACTERISTICAS PRODUCTOS POR LINEA'"
        >
          CARACTERISTICAS PRODUCTOS POR LINEA
        </button>
        <button 
          :class="['tab-button', { 'tab-active': tabActiva === 'PRODUCTOS' }]"
          @click="tabActiva = 'PRODUCTOS'"
        >
          PRODUCTOS
        </button>
      </div>

      <div v-if="tabActiva === 'CREAR TABLA DE PRODUCTOS'" class="tab-content">
        <div class="action-section">
          <Button variant="primary" size="sm" @click="crearTablaProductos">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            CREAR TABLA PRODUCTOS
          </Button>
        </div>

        <div class="filtros-row">
          <div class="filter-item">
            <label class="filter-label">Empresa</label>
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
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Línea</th>
                <th>Nombre Tabla</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="producto in productosPaginados" :key="producto.id">
                <td>{{ producto.numero }}</td>
                <td>{{ producto.linea }}</td>
                <td>{{ producto.nombreTabla }}</td>
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
      </div>

      <div v-else-if="tabActiva === 'CARACTERISTICAS PRODUCTOS POR LINEA'" class="tab-content">
        <div class="action-section">
          <Button variant="primary" size="sm" @click="abrirModalEditar({ nombre: lineasDisponibles[0].nombre })">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
            EDITAR CARACTERISTICAS
          </Button>
        </div>

        <div class="filtros-row">
          <div class="filter-item">
            <label class="filter-label">Empresa</label>
            <select v-model="empresaSeleccionada" class="filter-select">
              <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
                {{ empresa.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Nombre</th>
                <th>Caracteristicas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="caracteristica in caracteristicasPaginadas" :key="caracteristica.id">
                <td>{{ caracteristica.numero }}</td>
                <td>{{ caracteristica.nombre }}</td>
                <td>{{ caracteristica.caracteristicas }}</td>
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
      </div>

      <div v-else class="tab-content">
        <div class="action-section">
          <Button variant="primary" size="sm" @click="abrirModalAgregar">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            AGREGAR
          </Button>
          <Button variant="secondary" size="sm" @click="abrirModalEditarProducto(productosDetalladosPaginados[0])">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
            EDITAR
          </Button>
          <Button variant="secondary" size="sm">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            POR DEFECTO
          </Button>
        </div>

        <div class="filtros-row-productos">
          <div class="filter-item">
            <label class="filter-label">Empresa</label>
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
            <label class="filter-label">Linea</label>
            <select v-model="lineaSeleccionadaModal" class="filter-select filter-highlight">
              <option v-for="linea in lineasDisponibles" :key="linea.id" :value="linea.nombre">
                {{ linea.nombre }}
              </option>
            </select>
          </div>

          <div class="filter-item">
            <label class="filter-label">Producto por defecto</label>
            <input type="text" v-model="productoDefecto" class="filter-input" readonly />
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>SKU</th>
                <th>Descripción</th>
                <th>PLC-L3-Material</th>
                <th>PLC-L3-Destino</th>
                <th>PLC-L3-Marca</th>
                <th>PLC-L3-Sabor</th>
                <th>PLC-L3-Tamaño</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="producto in productosDetalladosPaginados" :key="producto.id">
                <td>{{ producto.numero }}</td>
                <td>{{ producto.sku }}</td>
                <td>{{ producto.descripcion }}</td>
                <td>{{ producto.material }}</td>
                <td>{{ producto.destino }}</td>
                <td>{{ producto.marca }}</td>
                <td>{{ producto.sabor }}</td>
                <td>{{ producto.tamano }}</td>
              </tr>
            </tbody>
          </table>

          <div class="pagination">
            <button 
              class="pagination-button" 
              :disabled="currentPageProductos === 1"
              @click="currentPageProductos--"
            >
              PREVIOUS
            </button>
            <span class="pagination-info">{{ currentPageProductos }}</span>
            <button 
              class="pagination-button"
              :disabled="currentPageProductos >= totalPagesProductos"
              @click="currentPageProductos++"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </Card>

    <teleport to="body">
      <div v-if="mostrarModalEditar" class="modal-overlay" @click="cerrarModal">
        <div class="modal-content-editar" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">EDITAR CARACTERISTICAS</h3>
          </div>

          <div class="modal-body-editar">
            <div class="filtros-modal">
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
                <select v-model="plantaSeleccionada" class="filter-select">
                  <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
                    {{ planta.nombre }}
                  </option>
                </select>
              </div>

              <div class="filter-item">
                <label class="filter-label">Linea</label>
                <select v-model="lineaSeleccionadaModal" class="filter-select">
                  <option v-for="linea in lineasDisponibles" :key="linea.id" :value="linea.nombre">
                    {{ linea.nombre }}
                  </option>
                </select>
              </div>

              <div class="filter-item">
                <label class="filter-label">Variable Disponible del Tiempo de Lote</label>
                <select class="filter-select-large">
                  <option v-for="variable in variablesDisponibles" :key="variable" :value="variable">
                    {{ variable }}
                  </option>
                </select>
              </div>
            </div>

            <div class="acciones-modal">
              <Button variant="primary" size="sm">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                AGREGAR
              </Button>
              <Button variant="primary" size="sm" @click="guardarCaracteristicas">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                GUARDAR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div v-if="mostrarModalAgregar" class="modal-overlay" @click="cerrarModalAgregar">
        <div class="modal-content-producto" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">AGREGAR</h3>
          </div>

          <div class="modal-body-producto">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Empresa</label>
                <select v-model="empresaSeleccionada" class="form-control">
                  <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
                    {{ empresa.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Planta</label>
                <select v-model="plantaSeleccionada" class="form-control">
                  <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
                    {{ planta.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Linea</label>
                <select v-model="formularioProducto.linea" class="form-control">
                  <option v-for="linea in lineasDisponibles" :key="linea.id" :value="linea.nombre">
                    {{ linea.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">SKU <span class="required">*</span></label>
                <input type="text" v-model="formularioProducto.sku" class="form-control" />
              </div>

              <div class="form-group form-group-full">
                <label class="form-label">Descripción <span class="required">*</span></label>
                <input type="text" v-model="formularioProducto.descripcion" class="form-control" />
              </div>

              <div class="form-group">
                <label class="form-label">PLC-L3-Material</label>
                <select v-model="formularioProducto.material" class="form-control">
                  <option v-for="material in materialesDisponibles" :key="material" :value="material">
                    {{ material }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">PLC-L3-Destino</label>
                <select v-model="formularioProducto.destino" class="form-control">
                  <option v-for="destino in destinosDisponibles" :key="destino" :value="destino">
                    {{ destino }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">PLC-L3-Marca</label>
                <select v-model="formularioProducto.marca" class="form-control">
                  <option v-for="marca in marcasDisponibles" :key="marca" :value="marca">
                    {{ marca }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">PLC-L3-Sabor</label>
                <select v-model="formularioProducto.sabor" class="form-control">
                  <option v-for="sabor in saboresDisponibles" :key="sabor" :value="sabor">
                    {{ sabor }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">PLC-L3-Tamaño</label>
                <select v-model="formularioProducto.tamano" class="form-control">
                  <option v-for="tamano in tamanosDisponibles" :key="tamano" :value="tamano">
                    {{ tamano }}
                  </option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <Button variant="success" size="sm" @click="guardarProducto">
                GUARDAR
              </Button>
              <Button variant="primary" size="sm" @click="cerrarModalAgregar">
                CANCELAR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div v-if="mostrarModalEditarProducto" class="modal-overlay" @click="cerrarModalEditarProducto">
        <div class="modal-content-producto" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">EDITAR</h3>
          </div>

          <div class="modal-body-producto">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Empresa</label>
                <select v-model="empresaSeleccionada" class="form-control">
                  <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
                    {{ empresa.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Planta</label>
                <select v-model="plantaSeleccionada" class="form-control">
                  <option v-for="planta in plantasFiltradas" :key="planta.id" :value="planta.id">
                    {{ planta.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Linea</label>
                <select v-model="formularioProducto.linea" class="form-control">
                  <option v-for="linea in lineasDisponibles" :key="linea.id" :value="linea.nombre">
                    {{ linea.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">SKU <span class="required">*</span></label>
                <input type="text" v-model="formularioProducto.sku" class="form-control" />
              </div>

              <div class="form-group form-group-full">
                <label class="form-label">Descripción <span class="required">*</span></label>
                <input type="text" v-model="formularioProducto.descripcion" class="form-control" />
              </div>

              <div class="form-group">
                <label class="form-label">PLC-L3-Material</label>
                <select v-model="formularioProducto.material" class="form-control">
                  <option v-for="material in materialesDisponibles" :key="material" :value="material">
                    {{ material }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">PLC-L3-Destino</label>
                <select v-model="formularioProducto.destino" class="form-control">
                  <option v-for="destino in destinosDisponibles" :key="destino" :value="destino">
                    {{ destino }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">PLC-L3-Marca</label>
                <select v-model="formularioProducto.marca" class="form-control">
                  <option v-for="marca in marcasDisponibles" :key="marca" :value="marca">
                    {{ marca }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">PLC-L3-Sabor</label>
                <select v-model="formularioProducto.sabor" class="form-control">
                  <option v-for="sabor in saboresDisponibles" :key="sabor" :value="sabor">
                    {{ sabor }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">PLC-L3-Tamaño</label>
                <select v-model="formularioProducto.tamano" class="form-control">
                  <option v-for="tamano in tamanosDisponibles" :key="tamano" :value="tamano">
                    {{ tamano }}
                  </option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <Button variant="success" size="sm" @click="actualizarProducto">
                GUARDAR
              </Button>
              <Button variant="primary" size="sm" @click="cerrarModalEditarProducto">
                CANCELAR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
.productos-view {
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

.tabs-header {
  display: flex;
  background-color: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
}

.tab-button {
  flex: 1;
  padding: 0.75rem 1rem;
  background-color: transparent;
  color: #374151;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.75rem;
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
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #1e3a8a;
  display: flex;
  gap: 0.75rem;
}

.filtros-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filtros-row-productos {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

.filter-highlight {
  background-color: #dcfce7;
}

.filter-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: #f3f4f6;
  color: #374151;
}

.table-container {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
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

@media (max-width: 768px) {
  .filtros-row {
    grid-template-columns: 1fr;
  }

  .tabs-header {
    flex-direction: column;
  }

  .tab-button {
    border-bottom: none;
    border-left: 3px solid transparent;
  }

  .tab-active {
    border-bottom: none;
    border-left: 3px solid #1e3a8a;
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

.modal-content-editar {
  background-color: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  background-color: #1e3a8a;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem 0.5rem 0 0;
}

.modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.modal-body-editar {
  padding: 1.5rem;
}

.filtros-modal {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-select-large {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  color: #374151;
  cursor: pointer;
}

.filter-select-large:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.acciones-modal {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.modal-content-producto {
  background-color: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-body-producto {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group-full {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  color: #374151;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
</style>
