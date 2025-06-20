<script setup lang="ts">
import * as z from 'zod'
import type {FormError, FormSubmitEvent} from '@nuxt/ui'

definePageMeta({
  layout: 'guest',
  middleware: ['sanctum:guest']
})

const {login} = useSanctumAuth();

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(5, 'Must be at least 8 characters'),
  remember: z.boolean()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
  remember: false
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  login(event.data)
      .then(() => {
        navigateTo('/')
      })
      .catch((error) => {
        if (error.response?.status !== 422) {
          toast.add({
            title: 'Login Failed',
            description: error.message || 'Something went wrong',
            icon: 'i-lucide-shield-x',
            color: 'error'
          })

          return
        }

        toast.add({
          title: 'Validation Error',
          description: error.data.message || 'Please check the form for errors',
          icon: 'i-lucide-alert-triangle',
          color: 'warning'
        })
      })
}
</script>

<template>
  <UCard variant="subtle">
    <template #header>
      <h1 class="text-center uppercase">Login</h1>
    </template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email" required>
        <UInput class="w-full" v-model="state.email"/>
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput class="w-full" v-model="state.password" type="password"/>
      </UFormField>

      <UFormField>
        <UCheckbox label="Remember me" name="remember" v-model="state.remember" />
      </UFormField>

      <div class="text-right">
        <UButton type="submit">
          Submit
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
