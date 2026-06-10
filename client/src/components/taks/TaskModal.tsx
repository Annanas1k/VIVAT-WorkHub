import { useState } from 'react';
import { MdClose, MdDelete } from 'react-icons/md';
import { createTask, updateTask, deleteTask } from '../../services/task.service';
import type { Task, TaskStatus, TaskPriority } from '../../types/task.types';

type Props = {
  projectId: number;
  task: Task | null;
  onSaved: (task: Task) => void;
  onDeleted: (id: number) => void;
  onClose: () => void;
};

export const TaskModal = ({ projectId, task, onSaved, onDeleted, onClose }: Props) => {
  const isEdit = !!task;

  const [form, setForm] = useState({
    title:       task?.title       ?? '',
    description: task?.description ?? '',
    status:      task?.status      ?? 'backlog' as TaskStatus,
    priority:    task?.priority    ?? 'medium'  as TaskPriority,
    dueDate:     task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form, projectId, dueDate: form.dueDate || undefined };
      const saved = isEdit
        ? await updateTask(task.id, payload)
        : await createTask(payload);
      onSaved(saved);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !confirm('Delete this task?')) return;
    setDeleting(true);
    try {
      await deleteTask(task.id);
      onDeleted(task.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-100 w-[420px] p-5 flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">{isEdit ? 'Edit task' : 'New task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><MdClose size={18} /></button>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Title *</label>
          <input
            autoFocus
            value={form.title}
            onChange={e => set('title', e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            placeholder="Task title…"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Description</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={3}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 resize-none"
            placeholder="Optional description…"
          />
        </div>

        {/* Status + Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Status</label>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            >
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Priority</label>
            <select
              value={form.priority}
              onChange={e => set('priority', e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Due date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Due date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={e => set('dueDate', e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
          />
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
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          ) : <span />}

          <div className="flex gap-2">
            <button onClick={onClose} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!form.title.trim() || saving}
              className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-indigo-700"
            >
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};