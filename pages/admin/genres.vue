<script setup lang="ts">
import * as yup from 'yup'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { toast } from 'vue3-toastify'

import type { Database, Genre } from '~/types/database.types'

useHead({
  title: 'Manage Genres - My Netflix',
})

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const client = useSupabaseClient<Database>()

interface Options {
  search: string
  page: number
  itemsPerPage: number
  total: number
  pageCount: ComputedRef<number>
}

const options = reactive<Options>({
  search: '',
  page: 1,
  itemsPerPage: 10,
  total: 0,
  pageCount: computed<number>((): number => {
    if (options.total % options.itemsPerPage === 0)
      return Math.floor(options.total / options.itemsPerPage)
    return Math.floor(options.total / options.itemsPerPage) + 1
  }),
})

const headers = [
  {
    title: 'Tên thể loại',
    align: 'start',
    sortable: true,
    key: 'name',
  },
  { title: 'Tương tác', key: 'actions', align: 'end', sortable: false },
] as any[]
const genres = ref<Genre[]>([])
const selectedItems = ref([])
const loading = ref(true)
const confirmDelete = ref(false)
const deletingItem = ref<Genre | undefined>(undefined)
const showFormModal = ref(false)
const editingItem = ref<Genre | undefined>(undefined)

const schema = ref<any>(yup.object({
  name: yup.string().required('Tên thể loại là bắt buộc').label('Tên thể loại'),
}))

async function loadGenres({ page, itemsPerPage, sortBy, search }: { page?: number; itemsPerPage?: number; sortBy?: string[]; search?: string }) {
  loading.value = true
  genres.value = []
  const { data, error } = await client.from('genres').select('*')
  if (error) {
    loading.value = false
    genres.value = []
  }
  else {
    genres.value = [...data]
    options.total = data.length
    loading.value = false
  }
}

async function addGenre(genre: any) {
  const { error } = await client.from('genres').insert(genre)
  if (error) {
    toast.error('Không thêm được thể loại')
  }
  else {
    setTimeout(() => {
      loadGenres({})
    }, 200)
    toast.success('Thêm thể loại thành công')
  }
  showFormModal.value = false
}

async function updateGenre(genre: Genre) {
  const { error } = await client.from('genres').update({ name: genre.name || '' }).eq('id', editingItem?.value?.id)
  if (error) {
    toast.error('Không cập nhật được thể loại')
  }
  else {
    setTimeout(() => {
      loadGenres({})
    }, 200)
    toast.success('Cập nhật thể loại thành công')
  }
  showFormModal.value = false
}

async function deleteGenre() {
  if (!deletingItem.value) {
    confirmDelete.value = false
    return
  }
  const { error } = await client.from('genres').delete().eq('id', (deletingItem.value as any).id)
  if (error) {
    toast.error('Không xoá được dữ liệu')
  }
  else {
    setTimeout(() => {
      loadGenres({})
    }, 200)
    toast.success('Xoá thể loại thành công')
  }
  confirmDelete.value = false
}

onMounted(() => {
  loadGenres({})
})

async function handleSubmitForm(data: any) {
  if (!data) {
    showFormModal.value = false
    return
  }

  if (!editingItem.value)
    addGenre(data)

  else
    updateGenre(data)
}

function handleEditItem(item: any) {
  editingItem.value = item
  setTimeout(() => showFormModal.value = true, 200)
}

function handleDeleteItem(item: any) {
  deletingItem.value = item
  confirmDelete.value = true
}

function cancel(isDeleting = false) {
  if (isDeleting) {
    confirmDelete.value = false
    deletingItem.value = undefined
  }
  else {
    showFormModal.value = false
    editingItem.value = undefined
  }
}
</script>

<template>
  <div class="w-100">
    <VDataTable
      v-model="selectedItems"
      :headers="headers"
      :items="genres"
      :items-per-page="options.itemsPerPage"
      :page="options.page"
      :loading="loading"
      class="rounded-table"
      height="calc(100vh - 260px)"
      item-value="id"
      :no-data-text="loading ? 'Đang tải dữ liệu...' : 'Không có dữ liệu'"
      loading-text="Đang tải dữ liệu"
      fixed-header
      hide-default-footer
    >
      <template #top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Thể loại</v-toolbar-title>
          <v-spacer />
          <div class="mr-4">
            <v-icon
              color="info"
              @click="showFormModal = true"
            >
              mdi-tag-plus
            </v-icon>
            <v-icon
              class="ml-2"
              color="info"
              @click="loadGenres"
            >
              mdi-reload
            </v-icon>
          </div>
        </v-toolbar>
      </template>
      <template #item.actions="{ item }">
        <v-icon
          color="info"
          size="small"
          class="me-2"
          @click="() => handleEditItem(item.raw)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          color="error"
          size="small"
          @click="() => handleDeleteItem(item.raw)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template #bottom>
        <div class="">
          <v-pagination
            v-model="options.page"
            rounded="circle"
            :length="options.pageCount"
            :total-visible="5"
          />
        </div>
      </template>
    </VDataTable>
    <ModalConfirm :show="confirmDelete" title="Xoá thể loại" message="Bạn có chắc chắn muốn xoá bản ghi này" icon="mdi-help-circle-outline" icon-color="red" @cancel="() => cancel(true)" @submit="deleteGenre" />
    <ModalFormModal
      class="w-[500px]"
      :show="showFormModal"
      :title="editingItem ? 'Sửa thể loại' : 'Thêm thể loại'"
      :initial-value="editingItem"
      :schema="schema"
      @cancel="() => cancel(false)"
      @submit="handleSubmitForm"
    >
      <InputTextFieldWithValidation name="name" label="Tên thể loại" class="my-1" />
    </ModalFormModal>
  </div>
</template>
