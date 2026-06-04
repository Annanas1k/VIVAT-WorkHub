import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { updateProfileService, getUserByIdService } from '../services/user.service';

import { ProfileAvatar } from '../components/profile/ProfileAvatar';
import { ProfileInfo } from '../components/profile/ProfileInfo';
import { ProfileSecurity } from '../components/profile/ProfileSecurity';
import { MdEdit, MdClose, MdEmail, MdPhone } from 'react-icons/md';
import type { UserData } from '../types/auth.types';

export const OwnProfilePage = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  // Stocăm datele complete fetch-uite de la server (inclusiv phone)
  const [fullProfile, setFullProfile] = useState<UserData | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch complet la mount și după fiecare save
  const fetchProfile = () => {
    if (!user?.id) return;
    getUserByIdService(user.id).then(setFullProfile).catch(console.error);
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const handleStartEdit = () => {
    setName(fullProfile?.name || user?.name || '');
    setPhone(fullProfile?.phone || user?.phone || '');
    setCurrentPassword('');
    setNewPassword('');
    setAvatarFile(null);
    setMessage(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    if (avatarFile) formData.append('avatar', avatarFile);
    if (newPassword) {
      formData.append('currentPassword', currentPassword);
      formData.append('newPassword', newPassword);
    }

    try {
      const resData = await updateProfileService(formData);
      if (resData?.token) localStorage.setItem('app_token', resData.token);
      updateUser(resData.user);
      setFullProfile(resData.user); // actualizăm și datele locale imediat
      setMessage({ type: 'success', text: t('profile.success') });
      setIsEditing(false);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || t('profile.error', 'An error occurred'),
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const displayName = fullProfile?.name || user.name || '—';
  const displayEmail = fullProfile?.email || user.email || '—';
  const displayPhone = fullProfile?.phone || user.phone || '—';
  const displayAvatar = fullProfile?.avatar || user.avatar;
  const displayRole = fullProfile?.role || user.role;
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  return (
    <div className="p-6 flex gap-10 items-start">

      {/* Coloana stânga */}
      <div className="w-96 shrink-0 space-y-6">

        {/* Header + buton Edit */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('profile.title', 'Profile')}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{t('profile.subtitle', 'Your personal information')}</p>
          </div>
          {!isEditing && (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <MdEdit size={15} />
              {t('profile.edit', 'Edit')}
            </button>
          )}
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium border ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-100'
              : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {message.text}
          </div>
        )}

        {/* VIEW MODE */}
        {!isEditing && (
          <div className="space-y-6">
            {/* Avatar + nume + rol */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-indigo-50 border border-gray-100 overflow-hidden flex items-center justify-center text-2xl font-semibold text-indigo-600 shrink-0">
                {displayAvatar
                  ? <img src={displayAvatar} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="Avatar" />
                  : initials
                }
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">{displayName}</p>
                <p className="text-sm text-gray-400 capitalize mt-0.5">{displayRole}</p>
              </div>
            </div>

            {/* Contact cards */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {t('profile.contact_info', 'Contact Info')}
              </p>

              {/* Email */}
              <a
                href={`mailto:${displayEmail}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <MdEmail size={18} className="text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">{t('profile.email_address', 'Email')}</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{displayEmail}</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${displayPhone}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <MdPhone size={18} className="text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">{t('profile.phone_number', 'Phone')}</p>
                  <p className="text-sm font-medium text-gray-800">{displayPhone}</p>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* EDIT MODE */}
        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <ProfileAvatar
              currentAvatar={displayAvatar}
              userName={displayName}
              userRole={displayRole}
              onFileSelect={setAvatarFile}
              onError={(msg) => setMessage({ type: 'error', text: msg })}
              disabled={false}
            />

            <ProfileInfo
              name={name}
              email={displayEmail}
              phone={phone}
              onChangeName={setName}
              onChangePhone={setPhone}
              disabled={false}
            />

            {!user.googleId && (
              <ProfileSecurity
                currentPass={currentPassword}
                newPass={newPassword}
                onChangeCurrentPass={setCurrentPassword}
                onChangeNewPass={setNewPassword}
              />
            )}

            <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? '...' : t('profile.save')}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors"
              >
                <MdClose size={15} />
                {t('profile.cancel', 'Cancel')}
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Coloana dreapta — rezervată pentru viitor */}
      <div className="flex-1">
        {/* viitor conținut aici */}
      </div>

    </div>
  );
};