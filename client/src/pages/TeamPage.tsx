import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // ◄ Importăm hook-ul de i18n
import { getUsersService, updateRoleService } from '../services/user.service';
import { useAuth } from '../hooks/useAuth';
import type { UserData } from '../types/auth.types';
import { Link } from 'react-router';

const roleBadge: Record<string, string> = {
  admin:   'bg-purple-100 text-purple-700',
  manager: 'bg-blue-100 text-blue-700',
  dev:     'bg-gray-100 text-gray-600',
};

const roles = ['admin', 'manager', 'dev'];

export const TeamPage = () => {
  const { t } = useTranslation(); // ◄ Inițializăm traducerea
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filtered, setFiltered] = useState<UserData[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | string | null>(null);

  // Încărcarea datelor la prima randare
  useEffect(() => {
    getUsersService()
      .then(data => { 
        setUsers(data); 
        setFiltered(data); 
      })
      .catch(err => console.error("Error fetching team:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filtrare reactivă client-side
  useEffect(() => {
    let result = users;
    if (roleFilter !== 'all') result = result.filter(u => u.role === roleFilter);
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(u =>
        u.name?.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      );
    }
    setFiltered(result);
  }, [search, roleFilter, users]);

  // Modificarea dinamică a rolului în DB și sincronizarea stării locale React
  const handleRoleChange = async (id: number | string, newRole: string) => {
    if (currentUser?.role !== 'admin') return;
    setUpdatingId(id);
    try {
      const updatedUser = await updateRoleService(id, newRole);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, role: updatedUser.role } : u));
    } catch (error) {
      console.error("Failed to update role:", error);
      alert(t('team.error_update', 'Could not update user role.'));
    } finally {
      setUpdatingId(null);
    }
  };

  const initials = (name?: string) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase() ?? '?';

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      {t('team.loading', 'Loading team...')}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{t('team.title')}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {/* Trimitem numărul curent pentru ca i18next să aleagă pluralul corect */}
            {t('team.members', { count: users.length })}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder={t('team.search_placeholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition w-64"
        />
        <div className="flex items-center gap-1.5">
          {['all', 'admin', 'manager', 'dev'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors capitalize
                ${roleFilter === r
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {r === 'all' ? t('team.filter_all', 'All') : r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">{t('team.table_user')}</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">{t('team.table_email')}</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">{t('team.table_role')}</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">{t('team.table_joined')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700 overflow-hidden shrink-0">
                      {u.avatar
                        ? <img src={u.avatar} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt={u.name} />
                        : initials(u.name)
                      }
                    </div>
                    <div>
                      <Link to={`/profile/${u?.id}`} className="font-medium text-gray-900">{u.name ?? '—'}</Link>
                      {String(u.id) === String(currentUser?.id) && (
                        <span className="text-xs text-indigo-500 font-medium bg-indigo-50 px-1.5 py-0.5 rounded">
                          {t('team.badge_you', 'you')}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  {currentUser?.role === 'admin' && String(u.id) !== String(currentUser?.id) ? (
                    <select
                      value={u.role}
                      disabled={updatingId === u.id}
                      onChange={e => handleRoleChange(u.id!, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-400 bg-white cursor-pointer disabled:opacity-50"
                    >
                      {roles.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium inline-block capitalize ${roleBadge[u.role ?? 'dev']}`}>
                      {u.role}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString(navigator.language || 'en-GB') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            {t('team.no_users', 'No users found')}
          </div>
        )}
      </div>
    </div>
  );
};