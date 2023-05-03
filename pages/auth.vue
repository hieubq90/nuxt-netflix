<script setup lang="ts">
import * as yup from 'yup'
import { Field, Form } from 'vee-validate'
import { toast } from 'vue3-toastify'
import TextFieldWithValidation from '~/components/inputs/TextFieldWithValidation.vue'

useHead({
  title: 'Đăng nhập - My Netflix',
})

definePageMeta({
  middleware: 'auth',
  layout: 'auth',
})

const router = useRouter()
const authClient = useSupabaseAuthClient()
const client = useSupabaseClient()
const variant = ref('login')
const loading = ref(false)

const schema = computed(() => {
  if (variant.value === 'login') {
    return yup.object({
      email: yup.string().email().required('Email là bắt buộc').label('Email'),
      password: yup
        .string()
        .min(6, 'Mật khẩu cần tối thiểu 6 ký tự')
        .required('Mật khẩu là bắt buộc')
        .label('Mật khẩu'),
    })
  }
  return yup.object({
    name: yup.string().required('Họ tên là bắt buộc').label('Họ vầ tên'),
    email: yup.string().required('Email là bắt buộc').email('Email không đúng định dạng').label('Email'),
    password: yup
      .string()
      .min(6, 'Mật khẩu cần tối thiểu 6 ký tự')
      .required('Mật khẩu là bắt buộc')
      .label('Mật khẩu'),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref('password')], 'Nhập lại mật khẩu không khớp')
      .required()
      .label('Nhập lại mật khẩu'),
  })
})

function toggleVariant() {
  if (variant.value === 'login')
    variant.value = 'register'
  else
    variant.value = 'login'
}

async function onSubmit(values: any) {
  // eslint-disable-next-line no-console
  console.log('Submitted with', values)
  loading.value = true
  if (variant.value === 'login') {
    // do login
    const { error } = await authClient.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    if (error) {
      loading.value = false
      toast.error('Vui lòng kiểm tra lại email và mật khẩu của bạn!')
    }
    else {
      toast.success('Đăng nhập thành công')
      loading.value = false
      router.push('/')
    }
  }
  else {
    // do register
    const { data, error } = await authClient.auth.signUp({
      email: values.email,
      password: values.password,
    })
    if (error) {
      toast.error(error.message)
      loading.value = false
    }
    else {
      toast.success('Đăng ký tài khoản thành công')
      await client.from('profiles').update({ name: values.name })
        .eq('id', data?.user?.id || '')
      loading.value = false
      router.push('/')
    }
  }
}
</script>

<template>
  <nav class="px-12 py-5">
    <img
      src="/images/logo.png"
      alt="Logo"
      class="h-12"
    >
  </nav>
  <div class="flex justify-center">
    <div
      class="mt-2 w-full self-center rounded-md bg-black bg-opacity-70 px-16 py-16 lg:max-w-md lg:w-2/5"
    >
      <h2
        class="mb-8 text-center text-4xl font-semibold uppercase text-white"
      >
        {{ variant === 'login' ? 'Đăng nhập' : 'Đăng ký' }}
      </h2>
      <Form v-slot="{ handleSubmit }" :validation-schema="schema">
        <v-form @submit.prevent="(e) => handleSubmit(e, onSubmit)">
          <!-- This method uses Higher-order component API to validate vuetify inputs -->
          <Field v-if="variant !== 'login'" v-slot="{ field, errors }" name="name">
            <v-text-field v-bind="field" label="Họ và tên" :error-messages="errors" variant="underlined" />
          </Field>

          <!-- This uses a custom component with the composition API -->
          <TextFieldWithValidation name="email" label="Email" type="email" class="mt-1" variant="underlined" />

          <!-- This uses a custom component with the composition API -->
          <TextFieldWithValidation name="password" label="Mật khẩu" type="password" class="mt-1" variant="underlined" />

          <!-- This uses a custom component with the composition API -->
          <TextFieldWithValidation
            v-if="variant !== 'login'"
            class="mt-1"
            name="passwordConfirm"
            label="Nhập lại mật khẩu"
            type="password"
            variant="underlined"
          />

          <div class="flex flex-row justify-center">
            <v-btn color="info" class="mr-4" type="submit" :loading="loading" :disabled="loading">
              {{ variant === 'login' ? 'Đăng nhập' : 'Đăng ký' }}
            </v-btn>
          </div>

          <p className="mt-12 text-neutral-500">
            {{ variant === 'login' ? 'Lần đầu sử dụng NETFLIX?' : 'Bạn đã có tài khoản.' }}
            <span
              className="ml-1 cursor-pointer font-semibold text-white hover:underline"
              @click="toggleVariant"
            >
              {{ variant === 'login' ? 'Tạo tài khoản' : 'Đăng nhập' }}
            </span>
          </p>
        </v-form>
      </Form>
    </div>
  </div>
</template>
