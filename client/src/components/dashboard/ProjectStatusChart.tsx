import { useTranslation } from "react-i18next";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "../../hooks/useDashboard";
import type { ProjectStatus } from "../../types/dashboard.types";

export function ProjectStatusChart() {
  const { t } = useTranslation();

  const STATUS_LABELS: Record<ProjectStatus, string> = {
    active: t("dashboard.statusLabels.active", "Active"),
    on_hold: t("dashboard.statusLabels.onHold", "În așteptare"),
    completed: t("dashboard.statusLabels.completed", "Finalizate"),
    cancelled: t("dashboard.statusLabels.cancelled", "Anulate"),
  };

const chartConfig: ChartConfig = {
  active:    { label: t("dashboard.statusLabels.active", "Active"),         color: "#10b981" }, // emerald
  on_hold:   { label: t("dashboard.statusLabels.onHold", "În așteptare"),   color: "#f59e0b" }, // amber
  completed: { label: t("dashboard.statusLabels.completed", "Finalizate"),  color: "#3b82f6" }, // blue
  cancelled: { label: t("dashboard.statusLabels.cancelled", "Anulate"),     color: "#ef4444" }, // red
};

  const { projectStatusBreakdown, isLoading, error } = useDashboard();

  const chartData = projectStatusBreakdown?.map((item) => ({
    status: item.status,
    label: STATUS_LABELS[item.status] || item.status,
    count: item.count,
    fill: `var(--color-${item.status})`,
  }));

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t("dashboard.projectStatus.title", "Proiecte după status")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-destructive font-medium">
          {t("dashboard.projectStatus.error", "Nu am putut încărca datele graficului:")} {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium">
          {t("dashboard.projectStatus.title", "Proiecte după status")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {isLoading || !chartData ? (
          <div className="flex h-[260px] items-center justify-center">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[260px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
              <Pie 
                data={chartData} 
                dataKey="count" 
                nameKey="status" 
                innerRadius={60} 
                strokeWidth={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="status" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}