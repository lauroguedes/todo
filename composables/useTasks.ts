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

  // Helper: recursively find and update a task by id
  function updateTaskInTree(
    tasksArr: Task[],
    id: number,
    updater: (task: Task) => void
  ) {
    for (const task of tasksArr) {
      if (task.id === id) {
        updater(task);
        return true;
      }
      if (task.children && updateTaskInTree(task.children, id, updater)) {
        return true;
      }
    }
    return false;
  }

  // Helper: recursively find and delete a task by id
  function deleteTaskInTree(tasksArr: Task[], id: number): boolean {
    const idx = tasksArr.findIndex((t) => t.id === id);
    if (idx !== -1) {
      tasksArr.splice(idx, 1);
      return true;
    }
    for (const task of tasksArr) {
      if (task.children && deleteTaskInTree(task.children, id)) {
        return true;
      }
    }
    return false;
  }

  // Helper: recursively find a parent by id and add a child
  function addSubtaskInTree(
    tasksArr: Task[],
    parentId: number,
    subtask: Task
  ): boolean {
    for (const task of tasksArr) {
      if (task.id === parentId) {
        if (!task.children) task.children = [];
        task.children.unshift(subtask);
        return true;
      }
      if (task.children && addSubtaskInTree(task.children, parentId, subtask)) {
        return true;
      }
    }
    return false;
  }

  // Add a new task (top-level only)
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
    if (data.value && data.value.data) {
      // If parent_id is present, add as subtask
      if ((taskData as any).parent_id) {
        addSubtaskInTree(
          tasks.value,
          (taskData as any).parent_id as number,
          data.value.data
        );
      } else {
        tasks.value.unshift(data.value.data);
      }
    }
  };

  // Update an existing task (deep)
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
      updateTaskInTree(tasks.value, id, (task) => {
        Object.assign(task, data.value.data);
      });
    }
  };

  // Delete a task (deep)
  const deleteTask = async (id: number) => {
    const { error: deleteError } = await useSanctumFetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (deleteError.value) {
      throw (
        (deleteError.value as any)?.data?.message || "Failed to delete task"
      );
    }
    deleteTaskInTree(tasks.value, id);
  };

  // Toggle completion (deep)
  const toggleTaskCompletion = async (task: Task) => {
    await updateTask(task.id, { is_completed: !task.is_completed });
  };

  // Create subtask (deep)
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
      addSubtaskInTree(tasks.value, parentId, data.value.data);
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
