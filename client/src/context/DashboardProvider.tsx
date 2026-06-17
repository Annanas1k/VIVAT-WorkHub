import { useDashboardInternal } from "@/hooks/useDashboardInternal";
import { DashboardContext } from "./createContex";
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const value = useDashboardInternal(); // logica din useDashboard
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}