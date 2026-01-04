<template>
  <div class="w-full max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg">
    <router-view />
    <ConfirmDialog />
    <Toast position="top-right" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useTodoStore } from '@/stores/todoStore'

const projectStore = useProjectStore()
const todoStore = useTodoStore()

onMounted(async () => {
  await Promise.all([
    projectStore.initialize(),
    todoStore.initialize()
  ])
})
</script>

<style>
body {
  @apply bg-gray-100 m-0 p-8 flex justify-center;
  font-family: var(--font-family);
}
</style>
