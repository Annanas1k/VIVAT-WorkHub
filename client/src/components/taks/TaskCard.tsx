import { memo } from 'react';
import { MdCalendarToday } from 'react-icons/md';
import type { Task } from '../../types/task.types';

const PRIORITY_BADGE: Record<string, string> = {
  low:    'bg-gray-100 text-gray-500',
  medium: 'bg-blue-50 text-blue-600',
  high:   'bg-amber-50 text-amber-600',
  urgent: 'bg-red-50 text-red-600',
};

type Props = { task: Task; isDragging: boolean; onClick: () => void };

export const TaskCard = memo(({ task, isDragging, onClick }: Props) => (
  <div
    onClick={onClick}
    className={`bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2 cursor-pointer transition-all hover:shadow hover:border-gray-200 ${
      isDragging ? 'ring-2 ring-indigo-400/30 border-indigo-300 shadow-md scale-[1.02]' : ''
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">{task.title}</p>
      <span className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${PRIORITY_BADGE[task.priority] ?? PRIORITY_BADGE.medium}`}>
        {task.priority}
      </span>
    </div>

    {task.description && (
      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{task.description}</p>
    )}

    <div className="flex items-center justify-between border-t border-gray-50 pt-2 mt-1">
      <span className="font-mono text-[10px] text-gray-300">#{task.id}</span>
      <div className="flex items-center gap-2">
        {task.dueDate && (
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <MdCalendarToday size={10} />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-1.5">
            {task.assignees.slice(0, 3).map(a => (
              <div
                key={a.id}
                title={a.user?.name}
                className="w-5 h-5 rounded-full bg-indigo-100 border border-white text-[9px] font-bold text-indigo-600 flex items-center justify-center uppercase overflow-hidden"
              >
                {a.user?.avatar
                  ? <img src={a.user.avatar} alt={a.user.name} className="w-full h-full object-cover" />
                  : a.user?.name?.charAt(0) ?? '?'
                }
              </div>
            ))}
            {task.assignees.length > 3 && (
              <div className="w-5 h-5 rounded-full bg-gray-100 border border-white text-[9px] font-bold text-gray-500 flex items-center justify-center">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
));