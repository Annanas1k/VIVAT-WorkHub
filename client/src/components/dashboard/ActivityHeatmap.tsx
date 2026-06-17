import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboard } from "../../hooks/useDashboard";

const WEEKS = 53;

const LEVEL_COLORS = [
  "bg-muted",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-300 dark:bg-emerald-800",
  "bg-emerald-500 dark:bg-emerald-700",
  "bg-emerald-700 dark:bg-emerald-500",
];

interface HeatmapDay {
  date: Date;
  count: number;
  level: number;
  inRange: boolean;
}

function getLevel(count: number, max: number) {
  if (count === 0 || max === 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function buildWeeks(countsByDate: Map<string, number>): HeatmapDay[][] {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - (WEEKS * 7 - 1));
  start.setDate(start.getDate() - start.getDay());

  const max = Math.max(0, ...countsByDate.values());
  const days: HeatmapDay[] = [];

  for (let i = 0; i < WEEKS * 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = date.toISOString().slice(0, 10);
    const count = countsByDate.get(key) ?? 0;
    days.push({ date, count, level: getLevel(count, max), inRange: date <= today });
  }

  const weeks: HeatmapDay[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    weeks.push(days.slice(w * 7, w * 7 + 7));
  }
  return weeks;
}

export function ActivityHeatmap() {
  const { t, i18n } = useTranslation();
  const { activityHeatmap, isLoading, error } = useDashboard();

  const weeks = useMemo(() => {
    if (!activityHeatmap) return null;
    const countsByDate = new Map(activityHeatmap.map((d) => [d.date, d.count]));
    return buildWeeks(countsByDate);
  }, [activityHeatmap]);

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t("dashboard.heatmap.title", "Activitatea ta în ultimul an")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-destructive font-medium">
          {t("dashboard.heatmap.error", "Nu am putut încărca datele hărții termice:")} {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {t("dashboard.heatmap.title", "Activitatea ta în ultimul an")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !weeks ? (
          <Skeleton className="h-[140px] w-full rounded-md" />
        ) : (
          <TooltipProvider delayDuration={150}>
            <div className="flex gap-[3px] overflow-x-auto pb-2 scrollbar-thin">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => (
                    <Tooltip key={di}>
                      <TooltipTrigger asChild>
                        <div
                          className={`h-[11px] w-[11px] rounded-sm transition-colors ${
                            day.inRange ? LEVEL_COLORS[day.level] : "bg-transparent"
                          }`}
                        />
                      </TooltipTrigger>
                      {day.inRange && (
                        <TooltipContent className="text-xs">
                          {t("dashboard.heatmap.tooltipContent", "{{count}} acțiuni pe", { count: day.count })}{" "}
                          {day.date.toLocaleDateString(i18n.language, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
              ))}
            </div>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
}