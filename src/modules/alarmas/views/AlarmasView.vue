<template>
  <div class="alarmas-view">
    <div class="page-header">
      <h1>Gestión de Alarmas</h1>
      <p>Configure alarmas y notificaciones para parámetros de producción</p>
    </div>

    <!-- Alarmas Activas -->
    <div class="alarmas-activas">
      <div class="section-header">
        <h2>Alarmas Activas</h2>
        <button @click="mostrarNuevaAlarma = true" class="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nueva Alarma
        </button>
      </div>

      <div class="alarmas-grid">
        <div v-for="alarma in alarmasActivas" :key="alarma.id" class="alarma-card" :class="`severity-${alarma.severidad}`">
          <div class="alarma-header">
            <div class="alarma-tipo">
              <svg v-if="alarma.tipo === 'oee'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <svg v-else-if="alarma.tipo === 'tiempo'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <svg v-else-if="alarma.tipo === 'produccion'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>{{ alarma.nombre }}</span>
            </div>
            <div class="alarma-status">
              <span :class="['status-badge', `status-${alarma.estado}`]">{{ alarma.estadoTexto }}</span>
            </div>
          </div>

          <div class="alarma-body">
            <div class="alarma-info">
              <div class="info-item">
                <span class="info-label">Línea:</span>
                <span class="info-value">{{ alarma.linea }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Condición:</span>
                <span class="info-value">{{ alarma.condicion }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Notificar a:</span>
                <span class="info-value">{{ alarma.destinatarios }}</span>
              </div>
            </div>
          </div>

          <div class="alarma-footer">
            <button @click="editarAlarma(alarma.id)" class="btn-small btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
            <button @click="toggleAlarma(alarma.id)" class="btn-small" :class="alarma.estado === 'activo' ? 'btn-warning' : 'btn-success'">
              <svg v-if="alarma.estado === 'activo'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 3l14 9-14 9V3z"/>
              </svg>
              {{ alarma.estado === 'activo' ? 'Pausar' : 'Activar' }}
            </button>
            <button @click="eliminarAlarma(alarma.id)" class="btn-small btn-danger">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Historial de Notificaciones -->
    <div class="historial-section">
      <h2>Historial de Notificaciones</h2>
      <div class="tabla-wrapper">
        <table class="tabla-historial">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Alarma</th>
              <th>Línea</th>
              <th>Valor</th>
              <th>Severidad</th>
              <th>Destinatario</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="notif in historial" :key="notif.id">
              <td>{{ notif.fecha }}</td>
              <td>{{ notif.alarma }}</td>
              <td>{{ notif.linea }}</td>
              <td><strong>{{ notif.valor }}</strong></td>
              <td><span :class="['badge', `badge-${notif.severidad}`]">{{ notif.severidadTexto }}</span></td>
              <td>{{ notif.destinatario }}</td>
              <td><span :class="['badge', `badge-${notif.estado}`]">{{ notif.estadoTexto }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Nueva Alarma -->
    <Teleport to="body">
      <div v-if="mostrarNuevaAlarma" class="modal-overlay" @click="mostrarNuevaAlarma = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Nueva Alarma</h3>
            <button @click="mostrarNuevaAlarma = false" class="btn-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre de la Alarma</label>
                <input type="text" v-model="nuevaAlarma.nombre" class="form-control" placeholder="Ej: OEE Bajo Línea 01">
              </div>

              <div class="form-group">
                <label>Tipo de Alarma</label>
                <select v-model="nuevaAlarma.tipo" class="form-control">
                  <option value="">Seleccionar...</option>
                  <option value="oee">OEE</option>
                  <option value="disponibilidad">Disponibilidad</option>
                  <option value="rendimiento">Rendimiento</option>
                  <option value="calidad">Calidad</option>
                  <option value="produccion">Producción</option>
                  <option value="tiempo">Tiempo de Parada</option>
                  <option value="defectos">Defectos</option>
                </select>
              </div>

              <div class="form-group">
                <label>Línea</label>
                <select v-model="nuevaAlarma.linea" class="form-control">
                  <option value="">Seleccionar...</option>
                  <option value="1">Línea 01</option>
                  <option value="2">Línea 02</option>
                  <option value="3">Línea 03</option>
                  <option value="4">Línea 04</option>
                  <option value="5">Línea 05</option>
                  <option value="6">Línea 06</option>
                </select>
              </div>

              <div class="form-group">
                <label>Condición</label>
                <select v-model="nuevaAlarma.condicion" class="form-control">
                  <option value="menor">Menor que</option>
                  <option value="mayor">Mayor que</option>
                  <option value="igual">Igual a</option>
                </select>
              </div>

              <div class="form-group">
                <label>Valor Umbral</label>
                <input type="number" v-model="nuevaAlarma.valor" class="form-control" placeholder="Ej: 75">
              </div>

              <div class="form-group">
                <label>Severidad</label>
                <select v-model="nuevaAlarma.severidad" class="form-control">
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label>Destinatarios (correos separados por coma)</label>
                <input type="text" v-model="nuevaAlarma.destinatarios" class="form-control" placeholder="supervisor@empresa.com, jefe@empresa.com">
              </div>

              <div class="form-group full-width">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="nuevaAlarma.activo">
                  <span>Activar alarma inmediatamente</span>
                </label>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="mostrarNuevaAlarma = false" class="btn btn-secondary">Cancelar</button>
            <button @click="crearAlarma" class="btn btn-primary">Crear Alarma</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mostrarNuevaAlarma = ref(false)

const nuevaAlarma = ref({
  nombre: '',
  tipo: '',
  linea: '',
  condicion: 'menor',
  valor: '',
  severidad: 'media',
  destinatarios: '',
  activo: true
})

const alarmasActivas = ref([
  {
    id: 1,
    nombre: 'OEE Crítico Línea 01',
    tipo: 'oee',
    linea: 'Línea 01',
    condicion: 'OEE < 70%',
    severidad: 'alta',
    destinatarios: '3 personas',
    estado: 'activo',
    estadoTexto: 'Activa'
  },
  {
    id: 2,
    nombre: 'Parada Prolongada',
    tipo: 'tiempo',
    linea: 'Línea 02',
    condicion: 'Parada > 15 min',
    severidad: 'media',
    destinatarios: '2 personas',
    estado: 'activo',
    estadoTexto: 'Activa'
  },
  {
    id: 3,
    nombre: 'Producción Baja',
    tipo: 'produccion',
    linea: 'Línea 03',
    condicion: 'Producción < 80%',
    severidad: 'baja',
    destinatarios: '1 persona',
    estado: 'pausado',
    estadoTexto: 'Pausada'
  },
  {
    id: 4,
    nombre: 'Defectos Elevados',
    tipo: 'defectos',
    linea: 'Todas',
    condición: 'Defectos > 50',
    severidad: 'critica',
    destinatarios: '5 personas',
    estado: 'activo',
    estadoTexto: 'Activa'
  }
])

const historial = ref([
  { id: 1, fecha: '19/11/2025 14:35', alarma: 'OEE Crítico Línea 01', linea: 'Línea 01', valor: '68%', severidad: 'alta', severidadTexto: 'Alta', destinatario: 'supervisor@empresa.com', estado: 'enviado', estadoTexto: 'Enviado' },
  { id: 2, fecha: '19/11/2025 13:20', alarma: 'Parada Prolongada', linea: 'Línea 02', valor: '18 min', severidad: 'media', severidadTexto: 'Media', destinatario: 'operador@empresa.com', estado: 'enviado', estadoTexto: 'Enviado' },
  { id: 3, fecha: '19/11/2025 11:45', alarma: 'Defectos Elevados', linea: 'Línea 04', valor: '62 unid', severidad: 'critica', severidadTexto: 'Crítica', destinatario: 'calidad@empresa.com', estado: 'enviado', estadoTexto: 'Enviado' },
  { id: 4, fecha: '19/11/2025 10:10', alarma: 'OEE Crítico Línea 01', linea: 'Línea 01', valor: '65%', severidad: 'alta', severidadTexto: 'Alta', destinatario: 'supervisor@empresa.com', estado: 'enviado', estadoTexto: 'Enviado' },
  { id: 5, fecha: '19/11/2025 09:30', alarma: 'Producción Baja', linea: 'Línea 03', valor: '75%', severidad: 'baja', severidadTexto: 'Baja', destinatario: 'jefe@empresa.com', estado: 'pendiente', estadoTexto: 'Pendiente' }
])

function crearAlarma() {
  // TODO: Conectar con backend
  console.log('Creando alarma:', nuevaAlarma.value)
  alert('Función lista para conectar con backend')
  mostrarNuevaAlarma.value = false
}

function editarAlarma(id) {
  // TODO: Conectar con backend
  console.log('Editando alarma:', id)
  alert('Función lista para conectar con backend')
}

function toggleAlarma(id) {
  // TODO: Conectar con backend
  console.log('Toggle alarma:', id)
  alert('Función lista para conectar con backend')
}

function eliminarAlarma(id) {
  // TODO: Conectar con backend
  if (confirm('¿Está seguro de eliminar esta alarma?')) {
    console.log('Eliminando alarma:', id)
    alert('Función lista para conectar con backend')
  }
}
</script>

<style scoped>
.alarmas-view {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #64748b;
  font-size: 1rem;
}

.alarmas-activas {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.alarmas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.alarma-card {
  background: white;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s;
}

.alarma-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.alarma-card.severity-baja {
  border-left: 4px solid #3b82f6;
}

.alarma-card.severity-media {
  border-left: 4px solid #f59e0b;
}

.alarma-card.severity-alta {
  border-left: 4px solid #f97316;
}

.alarma-card.severity-critica {
  border-left: 4px solid #ef4444;
}

.alarma-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.alarma-tipo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #1e293b;
}

.alarma-tipo svg {
  color: #3b82f6;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-activo {
  background: #dcfce7;
  color: #166534;
}

.status-pausado {
  background: #fef3c7;
  color: #92400e;
}

.alarma-body {
  padding: 1.25rem;
}

.alarma-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.info-label {
  color: #64748b;
  font-weight: 500;
}

.info-value {
  color: #1e293b;
  font-weight: 600;
}

.alarma-footer {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-small {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  flex: 1;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-success {
  background: #dcfce7;
  color: #166534;
}

.btn-success:hover {
  background: #bbf7d0;
}

.btn-warning {
  background: #fef3c7;
  color: #92400e;
}

.btn-warning:hover {
  background: #fde68a;
}

.btn-danger {
  background: #fee2e2;
  color: #991b1b;
}

.btn-danger:hover {
  background: #fecaca;
}

.historial-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.tabla-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tabla-historial {
  width: 100%;
  border-collapse: collapse;
}

.tabla-historial thead {
  background: #f8fafc;
}

.tabla-historial th {
  padding: 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tabla-historial td {
  padding: 1rem;
  border-top: 1px solid #f1f5f9;
  font-size: 0.875rem;
  color: #334155;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-baja {
  background: #dbeafe;
  color: #1e40af;
}

.badge-media {
  background: #fef3c7;
  color: #92400e;
}

.badge-alta {
  background: #fed7aa;
  color: #9a3412;
}

.badge-critica {
  background: #fee2e2;
  color: #991b1b;
}

.badge-enviado {
  background: #dcfce7;
  color: #166534;
}

.badge-pendiente {
  background: #fef3c7;
  color: #92400e;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.btn-close {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #ef4444;
}

.modal-body {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
}

.form-control {
  padding: 0.625rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .alarmas-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
