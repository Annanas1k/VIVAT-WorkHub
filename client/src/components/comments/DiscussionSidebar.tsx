import React from "react";
import { useTranslation } from "react-i18next";
import { MemberItem } from "./MemberItem";
import type { ProjectMember } from "../../types/members.type";

interface DiscussionSidebarProps {
  members: ProjectMember[];
  loading: boolean;
  currentUser?: { id?: number; name?: string; avatar?: string };
}

export const DiscussionSidebar: React.FC<DiscussionSidebarProps> = ({
  members,
  loading,
  currentUser,
}) => {
  const { t } = useTranslation();

  return (
    <aside className="hidden lg:flex flex-col w-56 border-l border-slate-100 bg-slate-50/60 shrink-0 h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {t("project.members")}
          {!loading && (
            <span className="ml-1.5 font-normal text-slate-300">
              {members.length}
            </span>
          )}
        </p>
      </div>

      {/* Lista */}
      <ul className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {loading ? (
          <li className="flex justify-center pt-8">
            <div className="w-4 h-4 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
          </li>
        ) : (
          members.map((member) => (
            <MemberItem
              key={member.id}
              member={member}
              currentUserId={currentUser?.id}
            />
          ))
        )}
      </ul>

      {/* Current user footer */}
      {currentUser && (
        <div className="px-3 py-3 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-[9px] font-bold uppercase shrink-0">
              {currentUser.name?.charAt(0) ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-700 truncate leading-tight">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-[9px] text-slate-400">
                  {t("project.online")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};