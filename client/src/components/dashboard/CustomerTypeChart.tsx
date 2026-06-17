import { useTranslation } from "react-i18next";
import { Bar, BarChart, XAxis, CartesianGrid, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "../../hooks/useDashboard";
import type { CustomerType } from "../../types/dashboard.types";

const TYPE_COLORS: Record<CustomerType, string> = {
  individual: "#10b981", // emerald
  company:    "#3b82f6", // blue
};

const chartConfig: ChartConfig = {
  count: { label: "Clienți" },
};

export function CustomerTypeChart() {
  const { t } = useTranslation();

  const TYPE_LABELS: Record<CustomerType, string> = {
    individual: t("dashboard.customerType.individual", "Persoane fizice"),
    company:    t("dashboard.customerType.company",    "Firme"),
  };

  const { customerTypeBreakdown, isLoading, error } = useDashboard();

  const chartData = customerTypeBreakdown?.map((item) => ({
    typeKey: item.status as CustomerType,
    type: TYPE_LABELS[item.status as CustomerType] || item.status,
    count: item.count,
  }));

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t("dashboard.customerType.title", "Clienți după tip")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-destructive font-medium">
          {t("dashboard.customerType.error", "Nu am putut încărca datele:")} {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {t("dashboard.customerType.title", "Clienți după tip")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !chartData ? (
          <Skeleton className="h-[220px] w-full rounded-md" />
        ) : (
          <ChartContainer config={chartConfig} className="max-h-[260px] w-full">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                className="stroke-muted"
              />
              <XAxis
                dataKey="type"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs fill-muted-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.typeKey}
                    fill={TYPE_COLORS[entry.typeKey] ?? "#64748b"}
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