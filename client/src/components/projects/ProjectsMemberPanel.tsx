import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdPersonAdd, MdClose } from 'react-icons/md';
import { adminGetUsers } from '../../services/admin.service';
import type { UserData } from '../../types/auth.types';
import axios from 'axios';

interface ProjectMember {
  id: number;
  userId: number;
  projectId: number;
  joinedAt: string;
  user: { id: number; name: string; email: string; role: string; avatar?: string };
}

interface Props {
  projectId: number;
}

const API_URL = import.meta.env.VITE_API_URL;
const getAuthHeaders = () => {
  const token = localStorage.getItem('app_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const ProjectMembersPanel = ({ projectId }: Props) => {
  const { t } = useTranslation();

  const [members, setMembers]     = useState<ProjectMember[]>([]);
  const [users, setUsers]         = useState<UserData[]>([]);
  const [loading, setLoading]     = useState(true);
  const [addUserId, setAddUserId] = useState('');
  const [adding, setAdding]       = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/projects/${projectId}/members`, getAuthHeaders()).then(r => r.data.members),
      adminGetUsers(),
    ])
      .then(([m, u]) => { setMembers(m); setUsers(u); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  // Userii care nu sunt deja membri
  const available = users.filter(u => !members.some(m => m.userId === u.id));

  const handleAdd = async () => {
    if (!addUserId) return;
    setAdding(true);
    try {
      const res = await axios.post(
        `${API_URL}/projects/${projectId}/members`,
        { userId: Number(addUserId) },
        getAuthHeaders()
      );
      setMembers(prev => [...prev, res.data.member]);
      setAddUserId('');
    } catch (err) {
      alert(err.response?.data?.error || t('admin.error_save', 'Operation failed'));
    } finally {
      setAdding(false);
    }
  };

  // Backend: DELETE /projects/:id/members/:userId
  const handleRemove = async (member: ProjectMember) => {
    try {
      await axios.delete(
        `${API_URL}/projects/${projectId}/members/${member.userId}`,
        getAuthHeaders()
      );
      setMembers(prev => prev.filter(m => m.userId !== member.userId));
    } catch (err) {
      alert(err.response?.data?.error || t('admin.error_delete', 'Error removing'));
    }
  };

  if (loading) return (
    <p className="text-xs text-gray-400 py-2">{t('admin.loading', 'Loading...')}</p>
  );

  return (
    <div className="space-y-3">

      {/* Lista membri */}
      {members.length === 0 ? (
        <p className="text-xs text-gray-400">{t('admin.no_members', 'No members yet')}</p>
      ) : (
        <ul className="space-y-2">
          {members.map(m => (
            <li key={m.userId} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                {m.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{m.user.name}</p>
                <p className="text-xs text-gray-400 truncate">{m.user.email}</p>
              </div>
              <span className="text-xs text-gray-400 capitalize flex-shrink-0">{m.user.role}</span>
              <button
                onClick={() => handleRemove(m)}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors rounded flex-shrink-0"
              >
                <MdClose size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add member */}
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
            {t('admin.btn_add', 'Add')}
          </button>
        </div>
      )}
    </div>
  );
};