import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { HiOutlineArrowLeft } from 'react-icons/hi2';

interface TaskHeaderProps {
  id: number;
  title: string;
  description?: string | null;
}

export const TaskHeader = ({ id, title, description }: TaskHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="w-full px-6 py-5 flex flex-col gap-4  text-slate-800">
      {/* Rândul de navigare și ID */}
      <div className="flex items-center justify-between w-full">
        <button 
          onClick={handleBack} 
          type="button"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 transition-all active:scale-[0.98]"
        >
          <HiOutlineArrowLeft className="w-3.5 h-3.5" />
          {t('tasks.details.header.back', 'Înapoi')}
        </button>

        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
          #task-{id}
        </span>
      </div>

      {/* Titlul și Descrierea Task-ului */}
      <div className="flex flex-col gap-2 max-w-4xl">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        
        {description ? (<div>
          <p className='text-xs mt-4 mb-2 text-gray-400'>{t('description', 'description')}</p>
          <p className="text-sm text-slate-500 leading-relaxed font-medium whitespace-pre-wrap">
            {description}
          </p>
        </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            {t('tasks.details.header.no_description', 'without descriptin')}
          </p>
        )}
      </div>
    </div>
  );
};