<script setup lang="ts">
import { TaskPriority } from "~/types/task";
import type { Label, Task, CreateTaskForm } from "~/types/task";
import { useTasks } from "~/composables/useTasks";
import { watch } from "vue";
import TasksTaskForm from "~/components/tasks/TaskForm.vue";

interface Props {
  availableLabels: Label[];
  task: Task;
}

const props = defineProps<Props>();
const emit = defineEmits<{ updated: [] }>();
const isLoading = ref(false);

const editTask = ref<CreateTaskForm>({
  title: "",
  description: "",
  priority: TaskPriority.MEDIUM,
  parent_id: null,
  is_completed: false,
  labels: [],
});

const toast = useToast();
const { updateTask } = useTasks();

watch(
  () => props.task,
  (task) => {
    if (task) {
      editTask.value = {
        title: task.title || "",
        description: task.description || "",
        priority: ["high", "medium", "low"].includes(
          String(task.priority).toLowerCase()
        )
          ? String(task.priority).toLowerCase() === "high"
            ? TaskPriority.HIGH
            : String(task.priority).toLowerCase() === "medium"
            ? TaskPriority.MEDIUM
            : TaskPriority.LOW
          : TaskPriority.MEDIUM,
        parent_id: null,
        is_completed: task.is_completed ?? false,
        labels: task.labels?.map((l: Label) => l.id) || [],
      };
    }
  },
  { immediate: true }
);

const handleSuccess = () => {
  toast.add({
    title: "Success",
    description: "Task updated successfully",
  });
  emit("updated");
};

const handleError = (error: any) => {
  toast.add({
    title: "Error",
    description: error?.data?.message || "Failed to update task",
    color: "error",
  });
};

const submitEdit = async (form: CreateTaskForm) => {
  isLoading.value = true;
  try {
    await updateTask(props.task.id, form as any);
    handleSuccess();
  } catch (error: any) {
    handleError(error);
  }
  isLoading.value = false;
};
</script>

<template>
  <TasksTaskForm
    v-model="editTask"
    :available-labels="availableLabels"
    :loading="isLoading"
    submit-label="Update Task"
    @submit="submitEdit"
  />
</template>
