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
  projectId?:  number;
  assignees?:  TaskAssignee[];
  createdAt:   Date | string;
}