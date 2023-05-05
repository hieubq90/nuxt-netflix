<script setup lang="ts">
import { type ObjectSchema } from 'yup'

interface Props {
  show?: boolean
  title?: string
  schema?: ObjectSchema<any>
  isForm?: boolean
  cancelText?: string
  submitText?: string
  submitColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  isForm: false,
  cancelText: 'Huỷ',
  submitText: 'Đồng ý',
  submitColor: 'success',
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit', data?: any): void
}>()

function onCancel() {
  emit('cancel')
}

function onSubmit(data?: any) {
  emit('submit', data)
}
</script>

<template>
  <v-dialog
    :model-value="props.show"
    scrollable
    persistent
    width="auto"
    v-bind="$attrs"
  >
    <template v-if="props.isForm">
      <Form v-slot="{ handleSubmit }" :validation-schema="props.schema">
        <v-form @submit.prevent="(e: any) => handleSubmit(e, onSubmit)">
          <v-card>
            <!-- Title -->
            <v-card-title v-if="props.title">
              {{ props.title }}
            </v-card-title>
            <v-divider v-if="props.title" />

            <!-- form body -->
            <v-card-text>
              <slot />
            </v-card-text>

            <!-- actions -->
            <v-card-actions>
              <v-spacer />
              <v-btn
                @click="onCancel"
              >
                {{ props.cancelText }}
              </v-btn>
              <v-btn
                type="submit"
              >
                {{ props.submitText }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </Form>
    </template>
    <template v-else>
      <v-card :elevation="2">
        <v-card-title v-if="props.title">
          {{ props.title }}
        </v-card-title>
        <v-divider v-if="props.title" />

        <!-- modal body -->
        <v-card-text>
          <slot />
        </v-card-text>
        <v-divider v-if="props.title" />

        <!-- actions -->
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="flat"
            @click="onCancel"
          >
            {{ props.cancelText }}
          </v-btn>
          <v-btn
            type="submit"
            variant="flat"
            :color="props.submitColor"
            @click="onSubmit"
          >
            {{ props.submitText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
