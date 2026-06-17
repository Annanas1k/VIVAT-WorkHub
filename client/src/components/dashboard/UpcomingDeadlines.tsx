import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarClock } from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard";

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function UpcomingDeadlines() {
  const { t } = useTranslation();
  const { projects, isLoading, error } = useDashboard();

  const upcomingProjects = projects
    .filter((project) => {
      if (!project.dueDate) return false;
      const days = daysUntil(project.dueDate);
      return days >= 0 && days <= 14;
    })
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t("dashboard.deadlines.title", "Termene apropiate")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-destructive font-medium">
          {t("dashboard.deadlines.error", "Nu am putut încărca termenele:")} {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          {t("dashboard.deadlines.title", "Termene apropiate")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))
        ) : upcomingProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.deadlines.empty", "Niciun proiect cu termen în următoarele 14 zile.")}
          </p>
        ) : (
          upcomingProjects.map((project) => {
            const days = daysUntil(project.dueDate!);
            
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {project.customer?.name ?? t("dashboard.deadlines.noCustomer", "Fără client")}
                  </p>
                </div>
                
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    days <= 3 
                      ? "bg-destructive/10 text-destructive" 
                      : "bg-amber-500/10 text-amber-600"
                  }`}>
                    {days === 0 
                      ? t("dashboard.deadlines.today", "Azi") 
                      : days === 1 
                        ? t("dashboard.deadlines.tomorrow", "Mâine") 
                        : t("dashboard.deadlines.inDays", "În {{count}} zile", { count: days })}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}