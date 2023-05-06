<script setup lang="ts">
import { type ObjectSchema } from 'yup'
import Modal from './Modal.vue'

interface Props {
  show?: boolean
  title?: string
  schema?: ObjectSchema<any>
  initialValue?: any
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  initialValue: undefined,
})

const submitText = computed(() => {
  if (props.initialValue)
    return 'Lưu'
  return 'Thêm'
})
</script>

<template>
  <Modal
    is-form
    :show="props.show"
    :title="props.title"
    :schema="props.schema"
    :initial-value="props.initialValue"
    :submit-text="submitText"
    v-bind="$attrs"
  >
    <slot />
  </Modal>
</template>
