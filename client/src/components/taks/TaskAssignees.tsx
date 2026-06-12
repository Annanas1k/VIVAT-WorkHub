import { useTranslation } from "react-i18next";
import { HiOutlineUsers, HiOutlineUserPlus } from "react-icons/hi2";
import type { UserData } from "../../types/auth.types";
// 1. Importă tipul original TaskAssignee (ajustează calea dacă e diferită în proiectul tău)
import type { TaskAssignee } from "../../types/task.types"; 

// 2. Extindem tipul nativ din Prisma pentru a include și relația cu User-ul din backend
type AssigneeWithUser = TaskAssignee & {
  user: UserData;
};

interface TaskAssigneesProps {
  // 3. Folosim noul tip extins
  assignees?: AssigneeWithUser[] | null;
  onAddAssigneeClick?: () => void;
}

export const TaskAssignees = ({ assignees, onAddAssigneeClick }: TaskAssigneesProps) => {
  const { t } = useTranslation();

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="w-full  p-5  text-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <HiOutlineUsers className="w-4 h-4 text-slate-700" />
          {t("tasks.details.assignees.title", "Membri Alocați")}
        </h3>
        {onAddAssigneeClick && (
          <button onClick={onAddAssigneeClick} className="text-slate-700 hover:text-indigo-600 p-1 rounded-lg hover:bg-slate-50 transition-colors">
            <HiOutlineUserPlus className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {!assignees || assignees.length === 0 ? (
          <p className="text-xs text-slate-700 italic py-2">
            {t("tasks.details.assignees.empty", "Niciun membru alocat pentru acest task.")}
          </p>
        ) : (
          assignees.map((assignee) => {
            const member = assignee.user;
            if (!member) return null;

            return (
              <div key={assignee.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50/80 border border-transparent hover:border-slate-100 transition-all group">
                <div className="flex items-center gap-3">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center border border-indigo-100 shrink-0 uppercase">
                      {getInitials(member.name)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                      {member.name}
                    </span>
                    {member.role && (
                      <span className="text-[11px] text-slate-700 font-medium capitalize">
                        {member.role.toLowerCase().replace("_", " ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};