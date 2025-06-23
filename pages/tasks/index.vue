<script setup lang="ts">
import type { Task, Label } from "~/types/task";

definePageMeta({
  layout: "app",
  middleware: ["sanctum:auth"],
});

const toast = useToast();

const { data: labelsData } = useSanctumFetch<{ data: Label[] }>("/api/labels");
const availableLabels = computed<Label[]>(() => labelsData.value?.data || []);
const taskToEdit = ref<Task | null>(null);

const {
  data: tasksData,
  pending,
  error,
  refresh,
} = useSanctumFetch<{ data: Task[] }>("/api/tasks");
const tasks = computed<Task[]>(() => tasksData.value?.data || []);

const handleEditTask = (task: Task) => {
  taskToEdit.value = task;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const resetForm = () => {
  taskToEdit.value = null;
  refresh();
};

const toggleTaskCompletion = async (task: Task) => {
  const { error } = await useSanctumFetch(`/api/tasks/${task.id}`, {
    method: "PATCH",
    body: {
      is_completed: !task.is_completed,
    },
  });

  if (error.value) {
    toast.add({
      title: "Error",
      description: error.value?.data?.message || "Operation Failed",
      color: "error",
    });
    return;
  }

  await refresh();

  toast.add({
    title: "Success",
    description: `Task ${
      task.is_completed ? "marked" : "unmarked"
    } as completed`,
  });
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

const createSubtask = async ({
  parentId,
  title,
}: {
  parentId: number;
  title: string;
}) => {
  try {
    await useSanctumFetch("/api/tasks", {
      method: "POST",
      body: {
        title,
        parent_id: parentId,
      },
    });
    await refresh();
    toast.add({
      title: "Success",
      description: "Subtask created successfully",
    });
  } catch (e) {
    toast.add({
      title: "Error",
      description: "Failed to create subtask",
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

    <TasksTaskCreateForm
      :available-labels="availableLabels"
      :task-to-edit="taskToEdit"
      @created="refresh"
      @updated="resetForm"
    />

    <div v-if="pending" class="flex justify-center items-center py-12">
      <UIcon
        name="i-lucide-loader-2"
        class="animate-spin text-4xl text-primary"
      />
    </div>

    <UAlert
      v-else-if="error"
      title="Error"
      description="Failed to load tasks. Please try again."
      color="error"
      icon="i-lucide-alert-circle"
    />

    <TasksTaskList
      v-else
      :tasks="tasks"
      @toggle-completion="toggleTaskCompletion"
      @delete="deleteTask"
      @edit="handleEditTask"
      @create-subtask="createSubtask"
    />
  </div>
</template>
