import React from "react";

interface Author {
  id: number;
  name: string;
  avatar: string;
}

interface MessageRendererProps {
  owned: number | string;
  author: Author;
  date: Date;
  children: React.ReactNode | (() => React.ReactNode);
}

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(date: Date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageRenderer({
  owned,
  author,
  date,
  children,
}: MessageRendererProps) {
  const isOwned = String(owned) === String(author.id);

  return (
    <div className="group flex gap-3 px-5 py-3 hover:bg-slate-50/80 transition-colors">
      {/* Avatar */}
      <div
        className={`
          shrink-0 w-7 h-7 rounded-full flex items-center justify-center
          text-white text-[10px] font-bold select-none overflow-hidden mt-0.5
          ${isOwned ? "bg-violet-600" : getAvatarColor(author.name)}
        `}
      >
        {author.avatar ? (
          <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
        ) : (
          getInitials(author.name)
        )}
      </div>

      {/* Conținut */}
      <div className="flex-1 min-w-0">
        {/* Meta */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`text-[12px] font-semibold leading-none ${isOwned ? "text-violet-700" : "text-slate-800"}`}>
            {author.name}
          </span>
          <span className="text-[10px] text-slate-400 leading-none">
            {formatDate(date)}
          </span>
        </div>

        {/* Text */}
        <div className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
          {typeof children === "function" ? children() : children}
        </div>
      </div>
    </div>
  );
}