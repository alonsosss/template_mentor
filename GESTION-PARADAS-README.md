# 📋 Gestión de Paradas - Documentación

## 🎯 Vista Creada: `GestionParadasView.vue`

Esta es una vista completa y profesional para la **Gestión de Paradas** basada en la estructura jerárquica de 4 niveles del Excel.

---

## ✨ Características Implementadas

### 1️⃣ **Header Principal**
- Título: "Gestión de Paradas"
- Subtítulo: "Configuración de categorías y niveles para las líneas de producción"
- **Botones de acción**:
  - 🟢 **Descargar Plantilla**: Descarga un Excel de ejemplo con la estructura correcta
  - 🟡 **Importar desde Excel**: Carga datos masivamente desde archivo Excel
  - 🔵 **Guardar Cambios**: Guarda todas las modificaciones (pendiente conexión API)

### 2️⃣ **Zona de Filtros Avanzados**
- **Línea**: Filtra por línea de producción (HAITIT LINEA 1, Línea 2, etc.)
- **Categoría**: Filtra por categoría (CATEGORÍA_GENERAL, CATEGORÍA_DE_PÉRDIDA, etc.)
- **Etiqueta**: Filtra por etiqueta (parada programada, parada no programada, CAMBIOS, etc.)
- **Búsqueda**: Busca por texto en cualquier campo
- **Contador**: Muestra cantidad de registros filtrados
- **Botón Limpiar**: Resetea todos los filtros

### 3️⃣ **Tabla Principal Editable**
**Columnas**:
- **#**: Número de fila
- **Nombre de la Variable**: Ej. "PLC-L1-Tipo de Parada Programada"
- **Nivel 1**: Con badge azul
- **Nivel 2**: Con badge verde
- **Nivel 3**: Con badge amarillo (opcional)
- **Nivel 4**: Con badge rosa (opcional)
- **Acciones**: Botón editar inline

**Funcionalidades**:
- ✏️ **Edición inline**: Click en botón editar → inputs en las celdas
- 🎯 **Selección de fila**: Click en fila → abre panel de detalle lateral
- 🎨 **Visual jerárquico**: Cada nivel tiene color diferente
- 📊 **Responsive**: Scroll horizontal en pantallas pequeñas

### 4️⃣ **Panel de Detalle Lateral** 
Aparece al hacer click en una fila:
- **Campos editables**:
  - Nombre de la Variable
  - Línea
  - Categoría
  - Etiqueta
  - Nivel 1 (con ID)
  - Nivel 2 (con ID)
  - Nivel 3 (con ID, opcional)
  - Nivel 4 (con ID, opcional)
- **Botones**:
  - Cancelar: Cierra el panel sin guardar
  - Aplicar Cambios: Guarda los cambios del detalle

**Características del panel**:
- 📱 Sticky en desktop
- 📲 Full screen en móvil
- ✨ Animación de entrada/salida
- 🎨 Indicadores visuales por nivel (dots de colores)

---

## 📊 Datos Mock Implementados

### Categorías (basadas en hoja "categorias")
```javascript
[
  { idCategoria: 1, nombreCategoria: 'CATEGORÍA_GENERAL', idEtiqueta: 1, etiqueta: 'parada programada' },
  { idCategoria: 1, nombreCategoria: 'CATEGORÍA_GENERAL', idEtiqueta: 2, etiqueta: 'parada no programada' },
  { idCategoria: 2, nombreCategoria: 'CATEGORÍA_DE_PÉRDIDA', idEtiqueta: 3, etiqueta: 'CAMBIOS' },
  { idCategoria: 2, nombreCategoria: 'CATEGORÍA_DE_PÉRDIDA', idEtiqueta: 4, etiqueta: 'SANEAMIENTOS' },
  // ... más categorías
]
```

### Paradas (basadas en hoja "HAITIT LINEA 1")
```javascript
[
  {
    id: 1,
    nombreVariable: 'PLC-L1-Tipo de Parada Programada',
    linea: 'HAITIT LINEA 1',
    nivel1: 'PARADAS OBLIGATORIA',
    nivel2: 'ALMUERZO/CENA',
    nivel3: '',
    nivel4: '',
    // ... más campos
  }
]
```

**Ejemplos incluidos**:
- ✅ PARADAS OBLIGATORIA → ALMUERZO/CENA
- ✅ PARADAS OBLIGATORIA → CAPACITACION PERSONAL OBLIGATORIA
- ✅ PARADA DE MAQUINAS → SOPLADORA → CAMBIO DE MOLDES → MOLDE A
- ✅ PARADA DE MAQUINAS → ETIQUETADORA → AJUSTE DE ETIQUETAS
- ✅ FALLAS MECANICAS → MOTOR → SOBRECALENTAMIENTO

---

## 📤 Importar/Exportar Excel

### **Importar Excel**
1. Click en botón "Importar desde Excel"
2. Selecciona archivo `.xlsx` o `.xls`
3. Debe tener la estructura:
   - Columnas: `nombre dela variable`, `id`, `nivel 1`, `id.1`, `nivel 2`, `id.2`, `nivel 3`, `id.3`, `nivel 4`, `categoriaId`, `etiquetaId`, `linea`
4. Los datos se cargan automáticamente

### **Exportar Excel**
1. Click en botón "Exportar Excel"
2. Descarga archivo con:
   - Hoja 1: Datos filtrados de paradas
   - Hoja 2: Categorías y etiquetas

### **Descargar Plantilla**
1. Click en botón "Descargar Plantilla"
2. Descarga Excel de ejemplo con:
   - 2 registros de ejemplo
   - Todas las columnas requeridas
   - Hoja de categorías

---

## 🔌 Integración con Backend (Pendiente)

### API Endpoints a implementar:

```javascript
// 1. Obtener categorías
GET /api/categorias
Response: [ { idCategoria, nombreCategoria, idEtiqueta, etiqueta }, ... ]

// 2. Obtener paradas por línea
GET /api/paradas?lineaId={id}
Response: [ { id, nombreVariable, nivel1, nivel2, nivel3, nivel4, ... }, ... ]

// 3. Guardar cambios masivos
PUT /api/paradas/bulk
Body: [ { id, nombreVariable, nivel1, nivel2, ... }, ... ]

// 4. Crear nueva parada
POST /api/paradas
Body: { nombreVariable, nivel1, nivel2, ... }

// 5. Actualizar parada individual
PUT /api/paradas/{id}
Body: { nombreVariable, nivel1, nivel2, ... }
```

### Lugares marcados con TODO:
```javascript
// Línea 8-17: Cargar categorías desde API
// TODO: Reemplazar con llamada a API: GET /api/categorias

// Línea 18-114: Cargar paradas desde API  
// TODO: Reemplazar con llamada a API: GET /api/paradas?lineaId={id}

// Línea 226-235: Guardar cambios
// TODO: Llamada a API para guardar cambios
// await axios.put('/api/paradas/bulk', paradasMock.value)

// Línea 679-682: Cargar datos al montar
// TODO: Cargar datos desde API
// loadCategorias()
// loadParadas()
```

---

## 🎨 Diseño y UX

### Paleta de Colores
- **Header**: Gradiente azul (desde #1e3a8a hasta #3b82f6)
- **Nivel 1**: Azul claro (#dbeafe / #1e40af)
- **Nivel 2**: Verde claro (#d1fae5 / #065f46)
- **Nivel 3**: Amarillo claro (#fef3c7 / #92400e)
- **Nivel 4**: Rosa claro (#fce7f3 / #9f1239)

### Responsive
- ✅ Desktop (>1400px): Panel lateral fijo
- ✅ Tablet (768px - 1400px): Panel lateral overlay
- ✅ Móvil (<768px): Panel lateral full screen

### Transiciones
- ✨ Panel de detalle: Slide desde la derecha
- ✨ Filtros: Smooth expand/collapse
- ✨ Hover states: 200ms transitions

---

## 🚀 Cómo usar la vista

1. **Acceder**: Menú lateral → Configuración → **Gestión de Paradas**
2. **Filtrar**: Usa los filtros superiores para encontrar registros específicos
3. **Ver detalle**: Click en cualquier fila para ver/editar en panel lateral
4. **Editar inline**: Click en botón editar (✏️) para editar directamente en tabla
5. **Importar datos**: Click en "Importar desde Excel" para carga masiva
6. **Exportar datos**: Click en "Exportar Excel" para descargar datos actuales
7. **Guardar**: Click en "Guardar Cambios" para persistir modificaciones

---

## 📂 Estructura de Archivos

```
src/
├── modules/
│   └── configuracion/
│       └── views/
│           ├── GestionParadasView.vue  ← NUEVA VISTA
│           └── ArbolParadasView.vue    (vista anterior)
├── router/
│   └── index.js                        (ruta agregada)
└── shared/
    └── components/
        └── layout/
            └── AppSidebar.vue          (menú actualizado)
```

---

## 🔗 Ruta

```
/configuracion/gestion-paradas
```

---

## 💡 Próximos pasos sugeridos

1. **Backend**: Implementar los endpoints de API
2. **Validaciones**: Agregar validación de campos requeridos
3. **Permisos**: Implementar control de acceso por roles
4. **Historial**: Agregar log de cambios por usuario
5. **Búsqueda avanzada**: Implementar búsqueda por múltiples criterios
6. **Bulk actions**: Agregar acciones masivas (eliminar, duplicar)
7. **Drag & Drop**: Permitir reordenar niveles arrastrando

---

## ✅ Checklist de Implementación

- [x] Vista principal creada
- [x] Filtros funcionales (mock data)
- [x] Tabla editable inline
- [x] Panel de detalle lateral
- [x] Importar/Exportar Excel
- [x] Descargar plantilla
- [x] Diseño responsive
- [x] Transiciones y animaciones
- [x] Ruta configurada
- [x] Menú actualizado
- [ ] Conexión con backend
- [ ] Validaciones de formulario
- [ ] Control de permisos
- [ ] Tests unitarios
- [ ] Documentación de API

---

## 📝 Notas Técnicas

- **Framework**: Vue 3 Composition API
- **Librería Excel**: xlsx (ya instalada)
- **Estado**: Local refs (no Pinia por ser datos temporales)
- **Validación**: Pendiente implementar
- **Performance**: Computed properties para filtrado reactivo
- **Accesibilidad**: Pendiente mejorar (ARIA labels, keyboard navigation)

---

**Creado**: 19 de noviembre de 2025  
**Autor**: GitHub Copilot  
**Versión**: 1.0.0
