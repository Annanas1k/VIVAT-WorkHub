import { useTranslation } from "react-i18next";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "../../hooks/useDashboard";
import type { UserRole } from "../../types/dashboard.types";

const ROLE_COLORS: Record<UserRole, string> = {
  admin:     "#ef4444", // red
  manager:   "#f59e0b", // amber
  team_lead: "#10b981", // emerald
  front_dev: "#3b82f6", // blue
  back_dev:  "#8b5cf6", // violet
  qa:        "#ec4899", // pink
  designer:  "#06b6d4", // cyan
  member:    "#64748b", // slate
};

const chartConfig: ChartConfig = {
  count: { label: "Useri" },
};

export function UserRolesChart() {
  const { t } = useTranslation();

  const ROLE_LABELS: Record<UserRole, string> = {
    admin:     t("dashboard.userRoles.admin",     "Admin"),
    manager:   t("dashboard.userRoles.manager",   "Manager"),
    team_lead: t("dashboard.userRoles.teamLead",  "Team lead"),
    front_dev: t("dashboard.userRoles.frontDev",  "Front-end dev"),
    back_dev:  t("dashboard.userRoles.backDev",   "Back-end dev"),
    qa:        t("dashboard.userRoles.qa",        "QA"),
    designer:  t("dashboard.userRoles.designer",  "Designer"),
    member:    t("dashboard.userRoles.member",    "Membru"),
  };

  const { userRoleBreakdown, isLoading, error } = useDashboard();

  const chartData = userRoleBreakdown
    ?.map((item) => ({
      roleKey: item.status as UserRole,
      role: ROLE_LABELS[item.status as UserRole] || item.status,
      count: item.count,
    }))
    .sort((a, b) => b.count - a.count);

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t("dashboard.userRoles.title", "Useri după rol")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-destructive font-medium">
          {t("dashboard.userRoles.error", "Nu am putut încărca datele:")} {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {t("dashboard.userRoles.title", "Useri după rol")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !chartData ? (
          <Skeleton className="h-[260px] w-full rounded-md" />
        ) : (
          <ChartContainer config={chartConfig} className="max-h-[260px] w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 16, bottom: 5 }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                className="stroke-muted"
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="role"
                type="category"
                tickLine={false}
                axisLine={false}
                width={100}
                className="text-xs fill-muted-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.roleKey}
                    fill={ROLE_COLORS[entry.roleKey] ?? "#64748b"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}