<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold">Todo App</h1>
        <UButton color="red" variant="soft" @click="logout">Logout</UButton>
      </div>
    </header>
    <main class="flex-grow container mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>