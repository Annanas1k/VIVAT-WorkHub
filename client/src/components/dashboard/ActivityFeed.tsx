import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  KeyRound,
  Shield,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import { useDashboard } from "../../hooks/useDashboard";
import type { LogAction } from "../../types/dashboard.types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ActivityFeed() {
  const { t } = useTranslation();

  const ACTION_CONFIG: Record<LogAction, { icon: typeof Plus; label: string }> = {
    created: { icon: Plus, label: t("dashboard.activity.actions.created", "a creat") },
    updated: { icon: Pencil, label: t("dashboard.activity.actions.updated", "a actualizat") },
    deleted: { icon: Trash2, label: t("dashboard.activity.actions.deleted", "a șters") },
    login: { icon: LogIn, label: t("dashboard.activity.actions.login", "s-a autentificat") },
    logout: { icon: LogOut, label: t("dashboard.activity.actions.logout", "s-a deconectat") },
    password_changed: { icon: KeyRound, label: t("dashboard.activity.actions.passwordChanged", "și-a schimbat parola") },
    role_changed: { icon: Shield, label: t("dashboard.activity.actions.roleChanged", "a schimbat rolul pentru") },
    assigned: { icon: UserPlus, label: t("dashboard.activity.actions.assigned", "a asignat") },
    unassigned: { icon: UserMinus, label: t("dashboard.activity.actions.unassigned", "a dezasignat") },
  };

  const ENTITY_LABELS: Record<string, string> = {
    Project: t("dashboard.activity.entities.project", "proiectul"),
    Task: t("dashboard.activity.entities.task", "taskul"),
    User: t("dashboard.activity.entities.user", "userul"),
    Customer: t("dashboard.activity.entities.customer", "clientul"),
  };

  const { activities, isLoading, error } = useDashboard();

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t("dashboard.activity.title", "Activitate recentă")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-destructive font-medium">
          {t("dashboard.activity.error", "Nu am putut încărca activitatea:")} {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {t("dashboard.activity.title", "Activitate recentă")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.activity.empty", "Nicio activitate recentă.")}
          </p>
        ) : (
          activities.map((entry) => {
            const config = ACTION_CONFIG[entry.action];
            const Icon = config?.icon || Plus;
            const entityLabel = ENTITY_LABELS[entry.entityType] ?? entry.entityType.toLowerCase();

            return (
              <div key={entry.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-muted text-muted-foreground font-medium">
                    {entry.performedBy ? initials(entry.performedBy.name) : "?"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm leading-snug text-foreground">
                    <span className="font-semibold text-foreground">
                      {entry.performedBy?.name ?? t("dashboard.activity.unknownUser", "Cineva")}
                    </span>{" "}
                    {config?.label || entry.action} {entityLabel} #{entry.entityId}
                    {entry.note && (
                      <span className="text-muted-foreground font-normal"> — {entry.note}</span>
                    )}
                  </p>
                  
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon className="h-3 w-3" />
                    {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true, locale: ro })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}