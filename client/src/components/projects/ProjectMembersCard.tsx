import { useTranslation } from "react-i18next";
import type { Project } from "../../types/project.types";
interface MembersCardProps {
  projectData: Project;
}

export const ProjectMembersCard = ({ projectData }: MembersCardProps) => {
  const { t } = useTranslation();
  
  const members = projectData.members || [];
  const tasks = projectData.tasks || [];

const getUserTaskCount = (userId: number) => {
    return tasks.filter((task) => 
      task.assignees?.some((assignee) => assignee.user?.id === userId)
    ).length;
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-slate-800 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t("projects.members.title", "TEAM")}
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {members.map((member) => {
            const user = member.user;
            if (!user) return null;
            
            const taskCount = getUserTaskCount(user.id);
            const initials = user.name 
              ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) 
              : "??";

            return (
              <div key={member.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-sm flex items-center justify-center border border-indigo-100">
                      {initials}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 leading-snug">{user.name}</h4>
                    <p className="text-xs text-slate-400 font-medium capitalize">
                      {user.role?.toLowerCase().replace("_", " ") || "Member"}
                    </p>
                  </div>
                </div>
                
                <span className="text-xs font-mono font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                  {taskCount} tasks
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};