// components/projects/MetricCard.tsx  (înlocuiește Card.tsx)
import type { IconType } from "react-icons";
import { useTranslation } from "react-i18next";

interface CardProps {
  icon: IconType;
  title: string;
  count: number | string;
  text: string;
  countColor?: string;
  textColor?: string;
  iconBg?: string;
  iconColor?: string;
}

export const Card = ({
  icon: Icon,
  title,
  count,
  text,
  countColor,
  textColor,
  iconBg,
  iconColor,
}: CardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5 flex items-center gap-3 flex-1 min-w-52">
      <div className={`w-10 h-10 rounded-lg flex items-center border border-gray-200 justify-center shrink-0 ${iconBg}`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 mb-0.5 truncate">{t(title)}</p>
        <p className={`text-2xl font-semibold leading-tight tracking-tight ${countColor ?? "text-slate-800"}`}>
          {count}
        </p>
        <p className={`text-[11px] mt-0.5 truncate ${textColor ?? "text-slate-400"}`}>
          {t(text)}
        </p>
      </div>
    </div>
  );
};