<script setup lang="ts">
useHead({
  title: 'Manage Movies - My Netflix',
})

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})
</script>

<template>
  <NuxtPage />
</template>
