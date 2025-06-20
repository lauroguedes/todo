<script setup lang="ts">
const toast = useToast()

const logout = () => {
  useSanctumAuth().logout()
      .then(() => {
        navigateTo('/login')
      })
      .catch((error) => {
        toast.add({
          title: 'Logout Failed',
          description: error.message || 'Something went wrong',
          icon: 'i-lucide-shield-x',
        })
      })
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="shadow">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold">Todo App</h1>
        <UButton color="error" variant="soft" @click="logout">Logout</UButton>
      </div>
    </header>
    <main class="flex-grow container mx-auto px-4 py-6">
      <UContainer>
        <slot/>
      </UContainer>
    </main>
  </div>
</template>