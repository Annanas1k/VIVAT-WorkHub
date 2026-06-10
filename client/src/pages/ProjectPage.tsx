import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import type { Project, ProjectStatus } from '../types/project.types';
import { useEffect, useState, useMemo } from "react";
import { getAllProjects, updateProject } from "../services/project.service";
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { MdFolderSpecial, MdAdd } from "react-icons/md";
import { ProjectColumn } from "../components/projects/ProjectColumn";
import { BeatLoader } from "react-spinners";
const COLUMNS: { id: ProjectStatus; titleKey: string; color: string }[] = [
  { id: 'active',    titleKey: 'projects.status.active',    color: 'border-t-emerald-500' },
  { id: 'on_hold',   titleKey: 'projects.status.on_hold',   color: 'border-t-amber-500'   },
  { id: 'completed', titleKey: 'projects.status.completed', color: 'border-t-indigo-500'  },
  { id: 'cancelled', titleKey: 'projects.status.cancelled', color: 'border-t-rose-500'    },
];

export const ProjectPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);

  const canManage = user?.role === 'admin' || user?.role === 'manager';
  const canDrag   = canManage || user?.role === 'team_lead';

  useEffect(() => {
    getAllProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columnsData = useMemo(() => {
    const board: Record<ProjectStatus, Project[]> = {
      active: [], on_hold: [], completed: [], cancelled: [],
    };
    projects.forEach(p => {
      if (board[p.status]) board[p.status].push(p);
    });
    return board;
  }, [projects]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const projectId  = Number(draggableId);
    const nextStatus = destination.droppableId as ProjectStatus;
    const origStatus = source.droppableId as ProjectStatus;

    setProjects(prev =>
      prev.map(p => p.id === projectId ? { ...p, status: nextStatus } : p)
    );

    try {
      await updateProject(projectId, { status: nextStatus });
    } catch {
      setProjects(prev =>
        prev.map(p => p.id === projectId ? { ...p, status: origStatus } : p)
      );
    }
  };

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <BeatLoader size={15} color="#4D179A" aria-label="Loading spinner" loading={loading} />
            </div>
        )
    }

  return (
    <section className="p-3 min-h-screen bg-gray-50/50 flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MdFolderSpecial className="text-indigo-600" size={22} />
            {t('projects.board_title', 'Project Board')}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {t('projects.board_subtitle', 'Internal operations & client distribution')}
          </p>
        </div>

        {canManage && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors">
            <MdAdd size={16} />
            {t('projects.add_btn', 'New Project')}
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {COLUMNS.map(col => (
            <ProjectColumn
              key={col.id}
              id={col.id}
              titleKey={col.titleKey}
              color={col.color}
              projects={columnsData[col.id]}
              canDrag={canDrag}
            />
          ))}
        </div>
      </DragDropContext>

    </section>
  );
};