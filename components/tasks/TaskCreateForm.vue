<script setup lang="ts">
import { TaskPriority } from "~/types/task";
import type { Label, CreateTaskForm } from "~/types/task";

interface Props {
  availableLabels: Label[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  created: [];
}>();

const isLoading = ref(false);

const newTask = ref<CreateTaskForm>({
  title: "",
  description: "",
  priority: TaskPriority.MEDIUM,
  parent_id: null,
  is_completed: false,
  labels: [],
});

const priorityItems = ref([
  { id: TaskPriority.HIGH, label: "High" },
  { id: TaskPriority.MEDIUM, label: "Medium" },
  { id: TaskPriority.LOW, label: "Low" },
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

const createTask = async () => {
  if (!newTask.value.title.trim()) {
    toast.add({
      title: "Error",
      description: "Task title is required",
      color: "error",
    });
    return;
  }

  isLoading.value = true;
  try {
    await useSanctumFetch("/api/tasks", {
      method: "POST",
      body: newTask.value,
    });

    newTask.value = {
      title: "",
      description: "",
      priority: TaskPriority.MEDIUM,
      parent_id: null,
      is_completed: false,
      labels: [],
    };

    emit("created");

    toast.add({
      title: "Success",
      description: "Task created successfully",
    });
  } catch (e) {
    toast.add({
      title: "Error",
      description: "Failed to create task",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <UCard class="mb-8" variant="subtle">
    <template #header>
      <h3 class="text-lg font-semibold">Create New Task</h3>
    </template>

    <form @submit.prevent="createTask" class="space-y-4">
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
          Create Task
        </UButton>
      </div>
    </form>
  </UCard>
</template>
