export enum TaskPriority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

export interface Label {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority | string;
  is_completed: boolean;
  children?: Task[];
  labels?: Label[];
  created_at: string;
}

export interface CreateTaskForm {
  title: string;
  description: string;
  priority: TaskPriority;
  is_completed: boolean;
  parent_id?: number | null;
  labels: number[];
}
