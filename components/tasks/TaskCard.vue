<script setup lang="ts">
import type { Task, TaskPriority } from "~/types/task";
import TaskCard from "~/components/tasks/TaskCard.vue";

interface Props {
  task: Task;
  completed?: boolean;
  isSubtask?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSubtask: false,
});

const emit = defineEmits<{
  (e: "toggleCompletion", task: Task): void;
  (e: "delete", id: number): void;
  (e: "edit", task: Task): void;
  (e: "createSubtask", payload: { parentId: number; title: string }): void;
}>();

const showChildren = ref(true);
const isAddingSubtask = ref(false);
const newSubtaskTitle = ref("");

const handleCreateSubtask = () => {
  if (!newSubtaskTitle.value.trim()) {
    return;
  }

  emit("createSubtask", {
    parentId: props.task.id,
    title: newSubtaskTitle.value,
  });

  newSubtaskTitle.value = "";
  isAddingSubtask.value = false;
};

const getPriorityColor = (priority: TaskPriority | string) => {
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

const getPriorityIcon = (priority: TaskPriority | string) => {
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
  <div class="w-full">
    <UCard
      v-if="!isSubtask"
      :variant="completed ? 'outline' : 'subtle'"
      class="relative hover:shadow-md transition-shadow"
      :class="completed ? 'opacity-75' : ''"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-3 flex-1">
          <div class="flex-1 min-w-0 space-y-2">
            <div class="flex items-center gap-2">
              <UCheckbox
                :model-value="Boolean(task.is_completed)"
                @update:model-value="emit('toggleCompletion', task)"
                size="xl"
              />
              <h3
                class="font-medium text-lg truncate"
                :class="completed ? 'line-through' : ''"
              >
                {{ task.title }}
              </h3>
            </div>

            <p
              v-if="task.description"
              class="text-sm opacity-80 line-clamp-2"
              :class="completed ? 'mt-1 line-through' : ''"
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
            </div>
          </div>
        </div>
        <div class="flex items-center self-center gap-1">
          <UButton
            v-if="task.children && task.children.length > 0"
            :icon="
              showChildren ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'
            "
            color="primary"
            variant="ghost"
            size="sm"
            title="Toggle subtasks"
            @click="showChildren = !showChildren"
          />
          <UButton
            v-if="!completed"
            icon="i-lucide-plus"
            color="primary"
            variant="ghost"
            size="sm"
            title="Add subtask"
            @click="isAddingSubtask = !isAddingSubtask"
          />
          <UButton
            v-if="!completed"
            icon="i-lucide-edit"
            color="primary"
            variant="ghost"
            size="sm"
            title="Edit task"
            @click="emit('edit', task)"
          />
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="sm"
            title="Delete task"
            @click="emit('delete', task.id)"
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
      <UBadge
        color="neutral"
        variant="soft"
        size="xs"
        class="absolute right-1 bottom-1 opacity-70"
      >
        {{ task.created_at }}
      </UBadge>

      <div v-if="isAddingSubtask" class="mt-4 flex items-center gap-2">
        <UInput
          v-model="newSubtaskTitle"
          placeholder="Add subtask..."
          class="flex-1"
          autofocus
          @keydown.enter="handleCreateSubtask"
        />
        <UButton
          icon="i-lucide-check"
          color="primary"
          variant="solid"
          size="sm"
          title="Save subtask"
          @click="handleCreateSubtask"
        />
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          title="Cancel"
          @click="isAddingSubtask = false"
        />
      </div>

      <div
        v-if="showChildren && task.children && task.children.length > 0"
        class="pl-5 mt-3 space-y-3"
      >
        <TaskCard
          v-for="child in task.children"
          :key="child.id"
          :task="child"
          :is-subtask="true"
          :completed="child.is_completed"
          @toggle-completion="emit('toggleCompletion', $event)"
          @delete="emit('delete', $event)"
          @edit="emit('edit', $event)"
          @create-subtask="emit('createSubtask', $event)"
        />
      </div>
    </UCard>
    <div v-else class="space-y-2">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 flex-1">
          <UCheckbox
            :disabled="completed"
            :model-value="Boolean(task.is_completed)"
            @update:model-value="emit('toggleCompletion', task)"
          />
          <span :class="completed ? 'line-through' : ''" class="flex-1">{{
            task.title
          }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UButton
            v-if="task.children && task.children.length > 0"
            :icon="
              showChildren ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'
            "
            color="primary"
            variant="ghost"
            size="xs"
            title="Toggle subtasks"
            @click="showChildren = !showChildren"
          />
          <UButton
            v-if="!completed"
            icon="i-lucide-plus"
            color="primary"
            variant="ghost"
            size="xs"
            title="Add subtask"
            @click="isAddingSubtask = !isAddingSubtask"
          />
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="xs"
            title="Delete task"
            @click="emit('delete', task.id)"
          />
        </div>
      </div>
      <div v-if="isAddingSubtask" class="mt-2 flex items-center gap-2 pl-6">
        <UInput
          v-model="newSubtaskTitle"
          placeholder="Add subtask..."
          class="flex-1"
          autofocus
          size="sm"
          @keydown.enter="handleCreateSubtask"
        />
        <UButton
          icon="i-lucide-check"
          color="primary"
          variant="solid"
          size="xs"
          title="Save subtask"
          @click="handleCreateSubtask"
        />
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="xs"
          title="Cancel"
          @click="isAddingSubtask = false"
        />
      </div>
      <div
        v-if="showChildren && task.children && task.children.length > 0"
        class="pl-6 mt-2 space-y-3"
      >
        <TaskCard
          v-for="child in task.children"
          :key="child.id"
          :task="child"
          :is-subtask="true"
          :completed="child.is_completed"
          @toggle-completion="emit('toggleCompletion', $event)"
          @delete="emit('delete', $event)"
          @edit="emit('edit', $event)"
          @create-subtask="emit('createSubtask', $event)"
        />
      </div>
    </div>
  </div>
</template>
