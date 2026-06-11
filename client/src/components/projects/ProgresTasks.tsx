import { useTranslation } from "react-i18next";
import type { Project } from "../../types/project.types";

interface TaskProgressCardProps {
  projectData: Project;
}

export const TaskProgressCard = ({ projectData }: TaskProgressCardProps) => {
  const { t } = useTranslation();
  const tasks = projectData.tasks || [];
  const totalTasks = tasks.length;

  const countByStatus = (status: string) => tasks.filter((t) => t.status === status).length;

  const backlogCount = countByStatus("backlog");
  const toDoCount = countByStatus("todo");
  const inProgressCount = countByStatus("in_progress");
  const reviewCount = countByStatus("review");
  const doneCount = countByStatus("done");

  const generalProgress = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;
  const getPercentage = (count: number) => (totalTasks > 0 ? (count / totalTasks) * 100 : 0);

  return (
    <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-slate-800">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
        {t("projects.analytics.title", "PROGRES TASKS")}
      </h3>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-center mb-1.5 text-sm font-medium">
            <span className="text-slate-700">{t("projects.analytics.general", "TOTAL PROJECT")}</span>
            <span className="font-semibold font-mono">{generalProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${generalProgress}%` }}
            />
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                backlog
              </span>
              <span className="text-slate-500 font-mono">{backlogCount} tasks</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-400 rounded-full transition-all duration-500" 
                style={{ width: `${getPercentage(backlogCount)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-600 border border-slate-200/60">
                to do
              </span>
              <span className="text-slate-500 font-mono">{toDoCount} tasks</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 rounded-full transition-all duration-500" 
                style={{ width: `${getPercentage(toDoCount)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-medium bg-yelow-50 text-yellow-600 border border-blue-100">
                in progress
              </span>
              <span className="text-slate-500 font-mono">{inProgressCount} tasks</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-600 rounded-full transition-all duration-500" 
                style={{ width: `${getPercentage(inProgressCount)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-medium bg-purple-50 text-purple-600 border border-purple-100">
                review
              </span>
              <span className="text-slate-500 font-mono">{reviewCount} tasks</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                style={{ width: `${getPercentage(reviewCount)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                done
              </span>
              <span className="text-slate-500 font-mono">{doneCount} tasks</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${getPercentage(doneCount)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};