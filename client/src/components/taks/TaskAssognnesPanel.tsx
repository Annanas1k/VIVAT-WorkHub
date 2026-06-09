import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdPersonAdd, MdClose } from 'react-icons/md';
import { adminGetUsers } from '../../services/admin.service';
import type { UserData } from '../../types/auth.types';
import axios from 'axios';

interface TaskAssignee {
  id: number;
  userId: number;
  taskId: number;
  assignedAt: string;
  user: { id: number; name: string; email: string; role: string; avatar?: string };
}

interface Props {
  taskId: number;
}

const API_URL = import.meta.env.VITE_API_URL;
const getAuthHeaders = () => {
  const token = localStorage.getItem('app_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const TaskAssigneesPanel = ({ taskId }: Props) => {
  const { t } = useTranslation();

  const [assignees, setAssignees] = useState<TaskAssignee[]>([]);
  const [users, setUsers]         = useState<UserData[]>([]);
  const [loading, setLoading]     = useState(true);
  const [addUserId, setAddUserId] = useState('');
  const [adding, setAdding]       = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/tasks/${taskId}/assignees`, getAuthHeaders()).then(r => r.data.assignees),
      adminGetUsers(),
    ])
      .then(([a, u]) => { setAssignees(a); setUsers(u); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [taskId]);

  // Userii care nu sunt deja asignați
  const available = users.filter(u => !assignees.some(a => a.userId === u.id));

  const handleAdd = async () => {
    if (!addUserId) return;
    setAdding(true);
    try {
      const res = await axios.post(
        `${API_URL}/tasks/${taskId}/assignees`,
        { userId: Number(addUserId) },
        getAuthHeaders()
      );
      setAssignees(prev => [...prev, res.data.assignee]);
      setAddUserId('');
    } catch (err) {
      alert(err.response?.data?.error || t('admin.error_save', 'Operation failed'));
    } finally {
      setAdding(false);
    }
  };

  // Backend: DELETE /tasks/:id/assignees/:userId
  const handleRemove = async (assignee: TaskAssignee) => {
    try {
      await axios.delete(
        `${API_URL}/tasks/${taskId}/assignees/${assignee.userId}`,
        getAuthHeaders()
      );
      setAssignees(prev => prev.filter(a => a.userId !== assignee.userId));
    } catch (err) {
      alert(err.response?.data?.error || t('admin.error_delete', 'Error removing'));
    }
  };

  if (loading) return (
    <p className="text-xs text-gray-400 py-2">{t('admin.loading', 'Loading...')}</p>
  );

  return (
    <div className="space-y-3">

      {/* Lista assignees */}
      {assignees.length === 0 ? (
        <p className="text-xs text-gray-400">{t('admin.no_assignees', 'No assignees yet')}</p>
      ) : (
        <ul className="space-y-2">
          {assignees.map(a => (
            <li key={a.userId} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                {a.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{a.user.name}</p>
                <p className="text-xs text-gray-400 truncate">{a.user.email}</p>
              </div>
              <span className="text-xs text-gray-400 capitalize flex-shrink-0">{a.user.role}</span>
              <button
                onClick={() => handleRemove(a)}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors rounded flex-shrink-0"
              >
                <MdClose size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add assignee */}
      {available.length > 0 && (
        <div className="flex gap-2 pt-1 border-t border-gray-50">
          <select
            value={addUserId}
            onChange={e => setAddUserId(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white outline-none focus:border-indigo-400"
          >
            <option value="">{t('admin.select_user', '— Select user —')}</option>
            {available.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!addUserId || adding}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <MdPersonAdd size={14} />
            {t('admin.btn_assign', 'Assign')}
          </button>
        </div>
      )}
    </div>
  );
};