import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { MdAdd } from 'react-icons/md';
import { BeatLoader } from 'react-spinners';
import { getProjectTasks, updateTask } from '../../services/task.service';
import { TaskColumn } from '../../components/taks/TaskColumn';
import { TaskModal } from '../../components/taks/TaskModal';
import { useAuth } from '../../hooks/useAuth';
import type { Task, TaskStatus } from '../../types/task.types';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog',     label: 'Backlog',     color: 'border-t-gray-400'    },
  { id: 'todo',        label: 'To Do',       color: 'border-t-blue-400'    },
  { id: 'in_progress', label: 'In Progress', color: 'border-t-amber-400'   },
  { id: 'review',      label: 'Review',      color: 'border-t-purple-400'  },
  { id: 'done',        label: 'Done',        color: 'border-t-emerald-500' },
];

export const ProjectTasksPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const canManage = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'team_lead';

  const [tasks, setTasks]     = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  useEffect(() => {
    getProjectTasks(Number(id))
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const columnsData = useMemo(() => {
    const board: Record<TaskStatus, Task[]> = {
      backlog: [], todo: [], in_progress: [], review: [], done: [],
    };
    tasks.forEach(t => { if (board[t.status]) board[t.status].push(t); });
    return board;
  }, [tasks]);

  const handleDragEnd = async (result: DropResult) => {
    if (!canManage) return;
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const taskId     = Number(draggableId);
    const nextStatus = destination.droppableId as TaskStatus;
    const origStatus = source.droppableId as TaskStatus;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
    try {
      await updateTask(taskId, { status: nextStatus });
    } catch {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: origStatus } : t));
    }
  };

  const openNew  = () => { setEditing(null); setModal(true); };
  const openEdit = (task: Task) => {
    if (!canManage) return;
    setEditing(task);
    setModal(true);
  };

  const handleSaved = (task: Task) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      return exists ? prev.map(t => t.id === task.id ? task : t) : [...prev, task];
    });
    setModal(false);
  };

  const handleDeleted = (taskId: number) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setModal(false);
  };


    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <BeatLoader size={15} color="#4D179A" aria-label="Loading spinner" loading={loading} />
            </div>
        )
    }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{tasks.length} tasks total</p>
        {canManage && (
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <MdAdd size={15} />
            New task
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3 items-start">
          {COLUMNS.map(col => (
            <TaskColumn
              key={col.id}
              id={col.id}
              label={col.label}
              color={col.color}
              tasks={columnsData[col.id]}
              onCardClick={openEdit}
              canDrag={canManage}
            />
          ))}
        </div>
      </DragDropContext>

      {modalOpen && canManage && (
        <TaskModal
          projectId={Number(id)}
          task={editing}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
};