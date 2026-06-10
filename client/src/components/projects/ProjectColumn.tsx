import { useTranslation } from "react-i18next";
import { Droppable, Draggable } from '@hello-pangea/dnd';
import type { Project, ProjectStatus } from '../../types/project.types';
import { ProjectCard } from './ProjectCard';

type Props = {
  id: ProjectStatus;
  titleKey: string;
  color: string;
  projects: Project[];
  canDrag: boolean;
};

export const ProjectColumn = ({ id, titleKey, color, projects, canDrag }: Props) => {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col rounded-xl border border-gray-100 bg-white p-3 min-h-125 border-t-4 shadow-sm ${color}`}>

      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          {t(titleKey, id.replace('_', ' '))}
        </h3>
        <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded-full">
          {projects.length}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2.5 flex-1 rounded-lg p-1 transition-colors ${
              snapshot.isDraggingOver ? 'bg-indigo-50/60' : 'bg-transparent'
            }`}
          >
            {projects.map((project, index) => (
              <Draggable
                key={project.id}
                draggableId={project.id.toString()}
                index={index}
                isDragDisabled={!canDrag}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ProjectCard
                      project={project}
                      isDragging={snapshot.isDragging}
                      canDrag={canDrag}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {projects.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-300 py-8">
                {t('projects.empty_column', 'No projects')}
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};