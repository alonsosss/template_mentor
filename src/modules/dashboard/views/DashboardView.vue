<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/shared/composables/useApi'
import { dashboardService } from '@/api/services/dashboard.service'
import Card from '@/shared/components/ui/Card.vue'
import Loading from '@/shared/components/ui/Loading.vue'

const { loading, execute } = useApi()
const stats = ref(null)

onMounted(async () => {
  const { data } = await execute(() => dashboardService.getStats())
  if (data) {
    stats.value = data
  }
})
</script>

<template>
  <div class="dashboard-view">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Dashboard</h1>
      <p class="dashboard-subtitle">Resumen del sistema de monitoreo</p>
    </div>

    <Loading v-if="loading" />

    <div v-else-if="stats" class="dashboard-grid">
      <Card title="Total Plantas" class="stat-card">
        <div class="stat-value">{{ stats.totalPlantas }}</div>
        <div class="stat-label">Plantas activas</div>
      </Card>

      <Card title="Total Líneas" class="stat-card">
        <div class="stat-value">{{ stats.totalLineas }}</div>
        <div class="stat-label">Líneas configuradas</div>
      </Card>

      <Card title="Dispositivos" class="stat-card">
        <div class="stat-value">{{ stats.totalDispositivos }}</div>
        <div class="stat-label">Dispositivos monitoreados</div>
      </Card>

      <Card title="Alarmas Activas" class="stat-card">
        <div class="stat-value text-red-600">{{ stats.alarmasActivas }}</div>
        <div class="stat-label">Requieren atención</div>
      </Card>

      <Card title="Eficiencia Promedio" class="stat-card">
        <div class="stat-value text-green-600">{{ stats.eficienciaPromedio }}%</div>
        <div class="stat-label">Rendimiento general</div>
      </Card>

      <Card title="Producción Hoy" class="stat-card">
        <div class="stat-value">{{ stats.produccionHoy }}</div>
        <div class="stat-label">Unidades producidas</div>
      </Card>
    </div>

    <div class="dashboard-section">
      <Card title="Reportes">
        <div class="empty-state">
          <p>Contenido de reportes aquí</p>
          <p class="text-sm text-gray-500 mt-2">Los gráficos se integrarán con ECharts</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
  @apply space-y-6;
}

.dashboard-header {
  @apply mb-6;
}

.dashboard-title {
  @apply text-3xl font-bold text-gray-900;
}

.dashboard-subtitle {
  @apply text-gray-600 mt-1;
}

.dashboard-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.stat-card {
  @apply text-center;
}

.stat-value {
  @apply text-4xl font-bold text-gray-900 mb-2;
}

.stat-label {
  @apply text-sm text-gray-600;
}

.dashboard-section {
  @apply mt-8;
}

.empty-state {
  @apply text-center py-12;
}
</style>
