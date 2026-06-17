import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "../../hooks/useDashboard";
import type { ProjectStatus } from "../../types/dashboard.types";

export function MyProjects() {
  const { t, i18n } = useTranslation();
  const { projects, isLoading, error } = useDashboard();

  const STATUS_BADGE: Record<
    ProjectStatus,
    { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
  > = {
    active: { label: t("dashboard.projects.status.active", "Activ"), variant: "default" },
    on_hold: { label: t("dashboard.projects.status.onHold", "În așteptare"), variant: "secondary" },
    completed: { label: t("dashboard.projects.status.completed", "Finalizat"), variant: "outline" },
    cancelled: { label: t("dashboard.projects.status.cancelled", "Anulat"), variant: "destructive" },
  };

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t("dashboard.projects.title", "Proiectele mele")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-destructive font-medium">
          {t("dashboard.projects.error", "Nu am putut încărca proiectele:")} {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {t("dashboard.projects.title", "Proiectele mele")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))
        ) : projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.projects.empty", "Nu ești membru în niciun proiect activ.")}
          </p>
        ) : (
          projects.map((project) => {
            const badge = STATUS_BADGE[project.status] || { label: project.status, variant: "outline" };
            
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {project.customer?.name ?? t("dashboard.projects.noCustomer", "Fără client")}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                  {project.dueDate && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(project.dueDate).toLocaleDateString(i18n.language)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}