<script setup lang="ts">
const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.push('browse')
  }, 500)
})
</script>

<template>
  <!-- <div>
    <Logos mb-6 />
    <Suspense>
      <ClientOnly>
        <PageView v-if="online" />
        <div v-else text-gray:80>
          You're offline
        </div>
      </ClientOnly>
      <template #fallback>
        <div italic op50>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
    <InputEntry />
  </div> -->
  <div class="min-h-screen w-full flex items-center justify-center">
    <v-progress-circular
      color="blue-lighten-3"
      indeterminate
      :size="128"
      :width="12"
    />
  </div>
</template>
