import type { UserData } from "./auth.types";

export type TaskStatus   = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskAssignee {
  id: number;
  user?: { id: number; name: string; avatar?: string };
}

export interface Task {
  id:          number;
  title:       string;
  description?: string;
  status:      TaskStatus;
  priority:    TaskPriority;
  dueDate?:    Date | string;
  createdById?: number | null;
  createdBy?: UserData;
  projectId?:  number;
  project?: {
    id: number;
    name: string;
  }
  assignees?:  TaskAssignee[];
  createdAt:   Date | string;
  updatedAt?: Date | string;
}