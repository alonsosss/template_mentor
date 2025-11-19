<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/shared/composables/useAuth'
import Button from '@/shared/components/ui/Button.vue'
import FormField from '@/shared/components/forms/FormField.vue'
import Alert from '@/shared/components/ui/Alert.vue'

const router = useRouter()
const { login } = useAuth()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  loading.value = true

  const result = await login(form.value)

  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.error || 'Error al iniciar sesión'
  }

  loading.value = false
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img src="/logo.svg" alt="Mentor Monitor" class="login-logo">
        <h1 class="login-title">Iniciar Sesión</h1>
      </div>

      <Alert v-if="error" type="error" :message="error" class="mb-4" />

      <form @submit.prevent="handleSubmit" class="login-form">
        <FormField
          v-model="form.username"
          label="Usuario"
          type="text"
          placeholder="Ingrese su usuario"
          required
        />

        <FormField
          v-model="form.password"
          label="Contraseña"
          type="password"
          placeholder="Ingrese su contraseña"
          required
        />

        <Button type="submit" :loading="loading" block>
          Ingresar
        </Button>
      </form>

      <div class="login-footer">
        <p class="login-hint">Usuario demo: admin / Contraseña: admin</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  @apply min-h-screen flex items-center justify-center bg-gray-100;
  @apply px-4;
}

.login-card {
  @apply bg-white rounded-lg shadow-lg p-8 w-full max-w-md;
}

.login-header {
  @apply text-center mb-8;
}

.login-logo {
  @apply h-16 mx-auto mb-4;
}

.login-title {
  @apply text-2xl font-bold text-gray-900;
}

.login-form {
  @apply space-y-4;
}

.login-footer {
  @apply mt-6 text-center;
}

.login-hint {
  @apply text-sm text-gray-600;
}
</style>
