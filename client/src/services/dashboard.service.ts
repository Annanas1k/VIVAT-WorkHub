import { apiClient } from "./client";
import type {
  DashboardStats,
  StatusCount,
  ActivityLogEntry,
  ActivityHeatmapDay,
  DashboardProject,
  DashboardComment,
  DashboardAttachment,
  ProjectStatus,
  CustomerType,
  UserRole,
} from "../types/dashboard.types";

export const getDashboardStats = () => apiClient.get<DashboardStats>("/dashboard/stats");
export const getProjectStatusBreakdown = () => apiClient.get<StatusCount<ProjectStatus>[]>("/dashboard/charts/project-status");
export const getCustomerTypeBreakdown = () => apiClient.get<StatusCount<CustomerType>[]>("/dashboard/charts/customer-type");
export const getUserRoleBreakdown = () => apiClient.get<StatusCount<UserRole>[]>("/dashboard/charts/user-roles");
export const getRecentActivity = (limit = 10) => apiClient.get<ActivityLogEntry[]>(`/dashboard/activity?limit=${limit}`);
export const getActivityHeatmap = () => apiClient.get<ActivityHeatmapDay[]>("/dashboard/activity-heatmap");
export const getMyProjects = () => apiClient.get<DashboardProject[]>("/dashboard/my-projects");
export const getUpcomingDeadlines = (days = 14) => apiClient.get<DashboardProject[]>(`/dashboard/upcoming-deadlines?days=${days}`);
export const getRecentComments = (limit = 5) => apiClient.get<DashboardComment[]>(`/dashboard/recent-comments?limit=${limit}`);
export const getRecentFiles = (limit = 5) => apiClient.get<DashboardAttachment[]>(`/dashboard/recent-files?limit=${limit}`);