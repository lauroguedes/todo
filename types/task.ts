export enum TaskPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export interface Label {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  is_completed: boolean;
  children?: Task[];
  labels?: Label[];
}

export interface CreateTaskForm {
  title: string;
  description: string;
  priority: TaskPriority;
  labels: number[];
}
