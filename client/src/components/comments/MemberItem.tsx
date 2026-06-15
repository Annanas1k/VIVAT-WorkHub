import React from "react";
import { useTranslation } from "react-i18next";
import type { ProjectMember } from "../../types/members.type";
import { getAvatarBg, getInitials } from "../../hooks/useProjectMembers";

interface MemberItemProps {
  member: ProjectMember;
  currentUserId?: number;
}

export const MemberItem: React.FC<MemberItemProps> = ({ member, currentUserId }) => {
  const { t } = useTranslation();
  const isMe = member.userId === currentUserId;
  const name = member.user.name;
  
  const initials = getInitials(name);
  const avatarBg = isMe ? "bg-violet-600" : getAvatarBg(name);

  return (
    <li className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${avatarBg}`}>
        {member.user.avatar ? (
          <img src={member.user.avatar} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-700 truncate leading-tight">
          {name}
          {isMe && <span className="ml-1 text-[9px] font-semibold text-violet-400">({t("project.you")})</span>}
        </p>
        <p className="text-[10px] text-slate-400 truncate leading-tight capitalize">
          {member.role}
        </p>
      </div>
    </li>
  );
};