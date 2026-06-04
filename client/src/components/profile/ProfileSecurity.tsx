import { useTranslation } from 'react-i18next';
import { MdLock } from 'react-icons/md';

interface ProfileSecurityProps {
  currentPass: string;
  newPass: string;
  onChangeCurrentPass: (val: string) => void;
  onChangeNewPass: (val: string) => void;
}

export const ProfileSecurity = ({ currentPass, newPass, onChangeCurrentPass, onChangeNewPass }: ProfileSecurityProps) => {
  const { t } = useTranslation();

  return (
    <div className="pt-4 border-t border-gray-50 space-y-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <MdLock size={14} /> {t('profile.security')}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('profile.curr_pass')}</label>
          <input 
            type="password" 
            value={currentPass} 
            onChange={e => onChangeCurrentPass(e.target.value)} 
            className="px-3 py-2 w-full text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400" 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('profile.new_pass')}</label>
          <input 
            type="password" 
            value={newPass} 
            onChange={e => onChangeNewPass(e.target.value)} 
            className="px-3 py-2 w-full text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400" 
          />
        </div>
      </div>
    </div>
  );
};