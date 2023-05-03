<script lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
  components: {
    VDataTable,
  },
}
</script>

<script setup lang="ts">
useHead({
  title: 'Manage Genres - My Netflix',
})

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const client = useSupabaseClient()

const headers = [
  {
    title: 'Tên thể loại',
    align: 'start',
    sortable: true,
    key: 'name',
  },
  { title: 'Tương tác', key: 'actions', align: 'end', sortable: false },
]
const genres = ref([])
const loading = ref(true)

async function loadGenres() {
  loading.value = true
  const { data, error } = await client.from('genres').select('*')
  if (error) {
    loading.value = false
    genres.value = []
  }
  else {
    console.log('data', data)
    genres.value = [...data]
    loading.value = false
  }
}

onMounted(() => {
  loadGenres()
})
</script>

<template>
  <div class="w-100">
    <VDataTable
      :headers="headers"
      :items="genres"
      :sort-by="[{ key: 'title', order: 'asc' }]"
      class="transparent-table bg-transparent"
      height="calc(100vh - 250px)"
      item-value="id"
      show-select
      no-data-text="Không có dữ liệu"
      hide-default-footer
      :loading="loading"
    >
      <template #top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Thể loại</v-toolbar-title>
        </v-toolbar>
      </template>
      <template #loading>
        <p>Đang tải dữ liệu...</p>
      </template>
      <template #item.actions="{ item }">
        <v-icon
          size="small"
          class="me-2"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
        >
          mdi-delete
        </v-icon>
      </template>
    </VDataTable>
  </div>
</template>