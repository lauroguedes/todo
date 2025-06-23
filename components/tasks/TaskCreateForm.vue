<script setup lang="ts">
import { TaskPriority } from "~/types/task";
import type { Label, CreateTaskForm } from "~/types/task";
import { useTasks } from "~/composables/useTasks";
import TasksTaskForm from "~/components/tasks/TaskForm.vue";

interface Props {
  availableLabels: Label[];
}

const props = defineProps<Props>();
const emit = defineEmits<{ created: [] }>();
const isLoading = ref(false);

const newTask = ref<CreateTaskForm>({
  title: "",
  description: "",
  priority: TaskPriority.MEDIUM,
  parent_id: null,
  is_completed: false,
  labels: [],
});

const toast = useToast();
const { addTask } = useTasks();

const handleSuccess = () => {
  toast.add({
    title: "Success",
    description: "Task created successfully",
  });
  emit("created");
  newTask.value = {
    title: "",
    description: "",
    priority: TaskPriority.MEDIUM,
    parent_id: null,
    is_completed: false,
    labels: [],
  };
};

const handleError = (error: any) => {
  toast.add({
    title: "Error",
    description: error?.data?.message || "Failed to create task",
    color: "error",
  });
};

const createTask = async (form: CreateTaskForm) => {
  isLoading.value = true;
  try {
    await addTask(form as any);
    handleSuccess();
  } catch (error: any) {
    handleError(error);
  }
  isLoading.value = false;
};
</script>

<template>
  <TasksTaskForm
    v-model="newTask"
    :available-labels="availableLabels"
    :loading="isLoading"
    submit-label="Create Task"
    @submit="createTask"
  />
</template>
