<script setup lang="ts">
import Modal from './Modal.vue'

interface Props {
  show?: boolean
  title?: string
  icon?: string
  iconColor?: string
  message?: string
  cancelText?: string
  submitText?: string
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  icon: 'mdi-alert-circle-outline',
  iconColor: 'info',
  cancelText: 'Huỷ',
  submitText: 'Đồng ý',
})
</script>

<template>
  <Modal :show="props.show" :title="props.title" :cancel-text="props.cancelText" :submit-text="props.submitText" submit-color="red" v-bind="$attrs">
    <div class="flex flex-row items-center">
      <v-icon :icon="icon" :size="64" :color="props.iconColor" />
      <p v-if="message">
        {{ message }}
      </p>
    </div>
  </Modal>
</template>
