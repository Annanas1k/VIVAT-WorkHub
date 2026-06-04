import { useTranslation } from 'react-i18next';
import { MdPerson, MdEmail, MdPhone } from 'react-icons/md';

interface ProfileInfoProps {
  name: string;
  email: string;
  phone: string;
  onChangeName: (val: string) => void;
  onChangePhone: (val: string) => void;
  disabled?: boolean;
}

export const ProfileInfo = ({
  name,
  email,
  phone,
  onChangeName,
  onChangePhone,
  disabled = false
}: ProfileInfoProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* SECȚIUNEA 1: Personal Info */}
      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {t('profile.personal_info', 'Personal Info')}
        </h4>
        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {t('profile.full_name', 'Full Name')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <MdPerson size={18} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => onChangeName(e.target.value)}
                disabled={disabled}
                className="pl-10 pr-3 py-2 w-full text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400 transition-colors disabled:bg-gray-100/70 disabled:text-gray-500 disabled:cursor-not-allowed"
                placeholder={t('profile.name_placeholder', 'John Doe')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECȚIUNEA 2: Contact Info */}
      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {t('profile.contact_info', 'Contact Info')}
        </h4>
        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {t('profile.email_address', 'Email Address')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <MdEmail size={17} />
              </span>
              <input
                type="email"
                value={email}
                disabled={true}
                className="pl-10 pr-3 py-2 w-full text-sm border border-gray-200 rounded-lg bg-gray-100/70 text-gray-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {t('profile.phone_number', 'Phone Number')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <MdPhone size={17} />
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => onChangePhone(e.target.value)}
                disabled={disabled}
                className="pl-10 pr-3 py-2 w-full text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400 transition-colors disabled:bg-gray-100/70 disabled:text-gray-500 disabled:cursor-not-allowed"
                placeholder={t('profile.phone_placeholder', '+40 7xx xxx xxx')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};