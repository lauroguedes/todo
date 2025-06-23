<script setup lang="ts">
import { TaskPriority } from "~/types/task";
import type { Label, CreateTaskForm } from "~/types/task";

interface Props {
  modelValue: CreateTaskForm;
  availableLabels: Label[];
  loading?: boolean;
  submitLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  submitLabel: "Save",
});
const emit = defineEmits<{
  (e: "update:modelValue", value: CreateTaskForm): void;
  (e: "submit", value: CreateTaskForm): void;
}>();

const priorityItems = [
  { id: TaskPriority.HIGH, label: "high" },
  { id: TaskPriority.MEDIUM, label: "medium" },
  { id: TaskPriority.LOW, label: "low" },
];

const selectedLabels = computed({
  get: () => {
    return props.modelValue.labels.map((labelId) => {
      const label = props.availableLabels.find((l) => l.id === labelId);
      return {
        label: label?.name || "",
        id: labelId,
      };
    });
  },
  set: (value: { label: string; id: number }[]) => {
    emit("update:modelValue", {
      ...props.modelValue,
      labels: value.map((item) => item.id),
    });
  },
});

const labelItems = computed(() => {
  return props.availableLabels.map((label) => ({
    label: label.name,
    id: label.id,
  }));
});

function updateField<K extends keyof CreateTaskForm>(
  key: K,
  value: CreateTaskForm[K]
) {
  emit("update:modelValue", {
    ...props.modelValue,
    [key]: value,
  });
}

function onSubmit() {
  emit("submit", props.modelValue);
}
</script>

<template>
  <UCard class="mb-8" variant="subtle">
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div class="grid grid-cols-5 gap-2">
        <UFormField class="col-span-3" name="title" required>
          <UInput
            class="w-full"
            icon="i-lucide-circle-check-big"
            placeholder="Title"
            :model-value="modelValue.title"
            @update:model-value="(val) => updateField('title', val)"
          />
        </UFormField>
        <UFormField name="priority">
          <USelect
            class="w-full"
            icon="i-lucide-arrow-up-wide-narrow"
            placeholder="Priority"
            :model-value="modelValue.priority"
            @update:model-value="(val) => updateField('priority', val)"
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
          :loading="loading"
          icon="i-lucide-plus"
        >
          {{ submitLabel }}
        </UButton>
      </div>
    </form>
  </UCard>
</template>
