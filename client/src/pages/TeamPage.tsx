import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsersService, updateRoleService } from '../services/user.service';
import { useAuth } from '../hooks/useAuth';
import type { UserData } from '../types/auth.types';
import { Link } from 'react-router';
import { BeatLoader } from 'react-spinners';
const roleBadge: Record<string, string> = {
  admin:     'bg-purple-100 text-purple-700',
  manager:   'bg-blue-100 text-blue-700',
  team_lead: 'bg-indigo-100 text-indigo-700',
  front_dev: 'bg-emerald-100 text-emerald-700',
  back_dev:  'bg-amber-100 text-amber-700',
  qa:        'bg-rose-100 text-rose-700',
  designer:  'bg-pink-100 text-pink-700',
  dev:       'bg-gray-100 text-gray-600',
};

const roles = Object.keys(roleBadge);

export const TeamPage = () => {
  const { t } = useTranslation(); 
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filtered, setFiltered] = useState<UserData[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // ◄ Aceasta este starea ta reală
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
    const proccessData = async () =>{
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
    }
    proccessData()
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{t('team.title')}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {t('team.members', { count: users.length })}
          </p>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row md:items-center  gap-4 mb-6">
        <input
          type="text"
          placeholder={t('team.search_placeholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition w-full md:w-64"
        />
        
        {/* Corectat: Schimbat din activeFilter în roleFilter */}
        <div className="flex flex-wrap gap-2">
          {['all', ...roles].map((r) => {
            const isActive = roleFilter === r;

            return (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r === 'all' ? t('team.filter_all', 'All') : t(`roles.${r}`, r)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
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
                        <Link to={`/profile/${u?.id}`} className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                          {u.name ?? '—'}
                        </Link>
                        {String(u.id) === String(currentUser?.id) && (
                          <span className="ml-2 text-[10px] text-indigo-500 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
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
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-400 bg-white cursor-pointer disabled:opacity-50 font-medium text-gray-700"
                      >
                        {roles.map(r => (
                          <option key={r} value={r}>
                            {t(`roles.${r}`, r)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium inline-block ${roleBadge[u.role ?? 'dev']}`}>
                        {t(`roles.${u.role ?? 'dev'}`, u.role)}
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
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            {t('team.no_users', 'No users found')}
          </div>
        )}
      </div>
    </div>
  );
};