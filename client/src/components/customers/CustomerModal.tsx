import type { CustomerData, CustomerType } from '../../types/admin.types';
import { useTranslation } from 'react-i18next';

interface Props {
  selected: CustomerData | null;
  formData: Partial<CustomerData>;
  onChange: (data: Partial<CustomerData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const Field = ({
  label, children,
}: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    {children}
  </div>
);

const inputCls = 'w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500';

export const CustomerModal = ({ selected, formData, onChange, onSubmit, onClose }: Props) => {
  const { t } = useTranslation();
  const set = (patch: Partial<CustomerData>) => onChange({ ...formData, ...patch });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden">

        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">
            {selected ? t('admin.modal_title_edit', 'Edit Customer') : t('admin.modal_title_create', 'Create Customer')}
          </h3>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Type */}
          <Field label={t('admin.label_type', 'Type')}>
            <select
              value={formData.type ?? 'individual'}
              onChange={e => set({ type: e.target.value as CustomerType })}
              className={`${inputCls} bg-white cursor-pointer`}
            >
              <option value="individual">{t('customer.individual', 'Individual')}</option>
              <option value="company">{t('customer.company', 'Company')}</option>
            </select>
          </Field>

          {/* Name */}
          <Field label={t('admin.label_name', 'Display Name')}>
            <input
              required type="text"
              value={formData.name ?? ''}
              onChange={e => set({ name: e.target.value })}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.label_email', 'Email')}>
              <input
                type="email"
                value={formData.email ?? ''}
                onChange={e => set({ email: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label={t('admin.label_phone', 'Phone')}>
              <input
                type="text"
                value={formData.phone ?? ''}
                onChange={e => set({ phone: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label={t('admin.label_address', 'Address')}>
            <input
              type="text"
              value={formData.address ?? ''}
              onChange={e => set({ address: e.target.value })}
              className={inputCls}
            />
          </Field>

          {/* Company-specific */}
          {formData.type === 'company' && (
            <>
              <Field label={t('admin.label_company', 'Company Name')}>
                <input
                  type="text"
                  value={formData.company ?? ''}
                  onChange={e => set({ company: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('admin.label_vat', 'VAT / CUI')}>
                  <input
                    type="text"
                    value={formData.vatNumber ?? ''}
                    onChange={e => set({ vatNumber: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label={t('admin.label_reg', 'Reg. Number')}>
                  <input
                    type="text"
                    value={formData.regNumber ?? ''}
                    onChange={e => set({ regNumber: e.target.value })}
                    className={inputCls}
                  />
                </Field>
              </div>
            </>
          )}

          {/* Individual-specific */}
          {formData.type === 'individual' && (
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.label_firstname', 'First Name')}>
                <input
                  type="text"
                  value={formData.firstName ?? ''}
                  onChange={e => set({ firstName: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label={t('admin.label_lastname', 'Last Name')}>
                <input
                  type="text"
                  value={formData.lastName ?? ''}
                  onChange={e => set({ lastName: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
          )}

          <Field label={t('admin.label_notes', 'Notes')}>
            <textarea
              rows={2}
              value={formData.notes ?? ''}
              onChange={e => set({ notes: e.target.value })}
              className={`${inputCls} resize-none`}
            />
          </Field>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-50">
            <button
              type="button" onClick={onClose}
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
  );
};