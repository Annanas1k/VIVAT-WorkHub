import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { adminGetUsers, adminDeleteUser, adminCreateUser, adminUpdateUser } from '../../services/admin.service';
import type { UserData } from '../../types/auth.types';
import { MdEdit, MdDelete, MdPersonAdd, MdSearch } from 'react-icons/md';

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

export const AdminUsersPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers]     = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const search     = searchParams.get('search') ?? '';
  const roleFilter = searchParams.get('role') ?? 'all';

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', role: 'dev', password: '',
  });

  useEffect(() => {
    adminGetUsers()
      .then(setUsers)
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

  const setRoleFilter = (value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value === 'all') next.delete('role');
      else next.set('role', value);
      return next;
    });
  };

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.confirm_delete', 'Are you sure you want to delete this user?'))) return;
    try {
      await adminDeleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || t('admin.error_delete', 'Error deleting user'));
    }
  };

  const handleOpenModal = (user: UserData | null = null) => {
    setSelectedUser(user);
    setFormData(user
      ? { name: user.name, email: user.email, phone: user.phone || '', role: user.role, password: '' }
      : { name: '', email: '', phone: '', role: 'dev', password: '' }
    );
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        const updated = await adminUpdateUser(selectedUser.id, formData);
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      } else {
        const created = await adminCreateUser(formData);
        setUsers(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || t('admin.error_save', 'Operation failed'));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      {t('admin.loading', 'Loading...')}
    </div>
  );

  return (
    <div className="p-1">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t('admin.title', 'System Users Management')}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {filtered.length} / {users.length} {t('admin.users_count', 'users')}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          <MdPersonAdd size={16} />
          <span className="hidden sm:inline">{t('admin.btn_add', 'Add New User')}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative w-full sm:w-64">
          <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('team.search_placeholder', 'Search by name, email, phone...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', ...roles].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                roleFilter === r
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r === 'all' ? t('team.filter_all', 'All') : t(`roles.${r}`, r)}
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
                <th className="px-4 py-3">{t('admin.table_user', 'User')}</th>
                <th className="px-4 py-3">{t('admin.table_email', 'Email')}</th>
                <th className="px-4 py-3">{t('admin.table_phone', 'Phone')}</th>
                <th className="px-4 py-3">{t('admin.table_role', 'Role')}</th>
                <th className="px-4 py-3 text-right">{t('admin.table_actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">#{u.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-gray-500">{u.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${roleBadge[u.role ?? 'dev']}`}>
                      {t(`roles.${u.role ?? 'dev'}`, u.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button
                      onClick={() => handleOpenModal(u)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <MdEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id!)}
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
            {t('team.no_users', 'No users found')}
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {t('team.no_users', 'No users found')}
          </div>
        ) : (
          filtered.map(u => (
            <div
              key={u.id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4"
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium text-gray-900 truncate">{u.name}</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium capitalize ${roleBadge[u.role ?? 'dev']}`}>
                    {t(`roles.${u.role ?? 'dev'}`, u.role)}
                  </span>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => handleOpenModal(u)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <MdEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(u.id!)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>

              {/* Card body */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div className="col-span-2">
                  <span className="text-gray-400 uppercase tracking-wide">{t('admin.table_email', 'Email')}</span>
                  <p className="text-gray-700 truncate mt-0.5">{u.email}</p>
                </div>
                {u.phone && (
                  <div>
                    <span className="text-gray-400 uppercase tracking-wide">{t('admin.table_phone', 'Phone')}</span>
                    <p className="text-gray-700 mt-0.5">{u.phone}</p>
                  </div>
                )}
              </div>

              {/* Card footer */}
              <div className="mt-3 pt-3 border-t border-gray-50">
                <span className="font-mono text-xs text-gray-300">#{u.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">
                {selectedUser
                  ? t('admin.modal_title_edit', 'Edit User')
                  : t('admin.modal_title_create', 'Create New User')}
              </h3>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t('admin.label_name', 'Full Name')}
                </label>
                <input
                  required type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t('admin.label_email', 'Email')}
                </label>
                <input
                  required type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t('admin.label_phone', 'Phone Number')}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t('admin.label_role', 'Role')}
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white outline-none focus:border-indigo-500 cursor-pointer capitalize"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{t(`roles.${r}`, r)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {selectedUser
                    ? t('admin.label_pass_edit', 'New Password (leave blank to keep current)')
                    : t('admin.label_pass_create', 'Password')}
                </label>
                <input
                  {...(!selectedUser && { required: true })}
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
          </div>
        </div>
      )}
    </div>
  );
};