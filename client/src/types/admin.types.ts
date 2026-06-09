// ─────────────────────────────────────────
// CUSTOMER
// ─────────────────────────────────────────
export type CustomerType = 'individual' | 'company';

export interface CustomerData {
  id?: number;
  type: CustomerType;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  // company
  company?: string;
  vatNumber?: string;
  regNumber?: string;
  // individual
  firstName?: string;
  lastName?: string;
  createdById?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────
// PROJECT
// ─────────────────────────────────────────
export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';

export interface ProjectData {
  id?: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  dueDate?: string;
  budget?: number;
  customerId?: number;
  customer?: CustomerData;
  createdById?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────
// TASK
// ─────────────────────────────────────────
export type TaskStatus   = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskData {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId?: number;
  project?: ProjectData;
  createdById?: number;
  createdAt?: string;
  updatedAt?: string;
}