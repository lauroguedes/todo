<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: ['sanctum:auth']
})

const { data, status, error, refresh } = await useSanctumFetch('/api/tasks');

const tasks = computed(() => data.value);

const deleteTask = (id: number) => {

}

</script>

<template>

</template>