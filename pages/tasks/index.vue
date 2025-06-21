<script setup lang="ts">
import { TaskPriority } from "~/types/task";
import type { Task, CreateTaskForm } from "~/types/task";

definePageMeta({
  layout: "app",
});

// Available labels for selection
const availableLabels = ref([
  { id: 1, name: "Personal" },
  { id: 2, name: "Work" },
  { id: 3, name: "Shopping" },
  { id: 4, name: "Health" },
  { id: 5, name: "Education" },
]);

// Data fetching
const {
  data: tasksData,
  pending,
  error,
  refresh,
} = useSanctumFetch<{ data: Task[] }>("/api/tasks");
const toast = useToast();

// Computed properties
const tasks = computed<Task[]>(() => tasksData.value?.data || []);

// Methods
const toggleTaskCompletion = async (task: Task) => {
  try {
    await useSanctumFetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      body: {
        is_completed: !task.is_completed,
      },
    });

    await refresh();

    toast.add({
      title: "Success",
      description: `Task ${
        task.is_completed ? "unmarked" : "marked"
      } as completed`,
    });
  } catch (e) {
    toast.add({
      title: "Error",
      description: "Failed to update task",
      color: "error",
    });
  }
};

const deleteTask = async (id: Task["id"]) => {
  try {
    await useSanctumFetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    await refresh();

    toast.add({
      title: "Success",
      description: "Task deleted successfully",
    });
  } catch (e) {
    toast.add({
      title: "Error",
      description: "Failed to delete task",
      color: "error",
    });
  }
};
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          My Tasks
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Manage your tasks and stay organized
        </p>
      </div>
    </div>

    <!-- Create Task Form -->
    <TasksTaskCreateForm
      :available-labels="availableLabels"
      @created="refresh"
    />

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <UIcon
        name="i-lucide-loader-2"
        class="animate-spin text-4xl text-primary"
      />
    </div>

    <!-- Error State -->
    <UAlert
      v-else-if="error"
      title="Error"
      description="Failed to load tasks. Please try again."
      color="error"
      icon="i-lucide-alert-circle"
    />

    <!-- Tasks List -->
    <TasksTaskList
      v-else
      :tasks="tasks"
      @toggle-completion="toggleTaskCompletion"
      @delete="deleteTask"
    />
  </div>
</template>
