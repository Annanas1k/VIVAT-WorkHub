import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdEdit, MdDelete, MdPersonAdd, MdSearch } from 'react-icons/md';
import { useSearchParams } from 'react-router';
import {
  adminGetCustomers,
  adminCreateCustomer,
  adminUpdateCustomer,
  adminDeleteCustomer,
} from '../../services/admin.service';
import type { CustomerData } from '../../types/admin.types';
import { CustomerModal } from '../../components/customers/CustomerModal';
import { BeatLoader } from 'react-spinners';
const typeBadge: Record<string, string> = {
  individual: 'bg-sky-100 text-sky-700',
  company:    'bg-amber-100 text-amber-700',
};

const EMPTY: Partial<CustomerData> = {
  type: 'individual', name: '', email: '', phone: '', address: '', notes: '',
  company: '', vatNumber: '', regNumber: '', firstName: '', lastName: '',
};

export const AdminCustomersPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading]     = useState(true);

  const search     = searchParams.get('search') ?? '';
  const typeFilter = (searchParams.get('type') ?? 'all') as 'all' | 'individual' | 'company';

  const [selected, setSelected] = useState<CustomerData | null>(null);
  const [isOpen, setIsOpen]     = useState(false);
  const [formData, setFormData] = useState<Partial<CustomerData>>(EMPTY);

  useEffect(() => {
    adminGetCustomers()
      .then(setCustomers)
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

  const setTypeFilter = (value: 'all' | 'individual' | 'company') => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value === 'all') next.delete('type');
      else next.set('type', value);
      return next;
    });
  };

  const filtered = customers.filter(c => {
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.confirm_delete', 'Are you sure?'))) return;
    try {
      await adminDeleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || t('admin.error_delete', 'Error deleting'));
    }
  };

  const openModal = (customer: CustomerData | null = null) => {
    setSelected(customer);
    setFormData(customer ? { ...customer } : EMPTY);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selected) {
        const updated = await adminUpdateCustomer(selected.id!, formData);
        setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
      } else {
        const created = await adminCreateCustomer(formData);
        setCustomers(prev => [...prev, created]);
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
            {t('admin.customers_title', 'Customers')}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {filtered.length} / {customers.length} {t('admin.users_count', 'entries')}
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          <MdPersonAdd size={16} />
          <span className="hidden sm:inline">{t('admin.btn_add_customer', 'Add Customer')}</span>
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
        <div className="flex gap-2">
          {(['all', 'individual', 'company'] as const).map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                typeFilter === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? t('team.filter_all', 'All') : t(`customer.${f}`, f)}
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
                <th className="px-4 py-3">{t('admin.table_type', 'Type')}</th>
                <th className="px-4 py-3">{t('admin.table_email', 'Email')}</th>
                <th className="px-4 py-3">{t('admin.table_phone', 'Phone')}</th>
                <th className="px-4 py-3">{t('admin.table_company', 'Company')}</th>
                <th className="px-4 py-3 text-right">{t('admin.table_actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">#{c.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${typeBadge[c.type]}`}>
                      {t(`customer.${c.type}`, c.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.company || '—'}</td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button
                      onClick={() => openModal(c)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <MdEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id!)}
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
            {t('team.no_users', 'No customers found')}
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {t('team.no_users', 'No customers found')}
          </div>
        ) : (
          filtered.map(c => (
            <div
              key={c.id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4"
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium text-gray-900 truncate">{c.name}</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium capitalize ${typeBadge[c.type]}`}>
                    {t(`customer.${c.type}`, c.type)}
                  </span>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openModal(c)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <MdEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id!)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>

              {/* Card body */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {c.email && (
                  <div className="col-span-2">
                    <span className="text-gray-400 uppercase tracking-wide">{t('admin.table_email', 'Email')}</span>
                    <p className="text-gray-700 truncate mt-0.5">{c.email}</p>
                  </div>
                )}
                {c.phone && (
                  <div>
                    <span className="text-gray-400 uppercase tracking-wide">{t('admin.table_phone', 'Phone')}</span>
                    <p className="text-gray-700 mt-0.5">{c.phone}</p>
                  </div>
                )}
                {c.company && (
                  <div>
                    <span className="text-gray-400 uppercase tracking-wide">{t('admin.table_company', 'Company')}</span>
                    <p className="text-gray-700 truncate mt-0.5">{c.company}</p>
                  </div>
                )}
              </div>

              {/* Card footer */}
              <div className="mt-3 pt-3 border-t border-gray-50">
                <span className="font-mono text-xs text-gray-300">#{c.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {isOpen && (
        <CustomerModal
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