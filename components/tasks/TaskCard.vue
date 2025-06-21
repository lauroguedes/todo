<script setup lang="ts">
import type { Task, TaskPriority } from "~/types/task";

interface Props {
  task: Task;
  completed?: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
  (e: "toggleCompletion", task: Task): void;
  (e: "delete", id: number): void;
  (e: "edit", task: Task): void;
}>();

const getPriorityColor = (priority: TaskPriority) => {
  switch (String(priority).toLowerCase()) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "secondary";
  }
};

const getPriorityIcon = (priority: TaskPriority) => {
  switch (String(priority).toLowerCase()) {
    case "high":
      return "i-lucide-alert-triangle";
    case "medium":
      return "i-lucide-minus-circle";
    case "low":
      return "i-lucide-check-circle";
    default:
      return "i-lucide-circle";
  }
};
</script>

<template>
  <UCard
    :variant="completed ? 'outline' : 'subtle'"
    class="relative hover:shadow-md transition-shadow"
    :class="completed ? 'opacity-75' : ''"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-start gap-3 flex-1">
        <UCheckbox
          :model-value="task.is_completed"
          @update:model-value="$emit('toggleCompletion', task)"
          class="mt-1"
        />
        <div class="flex-1 min-w-0 space-y-2">
          <h3
            class="font-medium text-lg truncate"
            :class="
              completed ? 'text-gray-900 dark:text-white line-through' : ''
            "
          >
            {{ task.title }}
          </h3>
          <p
            v-if="task.description"
            class="text-sm opacity-80 line-clamp-2"
            :class="
              completed
                ? 'text-gray-600 dark:text-gray-400 mt-1 line-through'
                : ''
            "
          >
            {{ task.description }}
          </p>
          <div class="flex items-center gap-2 mt-2 flex-wrap">
            <UBadge
              v-for="label in task.labels"
              :key="label.id"
              color="secondary"
              size="sm"
              variant="subtle"
            >
              {{ label.name }}
            </UBadge>
            <UBadge
              :color="getPriorityColor(task.priority)"
              size="sm"
              class="flex items-center gap-1"
            >
              <UIcon :name="getPriorityIcon(task.priority)" class="w-3 h-3" />
              {{ task.priority }}
            </UBadge>
          </div>
        </div>
      </div>
      <div class="flex items-center self-center gap-1">
        <UButton
          icon="i-lucide-edit"
          color="neutral"
          variant="ghost"
          size="sm"
          title="Edit task"
          @click="$emit('edit', task)"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          size="sm"
          title="Delete task"
          @click="$emit('delete', task.id)"
        />
      </div>
    </div>
    <UBadge
      :color="getPriorityColor(task.priority)"
      variant="soft"
      size="sm"
      :icon="getPriorityIcon(task.priority)"
      class="absolute right-2 top-2"
    >
      {{ task.priority }}
    </UBadge>
  </UCard>
</template>
