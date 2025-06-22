<script setup lang="ts">
import type { Task } from "~/types/task";
import TaskCard from "./TaskCard.vue";

interface Props {
  tasks: Task[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  toggleCompletion: [task: Task];
  delete: [id: number];
  edit: [task: Task];
  createSubtask: [payload: { parentId: number; title: string }];
}>();

const toast = useToast();

const completedTasks = computed(() =>
  props.tasks.filter((task) => task.is_completed)
);

const pendingTasks = computed(() =>
  props.tasks.filter((task) => !task.is_completed)
);

const editTask = (task: Task) => {
  emit("edit", task);
};

const toggleTaskCompletion = async (task: Task) => {
  try {
    emit("toggleCompletion", task);
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
    emit("delete", id);
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
  <div v-if="props.tasks.length > 0" class="space-y-4">
    <!-- Pending Tasks -->
    <div v-if="pendingTasks.length > 0">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Pending Tasks ({{ pendingTasks.length }})
      </h2>
      <div class="space-y-3">
        <TaskCard
          v-for="task in pendingTasks"
          :key="task.id"
          :task="task"
          :completed="false"
          @toggleCompletion="toggleTaskCompletion"
          @delete="deleteTask"
          @edit="editTask"
          @create-subtask="(payload) => emit('createSubtask', payload)"
        />
      </div>
    </div>

    <!-- Completed Tasks -->
    <div v-if="completedTasks.length > 0" class="mt-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Completed Tasks ({{ completedTasks.length }})
      </h2>
      <div class="space-y-3">
        <TaskCard
          v-for="task in completedTasks"
          :key="task.id"
          :task="task"
          :completed="true"
          @toggleCompletion="toggleTaskCompletion"
          @delete="deleteTask"
          @edit="editTask"
          @create-subtask="(payload) => emit('createSubtask', payload)"
        />
      </div>
    </div>
  </div>

  <UCard v-else class="text-center py-12">
    <UIcon
      name="i-lucide-clipboard-list"
      class="text-6xl text-gray-400 mx-auto mb-4"
    />
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
      No tasks yet
    </h3>
    <p class="text-gray-600 dark:text-gray-400 mb-4">
      Get started by creating your first task
    </p>
  </UCard>
</template>
