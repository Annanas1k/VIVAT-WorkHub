import { useTranslation } from "react-i18next";
import { StatsCards } from "../components/dashboard/StatsCards";
import { ProjectStatusChart } from "../components/dashboard/ProjectStatusChart";
import { CustomerTypeChart } from "../components/dashboard/CustomerTypeChart";
import { UserRolesChart } from "../components/dashboard/UserRolesChart";
import { ActivityHeatmap } from "../components/dashboard/ActivityHeatmap";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { MyProjects } from "../components/dashboard/MyProjects";
import { UpcomingDeadlines } from "../components/dashboard/UpcomingDeadlines";
import { RecentComments } from "../components/dashboard/RecentComments";
import { RecentFiles } from "../components/dashboard/RecentFiles";
import { DashboardProvider } from "@/context/DashboardProvider";

export function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("dashboard.page.title", "Dashboard")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.page.subtitle", "Sumar al activității din VIVAT WorkHub")}
        </p>
      </div>

      <DashboardProvider>
        {/* Rând 1 — Statistici */}
        <StatsCards />

        {/* Rând 2 — Grafice */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ProjectStatusChart />
          <CustomerTypeChart />
          <UserRolesChart />
        </div>

        {/* Rând 3 — Activitate (heatmap + feed) și Proiecte + Termene */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

          {/* Coloana stângă — heatmap + feed unite vizual */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <ActivityHeatmap />
            <ActivityFeed />
          </div>

          {/* Coloana dreaptă — proiecte + termene */}
          <div className="flex flex-col gap-4">
            <MyProjects />
            <UpcomingDeadlines />
          </div>

        </div>

        {/* Rând 4 — Comentarii + Fișiere */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RecentComments />
          <RecentFiles />
        </div>

      </DashboardProvider>
    </div>
  );
}

export default DashboardPage;