import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, Users, UserCheck, CheckSquare } from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard";
import type { DashboardStats } from "../../types/dashboard.types";

// 1. Definim un tip strict doar pentru cheile care sunt numere în DashboardStats
type NumericStatsKeys = keyof Omit<
  DashboardStats, 
  "projectStatusBreakdown" | "customerTypeBreakdown" | "userRoleBreakdown"
>;

interface StatCardConfig {
  key: NumericStatsKeys;
  titleKey: string;
  defaultTitle: string;
  icon: typeof Folder;
}

export function StatsCards() {
  const { t } = useTranslation();
  const { stats, isLoading, error } = useDashboard();

  // 2. Mapăm configurarea cardurilor folosind tipul strict creat mai sus
  const CARDS_CONFIG: StatCardConfig[] = [
    {
      key: "activeProjects",
      titleKey: "dashboard.stats.activeProjects",
      defaultTitle: "Proiecte active",
      icon: Folder,
    },
    {
      key: "totalCustomers",
      titleKey: "dashboard.stats.totalCustomers",
      defaultTitle: "Total clienți",
      icon: Users,
    },
    {
      key: "activeUsers",
      titleKey: "dashboard.stats.activeUsers",
      defaultTitle: "Useri activi",
      icon: UserCheck,
    },
    {
      key: "tasksCompletedThisMonth",
      titleKey: "dashboard.stats.tasksCompletedThisMonth",
      defaultTitle: "Task-uri finalizate (Lună)",
      icon: CheckSquare,
    },
  ];

  if (error) {
    return (
      <div className="text-sm text-destructive font-medium p-4 border border-destructive/50 bg-destructive/5 rounded-md">
        {t("dashboard.stats.error", "Nu am putut încărca statisticile:")} {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {CARDS_CONFIG.map((card) => {
        const Icon = card.icon;
        // Valoarea extrasă este garantat un număr acum
        const value = stats ? stats[card.key] : 0;

        return (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t(card.titleKey, card.defaultTitle)}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {value}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}