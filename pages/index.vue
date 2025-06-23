<script setup lang="ts">
import type { Task, Label } from "~/types/task";
import { useTasks } from "~/composables/useTasks";

definePageMeta({
  layout: "app",
  middleware: ["sanctum:auth"],
});

const toast = useToast();

const { data: labelsData } = useSanctumFetch<{ data: Label[] }>("/api/labels");
const availableLabels = computed<Label[]>(() => labelsData.value?.data || []);
const taskToEdit = ref<Task | null>(null);

// Use global tasks composable
const {
  tasks,
  loading,
  error,
  fetchTasks,
  addTask,
  updateTask,
  deleteTask: removeTask,
  toggleTaskCompletion,
  createSubtask,
} = useTasks();

onMounted(() => {
  fetchTasks();
});

const handleEditTask = (task: Task) => {
  taskToEdit.value = task;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleError = (error: string) => {
  toast.add({
    title: "Error",
    description: error || "Operation Failed",
    color: "error",
  });
};

const handleSuccess = (message: string) => {
  toast.add({
    title: "Success",
    description: message,
  });
};

const resetForm = () => {
  taskToEdit.value = null;
};

const handleToggleTaskCompletion = async (task: Task) => {
  try {
    await toggleTaskCompletion(task);
    handleSuccess(
      `Task ${task.title} was ${
        task.is_completed ? "unmarked" : "marked"
      } as completed`
    );
  } catch (e: any) {
    handleError(e);
  }
};

const handleDeleteTask = async (id: Task["id"]) => {
  try {
    await removeTask(id);
    handleSuccess("Task deleted successfully");
  } catch (e: any) {
    handleError(e);
  }
};

const handleCreateSubtask = async ({
  parentId,
  title,
}: {
  parentId: number;
  title: string;
}) => {
  try {
    await createSubtask(parentId, title);
    handleSuccess(`Subtask ${title} was created successfully`);
  } catch (e: any) {
    handleError(e);
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
      @created="fetchTasks"
      @updated="resetForm"
    />

    <div v-if="loading" class="flex justify-center items-center py-12">
      <UIcon
        name="i-lucide-loader-2"
        class="animate-spin text-4xl text-primary"
      />
    </div>

    <UAlert
      v-else-if="error"
      title="Error"
      :description="error"
      color="error"
      icon="i-lucide-alert-circle"
    />

    <TasksTaskList
      v-else
      :tasks="tasks"
      @toggle-completion="handleToggleTaskCompletion"
      @delete="handleDeleteTask"
      @edit="handleEditTask"
      @create-subtask="handleCreateSubtask"
    />
  </div>
</template>
