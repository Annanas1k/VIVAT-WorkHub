import { useTranslation } from "react-i18next";
import type { Project } from "../../types/project.types";
import { 
  HiOutlineUser, 
  HiOutlineCalendar, 
  HiOutlineBanknotes, 
  HiOutlineDocumentText, 
  HiOutlineArrowPath 
} from "react-icons/hi2";

interface DetailCardProps {
  projectData: Project;
}

export const DetailsCard = ({ projectData }: DetailCardProps) => {
  const { t } = useTranslation();

  const formatDate = (date: any) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">
        {t("projects.overview.title", "DETALII PROIECT")}
      </h3>
      
      <div className="flex flex-col gap-4">
        {/* Client */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-400 flex items-center gap-2 shrink-0 font-medium">
            <HiOutlineUser className="w-4 h-4 text-slate-400" />
            {t("projects.overview.customer")}
          </span>
          <span className="text-slate-800 font-semibold text-right break-words max-w-[70%]">
            {projectData.customer?.name || "—"}
          </span>
        </div>
        <hr className="border-slate-100" />

        {/* Dată Start */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-400 flex items-center gap-2 shrink-0 font-medium">
            <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
            {t("projects.overview.startDate")}
          </span>
          <span className="text-slate-700 font-medium text-right font-mono text-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            {formatDate(projectData.startDate)}
          </span>
        </div>
        <hr className="border-slate-100" />

        {/* Termen Limită */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-400 flex items-center gap-2 shrink-0 font-medium">
            <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
            {t("projects.overview.dueDate")}
          </span>
          <span className="text-slate-700 font-medium text-right font-mono text-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            {formatDate(projectData.dueDate)}
          </span>
        </div>
        <hr className="border-slate-100" />

        {/* Buget */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-400 flex items-center gap-2 shrink-0 font-medium">
            <HiOutlineBanknotes className="w-4 h-4 text-slate-400" />
            {t("projects.overview.budget")}
          </span>
          <span className="text-emerald-600 font-bold text-right font-mono text-base">
            {projectData.budget ? `${Number(projectData.budget).toLocaleString()} $` : "0 $"}
          </span>
        </div>
        <hr className="border-slate-100" />

        {/* Descriere Restructurată pentru un Aspect mai Frumos */}
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-slate-400 flex items-center gap-2 font-medium">
            <HiOutlineDocumentText className="w-4 h-4 text-slate-400" />
            {t("projects.overview.description")}
          </span>
          <div className="w-full bg-slate-50/60 border border-slate-100 rounded-lg p-3.5 text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">
            {projectData.description || (
              <span className="text-slate-400 italic">{t("projects.overview.no_description", "Nu există o descriere adăugată pentru acest proiect.")}</span>
            )}
          </div>
        </div>
        <hr className="border-slate-100" />

        {/* Ultima Actualizare */}
        <div className="flex items-center justify-between gap-4 text-sm pt-1">
          <span className="text-slate-400 flex items-center gap-2 shrink-0 font-medium">
            <HiOutlineArrowPath className="w-4 h-4 text-slate-400" />
            {t("projects.overview.updatedAt")}
          </span>
          <span className="text-slate-500 text-right text-xs font-mono">
            {formatDate(projectData.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};