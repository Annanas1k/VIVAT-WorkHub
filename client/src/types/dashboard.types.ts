export type ProjectStatus = "active" | "on_hold" | "completed" | "cancelled";
export type CustomerType = "individual" | "company";
export type UserRole = "admin" | "manager" | "team_lead" | "front_dev" | "back_dev" | "qa" | "designer" | "member";
export type LogAction = "created" | "updated" | "deleted" | "login" | "logout" | "password_changed" | "role_changed" | "assigned" | "unassigned";

export interface DashboardStats {
  activeProjects: number;
  totalCustomers: number;
  activeUsers: number;
  tasksCompletedThisMonth: number;

  projectStatusBreakdown: StatusCount<ProjectStatus>[];
  customerTypeBreakdown: StatusCount<CustomerType>[];
  userRoleBreakdown: StatusCount<UserRole>[];
}

export interface StatusCount<T extends string> {
  status: T;
  count: number;
}

export interface ActivityLogEntry {
  id: number;
  action: LogAction;
  entityType: string;
  entityId: number;
  note: string | null;
  createdAt: string;
  performedBy: {
    id: number;
    name: string;
    avatar: string | null;
  } | null;
}

export interface ActivityHeatmapDay {
  date: string;
  count: number;
}

export interface DashboardProject {
  id: number;
  name: string;
  status: ProjectStatus;
  dueDate: string | null;
  customer: { id: number; name: string } | null;
}

export interface DashboardComment {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; name: string; avatar: string | null };
  project: { id: number; name: string } | null;
}

export interface DashboardAttachment {
  id: number;
  filename: string;
  mimetype: string;
  size: number;
  createdAt: string;
  uploadedBy: { id: number; name: string } | null;
}