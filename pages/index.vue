<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: ['sanctum:auth']
})
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <h1 class="text-3xl font-bold">Todo App</h1>
  </div>
</template>
