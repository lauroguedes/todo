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

// Reactive data
const isLoading = ref(false);
const newTask = ref<CreateTaskForm>({
  title: "",
  description: "",
  priority: TaskPriority.MEDIUM,
  labels: [],
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

    // Reset form
    newTask.value = {
      title: "",
      description: "",
      priority: TaskPriority.MEDIUM,
      labels: [],
    };

    // Emit success event to parent
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
  <UCard class="mb-8">
    <template #header>
      <h3 class="text-lg font-semibold">Create New Task</h3>
    </template>

    <form @submit.prevent="createTask" class="space-y-4">
      <UFormGroup label="Title" required>
        <UInput
          v-model="newTask.title"
          placeholder="Enter task title"
          required
        />
      </UFormGroup>

      <UFormGroup label="Description">
        <UTextarea
          v-model="newTask.description"
          placeholder="Enter task description"
          :rows="3"
        />
      </UFormGroup>

      <UFormGroup label="Priority">
        <USelect
          v-model="newTask.priority"
          :options="[
            { label: 'High', value: TaskPriority.HIGH },
            { label: 'Medium', value: TaskPriority.MEDIUM },
            { label: 'Low', value: TaskPriority.LOW },
          ]"
        />
      </UFormGroup>

      <UFormGroup label="Labels">
        <USelect
          v-model="newTask.labels"
          :options="
            availableLabels.map((label) => ({
              label: label.name,
              value: label.id,
            }))
          "
          multiple
          placeholder="Select labels"
        />
      </UFormGroup>

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
