<script setup>
const { status } = useAuth()

// Redirect to login if not authenticated
onMounted(() => {
  const route = useRoute()
  const router = useRouter()

  watch(status, (newStatus) => {
    if (newStatus === 'unauthenticated' && route.meta.middleware?.includes('auth')) {
      router.push('/login')
    }
  }, { immediate: true })
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
