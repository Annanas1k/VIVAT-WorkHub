import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserByIdService } from '../services/user.service';
import { MdEmail, MdPhone } from 'react-icons/md';
import type { UserData } from '../types/auth.types';

interface ViewProfilePageProps {
  id: string;
}

export const ViewProfilePage = ({ id }: ViewProfilePageProps) => {
  const { t } = useTranslation();

  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setAllData = async () =>{
        setProfileData(null);
        setError(null);
        setLoading(true);
    
        getUserByIdService(id)
          .then(setProfileData)
          .catch(() => setError(t('profile.load_error', 'Could not load user profile.')))
          .finally(() => setLoading(false));
    }
    setAllData  ()
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        {t('team.loading', 'Loading profile...')}
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="p-6">
        <div className="p-3 rounded-lg text-sm font-medium border bg-red-50 text-red-700 border-red-100">
          {error}
        </div>
      </div>
    );
  }

  const initials = profileData.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?';

  return (
    <div className="p-6 flex gap-10 items-start">

      {/* Coloana stânga */}
      <div className="w-96 shrink-0 space-y-6">

        <div>
          <h1 className="text-xl font-bold text-gray-900">{t('profile.title', 'Profile')}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{t('profile.subtitle', 'Member information')}</p>
        </div>

        {/* Avatar + nume + rol */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-indigo-50 border border-gray-100 overflow-hidden flex items-center justify-center text-2xl font-semibold text-indigo-600 shrink-0">
            {profileData.avatar
              ? <img src={profileData.avatar} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="Avatar" />
              : initials
            }
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{profileData.name}</p>
            <p className="text-sm text-gray-400 capitalize mt-0.5">{profileData.role}</p>
          </div>
        </div>

        {/* Contact cards */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {t('profile.contact_info', 'Contact Info')}
          </p>

          <a
            href={`mailto:${profileData.email}`}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
              <MdEmail size={18} className="text-indigo-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">{t('profile.email_address', 'Email')}</p>
              <p className="text-sm font-medium text-gray-800 truncate">{profileData.email || '—'}</p>
            </div>
          </a>

          <a
            href={`tel:${profileData.phone}`}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
              <MdPhone size={18} className="text-indigo-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">{t('profile.phone_number', 'Phone')}</p>
              <p className="text-sm font-medium text-gray-800">{profileData.phone || '—'}</p>
            </div>
          </a>
        </div>

      </div>

      {/* Coloana dreapta — rezervată pentru viitor */}
      <div className="flex-1">
        {/* viitor conținut aici */}
      </div>

    </div>
  );
};