import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TaskData, TaskStatus, TaskPriority, ProjectData } from '../../types/admin.types';
import { adminGetProjects } from '../../services/admin.service';
import { TaskAssigneesPanel } from '../../components/taks/TaskAssognnesPanel';

interface Props {
  selected: TaskData | null;
  formData: Partial<TaskData>;
  onChange: (data: Partial<TaskData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const inputCls = 'w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    {children}
  </div>
);

const STATUSES: TaskStatus[]     = ['backlog', 'todo', 'in_progress', 'review', 'done'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

type Tab = 'details' | 'assignees';

export const TaskModal = ({ selected, formData, onChange, onSubmit, onClose }: Props) => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [tab, setTab] = useState<Tab>('details');
  const set = (patch: Partial<TaskData>) => onChange({ ...formData, ...patch });

  useEffect(() => {
    adminGetProjects().then(setProjects).catch(console.error);
  }, []);

  useEffect(() => {
    const setData =() =>{
      setTab('details'); 
    }
    setData()
  }, [selected]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">
            {selected ? t('admin.modal_title_edit', 'Edit Task') : t('admin.modal_title_create', 'Create Task')}
          </h3>
        </div>

        {/* Tabs — doar dacă edităm un task existent */}
        {selected && (
          <div className="flex border-b border-gray-100 px-6">
            {(['details', 'assignees'] as Tab[]).map(t_ => (
              <button
                key={t_}
                onClick={() => setTab(t_)}
                className={`py-2.5 px-1 mr-5 text-xs font-medium border-b-2 transition-colors capitalize ${
                  tab === t_
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {t_ === 'details'
                  ? t('admin.tab_details', 'Details')
                  : t('admin.tab_assignees', 'Assignees')}
              </button>
            ))}
          </div>
        )}

        {/* Tab: Details */}
        {tab === 'details' && (
          <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">

            <Field label={t('admin.label_title', 'Title')}>
              <input
                required type="text"
                value={formData.title ?? ''}
                onChange={e => set({ title: e.target.value })}
                className={inputCls}
              />
            </Field>

            <Field label={t('admin.label_description', 'Description')}>
              <textarea
                rows={2}
                value={formData.description ?? ''}
                onChange={e => set({ description: e.target.value })}
                className={`${inputCls} resize-none`}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.label_status', 'Status')}>
                <select
                  value={formData.status ?? 'backlog'}
                  onChange={e => set({ status: e.target.value as TaskStatus })}
                  className={`${inputCls} bg-white cursor-pointer capitalize`}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{t(`task_status.${s}`, s)}</option>
                  ))}
                </select>
              </Field>

              <Field label={t('admin.label_priority', 'Priority')}>
                <select
                  value={formData.priority ?? 'medium'}
                  onChange={e => set({ priority: e.target.value as TaskPriority })}
                  className={`${inputCls} bg-white cursor-pointer capitalize`}
                >
                  {PRIORITIES.map(p => (
                    <option key={p} value={p}>{t(`task_priority.${p}`, p)}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.label_due', 'Due Date')}>
                <input
                  type="date"
                  value={formData.dueDate ? formData.dueDate.slice(0, 10) : ''}
                  onChange={e => set({ dueDate: e.target.value })}
                  className={inputCls}
                />
              </Field>

              <Field label={t('admin.label_project', 'Project (optional)')}>
                <select
                  value={formData.projectId ?? ''}
                  onChange={e => set({ projectId: e.target.value ? Number(e.target.value) : undefined })}
                  className={`${inputCls} bg-white cursor-pointer`}
                >
                  <option value="">{t('admin.no_project', '— None —')}</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-gray-50">
              <button
                type="button" onClick={onClose}
                className="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-medium transition-colors"
              >
                {t('admin.btn_cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                {t('admin.btn_save', 'Save')}
              </button>
            </div>
          </form>
        )}

        {/* Tab: Assignees — doar dacă task-ul există */}
        {tab === 'assignees' && selected?.id && (
          <div className="p-6 max-h-[65vh] overflow-y-auto">
            <TaskAssigneesPanel taskId={selected.id} />
            <div className="pt-4 mt-2 flex justify-end border-t border-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-medium transition-colors"
              >
                {t('admin.btn_close', 'Close')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};