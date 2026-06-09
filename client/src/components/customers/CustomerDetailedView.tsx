import { MdArrowBack, MdEmail, MdPhone, MdLocationOn, MdNotes, MdFolder } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import type { Customer } from "../../types/customer.type";

interface Props {
  customer: Customer | null;
  onBack: () => void;
}

export const CustomerDetailedView = ({ customer, onBack }: Props) => {
  const { t } = useTranslation();

  // 1. STARE GOALĂ: Când nu este selectat niciun client
  if (!customer) {
    return (
      <div className="h-full flex items-center justify-center p-12 text-sm text-gray-600  rounded-xl ">
        {t('customers.empty_state', '[ select a customer from the list to view profile details ]')}
      </div>
    );
  }

  return (
    <div className="p-1 space-y-6 animate-in fade-in duration-150">
      
      {/* HEADER PROFIL */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="md:hidden p-2 rounded-lg bg-gray-50 text-gray-500 hover:text-gray-700 border border-gray-200 transition-colors cursor-pointer"
        >
          <MdArrowBack size={16} />
        </button>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold text-gray-900">{customer.name}</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold uppercase tracking-wider">
              {t(`customers.type_${customer.type}`, customer.type)}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {t('customers.id', 'ID')}: <span className="font-mono text-gray-500">#{customer.id}</span> • {t('customers.created_at', 'CREATED')}: <span className="text-gray-500">{new Date(customer.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      {/* 2. DATE PROFIL (Companii vs Individual) */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {t('customers.section_specs', 'Legal / Profile Specs')}
        </h3>
        
        {customer.type === 'company' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">{t('customers.company_name', 'Registered Name:')}</span>
              <span className="font-medium text-gray-900">{customer.company || '—'}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">{t('customers.vat_number', 'Fiscal Code (VAT):')}</span>
              <span className="font-mono font-semibold text-gray-900">{customer.vatNumber || '—'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-xs text-gray-400 block mb-0.5">{t('customers.reg_number', 'Trade Register No:')}</span>
              <span className="text-gray-700">{customer.regNumber || '—'}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">{t('customers.first_name', 'First Name:')}</span>
              <span className="font-medium text-gray-900">{customer.firstName || '—'}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">{t('customers.last_name', 'Last Name:')}</span>
              <span className="font-medium text-gray-900">{customer.lastName || '—'}</span>
            </div>
          </div>
        )}
      </div>

      {/* INFO CONTACT */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {t('customers.section_contact', 'Contact & Address')}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2.5 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
            <MdEmail className="text-gray-400 shrink-0" size={16} />
            <span className="text-gray-700 truncate">{customer.email || '—'}</span>
          </div>
          
          <div className="flex items-center gap-2.5 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
            <MdPhone className="text-gray-400 shrink-0" size={16} />
            <span className="text-gray-700 truncate">{customer.phone || '—'}</span>
          </div>

          <div className="sm:col-span-2 flex items-start gap-2.5 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
            <MdLocationOn className="text-gray-400 shrink-0 mt-0.5" size={16} />
            <span className="text-gray-700 wrap-break-words">{customer.address || '—'}</span>
          </div>
        </div>
      </div>

      {/* NOTE INTERNE */}
      {customer.notes && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <MdNotes size={16} className="text-gray-400" /> {t('customers.section_notes', 'Internal Notes')}
          </h3>
          <div className="p-4 border border-gray-100 rounded-xl text-sm text-gray-700 bg-gray-50/50 leading-relaxed whitespace-pre-line shadow-inner">
            {customer.notes}
          </div>
        </div>
      )}

      {/* PROIECTE ASOCIATE */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
          <MdFolder size={16} className="text-gray-400" /> {t('customers.section_projects', 'Associated Projects')} ({customer.projects?.length || 0})
        </h3>

        {customer.projects && customer.projects.length > 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 w-20">ID</th>
                    <th className="px-4 py-3">{t('customers.th_project_name', 'Project Name')}</th>
                    <th className="px-4 py-3 text-right">{t('customers.th_status', 'Status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customer.projects.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">#{p.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium uppercase rounded-md bg-gray-100 text-gray-600 border border-gray-200/40">
                          {t(`project_status.${p.status}`, p.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-white border border-gray-100 rounded-xl text-gray-400 text-sm shadow-sm">
            {t('customers.no_projects', '[ zero workspace projects assigned to this customer ]')}
          </div>
        )}
      </div>

    </div>
  );
};