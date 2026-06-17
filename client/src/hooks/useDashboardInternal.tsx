import { useState, useEffect, useCallback } from "react";
import * as dashboardApi from "../services/dashboard.service";
import type {
  DashboardStats,
  DashboardProject,
  ActivityLogEntry,
  ActivityHeatmapDay,
  DashboardComment,
  DashboardAttachment,
} from "../types/dashboard.types";

export function useDashboardInternal() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  // FIX: Inițializăm stările cu array-uri goale ca să nu mai crape .length în componente
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [activityHeatmap, setActivityHeatmap] = useState<ActivityHeatmapDay[]>([]);
  const [comments, setComments] = useState<DashboardComment[]>([]);
  const [files, setFiles] = useState<DashboardAttachment[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Rulează toate cererile în paralel
      const [
        statsRes, 
        projectsRes, 
        activityRes,
        heatmapRes,
        commentsRes,
        filesRes
      ] = await Promise.all([
        dashboardApi.getDashboardStats(),
        dashboardApi.getMyProjects(),
        dashboardApi.getRecentActivity(10),
        dashboardApi.getActivityHeatmap(),
        dashboardApi.getRecentComments(5),
        dashboardApi.getRecentFiles(5),
      ]);

      // FIX REZOLVAT (Imaginea 1): Salvăm .data din răspunsul Axios, nu răspunsul brut
      setStats(statsRes as unknown as DashboardStats);
      setProjects(projectsRes as unknown as DashboardProject[]);
      setActivities(activityRes as unknown as ActivityLogEntry[]);
      setActivityHeatmap(heatmapRes as unknown as ActivityHeatmapDay[]);
      setComments(commentsRes as unknown as DashboardComment[]);
      setFiles(filesRes as unknown as DashboardAttachment[]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Nu s-au putut încărca datele.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    // FIX REZOLVAT (Erorile din primul set de imagini): Fallback-uri sigure pentru breakdown-uri
    projectStatusBreakdown: stats?.projectStatusBreakdown ?? [],
    customerTypeBreakdown: stats?.customerTypeBreakdown ?? [],
    userRoleBreakdown: stats?.userRoleBreakdown ?? [],
    projects,
    activities,
    activityHeatmap,
    comments,
    files,
    isLoading,
    error,
    refresh: fetchDashboardData,
  };
}