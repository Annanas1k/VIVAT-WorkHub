import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdEdit, MdDelete, MdAdd, MdSearch } from 'react-icons/md';
import { useSearchParams } from 'react-router';
import {
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
} from '../../services/admin.service';
import type { ProjectData, ProjectStatus } from '../../types/admin.types';
import { ProjectModal } from '../../components/projects/ProjectModal';
import { BeatLoader } from 'react-spinners';
const statusBadge: Record<ProjectStatus, string> = {
  active:    'bg-emerald-100 text-emerald-700',
  on_hold:   'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUSES: ProjectStatus[] = ['active', 'on_hold', 'completed', 'cancelled'];

const EMPTY: Partial<ProjectData> = {
  name: '', description: '', status: 'active',
  startDate: '', dueDate: '', budget: undefined, customerId: undefined,
};

export const AdminProjectsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading]   = useState(true);

  const search       = searchParams.get('search') ?? '';
  const statusFilter = (searchParams.get('status') ?? 'all') as 'all' | ProjectStatus;

  const [selected, setSelected] = useState<ProjectData | null>(null);
  const [isOpen, setIsOpen]     = useState(false);
  const [formData, setFormData] = useState<Partial<ProjectData>>(EMPTY);

  useEffect(() => {
    adminGetProjects()
      .then(setProjects)
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

  const setStatusFilter = (value: 'all' | ProjectStatus) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value === 'all') next.delete('status');
      else next.set('status', value);
      return next;
    });
  };

  const filtered = projects.filter(p => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.customer?.name?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.confirm_delete', 'Are you sure?'))) return;
    try {
      await adminDeleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || t('admin.error_delete', 'Error deleting'));
    }
  };

  const openModal = (project: ProjectData | null = null) => {
    setSelected(project);
    setFormData(project ? { ...project } : EMPTY);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selected) {
        const updated = await adminUpdateProject(selected.id!, formData);
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await adminCreateProject(formData);
        setProjects(prev => [...prev, created]);
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
    <div className="p-1">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t('admin.projects_title', 'Projects')}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {filtered.length} / {projects.length} {t('admin.users_count', 'entries')}
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          <MdAdd size={16} />
          <span className="hidden sm:inline">{t('admin.btn_add_project', 'Add Project')}</span>
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
              {s === 'all' ? t('team.filter_all', 'All') : t(`project_status.${s}`, s)}
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
                <th className="px-4 py-3">{t('admin.table_name', 'Name')}</th>
                <th className="px-4 py-3">{t('admin.table_status', 'Status')}</th>
                <th className="px-4 py-3">{t('admin.table_customer', 'Customer')}</th>
                <th className="px-4 py-3">{t('admin.table_budget', 'Budget')}</th>
                <th className="px-4 py-3">{t('admin.table_due', 'Due Date')}</th>
                <th className="px-4 py-3 text-right">{t('admin.table_actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">#{p.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusBadge[p.status]}`}>
                      {t(`project_status.${p.status}`, p.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.customer?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {p.budget != null ? `$${p.budget.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button
                      onClick={() => openModal(p)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <MdEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id!)}
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
            {t('team.no_users', 'No projects found')}
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {t('team.no_users', 'No projects found')}
          </div>
        ) : (
          filtered.map(p => (
            <div
              key={p.id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4"
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium text-gray-900 truncate">{p.name}</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium capitalize ${statusBadge[p.status]}`}>
                    {t(`project_status.${p.status}`, p.status)}
                  </span>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openModal(p)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <MdEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id!)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>

              {/* Card body */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {p.customer?.name && (
                  <div className="col-span-2">
                    <span className="text-gray-400 uppercase tracking-wide">{t('admin.table_customer', 'Customer')}</span>
                    <p className="text-gray-700 truncate mt-0.5">{p.customer.name}</p>
                  </div>
                )}
                {p.budget != null && (
                  <div>
                    <span className="text-gray-400 uppercase tracking-wide">{t('admin.table_budget', 'Budget')}</span>
                    <p className="text-gray-700 mt-0.5">${p.budget.toLocaleString()}</p>
                  </div>
                )}
                {p.dueDate && (
                  <div>
                    <span className="text-gray-400 uppercase tracking-wide">{t('admin.table_due', 'Due Date')}</span>
                    <p className="text-gray-700 mt-0.5">{new Date(p.dueDate).toLocaleDateString()}</p>
                  </div>
                )}
                {p.description && (
                  <div className="col-span-2">
                    <span className="text-gray-400 uppercase tracking-wide">{t('admin.table_description', 'Description')}</span>
                    <p className="text-gray-700 mt-0.5 line-clamp-2">{p.description}</p>
                  </div>
                )}
              </div>

              {/* Card footer */}
              <div className="mt-3 pt-3 border-t border-gray-50">
                <span className="font-mono text-xs text-gray-300">#{p.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {isOpen && (
        <ProjectModal
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