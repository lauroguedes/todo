<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: ['sanctum:auth']
})


enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

interface Label {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  is_completed: boolean;
  children?: Task[];
  labels?: Label[];
}

const {data, status, error, refresh} = await useSanctumFetch<Task[]>('/api/tasks');
const toast = useToast();

const tasks = computed<Task[]>(() => data.value?.data);

const deleteTask = async (id: Task['id']) => {
  try {
    await useSanctumFetch(`/api/tasks/${id}`, {
      method: 'DELETE'
    });

    await refresh();

    toast.add({title: 'Success', description: 'Task deleted successfully'});
  } catch (e) {
    toast.add({title: 'Error', description: 'Failed to delete task', color: 'error'});
  }
}

</script>

<template>
      <UCollapsible v-for="task in tasks" :key="task.id" class="flex flex-col gap-2 w-full">
        <UCard class="w-full">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <UCheckbox v-model="task.is_completed"/>
              <span :class="{ 'line-through': task.is_completed }">{{ task.title }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UBadge v-for="label in task.labels" :key="label.id" color="secondary">{{ label.name }}</UBadge>
              <UBadge
                  :color="task.priority === TaskPriority.HIGH ? 'error' : task.priority === TaskPriority.MEDIUM ? 'warning' : 'success'">
                {{ task.priority }}
              </UBadge>
              <UButton icon="i-lucide-plus-circle" color="primary" variant="ghost" size="sm"/>
              <UButton icon="i-lucide-x" color="error" variant="ghost" size="sm" @click="deleteTask(task.id)"/>
            </div>
          </div>
        </UCard>

        <template #content>
          <ul v-for="child in task.children" :key="child.id">
            <li>{{ child.title }}</li>
          </ul>
        </template>
      </UCollapsible>
</template>