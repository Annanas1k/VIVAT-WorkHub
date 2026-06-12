import { useTranslation } from "react-i18next";
import { 
  HiOutlineSquares2X2, 
  HiOutlineFlag, 
  HiOutlineCalendar, 
  HiOutlineFolder, 
  HiOutlineClock,
  HiOutlineUser 
} from "react-icons/hi2";
import type { UserData } from "../../types/auth.types";

interface TaskDetailsProps {
  status: string;
  priority: string;
  createdAt: Date | string;
  dueDate: Date | string;
  projectId?: number | null;
  updatedAt?: Date | string;
  createdById?: number | null;
  createdBy?: UserData | null;
  project?: {
    id: number;
    name: string;
  } | null;
  // 1. Adăugăm funcția de callback în props pentru a trimite valoarea nouă în pagină
  onStatusChange: (newStatus: string) => void; 
}

export const TaskDetails = ({ 
  status, 
  priority, 
  createdAt, 
  dueDate, 
  updatedAt, 
  project,
  createdBy,
  onStatusChange // Destructurăm noua funcție
}: TaskDetailsProps) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('ro-RO', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const initials = createdBy?.name
    ? createdBy.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const statusStyles: Record<string, string> = {
    backlog: "bg-slate-100 text-slate-600 border-slate-200 focus:ring-slate-200",
    todo: "bg-blue-50 text-blue-600 border-blue-100 focus:ring-blue-200",
    in_progress: "bg-indigo-50 text-indigo-600 border-indigo-100 focus:ring-indigo-200",
    review: "bg-purple-50 text-purple-600 border-purple-100 focus:ring-purple-200",
    done: "bg-emerald-50 text-emerald-600 border-emerald-100 focus:ring-emerald-200",
  };

  const priorityStyles: Record<string, string> = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    medium: "bg-amber-50 text-amber-700 border-amber-100",
    high: "bg-rose-50 text-rose-600 border-rose-100",
    urgent: "bg-red-100 text-red-700 border-red-200 font-bold",
  };

  return (
    <div className="w-full rounded-xl p-5 text-slate-800">
      <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-5">
        {t("tasks.details.sidebar.title", "DETAILS")}
      </h3>

      <div className="flex flex-col gap-4">
        {/* Status Dropdown */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-700 flex items-center gap-2 font-medium shrink-0">
            <HiOutlineSquares2X2 className="w-4 h-4 text-slate-700" />
            {t("tasks.details.status", "Status")}
          </span>
          
          {/* 2. Înlocuit span-ul cu un select interactiv */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize cursor-pointer focus:outline-none focus:ring-2 transition-all appearance-none text-center ${
              statusStyles[status] || "bg-slate-100"
            }`}
          >
            <option value="backlog" className="text-slate-800 bg-white">{t("status.backlog", "Backlog")}</option>
            <option value="todo" className="text-slate-800 bg-white">{t("status.todo", "To Do")}</option>
            <option value="in_progress" className="text-slate-800 bg-white">{t("status.in_progress", "In Progress")}</option>
            <option value="review" className="text-slate-800 bg-white">{t("status.review", "Review")}</option>
            <option value="done" className="text-slate-800 bg-white">{t("status.done", "Done")}</option>
          </select>
        </div>
        <hr className="border-slate-100" />

        {/* Prioritate */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-700 flex items-center gap-2 font-medium shrink-0">
            <HiOutlineFlag className="w-4 h-4 text-slate-700" />
            {t("tasks.details.priority", "Priority")}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
            priorityStyles[priority] || "bg-slate-50 text-slate-600"
          }`}>
            {priority}
          </span>
        </div>
        <hr className="border-slate-100" />

        {/* Proiect Părinte */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-700 flex items-center gap-2 font-medium shrink-0">
            <HiOutlineFolder className="w-4 h-4 text-slate-700" />
            {t("tasks.details.project", "Project")}
          </span>
          <span className="text-slate-800 font-semibold truncate max-w-[60%] text-right">
            {project?.name || t("tasks.details.no_project", "Fără proiect")}
          </span>
        </div>
        <hr className="border-slate-100" />

        {/* Data Limită */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-700 flex items-center gap-2 font-medium shrink-0">
            <HiOutlineCalendar className="w-4 h-4 text-slate-700" />
            {t("tasks.details.dueDate", "Due Date")}
          </span>
          <span className="text-slate-700 font-medium text-right font-mono text-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            {formatDate(dueDate)}
          </span>
        </div>
        <hr className="border-slate-100" />

        {/* Secțiunea: Creat de */}
        <div className="flex items-start justify-between gap-4 text-sm">
          <span className="text-slate-700 flex items-center gap-2 font-medium shrink-0 pt-1">
            <HiOutlineUser className="w-4 h-4 text-slate-700" />
            {t("tasks.details.createdBy", "Created By")}
          </span>
          
          {createdBy ? (
            <div className="flex items-center gap-2.5 text-right">
              <div className="flex flex-col">
                <span className="text-slate-800 font-semibold leading-snug">{createdBy.name}</span>
                {createdBy.role && (
                  <span className="text-[11px] text-slate-700 font-medium capitalize">
                    {createdBy.role.toLowerCase().replace("_", " ")}
                  </span>
                )}
              </div>
              
              {createdBy.avatar ? (
                <img 
                  src={createdBy.avatar} 
                  alt={createdBy.name} 
                  className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center border border-indigo-100 shrink-0">
                  {initials}
                </div>
              )}
            </div>
          ) : (
            <span className="text-slate-500 font-medium">—</span>
          )}
        </div>
        <hr className="border-slate-100" />

        {/* Data Creării */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-700 flex items-center gap-2 font-medium shrink-0">
            <HiOutlineClock className="w-4 h-4 text-slate-700" />
            {t("tasks.details.createdAt", "Created At")}
          </span>
          <span className="text-slate-500 text-right text-xs font-mono">
            {formatDate(createdAt)}
          </span>
        </div>

        {/* Dată Actualizare */}
        {updatedAt && (
          <>
            <hr className="border-slate-100" />
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-700 flex items-center gap-2 font-medium shrink-0">
                <HiOutlineClock className="w-4 h-4 text-slate-700" />
                {t("tasks.details.updatedAt", "Updated At")}
              </span>
              <span className="text-slate-500 text-right text-xs font-mono">
                {formatDate(updatedAt)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};