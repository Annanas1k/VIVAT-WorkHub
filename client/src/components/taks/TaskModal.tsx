import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose, MdDelete } from 'react-icons/md';
import { createTask, updateTask, deleteTask } from '../../services/task.service';
import { getProjectMembers } from '../../services/members.service';
import { getAllProjects } from '../../services/project.service';
import type { Task, TaskStatus, TaskPriority } from '../../types/task.types';
import type { ProjectMember } from '../../types/members.type';
import type { Project } from '../../types/project.types';

type Props = {
  projectId?: number;
  task: Task | null;
  showProjectSelect?: boolean;
  onSaved: (task: Task) => void;
  onDeleted: (id: number) => void;
  onClose: () => void;
};

export const TaskModal = ({ projectId, task, showProjectSelect, onSaved, onDeleted, onClose }: Props) => {
  const { t } = useTranslation();
  const isEdit = !!task;

  const [form, setForm] = useState({
    title:       task?.title       ?? '',
    description: task?.description ?? '',
    status:      task?.status      ?? 'backlog' as TaskStatus,
    priority:    task?.priority    ?? 'medium'  as TaskPriority,
    dueDate:     task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });

  const [assigneeIds, setAssigneeIds] = useState<number[]>(
    task?.assignees?.map(a => a.user!.id) ?? []
  );
  const [members,  setMembers]  = useState<ProjectMember[]>([]);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(
    projectId ?? task?.projectId ?? undefined
  );

  // încarcă proiectele doar dacă showProjectSelect e activ
  useEffect(() => {
    if (showProjectSelect) {
      getAllProjects().then(setProjects).catch(console.error);
    }
  }, [showProjectSelect]);

  // încarcă membrii ori de câte ori se schimbă proiectul selectat
  useEffect(() => {
    if (selectedProjectId) {
      getProjectMembers(selectedProjectId).then(setMembers).catch(console.error);
    } else {
      setMembers([]);
    }
  }, [selectedProjectId]);

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const toggleAssignee = (userId: number) =>
    setAssigneeIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        projectId: selectedProjectId,
        assigneeIds,
        dueDate: form.dueDate || undefined,
      };
      const saved = isEdit
        ? await updateTask(task.id, payload)
        : await createTask(payload);
      onSaved(saved);
    } catch (err) {
      console.error('save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !confirm(t('tasks.confirm_delete', 'Delete this task?'))) return;
    setDeleting(true);
    try {
      await deleteTask(task.id);
      onDeleted(task.id);
    } catch (err) {
      console.error('delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-100 w-105 p-5 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            {isEdit ? t('tasks.edit', 'Edit task') : t('tasks.new', 'New task')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={18} />
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">{t('tasks.title', 'Title')} *</label>
          <input
            autoFocus
            value={form.title}
            onChange={e => set('title', e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            placeholder={t('tasks.title_placeholder', 'Task title…')}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">{t('tasks.description', 'Description')}</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={3}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 resize-none"
            placeholder={t('tasks.description_placeholder', 'Optional description…')}
          />
        </div>

        {/* Status + Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">{t('tasks.status', 'Status')}</label>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            >
              <option value="backlog">{t('tasks.status_backlog', 'Backlog')}</option>
              <option value="todo">{t('tasks.status_todo', 'To Do')}</option>
              <option value="in_progress">{t('tasks.status_in_progress', 'In Progress')}</option>
              <option value="review">{t('tasks.status_review', 'Review')}</option>
              <option value="done">{t('tasks.status_done', 'Done')}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">{t('tasks.priority', 'Priority')}</label>
            <select
              value={form.priority}
              onChange={e => set('priority', e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            >
              <option value="low">{t('tasks.priority_low', 'Low')}</option>
              <option value="medium">{t('tasks.priority_medium', 'Medium')}</option>
              <option value="high">{t('tasks.priority_high', 'High')}</option>
              <option value="urgent">{t('tasks.priority_urgent', 'Urgent')}</option>
            </select>
          </div>
        </div>

        {/* Due date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">{t('tasks.due_date', 'Due date')}</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={e => set('dueDate', e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
          />
        </div>

        {/* Project */}
        {showProjectSelect && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">{t('tasks.project', 'Project')}</label>
            <select
              value={selectedProjectId ?? ''}
              onChange={e => {
                setSelectedProjectId(e.target.value ? Number(e.target.value) : undefined);
                setAssigneeIds([]);
              }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            >
              <option value="">{t('tasks.no_project', 'No project')}</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Assignees */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-600">{t('tasks.assignees', 'Assignees')}</label>
          {members.length === 0 ? (
            <p className="text-xs text-gray-300 py-1">
              {selectedProjectId
                ? t('tasks.no_members', 'No members in this project yet')
                : t('tasks.select_project_first', 'Select a project first')
              }
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {members.map(m => {
                const uid      = m.user.id;
                const selected = assigneeIds.includes(uid);
                return (
                  <button
                    key={uid}
                    type="button"
                    onClick={() => toggleAssignee(uid)}
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors text-left ${
                      selected ? 'bg-indigo-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center uppercase shrink-0 overflow-hidden">
                      {m.user.avatar
                        ? <img src={m.user.avatar} alt={m.user.name} className="w-full h-full object-cover" />
                        : m.user.name?.charAt(0)
                      }
                    </div>
                    <span className="text-xs text-gray-700 flex-1">{m.user.name} <span className='bg-violet-200 rounded p-1'>{m.user.role}</span></span>
                    {selected && (
                      <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-[9px]">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          {isEdit ? (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              <MdDelete size={14} />
              {deleting ? t('common.deleting', 'Deleting…') : t('common.delete', 'Delete')}
            </button>
          ) : <span />}

          <div className="flex gap-2">
            <button onClick={onClose} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={!form.title.trim() || saving}
              className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-indigo-700"
            >
              {saving
                ? t('common.saving', 'Saving…')
                : isEdit
                  ? t('common.save_changes', 'Save changes')
                  : t('tasks.create', 'Create task')
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};