import { ref, computed } from "vue";
import type { Task } from "~/types/task";

export const useTasks = () => {
  // Global state for tasks
  const tasks = useState<Task[]>("tasks", () => []);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch tasks from server and set state
  const fetchTasks = async () => {
    loading.value = true;
    error.value = null;
    const { data, error: fetchError } = await useSanctumFetch<{ data: Task[] }>(
      "/api/tasks"
    );
    if (fetchError.value) {
      error.value =
        (fetchError.value as any)?.data?.message || "Failed to fetch tasks";
    } else {
      tasks.value = data.value?.data || [];
    }
    loading.value = false;
  };

  // Add a new task
  const addTask = async (taskData: Partial<Task>) => {
    const { data, error: addError } = await useSanctumFetch<{ data: Task }>(
      "/api/tasks",
      {
        method: "POST",
        body: taskData,
      }
    );
    if (addError.value) {
      throw (addError.value as any)?.data?.message || "Failed to add task";
    }
    if (data.value?.data) {
      tasks.value.unshift(data.value.data);
    }
  };

  // Update an existing task
  const updateTask = async (id: number, updates: Partial<Task>) => {
    const { data, error: updateError } = await useSanctumFetch<{ data: Task }>(
      `/api/tasks/${id}`,
      {
        method: "PATCH",
        body: updates,
      }
    );
    if (updateError.value) {
      throw (
        (updateError.value as any)?.data?.message || "Failed to update task"
      );
    }
    if (data.value?.data) {
      const idx = tasks.value.findIndex((t) => t.id === id);
      if (idx !== -1)
        tasks.value[idx] = { ...tasks.value[idx], ...data.value.data };
    }
  };

  // Delete a task
  const deleteTask = async (id: number) => {
    const { error: deleteError } = await useSanctumFetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (deleteError.value) {
      throw (
        (deleteError.value as any)?.data?.message || "Failed to delete task"
      );
    }
    tasks.value = tasks.value.filter((t) => t.id !== id);
  };

  // Toggle completion
  const toggleTaskCompletion = async (task: Task) => {
    await updateTask(task.id, { is_completed: !task.is_completed });
  };

  // Create subtask
  const createSubtask = async (parentId: number, title: string) => {
    const { data, error: subtaskError } = await useSanctumFetch<{ data: Task }>(
      "/api/tasks",
      {
        method: "POST",
        body: { title, parent_id: parentId },
      }
    );
    if (subtaskError.value) {
      throw (
        (subtaskError.value as any)?.data?.message || "Failed to create subtask"
      );
    }
    if (data.value?.data) {
      // Insert subtask into parent's children
      const parent = tasks.value.find((t) => t.id === parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.unshift(data.value.data);
      }
    }
  };

  return {
    tasks: computed(() => tasks.value),
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    createSubtask,
  };
};
