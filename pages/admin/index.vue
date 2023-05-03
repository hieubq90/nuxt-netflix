<script setup lang="ts">
useHead({
  title: 'Administrator - My Netflix',
})

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.push('/admin/genres')
  }, 300)
})
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center">
    <v-progress-circular
      color="blue-lighten-3"
      indeterminate
      :size="128"
      :width="12"
    />
  </div>
</template>
