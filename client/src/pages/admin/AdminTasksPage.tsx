import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdEdit, MdDelete, MdAdd, MdSearch } from 'react-icons/md';
import { useSearchParams } from 'react-router';
import {
  adminGetTasks,
  adminCreateTask,
  adminUpdateTask,
  adminDeleteTask,
} from '../../services/admin.service';
import type { TaskData, TaskStatus, TaskPriority } from '../../types/admin.types';
import { TaskModal } from '../../components/taks/TaskModal';
import { BeatLoader } from 'react-spinners';
const statusBadge: Record<TaskStatus, string> = {
  backlog:     'bg-gray-100 text-gray-500',
  todo:        'bg-sky-100 text-sky-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  review:      'bg-amber-100 text-amber-700',
  done:        'bg-emerald-100 text-emerald-700',
};

const priorityBadge: Record<TaskPriority, string> = {
  low:    'bg-gray-100 text-gray-500',
  medium: 'bg-blue-100 text-blue-700',
  high:   'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const STATUSES: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done'];

const EMPTY: Partial<TaskData> = {
  title: '', description: '', status: 'backlog',
  priority: 'medium', dueDate: '', projectId: undefined,
};

export const AdminTasksPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tasks, setTasks]   = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);

  const search       = searchParams.get('search') ?? '';
  const statusFilter = (searchParams.get('status') ?? 'all') as 'all' | TaskStatus;

  const [selected, setSelected] = useState<TaskData | null>(null);
  const [isOpen, setIsOpen]     = useState(false);
  const [formData, setFormData] = useState<Partial<TaskData>>(EMPTY);

  useEffect(() => {
    adminGetTasks()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const setSearch = (value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) next.set('search', value);
      else next.delete('search');
      return next;
    });
  };

  const setStatusFilter = (value: 'all' | TaskStatus) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value === 'all') next.delete('status');
      else next.set('status', value);
      return next;
    });
  };

  const filtered = tasks.filter(tk => {
    const matchStatus = statusFilter === 'all' || tk.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      tk.title?.toLowerCase().includes(q) ||
      tk.description?.toLowerCase().includes(q) ||
      tk.project?.name?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.confirm_delete', 'Are you sure?'))) return;
    try {
      await adminDeleteTask(id);
      setTasks(prev => prev.filter(tk => tk.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || t('admin.error_delete', 'Error deleting'));
    }
  };

  const openModal = (task: TaskData | null = null) => {
    setSelected(task);
    setFormData(task ? { ...task } : EMPTY);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selected) {
        const updated = await adminUpdateTask(selected.id!, formData);
        setTasks(prev => prev.map(tk => tk.id === updated.id ? updated : tk));
      } else {
        const created = await adminCreateTask(formData);
        setTasks(prev => [...prev, created]);
      }
      setIsOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || t('admin.error_save', 'Operation failed'));
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
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t('admin.tasks_title', 'Tasks')}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {filtered.length} / {tasks.length} {t('admin.users_count', 'entries')}
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          <MdAdd size={16} />
          <span className="hidden sm:inline">{t('admin.btn_add_task', 'Add Task')}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative w-full sm:w-64">
          <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('team.search_placeholder', 'Search...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', ...STATUSES] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? t('team.filter_all', 'All') : t(`task_status.${s}`, s)}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">{t('admin.table_title', 'Title')}</th>
                <th className="px-4 py-3">{t('admin.table_status', 'Status')}</th>
                <th className="px-4 py-3">{t('admin.table_priority', 'Priority')}</th>
                <th className="px-4 py-3">{t('admin.table_project', 'Project')}</th>
                <th className="px-4 py-3">{t('admin.table_due', 'Due Date')}</th>
                <th className="px-4 py-3 text-right">{t('admin.table_actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(tk => (
                <tr key={tk.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">#{tk.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{tk.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusBadge[tk.status]}`}>
                      {t(`task_status.${tk.status}`, tk.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${priorityBadge[tk.priority]}`}>
                      {t(`task_priority.${tk.priority}`, tk.priority)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{tk.project?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {tk.dueDate ? new Date(tk.dueDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button
                      onClick={() => openModal(tk)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <MdEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(tk.id!)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <MdDelete size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            {t('team.no_users', 'No tasks found')}
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {t('team.no_users', 'No tasks found')}
          </div>
        ) : (
          filtered.map(tk => (
            <div
              key={tk.id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4"
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium text-gray-900 truncate">{tk.title}</span>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openModal(tk)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <MdEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(tk.id!)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusBadge[tk.status]}`}>
                  {t(`task_status.${tk.status}`, tk.status)}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${priorityBadge[tk.priority]}`}>
                  {t(`task_priority.${tk.priority}`, tk.priority)}
                </span>
              </div>

              {/* Card body */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {tk.project?.name && (
                  <div className="col-span-2">
                    <span className="text-gray-400 uppercase tracking-wide">{t('admin.table_project', 'Project')}</span>
                    <p className="text-gray-700 truncate mt-0.5">{tk.project.name}</p>
                  </div>
                )}
                {tk.dueDate && (
                  <div>
                    <span className="text-gray-400 uppercase tracking-wide">{t('admin.table_due', 'Due Date')}</span>
                    <p className="text-gray-700 mt-0.5">{new Date(tk.dueDate).toLocaleDateString()}</p>
                  </div>
                )}
                {tk.description && (
                  <div className="col-span-2">
                    <span className="text-gray-400 uppercase tracking-wide">{t('admin.table_description', 'Description')}</span>
                    <p className="text-gray-700 mt-0.5 line-clamp-2">{tk.description}</p>
                  </div>
                )}
              </div>

              {/* Card footer */}
              <div className="mt-3 pt-3 border-t border-gray-50">
                <span className="font-mono text-xs text-gray-300">#{tk.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {isOpen && (
        <TaskModal
          selected={selected}
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};