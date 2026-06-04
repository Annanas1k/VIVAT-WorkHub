import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCameraAlt } from 'react-icons/md';

interface ProfileAvatarProps {
  currentAvatar?: string;
  userName?: string;
  userRole?: string;
  onFileSelect: (file: File) => void;
  onError: (msg: string) => void;
  disabled?: boolean; // ◄ Am adăugat prop-ul disabled optional
}

export const ProfileAvatar = ({ 
  currentAvatar, 
  userName, 
  userRole, 
  onFileSelect, 
  onError,
  disabled = false // ◄ Valoare implicită: false
}: ProfileAvatarProps) => {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const proccesPreviewUrl = async () =>{
        setPreviewUrl(null);
    }
    proccesPreviewUrl()
  }, [currentAvatar]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return; // Siguranță suplimentară în caz că se forțează HTML-ul
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      onError(t('profile.size_error'));
      return;
    }

    onFileSelect(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const initials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <div className="flex items-center gap-5 pb-6 border-b border-gray-50">
      {/* Containerul Avatar */}
      <div className="relative w-20 h-20 rounded-full bg-indigo-50 border border-gray-100 flex items-center justify-center text-xl font-semibold text-indigo-600 overflow-hidden group shrink-0">
        {previewUrl || currentAvatar ? (
          <img src={previewUrl || currentAvatar} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="Avatar" />
        ) : initials}
        
        {/* Randerăm overlay-ul de editare doar dacă NU este disabled */}
        {!disabled && (
          <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <MdCameraAlt size={20} />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>

      {/* Detalii Utilizator */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">{userName}</h3>
        <p className="text-xs text-gray-400 capitalize mt-0.5">{userRole}</p>
        
        {/* Randerăm butonul de upload doar dacă NU este disabled */}
        {!disabled && (
          <label className="mt-2 inline-block px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">
            {t('profile.upload_btn')}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
};