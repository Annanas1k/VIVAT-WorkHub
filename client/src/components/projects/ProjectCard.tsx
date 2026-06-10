import { memo } from "react";
import { Link } from "react-router";
import { MdCalendarToday } from "react-icons/md";
import type { Project } from '../../types/project.types';

type Props = {
  project: Project;
  isDragging: boolean;
  canDrag: boolean;
};

export const ProjectCard = memo(({ project, isDragging, canDrag }: Props) => (
  <div
    className={`bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2 transition-all ${
      !canDrag ? 'cursor-pointer hover:border-gray-300' : 'cursor-grab active:cursor-grabbing'
    } ${
      isDragging
        ? 'ring-2 ring-indigo-400/30 border-indigo-300 shadow-md scale-[1.02]'
        : 'hover:shadow hover:border-gray-200'
    }`}
  >
    <div className="flex flex-col gap-0.5">
      <Link
        to={`/projects/${project.id}/overview`}
        className="text-sm font-semibold text-gray-900 line-clamp-1 hover:text-indigo-600 hover:underline"
      >
        {project.name}
      </Link>
      {project.description && (
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      )}
    </div>

    <div className="flex items-center justify-between border-t border-gray-50 pt-2 mt-1">
      <span className="font-mono text-[11px] text-gray-400">#PRJ-{project.id}</span>
      <div className="flex items-center gap-2">
        {project.dueDate && (
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <MdCalendarToday size={11} />
            {new Date(project.dueDate).toLocaleDateString()}
          </span>
        )}
        {project.members && project.members.length > 0 && (
          <div className="flex -space-x-1.5">
            {project.members.slice(0, 3).map(m => (
              <div
                key={m.id}
                title={m.user?.name}
                className="w-5 h-5 rounded-full bg-indigo-100 border border-white text-[9px] font-bold text-indigo-600 flex items-center justify-center uppercase overflow-hidden"
              >
                {m.user?.avatar ? (
                  <img src={m.user.avatar} alt={m.user?.name || ''} className="w-full h-full object-cover" />
                ) : (
                  <span>{m.user?.name?.charAt(0) || '?'}</span>
                )}
              </div>
            ))}
            {project.members.length > 3 && (
              <div className="w-5 h-5 rounded-full bg-gray-100 border border-white text-[9px] font-bold text-gray-500 flex items-center justify-center">
                +{project.members.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
));