<script setup lang="ts">
import { type ObjectSchema } from 'yup'
import { Form } from 'vee-validate'

interface Props {
  show?: boolean
  title?: string
  schema?: ObjectSchema<any>
  initialValue?: any
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
    min-width="500"
    v-bind="$attrs"
  >
    <div class="w-full">
      <Form v-if="props.isForm" v-slot="{ handleSubmit, errors }" class="w-full" :validation-schema="props.schema" :initial-values="props.initialValue">
        <v-form class="w-full" @submit.prevent="(e: any) => handleSubmit(e, onSubmit)">
          <v-card class="w-full" :elevation="2">
            <!-- Title -->
            <v-card-title v-if="props.title">
              {{ props.title }}
            </v-card-title>
            <v-divider v-if="props.title" />

            <!-- form body -->
            <v-card-text style="max-height: 500px; overflow-y: auto;">
              <slot />
            </v-card-text>

            <!-- actions -->
            <v-divider v-if="props.title" />
            <v-card-actions>
              <v-spacer />
              <v-btn
                variant="flat"
                @click="onCancel"
              >
                {{ props.cancelText }}
              </v-btn>
              <v-btn
                variant="flat"
                type="submit"
                :color="props.submitColor"
                :disabled="Object.keys(errors).length > 0"
              >
                {{ props.submitText }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </Form>
      <v-card v-else :elevation="2">
        <v-card-title v-if="props.title">
          {{ props.title }}
        </v-card-title>
        <v-divider v-if="props.title" />

        <!-- modal body -->
        <v-card-text style="height: 500px; overflow-y: auto;">
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
    </div>
  </v-dialog>
</template>
