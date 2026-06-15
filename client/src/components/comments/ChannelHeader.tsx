import React from "react";
import { useTranslation } from "react-i18next";

interface ChannelHeaderProps {
  projectId: string | undefined;
  currentUserName?: string;
}

export const ChannelHeader: React.FC<ChannelHeaderProps> = ({ projectId, currentUserName }) => {
  const { t } = useTranslation();

  return (
    <header className="h-14 flex items-center px-5 bg-white border-b border-slate-200 shrink-0 gap-3 select-none">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xl font-bold text-slate-300">#</span>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-slate-800 leading-tight truncate">
            {t("project.channel", { id: projectId })}
          </h1>
          <p className="text-[10px] text-slate-400 leading-tight hidden sm:block">
            {t("project.discussion_channel")}
          </p>
        </div>
      </div>

      <div className="flex items-center bg-slate-100 rounded-lg px-2.5 py-1.5 shrink-0">
        <span className="text-[11px] font-medium text-slate-600 truncate max-w-30">
          {currentUserName}
        </span>
      </div>
    </header>
  );
};