<script setup lang="ts">
import { TaskPriority } from "~/types/task";
import type { Label, Task } from "~/types/task";

interface Props {
  tasks: Task[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  toggleCompletion: [task: Task];
  delete: [id: number];
}>();

const toast = useToast();

// Computed properties
const completedTasks = computed(() =>
  props.tasks.filter((task) => task.is_completed)
);
const pendingTasks = computed(() =>
  props.tasks.filter((task) => !task.is_completed)
);

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

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.HIGH:
      return "error";
    case TaskPriority.MEDIUM:
      return "warning";
    case TaskPriority.LOW:
      return "success";
    default:
      return "secondary";
  }
};

const getPriorityIcon = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.HIGH:
      return "i-lucide-alert-triangle";
    case TaskPriority.MEDIUM:
      return "i-lucide-minus-circle";
    case TaskPriority.LOW:
      return "i-lucide-check-circle";
    default:
      return "i-lucide-circle";
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
        <UCard
          v-for="task in pendingTasks"
          :key="task.id"
          class="hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-start gap-3 flex-1">
              <UCheckbox
                :model-value="task.is_completed"
                @update:model-value="toggleTaskCompletion(task)"
                class="mt-1"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 dark:text-white truncate">
                  {{ task.title }}
                </h3>
                <p
                  v-if="task.description"
                  class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2"
                >
                  {{ task.description }}
                </p>
                <div class="flex items-center gap-2 mt-2 flex-wrap">
                  <UBadge
                    v-for="label in task.labels"
                    :key="label.id"
                    color="secondary"
                    size="sm"
                  >
                    {{ label.name }}
                  </UBadge>
                  <UBadge
                    :color="getPriorityColor(task.priority)"
                    size="sm"
                    class="flex items-center gap-1"
                  >
                    <UIcon
                      :name="getPriorityIcon(task.priority)"
                      class="w-3 h-3"
                    />
                    {{ task.priority }}
                  </UBadge>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <UButton
                icon="i-lucide-edit"
                color="neutral"
                variant="ghost"
                size="sm"
                title="Edit task"
              />
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                size="sm"
                title="Delete task"
                @click="deleteTask(task.id)"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Completed Tasks -->
    <div v-if="completedTasks.length > 0" class="mt-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Completed Tasks ({{ completedTasks.length }})
      </h2>
      <div class="space-y-3">
        <UCard
          v-for="task in completedTasks"
          :key="task.id"
          class="hover:shadow-md transition-shadow opacity-75"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-start gap-3 flex-1">
              <UCheckbox
                :model-value="task.is_completed"
                @update:model-value="toggleTaskCompletion(task)"
                class="mt-1"
              />
              <div class="flex-1 min-w-0">
                <h3
                  class="font-medium text-gray-900 dark:text-white truncate line-through"
                >
                  {{ task.title }}
                </h3>
                <p
                  v-if="task.description"
                  class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 line-through"
                >
                  {{ task.description }}
                </p>
                <div class="flex items-center gap-2 mt-2 flex-wrap">
                  <UBadge
                    v-for="label in task.labels"
                    :key="label.id"
                    color="secondary"
                    size="sm"
                  >
                    {{ label.name }}
                  </UBadge>
                  <UBadge
                    :color="getPriorityColor(task.priority)"
                    size="sm"
                    class="flex items-center gap-1"
                  >
                    <UIcon
                      :name="getPriorityIcon(task.priority)"
                      class="w-3 h-3"
                    />
                    {{ task.priority }}
                  </UBadge>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <UButton
                icon="i-lucide-edit"
                color="neutral"
                variant="ghost"
                size="sm"
                title="Edit task"
              />
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                size="sm"
                title="Delete task"
                @click="deleteTask(task.id)"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>

  <!-- Empty State -->
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
