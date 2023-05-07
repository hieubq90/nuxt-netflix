<script setup lang="ts">
import * as yup from 'yup'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { Field } from 'vee-validate'
import { toast } from 'vue3-toastify'
import type { Database, Genre, Movie } from '~/types/database.types'

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
    title: 'Tiêu đề',
    align: 'start',
    sortable: true,
    key: 'title',
    width: '20%',
  },
  {
    title: 'Mô tả',
    align: 'start',
    sortable: false,
    key: 'desc',
    width: '40%',
  },
  {
    title: 'Ngày phát hành',
    align: 'start',
    sortable: false,
    key: 'release',
    width: '15%',
  },
  {
    title: 'Thể loại',
    align: 'start',
    sortable: false,
    key: 'genre_ids',
  },
  { title: 'Tương tác', key: 'actions', align: 'end', sortable: false, width: 150 },
] as any[]
const genres = ref<Genre[]>([])
const movies = ref<Movie[]>([])
const loading = ref(true)
const confirmDelete = ref(false)
const deletingItem = ref<Movie | undefined>(undefined)
const showFormModal = ref(false)
const editingItem = ref<Movie | undefined>(undefined)

const schema = ref<any>(yup.object({
  title: yup.string().required('Tiêu đề phim là bắt buộc').label('Tiêu đề phim'),
  desc: yup.string().label('Mô tả'),
  trailer_host: yup.string().label('Trailer host'),
  trailer_source: yup.string().label('Trailer source'),
  thumbnail_url: yup.string().label('Thumbnail url'),
  release: yup.number().label('Ngày phát hành'),
  release_full: yup.boolean().label('Đã hoàn thành'),
  genre_ids: yup.array().of(yup.string()).label('Thể loại'),
  one_shot: yup.boolean().label('Phim lẻ'),
}))

async function loadGenres() {
  loading.value = true
  genres.value = []
  const { data, error } = await client.from('genres').select('*')
  if (error)
    genres.value = []
  else
    genres.value = [...data]
}

async function loadMovies({ page = 1, itemsPerPage = 10 }: { page?: number; itemsPerPage?: number }) {
  loading.value = true
  genres.value = []
  const { data, error } = await client.from('movies').select('*').range((page - 1) * itemsPerPage, page * itemsPerPage)
  if (error) {
    loading.value = false
    movies.value = []
  }
  else {
    console.log('data', data)
    movies.value = [...data]
    options.total = data.length
    loading.value = false
  }
}

async function addMovie(movie: any) {
  const { error } = await client.from('movies').insert(movie)
  if (error) {
    toast.error('Không thêm được phim')
  }
  else {
    setTimeout(() => {
      loadMovies(options)
    }, 200)
    toast.success('Thêm phim thành công')
  }
  showFormModal.value = false
}

async function updateMovie(movie: any) {
  const { error } = await client.from('movies').update(movie).eq('id', editingItem?.value?.id)
  if (error) {
    toast.error('Không cập nhật được phim')
  }
  else {
    setTimeout(() => {
      loadMovies(options)
    }, 200)
    toast.success('Cập nhật phim thành công')
  }
  showFormModal.value = false
}

async function handleSubmitForm(data: any) {
  if (!data) {
    showFormModal.value = false
    return
  }

  if (!editingItem.value)
    addMovie(data)

  else
    updateMovie(data)
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

onMounted(() => {
  loadGenres()
  loadMovies({})
})
</script>

<template>
  <div class="w-100">
    <VDataTable
      :headers="headers"
      :items="movies"
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
          <v-toolbar-title>Phim</v-toolbar-title>
          <v-spacer />
          <div class="mr-4">
            <v-icon
              color="info"
              @click="showFormModal = true"
            >
              mdi-plus-circle
            </v-icon>
            <v-icon
              class="ml-2"
              color="info"
              @click="loadMovies"
            >
              mdi-reload
            </v-icon>
          </div>
        </v-toolbar>
      </template>
      <template #item.desc="{ item }">
        <div class="pa-1">
          <p class="line-clamp-3">
            {{ item.raw.desc }}
          </p>
        </div>
      </template>
      <template #item.genre_ids="{ item }">
        <div class="flex flex-wrap gap-1">
          <v-chip
            v-for="chip in genres.filter((e) => item.raw.genre_ids.includes(e.id))"
            :key="`${item.raw.id}_${chip}`"
            variant="elevated"
            color="info"
          >
            {{ chip.name }}
          </v-chip>
        </div>
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
      <InputTextFieldWithValidation name="title" label="Tiêu đề" class="my-1" />
      <InputTextFieldWithValidation name="desc" label="Mô tả" class="my-1" />
      <InputTextFieldWithValidation name="trailer_host" label="Trailer host" class="my-1" />
      <InputTextFieldWithValidation name="trailer_source" label="Trailer source" class="my-1" />
      <InputTextFieldWithValidation name="thumbnail_url" label="Thumbnail url" class="my-1" />
      <Field v-slot="{ field, errors }" name="release">
        <v-text-field v-bind="field" label="Ngày phát hành" :error-messages="errors" variant="underlined" />
      </Field>
      <Field v-slot="{ value, handleChange, errors }" :value="false" name="release_full" type="checkbox">
        <v-checkbox
          :model-value="value"
          label="Đã hoàn thành"
          :error-messages="errors"
          hide-details
          @update:modelValue="handleChange"
        />
      </Field>
      <Field v-slot="{ field, errors }" name="genre_ids" type="select">
        <v-select
          multiple
          v-bind="field"
          label="Thể loại"
          item-title="name"
          item-value="id"
          :items="genres"
          :error-messages="errors"
          variant="underlined"
        />
      </Field>
      <Field v-slot="{ value, handleChange, errors }" :value="false" name="one_shot" type="checkbox">
        <v-checkbox
          :model-value="value"
          label="Phim lẻ"
          :error-messages="errors"
          hide-details
          @update:modelValue="handleChange"
        />
      </Field>
    </ModalFormModal>
  </div>
</template>
