<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import Alert from '@/shared/components/ui/Alert.vue'
import { useApi } from '@/shared/composables/useApi'
import * as XLSX from 'xlsx'
import arbolParadasData from '@/data/arbol-paradas.json'

const { loading, error, execute } = useApi()
const fileInput = ref(null)
const uploadLoading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref('')

const empresas = ref([])
const plantas = ref([])
const lineas = ref([])
const expandedCategories = ref([])
const selectedItems = ref([])

const empresaFiltro = ref(1)
const plantaFiltro = ref(1)
const lineaFiltro = ref(1)

// Cargar datos del JSON
const paradasData = ref(arbolParadasData)

const loadData = async () => {
  await execute(async () => {
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

const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

const isCategoryExpanded = (categoryId) => {
  return expandedCategories.value.includes(categoryId)
}

// Función para importar Excel
const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploadLoading.value = true
  uploadError.value = ''
  uploadSuccess.value = false

  try {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    
    // Procesar hojas del Excel
    const programadaSheet = workbook.Sheets['Paradas Programadas']
    const noProgramadaSheet = workbook.Sheets['Paradas No Programadas']
    
    if (!programadaSheet && !noProgramadaSheet) {
      throw new Error('El archivo debe contener las hojas "Paradas Programadas" y/o "Paradas No Programadas"')
    }

    const newData = {
      tipoParadaProgramada: { categorias: [] },
      tipoParadaNoProgramada: { categorias: [] }
    }

    // Procesar Paradas Programadas
    if (programadaSheet) {
      const rows = XLSX.utils.sheet_to_json(programadaSheet)
      newData.tipoParadaProgramada.categorias = processExcelRows(rows)
    }

    // Procesar Paradas No Programadas
    if (noProgramadaSheet) {
      const rows = XLSX.utils.sheet_to_json(noProgramadaSheet)
      newData.tipoParadaNoProgramada.categorias = processExcelRows(rows)
    }

    // Actualizar datos
    paradasData.value = newData
    uploadSuccess.value = true
    
    // Aquí podrías hacer una petición al backend para guardar los datos
    // await axios.post('/api/arbol-paradas', newData)
    
    setTimeout(() => {
      uploadSuccess.value = false
    }, 3000)

  } catch (err) {
    uploadError.value = err.message || 'Error al procesar el archivo'
  } finally {
    uploadLoading.value = false
    event.target.value = '' // Resetear input
  }
}

const processExcelRows = (rows) => {
  const categorias = []
  const categoriaMap = new Map()

  rows.forEach((row, index) => {
    const categoriaNombre = row['CATEGORIA'] || row['Categoría'] || ''
    const subcategoriaNombre = row['SUBCATEGORIA'] || row['Subcategoría'] || row['DESCRIPCION'] || ''
    
    if (!categoriaNombre) return

    // Buscar o crear categoría
    if (!categoriaMap.has(categoriaNombre)) {
      const categoria = {
        id: categorias.length + 1,
        nombre: categoriaNombre,
        nivel: 1,
        subcategorias: []
      }
      categorias.push(categoria)
      categoriaMap.set(categoriaNombre, categoria)
    }

    // Agregar subcategoría si existe
    if (subcategoriaNombre) {
      const categoria = categoriaMap.get(categoriaNombre)
      categoria.subcategorias.push({
        id: `${categoria.id}-${categoria.subcategorias.length + 1}`,
        nombre: subcategoriaNombre,
        nivel: 2,
        categoriaGeneral: row['CATEGORIA_GENERAL'] || row['Categoría General'] || '',
        categoriaParada: row['CATEGORIA_DE_PARADA'] || row['Categoría de Parada'] || categoriaNombre,
        descripcionParada: row['DESCRIPCION_DE_PARADA'] || row['Descripción'] || subcategoriaNombre,
        maquina: row['MAQUINA'] || row['Máquina'] || '',
        parteMaquina: row['PARTE_DE_MAQUINA'] || row['Parte Máquina'] || ''
      })
    }
  })

  return categorias
}

// Función para exportar a Excel
const exportToExcel = () => {
  const workbook = XLSX.utils.book_new()

  // Crear hoja para Paradas Programadas
  const programadasData = []
  paradasData.value.tipoParadaProgramada.categorias.forEach(cat => {
    cat.subcategorias.forEach(sub => {
      programadasData.push({
        'CATEGORIA': cat.nombre,
        'SUBCATEGORIA': sub.nombre,
        'CATEGORIA_GENERAL': sub.categoriaGeneral || '',
        'CATEGORIA_DE_PARADA': sub.categoriaParada || '',
        'DESCRIPCION_DE_PARADA': sub.descripcionParada || '',
        'MAQUINA': sub.maquina || '',
        'PARTE_DE_MAQUINA': sub.parteMaquina || ''
      })
    })
  })

  // Crear hoja para Paradas No Programadas
  const noProgramadasData = []
  paradasData.value.tipoParadaNoProgramada.categorias.forEach(cat => {
    cat.subcategorias.forEach(sub => {
      noProgramadasData.push({
        'CATEGORIA': cat.nombre,
        'SUBCATEGORIA': sub.nombre,
        'CATEGORIA_GENERAL': sub.categoriaGeneral || '',
        'CATEGORIA_DE_PARADA': sub.categoriaParada || '',
        'DESCRIPCION_DE_PARADA': sub.descripcionParada || '',
        'MAQUINA': sub.maquina || '',
        'PARTE_DE_MAQUINA': sub.parteMaquina || ''
      })
    })
  })

  // Agregar hojas al workbook
  const wsProgramadas = XLSX.utils.json_to_sheet(programadasData)
  const wsNoProgramadas = XLSX.utils.json_to_sheet(noProgramadasData)
  
  XLSX.utils.book_append_sheet(workbook, wsProgramadas, 'Paradas Programadas')
  XLSX.utils.book_append_sheet(workbook, wsNoProgramadas, 'Paradas No Programadas')

  // Descargar archivo
  XLSX.writeFile(workbook, 'arbol-paradas.xlsx')
}

// Función para descargar plantilla
const downloadTemplate = () => {
  const workbook = XLSX.utils.book_new()

  const templateData = [
    {
      'CATEGORIA': 'CAMBIOS',
      'SUBCATEGORIA': 'CAMBIO DE FORMATO',
      'CATEGORIA_GENERAL': 'PROGRAMADA',
      'CATEGORIA_DE_PARADA': 'CAMBIOS',
      'DESCRIPCION_DE_PARADA': 'CAMBIO DE FORMATO',
      'MAQUINA': 'SOPLADORA',
      'PARTE_DE_MAQUINA': 'MOLDES'
    },
    {
      'CATEGORIA': 'CAMBIOS',
      'SUBCATEGORIA': 'CAMBIO DE PREFORMA',
      'CATEGORIA_GENERAL': 'PROGRAMADA',
      'CATEGORIA_DE_PARADA': 'CAMBIOS',
      'DESCRIPCION_DE_PARADA': 'CAMBIO DE PREFORMA',
      'MAQUINA': 'SOPLADORA',
      'PARTE_DE_MAQUINA': 'SISTEMA DE ALIMENTACIÓN'
    }
  ]

  const ws = XLSX.utils.json_to_sheet(templateData)
  XLSX.utils.book_append_sheet(workbook, ws, 'Paradas Programadas')
  
  // Agregar hoja vacía para No Programadas
  const wsEmpty = XLSX.utils.json_to_sheet([{
    'CATEGORIA': '',
    'SUBCATEGORIA': '',
    'CATEGORIA_GENERAL': '',
    'CATEGORIA_DE_PARADA': '',
    'DESCRIPCION_DE_PARADA': '',
    'MAQUINA': '',
    'PARTE_DE_MAQUINA': ''
  }])
  XLSX.utils.book_append_sheet(workbook, wsEmpty, 'Paradas No Programadas')

  XLSX.writeFile(workbook, 'plantilla-arbol-paradas.xlsx')
}

const plantasFiltradas = computed(() => {
  if (!empresaFiltro.value) return plantas.value
  return plantas.value.filter(p => p.empresaId === parseInt(empresaFiltro.value))
})

const lineasFiltradas = computed(() => {
  if (!plantaFiltro.value) return lineas.value
  return lineas.value.filter(l => l.plantaId === parseInt(plantaFiltro.value))
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="arbol-paradas-view">
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
      </div>
    </div>

    <Card class="content-card">
      <div class="action-bar">
        <div class="action-bar-left">
          <Button variant="primary" size="sm">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            AGREGAR
          </Button>
        </div>
        <div class="action-bar-right">
          <input 
            ref="fileInput" 
            type="file" 
            accept=".xlsx,.xls" 
            @change="handleFileUpload" 
            style="display: none"
          />
          <Button variant="success" size="sm" @click="downloadTemplate">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            DESCARGAR PLANTILLA
          </Button>
          <Button variant="warning" size="sm" @click="triggerFileInput" :disabled="uploadLoading">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            {{ uploadLoading ? 'CARGANDO...' : 'IMPORTAR EXCEL' }}
          </Button>
          <Button variant="info" size="sm" @click="exportToExcel">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            EXPORTAR EXCEL
          </Button>
        </div>
      </div>

      <Alert v-if="uploadSuccess" type="success" message="✓ Datos importados correctamente" class="mx-4 mt-4" />
      <Alert v-if="uploadError" type="error" :message="uploadError" class="mx-4 mt-4" />

      <Loading v-if="loading" />
      <Alert v-else-if="error" type="error" :message="error" />

      <div v-else class="tree-container">
        <table class="tree-table">
          <thead>
            <tr>
              <th>Descripcion</th>
              <th>CATEGORIA_GENERAL</th>
              <th>CATEGORÍA DE PARADA</th>
              <th>DESCRIPCION_DE_PARADA</th>
              <th>MAQUINA</th>
              <th>PARTE_DE_MAQUINA</th>
              <th>AREA_RESPONSABLE</th>
              <th style="width: 200px;">Editar</th>
              <th style="width: 200px;">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            <!-- Tipo de P. Programada -->
            <tr class="category-parent">
              <td colspan="9">
                <button class="collapse-btn" @click="toggleCategory('programada')">
                  {{ isCategoryExpanded('programada') ? '−' : '+' }}
                </button>
                <span class="category-title">Tipo de P. Programada</span>
              </td>
            </tr>

            <template v-if="isCategoryExpanded('programada')">
              <template v-for="categoria in paradasData.tipoParadaProgramada.categorias" :key="categoria.id">
                <!-- Nivel 1: Categoría principal (ej: CAMBIOS) -->
                <tr class="category-level-1">
                  <td colspan="9">
                    <button class="collapse-btn-small" @click="toggleCategory(`prog-${categoria.id}`)">
                      {{ isCategoryExpanded(`prog-${categoria.id}`) ? '−' : '+' }}
                    </button>
                    <span class="category-name">{{ categoria.nombre }}</span>
                    <span v-if="categoria.etiqueta" class="tag">{{ categoria.etiqueta }}</span>
                    <span v-if="categoria.valorEtiqueta" class="tag-value">{{ categoria.valorEtiqueta }}</span>
                  </td>
                </tr>

                <!-- Nivel 2: Subcategorías -->
                <template v-if="isCategoryExpanded(`prog-${categoria.id}`)">
                  <tr v-for="sub in categoria.subcategorias" :key="sub.id" class="category-level-2">
                    <td class="pl-8">
                      <button class="collapse-btn-small" @click="toggleCategory(`prog-sub-${sub.id}`)">
                        {{ isCategoryExpanded(`prog-sub-${sub.id}`) ? '−' : '+' }}
                      </button>
                      {{ sub.nombre }}
                    </td>
                    <td>{{ sub.categoriaGeneral }}</td>
                    <td>{{ sub.categoriaParada }}</td>
                    <td>{{ sub.descripcionParada }}</td>
                    <td>{{ sub.maquina }}</td>
                    <td>{{ sub.parteMaquina }}</td>
                    <td></td>
                    <td>
                      <Button variant="secondary" size="sm">EDITAR</Button>
                    </td>
                    <td>
                      <Button variant="danger" size="sm">ELIMINAR</Button>
                    </td>
                  </tr>
                </template>
              </template>
            </template>

            <!-- Tipo de Parada no Programada -->
            <tr class="category-parent">
              <td colspan="9">
                <button class="collapse-btn" @click="toggleCategory('noprogramada')">
                  {{ isCategoryExpanded('noprogramada') ? '−' : '+' }}
                </button>
                <span class="category-title">Tipo de Parada no Programada</span>
              </td>
            </tr>

            <template v-if="isCategoryExpanded('noprogramada')">
              <template v-for="categoria in paradasData.tipoParadaNoProgramada.categorias" :key="categoria.id">
                <!-- Nivel 1: Categoría principal -->
                <tr class="category-level-1">
                  <td colspan="9">
                    <button class="collapse-btn-small" @click="toggleCategory(`noprog-${categoria.id}`)">
                      {{ isCategoryExpanded(`noprog-${categoria.id}`) ? '−' : '+' }}
                    </button>
                    <span class="category-name">{{ categoria.nombre }}</span>
                  </td>
                </tr>

                <!-- Nivel 2: Subcategorías -->
                <template v-if="isCategoryExpanded(`noprog-${categoria.id}`)">
                  <tr v-for="sub in categoria.subcategorias" :key="sub.id" class="category-level-2">
                    <td class="pl-8">
                      <button class="collapse-btn-small" @click="toggleCategory(`noprog-sub-${sub.id}`)">
                        {{ isCategoryExpanded(`noprog-sub-${sub.id}`) ? '−' : '+' }}
                      </button>
                      {{ sub.nombre }}
                    </td>
                    <td>{{ sub.categoriaGeneral }}</td>
                    <td>{{ sub.categoriaParada }}</td>
                    <td>{{ sub.descripcionParada }}</td>
                    <td>{{ sub.maquina }}</td>
                    <td>{{ sub.parteMaquina }}</td>
                    <td></td>
                    <td>
                      <Button variant="secondary" size="sm">EDITAR</Button>
                    </td>
                    <td>
                      <Button variant="danger" size="sm">ELIMINAR</Button>
                    </td>
                  </tr>
                </template>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.arbol-paradas-view {
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

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #1e3a8a;
  flex-wrap: wrap;
}

.action-bar-left {
  display: flex;
  gap: 0.5rem;
}

.action-bar-right {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tree-container {
  overflow-x: auto;
}

.tree-table {
  width: 100%;
  font-size: 0.875rem;
  border-collapse: collapse;
}

.tree-table thead {
  background-color: #f3f4f6;
}

.tree-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e5e7eb;
}

.tree-table td {
  padding: 0.75rem 1rem;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
}

.category-parent {
  background-color: #f9fafb;
}

.category-parent td {
  font-weight: 700;
  font-size: 1rem;
  padding: 1rem;
}

.category-level-1 {
  background-color: #f0f9ff;
}

.category-level-1 td {
  font-weight: 600;
  padding: 0.875rem 1rem;
}

.category-level-2 {
  background-color: white;
}

.category-level-2:hover {
  background-color: #eff6ff;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  border: none;
  background-color: #1e3a8a;
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background-color: #1e40af;
}

.collapse-btn-small {
  width: 24px;
  height: 24px;
  border: none;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  transition: all 0.2s;
}

.collapse-btn-small:hover {
  background-color: #2563eb;
}

.category-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e3a8a;
}

.category-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e40af;
}

.pl-8 {
  padding-left: 3rem !important;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.tag-value {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background-color: #f3f4f6;
  color: #374151;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  margin-left: 0.25rem;
}
</style>
