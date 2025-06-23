<script setup lang="ts">
import { TaskPriority } from "~/types/task";
import type { Label, CreateTaskForm, Task } from "~/types/task";
import { watch } from "vue";
import { useTasks } from "~/composables/useTasks";

interface Props {
  availableLabels: Label[];
  taskToEdit?: Task | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  created: [];
  updated: [];
}>();

const isLoading = ref(false);

const isEditMode = computed(() => !!props.taskToEdit);

const newTask = ref<CreateTaskForm>({
  title: "",
  description: "",
  priority: TaskPriority.MEDIUM,
  parent_id: null,
  is_completed: false,
  labels: [],
});

watch(
  () => props.taskToEdit,
  (task) => {
    if (!task) {
      newTask.value = {
        title: "",
        description: "",
        priority: TaskPriority.MEDIUM,
        parent_id: null,
        is_completed: false,
        labels: [],
      };
      return;
    }
    newTask.value = {
      title: task.title || "",
      description: task.description || "",
      priority:
        priorityItems.value.find((p) => p.label === task.priority)?.id ??
        TaskPriority.MEDIUM,
      parent_id: null,
      is_completed: task.is_completed ?? false,
      labels: task.labels?.map((l: Label) => l.id) || [],
    };
  },
  { immediate: true }
);

const priorityItems = ref([
  { id: TaskPriority.HIGH, label: "high" },
  { id: TaskPriority.MEDIUM, label: "medium" },
  { id: TaskPriority.LOW, label: "low" },
]);

const selectedLabels = computed({
  get: () => {
    return newTask.value.labels.map((labelId) => {
      const label = props.availableLabels.find((l) => l.id === labelId);
      return {
        label: label?.name || "",
        id: labelId,
      };
    });
  },
  set: (value: { label: string; id: number }[]) => {
    newTask.value.labels = value.map((item) => item.id);
  },
});

const labelItems = computed(() => {
  return props.availableLabels.map((label) => ({
    label: label.name,
    id: label.id,
  }));
});

const toast = useToast();

const { addTask, updateTask } = useTasks();

const handleSuccess = (isEditing: boolean) => {
  toast.add({
    title: "Success",
    description: isEditing
      ? "Task updated successfully"
      : "Task created successfully",
  });

  if (!isEditing) {
    emit("created");
    newTask.value = {
      title: "",
      description: "",
      priority: TaskPriority.MEDIUM,
      parent_id: null,
      is_completed: false,
      labels: [],
    };
    return;
  }
  emit("updated");
};

const handleError = (error: any, isEditing: boolean) => {
  toast.add({
    title: "Error",
    description:
      error?.data?.message ||
      (isEditing ? "Failed to update task" : "Failed to create task"),
    color: "error",
  });
};

const createOrUpdateTask = async () => {
  isLoading.value = true;
  const isEditing = isEditMode.value && props.taskToEdit;
  try {
    if (isEditing && props.taskToEdit) {
      await updateTask(props.taskToEdit.id, newTask.value as any);
      handleSuccess(true);
    } else {
      await addTask(newTask.value as any);
      handleSuccess(false);
    }
  } catch (error: any) {
    handleError(error, !!isEditing);
  }
  isLoading.value = false;
};
</script>

<template>
  <UCard class="mb-8" variant="subtle">
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ isEditMode ? "Edit Task" : "Create New Task" }}
      </h3>
    </template>

    <form @submit.prevent="createOrUpdateTask" class="space-y-4">
      <div class="grid grid-cols-5 gap-2">
        <UFormField class="col-span-3" name="title" required>
          <UInput
            class="w-full"
            icon="i-lucide-circle-check-big"
            placeholder="Title"
            v-model="newTask.title"
          />
        </UFormField>

        <UFormField name="priority">
          <USelect
            class="w-full"
            icon="i-lucide-arrow-up-wide-narrow"
            placeholder="Priority"
            v-model="newTask.priority"
            :items="priorityItems"
            value-key="id"
          />
        </UFormField>

        <UFormField name="labels">
          <UInputMenu
            class="w-full"
            icon="i-lucide-tags"
            v-model="selectedLabels"
            multiple
            :items="labelItems"
          />
        </UFormField>
      </div>

      <div class="flex justify-end">
        <UButton
          type="submit"
          color="primary"
          :loading="isLoading"
          icon="i-lucide-plus"
        >
          {{ isEditMode ? "Update Task" : "Create Task" }}
        </UButton>
      </div>
    </form>
  </UCard>
</template>
